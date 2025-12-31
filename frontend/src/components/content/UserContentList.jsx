import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Spinner } from "../ui/spinner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { EllipsisIcon } from "lucide-react"
import { useState, useRef } from "react"
import { formatDate } from "../../lib/date-function"
import apiAction from "../../api"

export default function UserContentList({ data = {}, triggerRefreshData = null }) {
  const [dialogRename, setOpenDialogRename] = useState(false)
  const [dialogDelete, setOpenDialogDelete] = useState(false)
  const [sureToRename, setSureToRename] = useState(false)
  const [sureToDelete, setSureToDelete] = useState(false)
  const [loadingSessionRename, setLoadingSessionRename] = useState(false)
  const [loadingSessionDelete, setLoadingSessionDelete] = useState(false)
  const inputRename = useRef()

  const refreshPage = () => {
    if(typeof triggerRefreshData === "function") {
      triggerRefreshData()
    }
  }

  async function RenameUser() {
    const inputRenameData = String(inputRename.current.value||"")
    if(loadingSessionRename) return;
    setLoadingSessionRename(true)
    const requestdata = await apiAction.api.renameuser(data.id, inputRenameData)
    setLoadingSessionRename(false)
    if(requestdata.isError || requestdata.data.status > 399) {
      toast.error(requestdata?.data?.message||requestdata?.data||requestdata.statusText||"Unknowing")
      return;
    }
    setOpenDialogRename(false)
    refreshPage()
  }

  async function DeleteUser() {
    if(loadingSessionDelete) return;
    setLoadingSessionDelete(true)
    const requestdata = await apiAction.api.deleteuser(data.id)
    setLoadingSessionDelete(false)
    if(requestdata.isError || requestdata.data.status > 399) {
      toast.error(requestdata?.data?.message||requestdata?.data||requestdata.statusText||"Unknowing")
      return;
    }
    setOpenDialogDelete(false)
    refreshPage()
  }

  return <div className="w-full border-t border-neutral-100 py-1.5 px-3 flex items-center" data-user-id={String(data.id)}>
    <div className="w-[calc(100%-50px)] md:w-[calc(100%-300px)] flex items-center">
      <div className="w-14 h-14 flex items-center justify-center overflow-hidden rounded-full bg-neutral-100">
        {!!(data.profilePicUrl) && <img
          className="w-full h-full object-cover border-none"
          src={data.profilePicUrl}
        />}
      </div>
      <div className="w-[calc(100%-58px)] px-3 overflow-hidden">
        <b className="w-full block truncate">{data?.displayName||data?.email||data?.name}</b>
        <p className="truncate text-sm text-neutral-600">{data?.name}</p>
      </div>
    </div>
    <div className="max-md:hidden w-[250px]">
      <p className="text-sm text-neutral-700">{formatDate(data.createdAt)}</p>
    </div>
    <div className="w-[50px] flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-42" align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={() => { setOpenDialogRename(true) }}>Rename</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => { setOpenDialogDelete(true) }}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={dialogRename} onOpenChange={setOpenDialogRename}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Username</DialogTitle>
            <DialogDescription>Specify a new username for this account</DialogDescription>
          </DialogHeader>
          <div className="my-1">
            <Input
              placeholder="Enter new username..."
              type="text"
              ref={inputRename}
              autoComplete="off"
              onChange={(e) => {
                const isInput = String(e?.target?.value||"")
                setSureToRename(isInput.length > 3)
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
              disabled={!sureToRename}
              onClick={RenameUser}
            >
              {loadingSessionRename && <Spinner />}
              <span>Rename</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogDelete} onOpenChange={setOpenDialogDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              <span>Are you sure you want to delete this account? Deleting this account will remove all nodes registered to this account and cannot be undone. If you are sure, please enter your username "<b className="select-none">{data?.name||""}</b>" and click "<b>Delete.</b>"</span>
            </DialogDescription>
          </DialogHeader>
          <div className="my-1">
            <Input
              placeholder="Enter the username to accept delete..."
              type="text"
              autoComplete="off"
              onChange={(e) => {
                const isInput = String(e?.target?.value||"")
                setSureToDelete(isInput === data?.name||"")
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
              disabled={!sureToDelete}
              onClick={DeleteUser}
            >
              {loadingSessionDelete && <Spinner />}
              <span>Delete</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
}