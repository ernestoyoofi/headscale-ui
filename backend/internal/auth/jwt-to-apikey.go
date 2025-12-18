package auth

import "headscale-ui.backend/pkg/action"

func JsonWebTokenToApiKey(JwtToken string) (apiKey string, userId int, err *string) {
  // Extract Json Webtoken To Auth
  UserId, _, ApiKey, _, _, errs := action.IsLogin(JwtToken)
  if errs != nil {
    return "", 0, errs
  }
  return ApiKey, UserId, errs
}