package api

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"headscale-ui.backend/internal/service"
	"headscale-ui.backend/pkg/structure"
	"headscale-ui.backend/pkg/handle_http"
	"headscale-ui.backend/pkg/validator"
)

func API_NewDefaultAdmin(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")

  log.Println("[api/setup-new-admin]: [Request] /side-api/new-default-admin")
  if r.Method != http.MethodPost {
    log.Println("[api/setup-new-admin]: [No Method] /side-api/new-default-admin")
    handle_http.HTTP_Response_Error(w, http.StatusNotFound, "Not Found")
    return
  }

  // Get Body
  bodyReq, err := io.ReadAll(r.Body)
  if err != nil {
    handle_http.HTTP_Response_Error(w, http.StatusBadRequest, "No body?")
    return
  }
  defer r.Body.Close()

  // Format to JSON
  var dataReqJson structure.HTTP_Request_LoginAccount
  err = json.Unmarshal(bodyReq, &dataReqJson)
  if err != nil {
    handle_http.HTTP_Response_Error(w, http.StatusBadRequest, "Format is not json, maybe...")
    return
  }

  // Validation
  if strings.TrimSpace(dataReqJson.Password) == "" || strings.TrimSpace(dataReqJson.Username) == "" {
    handle_http.HTTP_Response_Error(w, http.StatusBadRequest, "Add username and password!")
    return
  }
  if !validator.IsValidSimpleFormat(dataReqJson.Username) || !validator.IsValidPasswordFormat(dataReqJson.Password) {
    handle_http.HTTP_Response_Error(w, http.StatusBadRequest, "Format username is only A-Za-z0-9._ for password is A-Za-z0-9._#@ !")
    return
  }

  // Database action!
  jwtToken, errs := service.Service_SetupNewAccount(dataReqJson.Username, dataReqJson.Password)
  if errs != "" {
    handle_http.HTTP_Response_Error(w, http.StatusBadRequest, string(errs))
    return
  }

  // Create Cookie
  cookieData := &http.Cookie{
    Name: handle_http.CookieAuthAdminKey,
    Value: *jwtToken,
    Expires: time.Now().Add(24 * time.Hour),
    Path: "/",
    HttpOnly: true,
  }
  http.SetCookie(w, cookieData)
  
  // Set Response
  dataResponse := structure.HTTP_Response_Data_Type{
    Status: 200,
    Data: structure.HTTP_Response_LoginAccount{
      TokenAuth: *jwtToken,
      Success: true,
    },
  }
  json.NewEncoder(w).Encode(dataResponse)
}