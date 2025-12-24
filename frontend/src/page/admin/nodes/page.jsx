import { useEffect, useRef, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Input } from "../../../components/ui/input"
import HeadscaleUnathorization from "../../../components/layout/HeadscaleUnauthorization"
import LoadingMiddleware from "../../../components/layout/LoadingMiddlware"
import apiAction from "../../../api/index"
import SideServerIssue from "../../../components/layout/SideServerIssue"
import NodeMachineList from "../../../components/content/NodeMachineList"
import { Button } from "../../../components/ui/button"
import { PlusIcon } from "lucide-react"
import { Spinner } from "../../../components/ui/spinner"
import { toast } from "sonner"

export default function Node() {
  const [needPermission, setPerissionNeeded] = useState(false)
  const [dialogAddDevice, setDialogAddDevice] = useState(false)
  const [loadingSessionAddDevice, setLoadingSessionAddDevice] = useState(false)
  const [dataUser, setDataUser] = useState({ isLoading: true, data: {} })
  const [data, setData] = useState({ isLoading: true, data: {} })
  const inputDeviceAdd = useRef()
  const inputDeviceAddUser = useRef()
  const hasRun = useRef(false)

  async function GetDataPage() {
    setData({ isLoading: true, data: data.data })
    const requestdata = await apiAction.api.nodes()
    if(requestdata.status === 403) {
      setPerissionNeeded(true)
    }
    setData({ isLoading: false, data: requestdata })
  }

  async function TriggerDataUser() {
    setDataUser({ isLoading: true, data: data.data })
    const requestdata = await apiAction.api.getuser()
    if(requestdata.status === 403) {
      setPerissionNeeded(true)
    }
    setDataUser({ isLoading: false, data: requestdata })
  }

  async function NodeAddDeviceKeyRegister() {
    if(loadingSessionAddDevice) return;
    setLoadingSessionAddDevice(true)
    const requestdata = await apiAction.api.register(
      inputDeviceAddUser.current || "",
      inputDeviceAdd.current?.value || ""
    )
    setLoadingSessionAddDevice(false)
    if(requestdata.isError || requestdata.data.status > 399) {
      toast.error(requestdata?.data?.message||requestdata?.data||requestdata.statusText||"Unknowing")
      return;
    }
    inputDeviceAddUser.current = ""
    inputDeviceAdd.current.value = ""
    setDialogAddDevice(false)
  }

  const openMenuDeviceAdd = () => {
    setDialogAddDevice(true)
    if(!Object.keys(dataUser.data)[0]) {
      TriggerDataUser()
    }
  }
  const triggerDialogDeviceAdd = (e) => {
    setDialogAddDevice(e)
    if(!e) {
      if(inputDeviceAdd.current) {
        inputDeviceAdd.current.value = ""
      }
      if(inputDeviceAddUser.current) {
        inputDeviceAddUser.current = ""
      }
    }
  }

  useEffect(() => {
    if(hasRun.current) return;
    hasRun.current = true;
    // Run...
    GetDataPage();
  }, [])

  if(needPermission) {
    return <>
      <HeadscaleUnathorization className="h-[calc(100dvh-60px)]"/>
    </>
  }
  if(!data.isLoading && data.data.status > 499) {
    return <>
      <SideServerIssue className="h-[calc(100dvh-60px)]"/>
    </>
  }
  return <>
    {data.isLoading && <LoadingMiddleware className="h-[calc(100dvh-60px)]"/>}
    {(data.data?.data?.list) && <>
      <div className="w-full py-2.5 px-3">
        <h2 className="text-2xl font-bold">Machine</h2>
        <p className="mt-1 text-neutral-600">Manage devices connected to your tailnet network.</p>
      </div>
      <div className="w-full pb-4.5 flex items-center justify-end px-3">
        <Button variant="outline" className="cursor-pointer" onClick={openMenuDeviceAdd}>
          <PlusIcon />
          <span>Add Device</span>
        </Button>
      </div>
      <div className="w-full px-3">
        {(data.data?.data?.list).map((items, key) => (
          <NodeMachineList data={items} key={key} triggerRefreshData={GetDataPage}/>
        ))}
        {/* <pre className="text-nowrap overflow-x-auto">{JSON.stringify(data,null,2)}</pre>
        <p>Comming Soon...</p> */}
      </div>
      <Dialog open={dialogAddDevice} onOpenChange={triggerDialogDeviceAdd}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Device</DialogTitle>
            <DialogDescription>
              <span>Enter the key into the input field, then select the user who wants to connect their device.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="my-1">
            <Input
              ref={inputDeviceAdd}
              placeholder="Key machine..."
              className="mb-3"
            />
            <Select onValueChange={(e) => {
              inputDeviceAddUser.current = String(e||"")
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {dataUser.data?.data?.list?.map((users, key) => (
                  <SelectItem key={key} value={users?.name||""}>{users?.displayName? `${users?.name} (${users?.name})`:users?.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              onClick={NodeAddDeviceKeyRegister}
            >
              {loadingSessionAddDevice && <Spinner />}
              <span>Register</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>}
  </>
}