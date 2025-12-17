package service

import (
	"log"
	"net/http"

	"headscale-ui.backend/pkg/action"
	"headscale-ui.backend/pkg/auth"
	"headscale-ui.backend/pkg/db"
)

func Service_UpdatePassword(JwtToken string, PasswordNow string, PasswordUp string, PasswordConfrim string) (SuccessData bool, StatusCode int, ResError string) {
	// Is Auth Login
	UserId, _, _, authPasswordHash, CodeStatus, errs := action.IsLogin(JwtToken)
	if errs != nil {
		return false, CodeStatus, (*errs)
	}

	// Check hash password
	matchHash := auth.Hash_VerifyPassword(PasswordNow, authPasswordHash)

	// No Match!
	if !matchHash {
		return false, http.StatusBadRequest, "The password you entered is incorrect. please remember again."
	}

	// Is Same With Old?
	if PasswordNow == PasswordUp {
		return false, http.StatusBadRequest, "The password cannot be the same as the previous one!"
	}

	// Is Match with Up and Confrim?
	if PasswordUp != PasswordConfrim {
		return false, http.StatusBadRequest, "The confirmation password does not match the new password!"
	}

	// Match & Normaly!
	// 1. Create New Hash Password
	newHashPassword, err := auth.Hash_HashPassword(PasswordUp)
	if err != nil {
		log.Printf("[service/update-password]: Error: %v", err.Error())
		return false, http.StatusInternalServerError, "Internal server Error!"
	}

	// 2. Update
	dbaction := db.GetDatabase()
	_, err = dbaction.Exec("UPDATE admin SET password = ? WHERE id = ?", newHashPassword, UserId)
	if err != nil {
		log.Printf("[service/update-password]: Error: %v", err.Error())
		return false, http.StatusInternalServerError, "Internal server Error!"
	}

	// Success
	return true, http.StatusOK, ""
}