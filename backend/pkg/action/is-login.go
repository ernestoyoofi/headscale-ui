package action

import (
	"log"
	"net/http"
	"strings"

	"headscale-ui.backend/pkg/auth"
	"headscale-ui.backend/pkg/db"
)

func IsLogin(JwtToken string) (UserID int, Username string, ApiKey string, PasswordHash string, StatusHttp int, ErrorIssues *string) {
	// Need Login
	jwtStrToken := strings.TrimSpace(JwtToken)
	if jwtStrToken == "" {
		messageError := "You need to re-login for this action"
		return 0, "", "", "", http.StatusUnauthorized, &messageError
	}

	// Jsonwebtoken
	dataJwt, err := auth.JWT_Parse(jwtStrToken)
	if err != nil {
		log.Println("[is-login-auth]: Panic!, Internal server error:", err.Error())
		messageError := "Internal server error"
		return 0, "", "", "", http.StatusInternalServerError, &messageError
	}

	// Data SQL
	dbaction := db.GetDatabase()
	rowsdata, err := dbaction.Query("SELECT * FROM admin WHERE id = ? AND session_id = ? LIMIT 1", dataJwt.UserID, dataJwt.SessionID)
	if err != nil {
		log.Println("[is-login-auth]: Panic!, Internal server error:", err.Error())
		messageError := "Internal server error"
		return 0, "", "", "", http.StatusInternalServerError, &messageError
	}
	defer rowsdata.Close()

	if !rowsdata.Next() {
		messageError := "You need to login for this action"
		return 0, "", "", "", http.StatusUnauthorized, &messageError
	}

	// Manage Data
	var SelectData db.UserData
	err = rowsdata.Scan(
		&SelectData.UserId,
		&SelectData.Username,
		&SelectData.Password,
		&SelectData.ApiKey,
		&SelectData.SessionId,
	)
	if err != nil {
		log.Println("[is-login-auth]: Panic!, Internal server error:", err.Error())
		messageError := "Internal server error"
		return 0, "", "", "", http.StatusInternalServerError, &messageError
	}

	// Return Data
	return SelectData.UserId, SelectData.Username, SelectData.ApiKey, SelectData.Password, http.StatusOK, nil
}