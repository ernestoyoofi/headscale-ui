import { useEffect, useRef } from "react"
import { useLocation } from "react-router"

export default function Middleware_All({ children }) {
  const hasRun = useRef(false)
  let location = useLocation()
  const path = (location?.pathname||"/")
  
  console.log(path)

  function ReadFirst() {
    if(hasRun.current) return;
    hasRun.current = true;
    // Run...
    console.log("View:", path)
  }

  useEffect(() => {
    ReadFirst()
  }, [])

  return <>
    {children}
  </>
}