package setup

import (
  "log"
  "os"

  "headscale-ui.backend/pkg/helper"
)

// If User No Add JWT Token For Secret, System By Automaticly Generate Own Token
func GenerateJwtToken() {
  unjwttoken := "/root/secret/jwt-token"
  if os.Getenv("RE_GENERATE_R") != "" {
    unjwttoken = os.Getenv("RE_GENERATE_R")
  }
  if _, err := os.Stat(unjwttoken); os.IsNotExist(err) {
    idGenerateJwt := helper.GenerateID(52)
    jwtString := "tokenjwt-"+idGenerateJwt
    err := os.WriteFile(unjwttoken, []byte(jwtString), 0666)
    if err != nil {
      log.Fatal("[\x1b[31mJWT Token\x1b[0m]: Bad Write File", err)
    }
  }
}