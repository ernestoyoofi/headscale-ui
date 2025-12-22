package structure

// Structure
type HTTP_Response_Data_Type struct {
  Status int         `json:"status"`
  Data   interface{} `json:"data"`
}
type HTTP_Response_Error_Type struct {
  Status  int    `json:"status"`
  Message string `json:"message"`
}

// Data Payload
type HTTP_Request_LoginAccount struct {
  Username string `json:"username"`
  Password string `json:"password"`
}
type HTTP_Request_UpdatePassword struct {
  PasswordOld     string `json:"password_old"`
  PasswordNew     string `json:"password_new"`
  PasswordConfirm string `json:"password_confirm"`
}
type HTTP_Request_UpdateTokenKey struct {
  TokenKey    string `json:"apikey"`
}

// Data Respon
type HTTP_Response_MiddlewareChecker struct {
  Username       string `json:"username"`
  IsSetup        bool   `json:"is_setup"`
  IsLogin        bool   `json:"is_login"`
  HaveKeyAPI     bool   `json:"have_apikey"`
  IsBackendError bool   `json:"backend_err"`
}
type HTTP_Response_ActionSucces struct {
  Message string `json:"message"`
  Success bool   `json:"success"`
}
type HTTP_Response_LoginAccount struct {
  TokenAuth string `json:"token"`
  Success   bool   `json:"success"`
}
type HTTP_Response_SetupNewAccount struct {
  TokenAuth string `json:"token"`
  Success   bool   `json:"success"`
}