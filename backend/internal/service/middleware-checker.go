package service

import (
	"log"

	"headscale-ui.backend/pkg/auth"
	"headscale-ui.backend/pkg/db"
)

func Service_MiddlewareCheck(JwtToken string) (username string, setupAccount bool, isLogin bool, isBackendError bool) {
	// Request
	dbaction := db.GetDatabase()

	// Get Setup
	rows_setup, err := dbaction.Query("SELECT * FROM admin LIMIT 1")
	if err != nil {
    log.Printf("[service/middleware-checker]: (Select One) Error: %v", err.Error())
    return "", false, false, true
  }
  defer rows_setup.Close()

	dataHasSetup := !bool(rows_setup.Next())

	// JWT Token
	dataJwtToken := ""
	if JwtToken != "" {
		dataJwtToken = JwtToken
	} else {
		log.Println("[service/middleware-checker]: No login, normal....")
		return "", dataHasSetup, false, false
	}

	// Reparse JWT Token
	jwtauth, err := auth.JWT_Parse(dataJwtToken)
	if err != nil {
		log.Printf("[service/middleware-checker]: Error: %v", err.Error())
		return "", dataHasSetup, false, true
	}

	// Get User
	rows_select, err := dbaction.Query("SELECT username FROM admin WHERE id = ? AND session_id = ? LIMIT 1", jwtauth.UserID, jwtauth.SessionID)
	if err != nil {
    log.Printf("[service/middleware-checker]: (Select Database) Error: %v", err.Error())
    return "", dataHasSetup, false, true
  }
  defer rows_select.Close()

	// Return data
	dataUsername := ""
	dataIsLogin  := false
	if rows_select.Next() {
		var SelectData db.UserData
		err = rows_select.Scan(
			&SelectData.Username,
		)
		
		if err != nil {
			log.Printf("[service/middleware-checker]: (Select Database) Error: %v", err.Error())
			return "", dataHasSetup, false, true
		}

		dataUsername = "@"+SelectData.Username
		dataIsLogin  = true
	}

	return dataUsername, dataHasSetup, dataIsLogin, false
}