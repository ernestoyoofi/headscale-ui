import { useEffect, useRef, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import HeadscaleUnathorization from "../../../components/layout/HeadscaleUnauthorization"
import LoadingMiddleware from "../../../components/layout/LoadingMiddlware"
import apiAction from "../../../api/index"
import SideServerIssue from "../../../components/layout/SideServerIssue"
import UserContentList from "../../../components/content/UserContentList"
import { Button } from "../../../components/ui/button"
import { PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { Spinner } from "../../../components/ui/spinner"
import { toast } from "sonner"

export default function Users() {
  const [needPermission, setPerissionNeeded] = useState(false)
  const [dialogAddUser, setDialogAddUser] = useState(false)
  const [loadingSessionAddUser, setLoadingSessionAddUser] = useState(false)
  const [data, setData] = useState({ isLoading: true, data: {} })
  const addUserForm = useForm()
  const hasRun = useRef(false)

  async function GetDataPage({ id = "", name = "", email = "" } = {}) {
    setData({ isLoading: true, data: data.data })
    const requestdata = await apiAction.api.getuser(id, name, email)
    if(requestdata.status === 403) {
      setPerissionNeeded(true)
    }
    setData({ isLoading: false, data: requestdata })
  }

  async function AddNewUser() {
    if(loadingSessionAddUser) return;
    const allDataFormNewUser = addUserForm.getValues()
    if(String(allDataFormNewUser?.username||"").length < 3) {
      addUserForm.setError("username", {
        type: "minLength",
        message: "The username must be at least 3 letters long and must be unique, it cannot be the same as another username."
      })
      toast.error("The username must be at least 3 letters long and must be unique, it cannot be the same as another username.")
      return;
    }
    setLoadingSessionAddUser(true);
    const requestdata = await apiAction.api.createuser(
      (allDataFormNewUser.username || ""),
      (allDataFormNewUser.email || ""),
      (allDataFormNewUser.display_name || ""),
      (allDataFormNewUser.picture_url || ""),
    )
    setLoadingSessionAddUser(false);
    if(requestdata.isError || requestdata.data.status > 399) {
      toast.error(requestdata?.data?.message||requestdata?.data||requestdata.statusText||"Unknowing")
      return;
    }
    addUserForm.reset();
    setDialogAddUser(false);
    GetDataPage();
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
    {data.isLoading && <LoadingMiddleware className="h-[calc(100dvh-130px)]"/>}
    {(data.data?.data?.list) && <>
      <div className="w-full py-2.5 px-3">
        <h2 className="text-2xl font-bold">Users</h2>
        <p className="mt-1 text-neutral-600">Manage users on your tailnet.</p>
      </div>
      <div className="w-full pb-4.5 flex items-center justify-start px-3">
        <Button variant="outline" className="cursor-pointer" onClick={() => { setDialogAddUser(true) }}>
          <PlusIcon />
          <span>Add User</span>
        </Button>
      </div>
      <Dialog open={dialogAddUser} onOpenChange={setDialogAddUser}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New User</DialogTitle>
            <DialogDescription>Specify a new username for this account</DialogDescription>
          </DialogHeader>
          <form className="my-1" autoComplete="off">
            <label className="block">
              <span className="w-full block px-0.5 py-1.5 text-neutral-600 text-sm">Username <span className="text-red-500">*</span></span>
              <Input
                placeholder="Enter the username..."
                type="text"
                {...addUserForm.register("username", { required: true, min: 3 })}
              />
              {addUserForm?.formState?.errors?.username && <span
                  className="w-full block my-2 text-sm text-red-500"
                >
                  {addUserForm?.formState?.errors?.username?.message||"Unknowing your field error"}
                </span>
              }
            </label>
            <label className="mt-1.5 block">
              <span className="w-full block px-0.5 py-1.5 text-neutral-600 text-sm">Email</span>
              <Input
                placeholder="Enter the email..."
                type="email"
                {...addUserForm.register("email", { required: false, min: 3 })}
              />
            </label>
            <label className="mt-1.5 block">
              <span className="w-full block px-0.5 py-1.5 text-neutral-600 text-sm">Display Name</span>
              <Input
                placeholder="Enter the username..."
                type="text"
                {...addUserForm.register("display_name", { required: false, min: 3 })}
              />
            </label>
            <label className="mt-1.5 block">
              <span className="w-full block px-0.5 py-1.5 text-neutral-600 text-sm">Picture URL</span>
              <Input
                placeholder="Enter the url for picture (https://..)..."
                type="url"
                {...addUserForm.register("picture_url", { required: false, min: 3 })}
              />
            </label>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
              >Cancel</Button>
            </DialogClose>
            <Button
              className="cursor-pointer"
              onClick={AddNewUser}
            >
              {loadingSessionAddUser && <Spinner />}
              <span>Add New User</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>}
    <div className="w-full px-3">
      {data.data?.data?.list?.map((items, i) => (
        <UserContentList key={i} data={items} triggerRefreshData={GetDataPage}/>
      ))}
    </div>
  </>
}