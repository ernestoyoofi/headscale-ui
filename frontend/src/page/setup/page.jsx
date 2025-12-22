import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { useState, useRef } from "react"
import { InfoIcon } from "lucide-react"
import apiAction from "../../api/index"

function Page_RegisterNewAdmin({ handleForm, isLoading = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  return <>
    <div className="w-full h-20 flex items-center justify-center mb-3.5">
      <div className="w-11 h-11 min-w-11 min-h-11 max-w-11 max-h-11">
        <img
          width={44}
          height={44}
          className="w-full h-full object-contain"
          alt="Icon Tailscale (It Headscale Server!)"
          src="/icon-tailscale.png"
        />
      </div>
    </div>
    <h2 className="text-2xl font-bold text-center mb-2">Register to your dashboard</h2>
    <p className="text-sm font-normal text-center text-neutral-700 mb-10">Welcome to headscale dashboard, please enter your username and password to access.</p>
    <form onSubmit={handleSubmit(handleForm)}>
      <label className="mt-2 w-full block">
        <span className="mb-1.5 w-full block text-neutral-600 text-sm">Username</span>
        <Input
          placeholder="Enter your username"
          type="text"
          {...register("username", { required: true, min: 2 })}
        />
        {errors.username && <span className="w-full block mt-1.5 text-red-500 text-sm font-semibold">Username are required!</span>}
      </label>
      <label className="mt-2 w-full block">
        <span className="mb-1.5 w-full block text-neutral-600 text-sm">Password</span>
        <Input
          placeholder="Enter your password"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && <span className="w-full block mt-1.5 text-red-500 text-sm font-semibold">Password are required!</span>}
      </label>
      <Button variant="outline" className="mt-8 cursor-pointer w-full">
        <span>{isLoading? "Loading...":"Create Account"}</span>
      </Button>
    </form>
  </>
}

function Page_SetApiKeyHeadscale({ handleForm, skipPage, isLoading = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  return <>
    <div className="w-full h-20 flex items-center justify-center mb-3.5">
      <div className="w-11 h-11 min-w-11 min-h-11 max-w-11 max-h-11">
        <img
          width={44}
          height={44}
          className="w-full h-full object-contain"
          alt="Icon Tailscale (It Headscale Server!)"
          src="/icon-tailscale.png"
        />
      </div>
    </div>
    <h2 className="text-2xl font-bold text-center mb-2">Register to your dashboard</h2>
    <p className="text-sm font-normal text-center text-neutral-700 mb-10">Add your apikey to access headscale.</p>
    <form onSubmit={handleSubmit(handleForm)}>
      <Alert>
        <InfoIcon />
        <AlertTitle className="mb-1">Don't know how to get an API Key?</AlertTitle>
        <AlertDescription className="mt-1.5">Go to the headscale section of your system, whether it's a VPS server or a virtual machine, then open the command line section, type this:</AlertDescription>
        <AlertDescription className="mt-1.5">
          <pre className="w-full overflow-hidden overflow-x-auto bg-neutral-200 px-3.5 py-2 rounded-md">
            <code className="text-sm">headscale apikeys create --expiration 90d</code>
          </pre>
        </AlertDescription>
        <AlertDescription className="mt-1.5">to create it, and now you have the apikey, then enter the apikey here.</AlertDescription>
        <AlertDescription className="mt-1.5"><a href="https://headscale.net/stable/ref/remote-cli/#prerequisite" target="_blank" className="text-blue-500">See documentation in here</a></AlertDescription>
      </Alert>
      <label className="mt-2 w-full block">
        <span className="mb-1.5 w-full block text-neutral-600 text-sm">API Key</span>
        <Input
          placeholder="Enter headscale API Key"
          type="password"
          {...register("apikey", { required: true, min: 2 })}
        />
        {errors.apikey && <span className="w-full block mt-1.5 text-red-500 text-sm font-semibold">API Key is required!</span>}
      </label>
      <Button variant="outline" className="mt-8 cursor-pointer w-full">
        <span>{isLoading? "Loading...":"Add API Key"}</span>
      </Button>
      <div className="mt-2 text-sm flex justify-end">
        <button onClick={() => {
          if(typeof skipPage === "function") {
            skipPage("/")
          }
        }} className="cursor-pointer text-blue-600 mr-1.5">Skip</button>
      </div>
    </form>
  </>
}

export default function SetupHeadscaleDashboard() {
  const navigate = useNavigate()
  const tokenUses = useRef("")
  const [isLoadingTab, setLoadingTab] = useState("none")
  const [pageTab, setPageTab] = useState("register") // "register" | "add-apikey"

  async function RegisterNewAdmin(formHandle) {
    setLoadingTab("register")
    const requestaction = await apiAction.proxy.default_admin(
      formHandle.username, formHandle.password
    )
    setLoadingTab("none")
    // Stop Error
    if(requestaction.isError) {
      toast.error(requestaction?.data?.message||"Unknowing")
      return; // Stop
    }
    // Next
    if(!!requestaction?.headers["x-redirect-app"]) {
      navigate(String(requestaction?.headers["x-redirect-app"]).split("location:")[1])
      toast.info("The account already exists", {
        description: "You already have an account on the Headscale dashboard, please log in!"
      })
      return;
    }
    tokenUses.current = String(requestaction?.data?.data?.token||"")
    setPageTab("add-apikey")
  }

  async function SetApiKeyHeadscale(formHandle) {
    setLoadingTab("add-apikey")
    const requestaction = await apiAction.proxy.update_apikey(formHandle.apikey)
    setLoadingTab("none")
    // Stop Error
    if(requestaction.isError) {
      toast.error(requestaction?.data?.message||"Unknowing")
      return; // Stop
    }
    // Next
    navigate("/admin")
  }

  function PageSkipAddApiKey() {
    navigate("/admin")
  }

  return <>
    <div className="w-full h-dvh flex items-center justify-center">
      <div className="w-full max-w-98 px-3.5">
        {pageTab === "register" && <>
          <Page_RegisterNewAdmin
            handleForm={RegisterNewAdmin}
            isLoading={isLoadingTab === "register"}
          />
        </>}
        {pageTab === "add-apikey" && <>
          <Page_SetApiKeyHeadscale
            skipPage={PageSkipAddApiKey}
            isLoading={isLoadingTab === "add-apikey"}
            handleForm={SetApiKeyHeadscale}
          />
        </>}
      </div>
    </div>
  </>
}