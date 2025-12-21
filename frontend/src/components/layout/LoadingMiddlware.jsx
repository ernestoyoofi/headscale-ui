import { OrbitProgress } from "react-loading-indicators"
import { cn } from "../../lib/utils"

export default function LoadingMiddleware({ className = "" }) {
  return <div className={cn(
    "w-full h-dvh flex items-center justify-center",
    className
  )}>
    <div className="scale-50">
      <OrbitProgress variant="disc" dense color="#1073ff" size="small"/>
    </div>
    <p className="text-base font-semibold -ml-0.5">Loading App...</p>
  </div>
}