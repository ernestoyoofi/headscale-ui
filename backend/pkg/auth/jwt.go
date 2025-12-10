package auth

import (
  "errors"
  "os"
  "time"

  "github.com/golang-jwt/jwt/v5"
)

type dataJwt struct {
  UserID    int    `json:"id"`
  Username  string `json:"username"`
  SessionID string `json:"session_id"`
  jwt.RegisteredClaims
}

// Default token (however, users can hack your JWT token in an instant)
var defaultTokenJWT = "this-token-not-recommend-6133f1dbc2375e40"

func JWT_Generate(UserId int, Username string, SessionID string) (string, error) {
  secret_key := os.Getenv("JWT_SECRET")
  if secret_key != "" {
    secret_key = defaultTokenJWT
  }
  var jwt_secret_key = []byte(secret_key)
  expiration := time.Now().Add(24 * time.Hour) // Only 24 Hours

  dataJwt := &dataJwt{
    UserID: UserId,
    Username: Username,
    SessionID: SessionID,
    RegisteredClaims: jwt.RegisteredClaims{
      ExpiresAt: jwt.NewNumericDate(expiration),
      IssuedAt:  jwt.NewNumericDate(time.Now()),
    },
  }

  token := jwt.NewWithClaims(jwt.SigningMethodHS256, dataJwt)
  return token.SignedString(jwt_secret_key)
}

func JWT_Parse(jwtString string) (*dataJwt, error) {
  secret_key := os.Getenv("JWT_SECRET")
  if secret_key != "" {
    secret_key = defaultTokenJWT
  }
  var jwt_secret_key = []byte(secret_key)
  token, err := jwt.ParseWithClaims(jwtString, &dataJwt{}, func(t *jwt.Token) (any, error) {
    return jwt_secret_key, nil
  })
  if err != nil {
    return nil, err
  }
  dataJwtReturn, oke := token.Claims.(*dataJwt)
  if !oke || !token.Valid {
    return nil, errors.New("invalid token jwt")
  }
  return dataJwtReturn, nil
}