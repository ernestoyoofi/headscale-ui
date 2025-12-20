import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { useForm } from "react-hook-form"
import apiAction from "../api/index"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { useState } from "react"

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  async function FormLogin(formHandle) {
    setLoading(true)
    // Request
    const requestaction = await apiAction.proxy.login(
      formHandle.username, formHandle.password
    )
    setLoading(false)
    // Next
    if(requestaction.isError) {
      toast.error(requestaction?.data?.message||"Unknowing")
      return;
    }
    toast.success("Success login!")
    navigate("/admin/")
  }

  return <>
    <div className="w-full h-dvh flex items-center justify-center">
      <div className="w-full max-w-98 px-3.5">
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
        <h2 className="text-2xl font-bold text-center mb-2">Log in to your dashboard</h2>
        <p className="text-sm font-normal text-center text-neutral-700 mb-10">Welcome back!, please enter your details.</p>
        <form onSubmit={handleSubmit(FormLogin)}>
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
            <span>{isLoading? "Loading...":"Log in"}</span>
          </Button>
          <small className="w-full block mt-3.5 text-center text-neutral-600">Forgot your account or password? <a href="https://github.com/ernestoyoofi/headscale-ui/?tab=readme-ov-file#reset-account" className="text-blue-600 underline" target="_blank">check here</a></small>
        </form>
      </div>
    </div>
  </>
}