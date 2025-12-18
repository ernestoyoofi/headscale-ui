package api

import (
  "encoding/json"
  "io"
  "log"
  "net/http"

  "headscale-ui.backend/internal/service"
  "headscale-ui.backend/pkg/handle_http"
  "headscale-ui.backend/pkg/structure"
  "headscale-ui.backend/pkg/validator"
)

func API_UpdatePassword(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")

  log.Println("[api/update-password]: [Request] /side-api/update-password")
  if r.Method != http.MethodPatch {
    log.Println("[api/update-password]: [No Method] /side-api/update-password")
    handle_http.HTTP_Response_Error(w, http.StatusNotFound, "Not Found")
    return
  }

  // Cookie!
  valueCookie := ""
  cookie, err := r.Cookie(handle_http.CookieAuthAdminKey)
  if err != nil {
    if err != http.ErrNoCookie {
      log.Println("[api/update-password]: Cookie Auth Error handleing", err.Error())
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
  var dataReqJson structure.HTTP_Request_UpdatePassword
  err = json.Unmarshal(bodyReq, &dataReqJson)
  if err != nil {
    log.Println("[api/update-password]: Format Json Error", err.Error())
    handle_http.HTTP_Response_Error(w, http.StatusBadRequest, "Format is not json, maybe...")
    return
  }

  // Validator
  if !validator.IsValidPasswordFormat(dataReqJson.PasswordOld) {
    handle_http.HTTP_Response_Error(w, http.StatusBadRequest, "Fill your input and format \"password_old\" is A-Za-z0-9._#@")
    return
  }
  if !validator.IsValidPasswordFormat(dataReqJson.PasswordNew) {
    handle_http.HTTP_Response_Error(w, http.StatusBadRequest, "Fill your input and format \"password_new\" is A-Za-z0-9._#@")
    return
  }
  if !validator.IsValidPasswordFormat(dataReqJson.PasswordConfrim) {
    handle_http.HTTP_Response_Error(w, http.StatusBadRequest, "Fill your input and format \"password_confrim\" is A-Za-z0-9._#@")
    return
  }

  // Database action!
  isSuccess, StatusCode, errs := service.Service_UpdatePassword(valueCookie, dataReqJson.PasswordOld, dataReqJson.PasswordNew, dataReqJson.PasswordConfrim)
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