import { FetchData } from "../../base"

export async function getUsers(id = "", name = "", email = "") {
  const query = new URLSearchParams()
  if(!!String(id).trim()) {
    query.set("id", String(id).trim())
  }
  if(!!String(name).trim()) {
    query.set("name", String(name).trim())
  }
  if(!!String(email).trim()) {
    query.set("email", String(email).trim())
  }
  const request = await FetchData("/api/v1/user"+(!!query.toString()? `?${query.toString()}`:""))
  if(request.status !== 200) {
    return {
      isError: true,
      message: (request?.data?.message||request?.statusText||"Unknowing")
    }
  }
  return {
    isError: false,
    data: {
      list: (request.data.users||[])
    }
  }
}

export async function createUser(username = "", email = "", displayName = "", pictureUrl = "") {
  const request = await FetchData("/api/v1/user", {
    method: "POST", data: { name: username, email, displayName, pictureUrl }
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
      type: "create-user",
      success: true
    }
  }
}

export async function deleteUser(id = "") {
  const request = await FetchData(`/api/v1/user/${id}`, {
    method: "DELETE",
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
      type: "delete-user",
      success: true
    }
  }
}

export async function renameUser(id = "", newName = "") {
  const request = await FetchData(`/api/v1/user/${id}/rename/${newName}`, {
    method: "POST",
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
      type: "rename-user",
      success: true
    }
  }
}