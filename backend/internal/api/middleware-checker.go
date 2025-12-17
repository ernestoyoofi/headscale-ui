package api

import (
	"encoding/json"
	"log"
	"net/http"

	"headscale-ui.backend/internal/service"
	"headscale-ui.backend/pkg/handle_http"
	"headscale-ui.backend/pkg/structure"
)

func API_MiddlewareChecker(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")

  log.Println("[api/middleware-checker]: [Request] /side-api/md-checker")
  if r.Method != http.MethodGet {
    log.Println("[api/middleware-checker]: [No Method] /side-api/md-checker")
    handle_http.HTTP_Response_Error(w, http.StatusNotFound, "Not Found")
    return
  }

  valueCookie := ""
  cookie, err := r.Cookie(handle_http.CookieAuthAdminKey)

  if err != nil {
    if err != http.ErrNoCookie {
      log.Println("Cookie Auth Error handleing", err.Error())
    }
  } else {
    valueCookie = cookie.Value
  }

  // Execute
  dataUsername, dataSetupAccount, dataIsLogin, haveKeyAPI, dataIsBackendError := service.Service_MiddlewareCheck(valueCookie)

  dataReturn := structure.HTTP_Response_Data_Type{
    Status: http.StatusOK,
    Data: structure.HTTP_Response_MiddlewareChecker{
      Username: dataUsername,
      IsSetup: dataSetupAccount,
      IsLogin: dataIsLogin,
      HaveKeyAPI: haveKeyAPI,
      IsBackendError: dataIsBackendError,
    },
  }
  json.NewEncoder(w).Encode(dataReturn)
}