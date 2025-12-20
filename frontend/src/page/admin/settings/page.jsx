import { useEffect } from "react"
import { toast } from "sonner"

export default function Settings() {
  useEffect(() => {
    toast.info("Settings")
  }, [])

  return <>
    <p>Settings page...</p>
  </>
}