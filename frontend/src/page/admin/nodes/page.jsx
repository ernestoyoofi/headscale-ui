import { useEffect, useRef, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import HeadscaleUnathorization from "../../../components/layout/HeadscaleUnauthorization"
import LoadingMiddleware from "../../../components/layout/LoadingMiddlware"
import apiAction from "../../../api/index"
import SideServerIssue from "../../../components/layout/SideServerIssue"
//...
import { Button } from "../../../components/ui/button"
import { PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { Spinner } from "../../../components/ui/spinner"
import { toast } from "sonner"

export default function Node() {
  const [needPermission, setPerissionNeeded] = useState(false)
  const [dialogAddDevice, setDialogAddDevice] = useState(false)
  const [loadingSessionAddDevice, setLoadingSessionAddDevice] = useState(false)
  const [data, setData] = useState({ isLoading: true, data: {} })
  const hasRun = useRef(false)

  async function GetDataPage() {
    setData({ isLoading: true, data: data.data })
    const requestdata = await apiAction.api.nodes()
    if(requestdata.status === 403) {
      setPerissionNeeded(true)
    }
    setData({ isLoading: false, data: requestdata })
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
        <Button variant="outline" className="cursor-pointer" onClick={() => { setDialogAddDevice(true) }}>
          <PlusIcon />
          <span>Add Device</span>
        </Button>
      </div>
      <div className="w-full px-3">
        <p>Comming Soon...</p>
      </div>
    </>}
  </>
}