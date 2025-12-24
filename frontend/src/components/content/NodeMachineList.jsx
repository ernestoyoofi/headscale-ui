import { DropdownMenuSeparator, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { useRef, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Checkbox } from "../ui/checkbox"
import { Spinner } from "../ui/spinner"
import { EllipsisIcon, TagsIcon } from "lucide-react"
import { toast } from "sonner"
import { formatDateShort } from "../../lib/date-function"
import { cn } from "../../lib/utils"
import apiAction from "../../api"

export default function NodeMachineList({ data = {}, triggerRefreshData = null }) {
  const [dialogType, setDialogType] = useState(null) // "delete"|"approve_routes"|"expire"|"rename"|"set_tags"
  const [sureAction, setSureAction] = useState("")
  const [loadingSessionType, setLoadingSessionType] = useState("")
  const [valueSubnets, setValueSubnets] = useState(data.approvedRoutes||[])
  const [valueACLTags, setValueACLTags] = useState(data.validTags||[])
  const inputRename = useRef()
  const inputNewTag = useRef()

  const refreshPage = () => {
    if(typeof triggerRefreshData === "function") {
      triggerRefreshData()
    }
  }

  const copySomethingOnNode = (texts) => {
    try {
      console.log("Copy:", texts)
      navigator.clipboard.writeText(String(texts||""))
      toast.success("Success copy!")
    } catch(e) {
      toast.error("Bad copy to clipboard...")
    }
  }

  async function RenameNode() {
    if(loadingSessionType === "rename") return;
    toast.info(`Rename node ${data?.givenName||data.name}...`)
    setLoadingSessionType("rename")
    const requestdata = await apiAction.api.rename(data.id, inputRename.current?.value||"")
    setLoadingSessionType("")
    if(requestdata.isError || requestdata.data.status > 399) {
      toast.error(requestdata?.data?.message||requestdata?.data||requestdata.statusText||"Unknowing")
      return;
    }
    setDialogType(null)
    setSureAction("")
    refreshPage()
    toast.success("Success to rename node!")
  }

  async function ApproveRouteNode() {
    if(loadingSessionType === "routes") return;
    toast.info(`Set route node ${data?.givenName||data.name}...`)
    setLoadingSessionType("routes")
    const requestdata = await apiAction.api.approve_routes(data.id, valueSubnets)
    setLoadingSessionType("")
    if(requestdata.isError || requestdata.data.status > 399) {
      toast.error(requestdata?.data?.message||requestdata?.data||requestdata.statusText||"Unknowing")
      return;
    }
    setDialogType(null)
    setSureAction("")
    refreshPage()
    toast.success("Success to set routes node!")
  }

  async function TagSetNode() {
    if(loadingSessionType === "tags") return;
    toast.info(`Set tag node ${data?.givenName||data.name}...`)
    setLoadingSessionType("tags")
    const requestdata = await apiAction.api.tags(data.id, valueACLTags)
    setLoadingSessionType("")
    if(requestdata.isError || requestdata.data.status > 399) {
      toast.error(requestdata?.data?.message||requestdata?.data||requestdata.statusText||"Unknowing")
      return;
    }
    setDialogType(null)
    setSureAction("")
    refreshPage()
    toast.success("Success to set tag node!")
  }

  async function ExpireNode() {
    if(loadingSessionType === "expire") return;
    toast.info(`Expire node ${data?.givenName||data.name}...`)
    setLoadingSessionType("expire")
    const requestdata = await apiAction.api.expire(data.id)
    setLoadingSessionType("")
    if(requestdata.isError || requestdata.data.status > 399) {
      toast.error(requestdata?.data?.message||requestdata?.data||requestdata.statusText||"Unknowing")
      return;
    }
    setDialogType(null)
    setSureAction("")
    refreshPage()
    toast.success("Success to expire node!")
  }

  async function DeleteNode() {
    if(loadingSessionType === "delete") return;
    toast.info(`Delete node ${data?.givenName||data.name}...`)
    setLoadingSessionType("delete")
    const requestdata = await apiAction.api.remove(data.id)
    setLoadingSessionType("")
    if(requestdata.isError || requestdata.data.status > 399) {
      toast.error(requestdata?.data?.message||requestdata?.data||requestdata.statusText||"Unknowing")
      return;
    }
    setDialogType(null)
    setSureAction("")
    refreshPage()
    toast.success("Success to delete node!")
  }

  return <div className="w-full border-t border-neutral-100 py-2 px-3 flex items-center items-start" data-node-id={String(data.id)}>
    <div className="w-[calc(100%-50px)] text-sm md:flex">
      <div className="w-full md:w-[calc(100%-488px)]">
        <b className="mb-0.5 w-full block text-base hover:text-blue-600 hover:underline cursor-pointer">{data.givenName}</b>
        <p className="mb-1.5 text-neutral-600">{data?.user?.name||"unknowing?"}</p>
        {!!data.validTags[0] && <div className="w-full flex gap-2 pb-1">
          {(data.validTags||[]).filter(a => !!a.trim())?.map((tags, key) => (
            <Badge variant="outline" key={key}>
              <span><span className="text-neutral-500">tag:</span>{tags.slice(4)}</span>
            </Badge>
          ))}
        </div>}
        {!!data.approvedRoutes[0] && <div className="w-full flex gap-2 pb-1">
          {data.approvedRoutes.map((tags, key) => (
            <Badge variant="outline" key={key}>
              <span><span className="text-blue-500">subnets:</span>{tags}</span>
            </Badge>
          ))}
        </div>}
      </div>
      <div className="w-full pt-1 md:w-[272px] md:px-1">
        {(data?.ipAddresses||[]).map((ips, key) => (
          <p key={key} className="truncate text-nowrap overflow-hidden block w-full">{ips}</p>
        ))}
      </div>
      <div className={cn("w-full pt-1 md:w-[190px] md:px-1", data.online? "text-green-500":"text-black")}>
        <div className="w-full flex items-center">
          <span
            className={cn("w-[8px] h-[8px] min-w-[8px] min-h-[8px] rounded-md", data.online? "bg-green-500":"bg-neutral-700")}
          />
          <span className="ml-1.5 truncate text-nowrap overflow-hidden block w-full">{data.online? "Online":`Last seen ${formatDateShort(data.lastSeen)}`}</span>
        </div>
      </div>
    </div>
    <div className="w-[50px] h-full flex items-start">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto" align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => { copySomethingOnNode(data?.ipAddresses?.filter(a => !a.match(":"))[0]||"") }}
          >Copy IPv4</DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => { copySomethingOnNode(data?.ipAddresses?.filter(a => a.match(":"))[0]||"") }}
          >Copy IPv6</DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => { copySomethingOnNode(data?.givenName||"") }}
          >Copy DNS/Name Machine</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => { setDialogType("rename") }}
          >Rename machine</DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => { setDialogType("routes") }}
          >Edit routes</DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => { setDialogType("tags") }}
          >Edit ACL tags</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            variant="destructive" 
            className="cursor-pointer"
            onClick={() => { setDialogType("expire") }}
          >Expire machine</DropdownMenuItem>
          <DropdownMenuItem 
            variant="destructive" 
            className="cursor-pointer"
            onClick={() => { setDialogType("delete") }}
          >Remove</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Rename Node */}
      <Dialog open={dialogType === "rename"} onOpenChange={(e) => {
        setDialogType(e? "rename":null)
        if(!e) {
          setSureAction("")
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename machine</DialogTitle>
            <DialogDescription>
              <span>Enter the machine <b>{data?.givenName||data?.name}</b></span>
            </DialogDescription>
          </DialogHeader>
          <div className="my-1">
            <Input
              placeholder="Enter the new machine name..."
              type="text"
              autoComplete="off"
              ref={inputRename}
              onChange={(e) => {
                const isInput = String(e?.target?.value||"")
                setSureAction(!!isInput? "rename":"")
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
              >Cancel</Button>
            </DialogClose>
            <Button
              className="cursor-pointer"
              disabled={sureAction !== "rename"}
              onClick={RenameNode}
            >
              {loadingSessionType === "rename" && <Spinner />}
              <span>Rename the machine</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Routes Node Dialog */}
      <Dialog open={dialogType === "routes"} onOpenChange={(e) => {
        setDialogType(e? "routes":null)
        if(!e) {
          setValueSubnets(Array.from(data.approvedRoutes||[]))
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{`Edit Route ${data?.givenName||data?.name}`}</DialogTitle>
            <DialogDescription>
              <span>Connect to devices you can't install Tailscale on by advertising IP ranges as subnet routes</span>
            </DialogDescription>
          </DialogHeader>
          <div className="my-1">
            {data?.availableRoutes?.map((ip_subnets, key) => (
              <label key={key} className="w-full flex items-center py-1 cursor-pointer">
                <Checkbox
                  name={"value-"+ip_subnets}
                  defaultChecked={valueSubnets.find(a => a === ip_subnets)}
                  onClick={(e) => {
                    const isChecked = e.target?.getAttribute("data-state") === "checked"
                    let dataValues = valueSubnets
                    if(!isChecked) {
                      if(!valueSubnets.find(a => a === ip_subnets)) {
                        dataValues.push(ip_subnets)
                      }
                    } else {
                      dataValues = valueSubnets.filter(a => a !== ip_subnets)
                    }
                    setValueSubnets(Array.from(dataValues))
                  }}
                />
                <span className="ml-2">{ip_subnets}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
              >Cancel</Button>
            </DialogClose>
            <Button
              className="cursor-pointer"
              onClick={ApproveRouteNode}
            >
              {loadingSessionType === "routes" && <Spinner />}
              <span>Set routes</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Tags Node Dialog */}
      <Dialog open={dialogType === "tags"} onOpenChange={(e) => {
        setDialogType(e? "tags":null)
        if(!e) {
          setValueACLTags(Array.from(data.validTags||[]))
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{`Edit Tags ${data?.givenName||data?.name}`}</DialogTitle>
            <DialogDescription>
              <span>Manage access to this machine by adding and removing tags.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="my-1">
            {!valueACLTags[0] && <div className="w-full h-12 flex items-center justify-center text-neutral-400 text-sm border-neutral-200 border rounded-md mb-1.5">
              <p>No tag in here...</p>
            </div>}
            {valueACLTags?.map((tags, key) => (
              <label key={key} className="w-full flex items-center py-1 px-3.5 cursor-pointer text-neutral-700 text-sm rounded-md mb-1.5 border-neutral-200 border">
                <TagsIcon size={15}/>
                <span className="ml-2">{tags}</span>
              </label>
            ))}
            <Input
              className="mt-2"
              name="new-tag"
              ref={inputNewTag}
              placeholder="Add your tag..."
            />
            <Button
              variant="outline"
              className="cursor-pointer mt-2"
              onClick={() => {
                let datadefault = valueACLTags
                if(!String(inputNewTag.current.value||"").trim()) {
                  return;
                }
                const strAdd = `tag:${inputNewTag.current.value||""}`
                if(!datadefault.find(a => a === strAdd)) {
                  datadefault.push(strAdd)
                }
                setValueACLTags(Array.from(datadefault))
              }}
            >Add tag</Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
              >Cancel</Button>
            </DialogClose>
            <Button
              className="cursor-pointer"
              onClick={TagSetNode}
            >
              {loadingSessionType === "tags" && <Spinner />}
              <span>Set tags</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Expire Node Dialog */}
      <Dialog open={dialogType === "expire"} onOpenChange={(e) => {
        setDialogType(e? "expire":null)
        if(!e) {
          setSureAction("")
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Expire Machine</DialogTitle>
            <DialogDescription>
              <span>Are you sure you want to expire this machine? If you are sure, please enter your machine name "<b className="select-none">{data?.givenName||""}</b>" and click "<b>Expire the machine.</b>"</span>
            </DialogDescription>
          </DialogHeader>
          <div className="my-1">
            <Input
              placeholder="Enter the machine name to expire..."
              type="text"
              autoComplete="off"
              onChange={(e) => {
                const isInput = String(e?.target?.value||"")
                setSureAction((isInput === data?.givenName||"")? "expire":"")
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
              >Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              className="cursor-pointer"
              disabled={sureAction !== "expire"}
              onClick={ExpireNode}
            >
              {loadingSessionType === "expire" && <Spinner />}
              <span>Expire the machine</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Node Dialog */}
      <Dialog open={dialogType === "delete"} onOpenChange={(e) => {
        setDialogType(e? "delete":null);
        if(!e) {
          setSureAction("")
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Machine</DialogTitle>
            <DialogDescription>
              <span>Are you sure you want to delete this machine? If you delete it, the data cannot be recovered and will be permanently deleted. If you are sure, please enter your machine name "<b className="select-none">{data?.givenName||""}</b>" and click "<b>Delete.</b>"</span>
            </DialogDescription>
          </DialogHeader>
          <div className="my-1">
            <Input
              placeholder="Enter the machine name to delete..."
              type="text"
              autoComplete="off"
              onChange={(e) => {
                const isInput = String(e?.target?.value||"")
                setSureAction((isInput === data?.givenName||"")? "delete":"")
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
              >Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              className="cursor-pointer"
              disabled={sureAction !== "delete"}
              onClick={DeleteNode}
            >
              {loadingSessionType === "delete" && <Spinner />}
              <span>Delete</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
}