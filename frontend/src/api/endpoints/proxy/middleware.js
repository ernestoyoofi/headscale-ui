import { FetchData } from "../../base"

export async function proxyGetMiddleware() {
  const request = await FetchData("/api/backend/md-checker")
  if(request.status !== 200) {
    return {
      isError: true,
      message: (request?.data?.message||request?.statusText||"Unknowing")
    }
  }
  return {
    isError: false,
    data: (request?.data?.data||{})
  }
}