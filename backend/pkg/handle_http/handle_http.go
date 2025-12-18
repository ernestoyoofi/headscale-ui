package handle_http

import (
  "encoding/json"
  "net/http"

  "headscale-ui.backend/pkg/structure"
)

var CookieAuthAdminKey = "headscale-ui.admin"

func HTTP_Response_Error(w http.ResponseWriter, statusCode int, message string) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(statusCode)
  errorRes := structure.HTTP_Response_Error_Type{
    Status: statusCode,
    Message: message,
  }
  json.NewEncoder(w).Encode(errorRes)
}