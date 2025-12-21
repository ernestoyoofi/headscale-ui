import { ServerIcon } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../../components/ui/empty"
import { cn } from "../../lib/utils"

export default function SideServerIssue({ className = "" }) {
  return <div className={cn(
    "w-full h-dvh flex items-center justify-center",
    className
  )}>
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ServerIcon />
        </EmptyMedia>
        <EmptyTitle>Side Server Issue <span className="text-sm bg-red-100 text-red-600 py-0.5 px-2 rounded-md">504</span></EmptyTitle>
        <EmptyDescription>There seems to be a problem on the server side. Please check the log to see the activity and report the problem.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  </div>
}