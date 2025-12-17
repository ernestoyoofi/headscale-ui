package proxy

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path"
	"strings"

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

func HTTP_Proxy_HeadscaleServer(w http.ResponseWriter, r *http.Request) {
	var headscaleTarget = getHeadscaleURL()
	proxy := httputil.NewSingleHostReverseProxy(headscaleTarget)

	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)

		originalPath := req.URL.Path
		req.URL.Path = path.Join("/api/v1", originalPath)
		
		req.Header.Del("Authorization")
		req.Header.Del("Cookie")
		req.Header.Set("Accept", "application/json")
		
		req.Host = headscaleTarget.Host
		log.Printf("[proxy]: %s%s", req.Host, req.URL.Path)
	}

	proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
		log.Printf("[proxy]: Error communicating with Headscale: %v", err)
		handle_http.HTTP_Response_Error(w, http.StatusBadGateway, "Headscale Server Unreachable")
	}

	proxy.ServeHTTP(w, r)

	// helper.LoadEnv() // Load env (file/env os)
	// urlBase := "http://localhost:8080"
	// urlBaseEnv := os.Getenv("HEADSCALE_SERVER")

	// if strings.TrimSpace(urlBaseEnv) != "" {
	// 	urlBase = strings.TrimSpace(urlBaseEnv)
	// }

	// var baseUrlInclude = urlBase+r.URL.Path
	// req, err := http.NewRequest(r.Method, baseUrlInclude, r.Body)
	// // Create
	// if err != nil {
	// 	log.Printf("[proxy]: Error during create request %s: %s\n", baseUrlInclude, err)
	// 	handle_http.HTTP_Response_Error(w, http.StatusInternalServerError, "Internal Server Error")
	// 	return;
	// }

	// // Copy Headers
	// for key, values := range r.Header {
	// 	for _, value := range values {
	// 		req.Header.Add(key, value)
	// 	}
	// }
	// req.Header.Del("Authorization") // Delete Authorization
	// req.Header.Del("Cookie") // Delete Cookie
	// req.Header.Set("Accept", "application/json") // Set To Json!

	// // Do Request
	// resp, err := http.DefaultClient.Do(req)
	// if err != nil {
	// 	log.Printf("[proxy]: Error during do request %s: %s\n", baseUrlInclude, err)
	// 	handle_http.HTTP_Response_Error(w, http.StatusInternalServerError, "Internal Server Error")
	// 	return;
	// }
	// defer resp.Body.Close()

	// written, err := io.Copy(w, resp.Body)
	// if err != nil {
	// 	log.Printf("[proxy]: Error during copy request %s: %s\n", baseUrlInclude, err)
	// 	handle_http.HTTP_Response_Error(w, http.StatusInternalServerError, "Internal Server Error")
	// 	return;
	// }


	// return;
}