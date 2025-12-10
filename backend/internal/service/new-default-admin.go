package service

import (
  "log"

  "headscale-ui.backend/pkg/auth"
  "headscale-ui.backend/pkg/db"
  "headscale-ui.backend/pkg/helper"
)

func Service_SetupNewAccount(Username string, Password string) (JwtToken *string, ResError string) {
  // Request
  dbaction := db.GetDatabase()
  rows, err := dbaction.Query("SELECT * FROM admin LIMIT 1")
  if err != nil {
    log.Printf("[service/new-default-admin]: Error: %v", err.Error())
    return nil, "Database error request"
  }
  defer rows.Close() // Close

  if rows.Next() {
    return nil, "Admin account setup have been added"
  }

  // Hashing password
  hash, err := auth.Hash_HashPassword(Password)
  if err != nil {
    log.Printf("[service/new-default-admin]: Error: %v", err.Error())
    return nil, "Error create hashing"
  }

  // Generate new session
  idGen := helper.GenerateID(16)
  genStr := "session-" + idGen
  
  // Insert
  _, err = dbaction.Exec(`INSERT INTO admin
  (username, password, apikey, session_id) VALUES
  (?, ?, ?, ?)`, Username, hash, "", genStr)
  if err != nil {
    log.Printf("[service/new-default-admin]: Error: %v", err.Error())
    return nil, "Database error request"
  }

  // Get again with one user
  rows, err = dbaction.Query("SELECT * FROM admin LIMIT 1")
  if err != nil {
    log.Printf("[service/new-default-admin]: Error: %v", err.Error())
    return nil, "Database error request"
  }
  defer rows.Close() // Close

  if !rows.Next() {
    return nil, "Rare error, maybe the data not add to database"
  }

  // Get data by rows
  var userRowsData db.UserData
  err = rows.Scan(
    &userRowsData.UserId,
    &userRowsData.Username,
    &userRowsData.Password,
    &userRowsData.ApiKey,
    &userRowsData.SessionId,
  )
  if err != nil {
    log.Printf("[service/new-default-admin]: Error: %v", err.Error())
    return nil, "Get data error"
  }

  // Create JWT Token
  jwtTokens, err := auth.JWT_Generate(userRowsData.UserId, userRowsData.Username, genStr)
  if err != nil {
    log.Printf("[service/new-default-admin]: Error: %v", err.Error())
    return nil, "Bad create JWT token"
  }

  return &jwtTokens, ""
}