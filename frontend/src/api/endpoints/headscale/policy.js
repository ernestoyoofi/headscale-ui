import { FetchData } from "../../base"

export async function getPolicy() {
  const request = await FetchData("/api/v1/policy")
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request.headers || {},
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request.headers || {},
    data: {
      policy: request.data?.policy||"{}",
			updatedAt: request.data?.updatedAt !== null ? new Date(request.data?.updatedAt) : null,
    }
  }
}

export async function setPolicy(policy = "") {
  const request = await FetchData("/api/v1/policy", {
    method: "PUT", data: { policy: String(policy) }
  })
  if(request.status !== 200) {
    return {
      isError: true,
      headers: request.headers || {},
      data: {
        message: (request?.data?.message||request?.statusText||"Unknowing")
      }
    }
  }
  return {
    isError: false,
    headers: request.headers || {},
    data: {
      policy: request.data?.policy||"{}",
			updatedAt: new Date(request.data?.updatedAt||""),
    }
  }
}