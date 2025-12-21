import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import HeadscaleUnathorization from "../../../components/layout/HeadscaleUnauthorization"
import LoadingMiddleware from "../../../components/layout/LoadingMiddlware"
import apiAction from "../../../api/index"
import SideServerIssue from "../../../components/layout/SideServerIssue"

export default function Users() {
  const [needPermission, setPerissionNeeded] = useState(false)
  const [data, setData] = useState({ isLoading: true, data: {} })
  const hasRun = useRef(false)
  const navigate = useNavigate()

  async function GetDataPage({ id = "", name = "", email = "" } = {}) {
    setData({ isLoading: true, data: data.data })
    const requestdata = await apiAction.api.getuser(id, name, email)
    if(requestdata.status === 403) {
      setPerissionNeeded(true)
    }
    setData({ isLoading: false, data: requestdata })
  }
  
  console.log(data)

  useEffect(() => {
    if(hasRun.current) return;
    hasRun.current = true;
    // Run...
    GetDataPage();
  }, [])

  if(needPermission) {
    return <>
      <HeadscaleUnathorization className="h-[calc(100dvh-95px)]"/>
    </>
  }
  if(!data.isLoading && data.data.status === 500) {
    return <>
      <SideServerIssue className="h-[calc(100dvh-95px)]"/>
    </>
  }
  return <>
    {data.isLoading && <LoadingMiddleware className="h-[calc(100dvh-95px)]"/>}
  </>
}