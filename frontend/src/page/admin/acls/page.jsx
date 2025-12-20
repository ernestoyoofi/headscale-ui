import { useEffect } from "react"
import { toast } from "sonner"

export default function Policy() {
  useEffect(() => {
    toast("Hai")
  }, [])

  return <>
    <p>Policy page...</p>
  </>
}