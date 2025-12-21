import { LaptopIcon, ServerIcon } from "lucide-react"
import { Empty, EmptyDescription, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty"
import { Button } from "../ui/button"

export default function SideClientIssue({ error, resetErrorBoundary }) {
  if(!!error) {
    console.log(String(error?.stack||""))
  }

  return <div className="w-full h-dvh flex items-center justify-center">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LaptopIcon />
        </EmptyMedia>
        <EmptyTitle>Side Client Issue</EmptyTitle>
        <EmptyDescription>
          <p>There seems to be a problem with the front-end logic. Please check the devtools log in <b>Inspect</b> → <b>Console</b> and report the problem.</p>
          {/* <pre className="w-full text-left max-w-md overflow-y-auto">{String(error.stack)}</pre> */}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={resetErrorBoundary} className="cursor-pointer">Re-Try</Button>
      </EmptyContent>
    </Empty>
  </div>
}