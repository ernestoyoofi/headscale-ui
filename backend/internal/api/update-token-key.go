package api

import (
	"log"
	"net/http"

	"headscale-ui.backend/pkg/handle_http"
)

func API_UpdateTokenKey(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")

  log.Println("[api/update-token-key]: [Request] /side-api/update-token-key")
  if r.Method != http.MethodPatch {
    log.Println("[api/update-token-key]: [No Method] /side-api/update-token-key")
    handle_http.HTTP_Response_Error(w, http.StatusNotFound, "Not Found")
    return
  }
}