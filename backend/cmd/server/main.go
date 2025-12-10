package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"headscale-ui.backend/internal/api"
	"headscale-ui.backend/internal/proxy"
	"headscale-ui.backend/pkg/db"
	"headscale-ui.backend/pkg/helper"
)

func main() {
  // System Load
  helper.LoadEnv()
  db.InitDB()

  // Default Environment
  addrlisten := ":3050"
  staticdist := "/app/html_web"

  // Environment
  if os.Getenv("SERVER_LISTEN") != "" {
    addrlisten = os.Getenv("SERVER_LISTEN")
  }
  if os.Getenv("DIST_FRONTEND") != "" {
    staticdist = os.Getenv("DIST_FRONTEND")
  }

  // Static File HTTP
  statichttpfile := http.FileServer(http.Dir(staticdist))
  http.Handle("/", http.StripPrefix("/", statichttpfile))

  // Handle API
  http.HandleFunc("/health", HealthTest) // Health check
  http.HandleFunc("/side-api/md-checker", api.API_MiddlewareChecker) // Middleware check
  http.HandleFunc("/side-api/new-default-admin", api.API_NewDefaultAdmin) // Register
  http.HandleFunc("/side-api/login", api.API_LoginAccount) // Login
  http.HandleFunc("/side-api/update-password", api.API_UpdatePassword) // Update password
  http.HandleFunc("/side-api/update-token-key", api.API_UpdateTokenKey) // Update token key

  // Proxy API Middleware
  http.Handle("/api/v1/",
    http.StripPrefix(
      "/api/v1/",
      http.HandlerFunc(proxy.HTTP_Proxy_HeadscaleServer),
    ),
  )

  // Running
  log.Printf("[server.go]: Running at port %v\n", addrlisten)
  http.ListenAndServe(addrlisten, nil)
}

// Health Check
type healthTestHTTP_Data struct {
  Message string `json:"message"`
}
type healthTestHTTP struct {
  Status int                 `json:"status"`
  Data   healthTestHTTP_Data `json:"data"`
}

// Handle Helath Check
func HealthTest(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")

  writeResponseData := healthTestHTTP_Data{
    Message: "Success!",
  }
  writeResponse := healthTestHTTP{
    Status: 200,
    Data: writeResponseData,
  }

  json.NewEncoder(w).Encode(writeResponse)
}