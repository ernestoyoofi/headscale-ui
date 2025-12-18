package main

import (
  "encoding/json"
  "log"
  "net/http"
  "os"
  "path/filepath"

  "headscale-ui.backend/internal/api"
  "headscale-ui.backend/internal/proxy"
  "headscale-ui.backend/pkg/db"
  "headscale-ui.backend/pkg/helper"
)

func EnableCORS(next http.Handler) http.Handler {
  return http.HandlerFunc((func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*") 
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "*")

    if r.Method == "OPTIONS" {
      w.WriteHeader(http.StatusOK)
      return 
    }
    next.ServeHTTP(w, r)
  }))
}

func main() {
  // System Load
  helper.LoadEnv()
  db.InitDB()

  // Default Environment
  addrlisten := ":3050"
  staticdist := "/app/html_web"
  prodbuild := false

  // Environment
  if os.Getenv("PRODUCTION_BUILD") != "" {
    prodbuild = true
  }
  if os.Getenv("SERVER_LISTEN") != "" {
    addrlisten = os.Getenv("SERVER_LISTEN")
  }
  if os.Getenv("DIST_FRONTEND") != "" {
    staticdist = os.Getenv("DIST_FRONTEND")
  }

  // Static File HTTP
  statichttpfile := http.FileServer(http.Dir(staticdist))
  // Single Page Application Handle
  spaHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    log.Printf("[Server]: [%s] %s\n", r.Method, r.URL.Path)
    path := filepath.Join(staticdist, r.URL.Path)
    info, err := os.Stat(path)
    if os.IsNotExist(err) || (err == nil && info.IsDir()) {
      http.ServeFile(w, r, filepath.Join(staticdist, "index.html"))
      return;
    }
    http.StripPrefix("/", statichttpfile).ServeHTTP(w, r)
  })
  http.Handle("/", spaHandler)

  // Handle API
  http.HandleFunc("/health", HealthTest) // Health check
  http.HandleFunc("/api/backend/md-checker", api.API_MiddlewareChecker) // Middleware check
  http.HandleFunc("/api/backend/new-default-admin", api.API_NewDefaultAdmin) // Register
  http.HandleFunc("/api/backend/login", api.API_LoginAccount) // Login
  http.HandleFunc("/api/backend/update-password", api.API_UpdatePassword) // Update password
  http.HandleFunc("/api/backend/update-token-key", api.API_UpdateTokenKey) // Update token key

  // Proxy API Middleware
  http.Handle("/api/v1/",
    http.StripPrefix(
      "/api/v1/",
      http.HandlerFunc(proxy.HTTP_Proxy_HeadscaleServer),
    ),
  )

  // Running
  log.Printf("[Server]: Running at port http://%v\n", addrlisten)
  if prodbuild {
    http.ListenAndServe(addrlisten, nil)
    } else {
    http.ListenAndServe(addrlisten, EnableCORS(http.DefaultServeMux))
  }
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