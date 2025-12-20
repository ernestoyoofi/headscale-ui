import { useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export default function Machine() {
  const hasRun = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    if(hasRun.current) return;
    hasRun.current = true;
    // Change
    navigate("/admin/nodes")
    toast.info("Move to node...")
  }, [])

  return <></>
}