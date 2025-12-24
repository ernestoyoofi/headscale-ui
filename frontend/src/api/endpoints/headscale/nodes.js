import { FetchData } from "../../base"

export async function getNodes() {
  const request = await FetchData("/api/v1/node")
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request.headers || {},
      status: request.status || 0,
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request.headers || {},
    status: request.status || 0,
    data: {
      list: (request.data.nodes||[])
    }
  }
}

export async function getNode(id = "") {
  const request = await FetchData(`/api/v1/node/${id}`)
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request.headers || {},
      status: request.status || 0,
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request.headers || {},
    status: request.status || 0,
    data: (request.data.node||{})
  }
}

export async function deleteNode(id = "") {
  const request = await FetchData(`/api/v1/node/${id}`, {
    method: "DELETE"
  })
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request.headers || {},
      status: request.status || 0,
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request.headers || {},
    status: request.status || 0,
    data: {
      type: "delete-node",
      success: true,
    }
  }
}

export async function registerNode(user = "", key = "") {
  const query = new URLSearchParams()
  query.append("key", String(key))
  query.append("user", String(user))
  const request = await FetchData(`/api/v1/node/register`, {
    method: "POST", data: String(query),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request.headers || {},
      status: request.status || 0,
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request.headers || {},
    status: request.status || 0,
    data: {
      type: "register-node",
      success: true,
    }
  }
}

export async function approveNodeRoutes(id = "", routes = []) {
  const request = await FetchData(`/api/v1/node/${id}/approve_routes`, {
    method: "POST", data: { routes: Array.from(routes) }
  })
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request.headers || {},
      status: request.status || 0,
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request.headers || {},
    status: request.status || 0,
    data: {
      type: "approve-node",
      success: true,
    }
  }
}

export async function expireNode(id = "") {
  const request = await FetchData(`/api/v1/node/${id}/expire`, {
    method: "POST",
  })
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request.headers || {},
      status: request.status || 0,
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request.headers || {},
    status: request.status || 0,
    data: {
      type: "expire-node",
      success: true,
    }
  }
}

export async function renameNode(id = "", newName = "") {
  const request = await FetchData(`/api/v1/node/${id}/rename/${newName}`, {
    method: "POST",
  })
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request.headers || {},
      status: request.status || 0,
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request.headers || {},
    status: request.status || 0,
    data: {
      type: "rename-node",
      success: true,
    }
  }
}

export async function setNodeTags(id = "", tags = []) {
  const request = await FetchData(`/api/v1/node/${id}/tags`, {
    method: "POST", data: { tags: Array.from(tags) }
  })
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request.headers || {},
      status: request.status || 0,
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request.headers || {},
    status: request.status || 0,
    data: {
      type: "settag-node",
      success: true,
    }
  }
}

// Remove Feature Move Node
// See More : https://github.com/juanfont/headscale/pull/2922

// export async function moveNodeUser(id = "", user = "") {
//   const request = await FetchData(`/api/v1/node/${id}/user`, {
//     method: "POST", data: { user }
//   })
//   if(request.status !== 200) {
//     return {
//       isError: true,
//       message: (request?.data?.message||request?.statusText||"Unknowing")
//     }
//   }
//   return {
//     isError: false,
//     data: {
//       type: "setuser-node",
//       success: true,
//     }
//   }
// }