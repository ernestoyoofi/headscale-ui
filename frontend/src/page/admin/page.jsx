import { useEffect, useRef } from "react"
import { useNavigate } from "react-router"

export default function AdminIndex() {
  const hasRun = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    if(hasRun.current) return;
    hasRun.current = true;
    // Change
    navigate("/admin/nodes")
  }, [])

  return <></>
}