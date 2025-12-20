package service

import (
  "log"

  "headscale-ui.backend/pkg/auth"
  "headscale-ui.backend/pkg/db"
  "headscale-ui.backend/pkg/helper"
)

func Service_LoginAccount(Username string, Password string) (JwtToken *string, ResError string) {
  // Request
  dbaction := db.GetDatabase()
  rows, err := dbaction.Query("SELECT * FROM admin WHERE username = ? LIMIT 1", Username)
  if err != nil {
    log.Printf("[service/login-account]: Error: %v", err.Error())
    return nil, "Database error request"
  }
  defer rows.Close() // Close

  // No data
  if !rows.Next() {
    return nil, "Invalid username"
  }

  // Get data
  var userRowsData db.UserData
  err = rows.Scan(
    &userRowsData.UserId,
    &userRowsData.Username,
    &userRowsData.Password,
    &userRowsData.ApiKey,
    &userRowsData.SessionId,
  )
  if err != nil {
    log.Printf("[service/login-account]: Error: %v", err.Error())
    return nil, "Get data error"
  }

  // Check password hashing
  match := auth.Hash_VerifyPassword(Password, userRowsData.Password)
  if !match {
    return nil, "Invalid password"
  }

  // Generate new session
  idGen := helper.GenerateID(16)
  genStr := "session-" + idGen

  _, err = dbaction.Exec("UPDATE admin SET session_id = ? WHERE id = ?;", genStr, userRowsData.UserId)
  if err != nil {
    log.Printf("[service/login-account]: Error: %v", err.Error())
    return nil, "Database error request"
  }

  // Create JWT Token
  jwtTokens, err := auth.JWT_Generate(userRowsData.UserId, userRowsData.Username, genStr)
  if err != nil {
    log.Printf("[service/login-account]: Error: %v", err.Error())
    return nil, "Bad create JWT token"
  }

  return &jwtTokens, ""
}