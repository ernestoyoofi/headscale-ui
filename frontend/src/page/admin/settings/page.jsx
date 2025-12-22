import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Spinner } from "../../../components/ui/spinner"
import apiAction from "../../../api/index"

function FormChangeAPIKey({ handleForm, isLoading = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  return <div className="mt-2 mb-4.5">
    <h3 className="text-md font-semibold">Set/Change API Key</h3>
    <form onSubmit={handleSubmit(handleForm)}>
      <label className="mt-2 w-full block">
        <span className="mb-1.5 w-full block text-neutral-600 text-sm">API Key</span>
        <Input
          placeholder="Enter headscale API Key..."
          type="password"
          {...register("apikey", { required: true, min: 2 })}
        />
        {errors.apikey && <span className="w-full block mt-1.5 text-red-500 text-sm font-semibold">API Key are required!</span>}
      </label>
      <Button className="mt-2.5 cursor-pointer" variant="outline">
        {isLoading && <Spinner />}
        <span>Update</span>
      </Button>
    </form>
  </div>
}
function FormChangePassword({ handleForm, isLoading = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  return <div className="mt-2 mb-4.5">
    <h3 className="text-md font-semibold">Update Password</h3>
    <form onSubmit={handleSubmit(handleForm)}>
      <label className="mt-2 w-full block">
        <span className="mb-1.5 w-full block text-neutral-600 text-sm">Current Password</span>
        <Input
          placeholder="Enter your current password"
          type="password"
          {...register("password_old", { required: true, min: 8 })}
        />
        {errors.password_old && <span className="w-full block mt-1.5 text-red-500 text-sm font-semibold">Current Password are required!</span>}
      </label>
      <label className="mt-2 w-full block">
        <span className="mb-1.5 w-full block text-neutral-600 text-sm">New Password</span>
        <Input
          placeholder="Enter your new password"
          type="password"
          {...register("password_new", { required: true, min: 8 })}
        />
        {errors.password_new && <span className="w-full block mt-1.5 text-red-500 text-sm font-semibold">New Password are required!</span>}
      </label>
      <label className="mt-2 w-full block">
        <span className="mb-1.5 w-full block text-neutral-600 text-sm">Confirm Password</span>
        <Input
          placeholder="Enter your confirm password"
          type="password"
          {...register("password_confirm", { required: true, min: 8 })}
        />
        {errors.password_confirm && <span className="w-full block mt-1.5 text-red-500 text-sm font-semibold">Confirm Password are required!</span>}
      </label>
      <Button className="mt-2.5 cursor-pointer" variant="outline">
        {isLoading && <Spinner />}
        <span>Update</span>
      </Button>
    </form>
  </div>
}

export default function Settings() {
  const [loadingApikey, setLoadingApikey] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)

  async function UpdateAPIKey(formHandle) {
    setLoadingApikey(true);
    const requestdata = await apiAction.proxy.update_apikey(
      formHandle.apikey
    )
    setLoadingApikey(false);
    if(requestdata.isError || requestdata.data.status > 399) {
      toast.error(requestdata?.data?.message||requestdata?.data||requestdata.statusText||"Unknowing")
      return;
    }
    toast.success("Success update apikey!")
  }

  async function UpdatePassword(formHandle) {
    setLoadingPassword(true);
    const requestdata = await apiAction.proxy.update_password(
      formHandle.password_old, formHandle.password_new,
      formHandle.password_confirm
    )
    setLoadingPassword(false);
    if(requestdata.isError || requestdata.data.status > 399) {
      toast.error(requestdata?.data?.message||requestdata?.data||requestdata.statusText||"Unknowing")
      return;
    }
    toast.success("Success update new password!")
  }

  return <>
    <div className="w-full py-2.5 px-3">
      <h2 className="text-2xl font-bold">Settings</h2>
      <p className="mt-1 text-neutral-600">Setting up the foundation of the backend system for Headscale UI.</p>
    </div>
    <div className="w-full py-2.5 px-3">
      <FormChangeAPIKey
        isLoading={loadingApikey}
        handleForm={UpdateAPIKey}
      />
      <FormChangePassword
        isLoading={loadingPassword}
        handleForm={UpdatePassword}
      />
    </div>
  </>
}