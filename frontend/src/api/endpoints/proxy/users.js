import { FetchData } from "../../base"

export async function proxyNewDefaultAdmin(username = "", password = "") {
  const request = await FetchData("/api/backend/new-default-admin", {
    method: "POST", data: { username, password }
  })
  if(request.status !== 200) {
    return {
      isError: true,
      message: (request?.data?.message||request?.statusText||"Unknowing")
    }
  }
  return {
    isError: false,
    data: {
      token: String(request?.data?.token||""),
      success: true
    }
  }
}

export async function proxyLogin() {
  const request = await FetchData("/api/backend/login", {
    method: "POST", data: { username, password }
  })
  if(request.status !== 200) {
    return {
      isError: true,
      message: (request?.data?.message||request?.statusText||"Unknowing")
    }
  }
  return {
    isError: false,
    data: {
      token: String(request?.data?.token||""),
      success: true
    }
  }
}

export async function proxyUpdateTokenkey(apikey = "") {
  const request = await FetchData("/api/backend/update-token-key", {
    method: "PATCH", data: { apikey }
  })
  if(request.status !== 200) {
    return {
      isError: true,
      message: (request?.data?.message||request?.statusText||"Unknowing")
    }
  }
  return {
    isError: false,
    data: {
      type: "update-token-key",
      token: String(request?.data?.token||""),
      success: true
    }
  }
}

export async function proxyUpdateTokenkey(password_old = "", password_new = "", password_confrim = "") {
  const request = await FetchData("/api/backend/update-password", {
    method: "PATCH", data: { password_old, password_new, password_confrim }
  })
  if(request.status !== 200) {
    return {
      isError: true,
      message: (request?.data?.message||request?.statusText||"Unknowing")
    }
  }
  return {
    isError: false,
    data: {
      type: "update-password",
      token: String(request?.data?.token||""),
      success: true
    }
  }
}