import axios from "axios"

export const baseUrlAPI = "/"

export async function FetchData(path, { method = "GET", data = {}, headers = {}, ...others } = {}) {
  try {
    const base = axios.create({ baseURL: baseUrlAPI })
    const request = await base.request({
      ...others,
      headers: headers,
      url: String(path),
      method: method,
      data: data
    })
    return {
      status: request.status||{},
      statusText: request.statusText||200,
      headers: request.headers||{},
      isError: false,
      data: request.data||{},
    }
  } catch(e) {
    const responseHTTP = e?.response||{}
    return {
      status: responseHTTP?.status||-1,
      statusText: responseHTTP?.statusText||e?.message||"Unknowing",
      headers: responseHTTP?.headers||{},
      isError: true,
      data: responseHTTP?.data||{},
    }
  }
}