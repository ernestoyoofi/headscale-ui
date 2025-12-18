package service

import (
  "log"
  "net/http"
  "strings"

  "headscale-ui.backend/pkg/action"
  "headscale-ui.backend/pkg/db"
)

func Service_UpdateTokenKey(JwtToken string, TokenKey string) (SuccessData bool, StatusCode int, ResError string) {
  // Is Auth Login
  UserId, _, _, _, CodeStatus, errs := action.IsLogin(JwtToken)
  if errs != nil {
    return false, CodeStatus, (*errs)
  }

  // Validation
  trimWhiteSpacesAPIKEY := strings.TrimSpace(TokenKey)
  if trimWhiteSpacesAPIKEY == "" {
    return false, http.StatusBadRequest, "Put your API key!"
  }

  // Insert API Key
  dbaction := db.GetDatabase()
  _, err := dbaction.Exec("UPDATE admin SET apikey = ? WHERE id = ?", trimWhiteSpacesAPIKEY, UserId)

  if err != nil {
    log.Printf("[service/update-token-key]: Error: %v", err.Error())
    return false, http.StatusInternalServerError, "Internal server Error!"
  }

  // Success
  return true, http.StatusOK, ""
}