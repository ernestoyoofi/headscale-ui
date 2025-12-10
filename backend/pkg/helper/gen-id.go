package helper

import (
  "crypto/rand"
  "log"
  "math/big"
)

func GenerateID(Length int) string {
  var hexString = "abcdef1234567890"
  chars := []rune(hexString)
  result := make([]rune, Length)
  max := big.NewInt(int64(len(chars)))

  for i := 0; i < Length; i++ {
    randomIndex, err := rand.Int(rand.Reader, max)
    if err != nil {
      log.Printf("[gen-id.go]: Failed to generate secure random number: %v", err)
    }
    index := randomIndex.Int64()
    result[i] = chars[index]
  }

  return string(result)
}