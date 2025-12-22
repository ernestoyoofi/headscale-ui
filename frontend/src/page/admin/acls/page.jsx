import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import * as shopify from "@shopify/lang-jsonc"
import { githubLight, defaultSettingsGithubLight } from "@uiw/codemirror-theme-github"
import CodeMirror from "@uiw/react-codemirror"
import LoadingMiddleware from "../../../components/layout/LoadingMiddlware"
import apiAction from "../../../api/index"
import { Button } from "../../../components/ui/button"
import HeadscaleUnathorization from "../../../components/layout/HeadscaleUnauthorization"
import SideServerIssue from "../../../components/layout/SideServerIssue"

export default function Policy() {
  const [needPermission, setPerissionNeeded] = useState(false)
  const [sessionLoadingEdited, setSessionLoadingEdited] = useState(false)
  const [data, setData] = useState({ isLoading: true, data: {} })
  const [inputText, setInputText] = useState("")
  const hasRun = useRef(false)

  async function GetDataPage() {
    setData({ isLoading: true, data: data.data })
    const requestdata = await apiAction.api.policy()
    if(requestdata.status === 403) {
      setPerissionNeeded(true)
    }
    if(!!requestdata?.data?.policy) {
      setInputText(String(requestdata?.data?.policy||"").trim())
    }
    setData({ isLoading: false, data: requestdata })
  }

  async function SaveChanges() {
    if(String(data.data?.data?.policy||"")?.trim() === String(inputText)?.trim()) {
      toast.warning("Nothing to change...")
      return;
    }
    if(sessionLoadingEdited) return;
    toast.info("Update acls...")
    setSessionLoadingEdited(true)
    const requestdata = await apiAction.api.setpolicy(inputText)
    setSessionLoadingEdited(false)
    if(requestdata.isError || requestdata.data.status > 399) {
      toast.error(requestdata?.data?.message||requestdata?.data||requestdata.statusText||"Unknowing")
      return;
    }
    toast.success("Success update acls!")
    GetDataPage()
  }

  function DiscardChanges() {
    setInputText(String(data.data?.data?.policy||"").trim())
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
    <div className="w-full py-2.5 px-3">
      <h2 className="text-2xl font-bold">Access controls</h2>
      <p className="mt-1 text-neutral-600">Grant specific access to devices connected to your tailnet network.</p>
    </div>
    {data.isLoading && <LoadingMiddleware className="h-[calc(100dvh-210px)]"/>}
    {(!data.isLoading && data.data?.data?.policy) && <>
      <div className="w-full px-3">
        <div className="bg-neutral-100 rounded-md overflow-hidden">
          <CodeMirror
            editable={!sessionLoadingEdited}
            extensions={[shopify.jsonc()]}
            value={inputText}
            onChange={(e) => { setInputText(e) }}
            height="100%"
            style={{ height: "100%" }}
            theme={githubLight}
          />
        </div>
        <div className="gap-2 flex py-3.5">
          <Button onClick={SaveChanges} className="cursor-pointer">
            <span>Save</span>
          </Button>
          <Button onClick={DiscardChanges} className="cursor-pointer" variant="outline">
            <span>Discard changes</span>
          </Button>
        </div>
      </div>
    </>}
  </>
}