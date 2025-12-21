import { ArrowUpRightIcon, LaptopIcon, ServerIcon, UnplugIcon } from "lucide-react"
import { Empty, EmptyDescription, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty"
import { Button } from "../ui/button"
import { Link } from "react-router"

export default function HeadscaleUnathorization() {
  return <div className="w-full h-[calc(100dvh-95px)] flex items-center justify-center">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UnplugIcon />
        </EmptyMedia>
        <EmptyTitle>Not getting Headscale permission</EmptyTitle>
        <EmptyDescription>
          <p>Please open your virtual machine, VPS, or server, then open the terminal/CLI and type the menu "<code className="font-medium">headscale apikeys create --expiration 256d</code>" to create the API Key.</p>
          <p className="mt-2.5">Ensure that the API Key is valid. If you set the timeout, please set the time or renew it before it times out.</p>
          <p className="mt-2.5">To enter the API Key, open the <b>"Settings"</b> menu, then the <b>"API Key"</b> section, enter the key, and click <b>Update</b>. It should now be working normally and accessible.</p>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild className="cursor-pointer">
          <Link to="/admin/settings">Open Settings</Link>
        </Button>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a target="_blank" href="https://headscale.net/stable/ref/remote-cli/#create-an-api-key">View Documentation <ArrowUpRightIcon /></a>
      </Button>
    </Empty>
  </div>
}