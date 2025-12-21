import { FetchData } from "../../base"

export async function proxyGetMiddleware() {
  const request = await FetchData("/api/backend/md-checker")
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
    data: (request?.data?.data||{})
  }
}