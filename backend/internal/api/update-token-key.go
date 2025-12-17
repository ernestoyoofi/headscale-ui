package api

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"

	"headscale-ui.backend/internal/service"
	"headscale-ui.backend/pkg/handle_http"
	"headscale-ui.backend/pkg/structure"
)

func API_UpdateTokenKey(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")

  log.Println("[api/update-token-key]: [Request] /side-api/update-token-key")
  if r.Method != http.MethodPatch {
    log.Println("[api/update-token-key]: [No Method] /side-api/update-token-key")
    handle_http.HTTP_Response_Error(w, http.StatusNotFound, "Not Found")
    return
  }

  // Cookie!
  valueCookie := ""
  cookie, err := r.Cookie(handle_http.CookieAuthAdminKey)
  if err != nil {
    if err != http.ErrNoCookie {
      log.Println("[api/update-token-key]: Cookie Auth Error handleing", err.Error())
    }
  } else {
    valueCookie = cookie.Value
  }

  // Get Body
  bodyReq, err := io.ReadAll(r.Body)
  if err != nil {
    log.Println("[api/update-password]: Body Error", err.Error())
    handle_http.HTTP_Response_Error(w, http.StatusBadRequest, "No body?")
    return
  }
  defer r.Body.Close()

  // Format to JSON
  var dataReqJson structure.HTTP_Request_UpdateTokenKey
  err = json.Unmarshal(bodyReq, &dataReqJson)
  if err != nil {
    log.Println("[api/update-password]: Format Json Error", err.Error())
    handle_http.HTTP_Response_Error(w, http.StatusBadRequest, "Format is not json, maybe...")
    return
  }

  // Validator
  if strings.TrimSpace(dataReqJson.TokenKey) == "" {
    handle_http.HTTP_Response_Error(w, http.StatusBadRequest, "Fill your input and format \"apikey\"!")
    return
  }

  // Database action!
  isSuccess, StatusCode, errs := service.Service_UpdateTokenKey(valueCookie, dataReqJson.TokenKey)
  if errs != "" {
    handle_http.HTTP_Response_Error(w, StatusCode, errs)
    return
  }

  dataReturn := structure.HTTP_Response_Data_Type{
    Status: http.StatusOK,
    Data: structure.HTTP_Response_ActionSucces{
      Message: "Success update password!",
      Success: isSuccess,
    },
  }

  // Return!
  json.NewEncoder(w).Encode(dataReturn)
}