import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import apiAction from "../../api"
import SideServerIssue from "../layout/SideServerIssue"
import LoadingMiddleware from "../layout/LoadingMiddlware"
import Sidebar_Admin from "./Sidebar"

export default function Middleware_All({ children }) {
  const [mode, setMode] = useState("loading")
  const hasRun = useRef(false)
  const hasAdmin = useRef(true)
  const location = useLocation()
  const navigate = useNavigate()
  const path = String(location?.pathname||"/")

  async function RunningMiddleware() {
    const requestdata = await apiAction.proxy.middleware()
    const { data, isError } = requestdata || {}

    if(isError || data?.backend_err) {
      setMode("server_error")
      return;
    }
    setMode("none")

    if(data?.is_login) {
      if(!path.startsWith("/admin")) navigate("/admin/")
      return;
    }
    if(data?.is_setup) {
      if(!path.startsWith("/setup")) navigate("/setup")
      return;
    }
    if(path !== "/") {
      navigate("/")
    }
  }

  useEffect(() => {
    if(hasRun.current) return;
    hasRun.current = true;
    RunningMiddleware(); // Executed
  }, [])

  useEffect(() => {
    if(path.match("/admin")) {
      if(!hasAdmin.current) {
        hasAdmin.current = true;
        RunningMiddleware(); // Executed
      }
    } else {
      if(hasAdmin.current) {
        hasAdmin.current = false;
        RunningMiddleware(); // Executed
      }
    }
  }, [hasAdmin, path])

  if(mode === "loading") {
    return <LoadingMiddleware />
  }
  if(mode === "server_error") {
    return <SideServerIssue />
  }
  return <>
    {path.match("/admin")? <Sidebar_Admin pathNow={path}>
      {children}
    </Sidebar_Admin>:children}
  </>
}