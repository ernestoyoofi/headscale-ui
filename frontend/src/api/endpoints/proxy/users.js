import { FetchData } from "../../base"

export async function proxyNewDefaultAdmin(username = "", password = "") {
  const request = await FetchData("/api/backend/new-default-admin", {
    method: "POST", data: { username, password }
  })
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request?.headers || {},
      status: request.status || 0,
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request?.headers || {},
    status: request.status || 0,
    data: {
      token: String(request?.data?.token||""),
      success: true
    }
  }
}

export async function proxyLogin(username = "", password = "") {
  const request = await FetchData("/api/backend/login", {
    method: "POST", data: { username, password }
  })
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request?.headers || {},
      status: request.status || 0,
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request?.headers || {},
    status: request.status || 0,
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
      headers: request?.headers || {},
      status: request.status || 0,
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request?.headers || {},
    status: request.status || 0,
    data: {
      type: "update-token-key",
      token: String(request?.data?.token||""),
      success: true
    }
  }
}

export async function proxyUpdatePassword(password_old = "", password_new = "", password_confrim = "") {
  const request = await FetchData("/api/backend/update-password", {
    method: "PATCH", data: { password_old, password_new, password_confrim }
  })
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request?.headers || {},
      status: request.status || 0,
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request?.headers || {},
    status: request.status || 0,
    data: {
      type: "update-password",
      token: String(request?.data?.token||""),
      success: true
    }
  }
}