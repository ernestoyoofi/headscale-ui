package proxy

import (
  "encoding/json"
  "fmt"
  "log"
  "net/http"
  "net/http/httputil"
  "net/url"
  "os"
  "path"
  "strings"

  "headscale-ui.backend/internal/auth"
  "headscale-ui.backend/pkg/handle_http"
)

func getHeadscaleURL() *url.URL {
  urlBase := os.Getenv("HEADSCALE_SERVER")
  if strings.TrimSpace(urlBase) == "" {
    urlBase = "http://localhost:8080"
  }
  
  target, err := url.Parse(urlBase)
  if err != nil {
    log.Fatalf("[proxy]: Invalid Headscale URL: %v", err)
  }
  return target
}

type HTTP_Response_ErrorProxyType struct {
  Code    int      `json:"code"`
  Message string   `json:"message"`
  Details []any `json:"details"`
}

func HTTP_Response_ErrorProxy(w http.ResponseWriter, statusCode int, Message string, CodeError int, ByProxy bool) {
  if ByProxy {
    w.Header().Set("X-Response-By", "proxy")
  } else {
    w.Header().Set("X-Response-By", "headscale-api")
  }
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(statusCode)
  errorRes := HTTP_Response_ErrorProxyType{
    Code: statusCode,
    Message: Message,
    Details: []any{},
  }
  json.NewEncoder(w).Encode(errorRes)
}

func HTTP_Proxy_HeadscaleServer(w http.ResponseWriter, r *http.Request) {
  var headscaleTarget = getHeadscaleURL()
  proxy := httputil.NewSingleHostReverseProxy(headscaleTarget)

  cookieHttp, err := r.Cookie(handle_http.CookieAuthAdminKey)
  if err != nil {
    w.Header().Set("X-Response-By", "proxy")
    HTTP_Response_ErrorProxy(w, http.StatusForbidden, "Unauthentication", 1, true)
    return;
  }
  getApiKey, _, isError := auth.JsonWebTokenToApiKey(cookieHttp.Value)
  if isError != nil {
    w.Header().Set("X-Response-By", "proxy")
    HTTP_Response_ErrorProxy(w, http.StatusBadRequest, *isError, 1, true)
    return;
  }
  if getApiKey == "" {
    w.Header().Set("X-Response-By", "proxy")
    HTTP_Response_ErrorProxy(w, http.StatusForbidden, "No API Key", 1, true)
    return;
  }

  originalDirector := proxy.Director
  proxy.Director = func(req *http.Request) {
    originalDirector(req)

    originalPath := req.URL.Path
    req.URL.Path = path.Join("/api/v1", originalPath)
    
    req.Header.Del("Authorization")
    req.Header.Del("Cookie")
    req.Header.Set("Accept", "application/json")
    req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", getApiKey))
    
    req.Host = headscaleTarget.Host
    log.Printf("[proxy]: %s%s", req.Host, req.URL.Path)
  }

  proxy.ModifyResponse = func(resp *http.Response) error {
    if resp.StatusCode == http.StatusUnauthorized {
      return fmt.Errorf("headscale_unauthorization")
    }
    if resp.StatusCode == http.StatusNotFound {
      return fmt.Errorf("headscale_notfound")
    }
    return nil
  }

  proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
    log.Printf("[proxy]: Error communicating with Headscale: %v", err)
    if err.Error() == "headscale_unauthorization" {
      HTTP_Response_ErrorProxy(w, http.StatusForbidden, "Unauthorization, Bad API Key", 1, false)
      return;
    }
    if err.Error() == "headscale_notfound" {
      HTTP_Response_ErrorProxy(w, http.StatusNotFound, "Not Found", 5, false)
      return;
    }
    HTTP_Response_ErrorProxy(w, http.StatusBadGateway, "Headscale Server Unreachable", 1, false)
  }

  w.Header().Set("X-Response-By", "headscale-api")
  proxy.ServeHTTP(w, r)
}