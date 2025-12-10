package validator

import (
  "regexp"
)

func IsValidSimpleFormat(SimpleString string) bool {
  var validSimpleRegex = regexp.MustCompile("^[a-zA-Z0-9._]+$")

  if len(SimpleString) < 3 || len(SimpleString) > 255 {
    return false
  }

  return  validSimpleRegex.MatchString(SimpleString)
}

func IsValidPasswordFormat(PasswordString string) bool {
  var validPasswordRegex = regexp.MustCompile("^[a-zA-Z0-9._#@]+$")

  if len(PasswordString) < 3 || len(PasswordString) > 255 {
    return false
  }

  return  validPasswordRegex.MatchString(PasswordString)
}