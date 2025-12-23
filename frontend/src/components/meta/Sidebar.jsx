import { KeyIcon, LockIcon, MenuIcon, ServerIcon, SettingsIcon, UsersIcon, XIcon } from "lucide-react"
import { Link } from "react-router"
import { cn } from "../../lib/utils"
import { useState } from "react"
import Footer from "./Footer"

const linkList = [
  { href: "/admin/nodes", label: "Nodes", icon: <ServerIcon size={19}/> },
  { href: "/admin/users", label: "Users", icon: <UsersIcon size={19}/> },
  { href: "/admin/acls", label: "Access Control", icon: <LockIcon size={19}/> },
  { href: "/admin/settings", label: "Settings", icon: <SettingsIcon size={20}/> },
]

export default function Sidebar_Admin({ children, pathNow = "/admin/" }) {
  const [openSidebar, setOpenSidebar] = useState(false)
  return <>
    <div className={cn(
      "fixed top-0 left-0 w-full h-dvh bg-black/50 duration-300 z-100",
      openSidebar? "opacity-100":"opacity-0 pointer-events-none"
    )} onClick={() => { setOpenSidebar(false) }}/>
    <nav className={cn(
      "fixed top-0 left-0 w-full max-w-[290px] h-dvh bg-white border-r border-neutral-100 duration-300 shadow-md z-100",
      openSidebar? "ml-0":"ml-[-290px]"
    )}>
      <div className="w-full p-2.5 py-2.5 flex items-center">
        <button className="w-10 h-10 duration-150 flex items-center justify-center cursor-pointer hover:bg-neutral-200 rounded-md" onClick={() => { setOpenSidebar(false) }}>
          <XIcon size={20}/>
        </button>
        <b className="ml-1.5">Headscale UI</b>
      </div>
      <div className="w-full p-2 py-2.5 pt-0">
        {linkList.map((items, i) => (
          <Link to={items.href} key={i} className={cn(
            "px-3 py-1.5 my-0.5 flex items-center rounded-md duration-150 hover:bg-neutral-200/60 text-neutral-700",
            pathNow.match(items.href) && "text-blue-600 bg-blue-100/60 hover:bg-blue-300/60"
          )} onClick={() => { setOpenSidebar(false) }}>
            <div className="w-[20px] flex items-center justify-start">
              {items.icon}
            </div>
            <span className="pl-2">{items.label}</span>
          </Link>
        ))}
      </div>
    </nav>
    <header className="sticky top-0 left-0 w-full bg-gray-100 border-b border-gray-200 z-50">
      <div className="w-full max-w-4xl m-auto flex items-center p-2.5 py-2.5">
        <button className="w-10 h-10 duration-150 flex items-center justify-center cursor-pointer hover:bg-neutral-200 rounded-md" onClick={() => { setOpenSidebar(true) }}>
          <MenuIcon size={20}/>
        </button>
        <b className="ml-1.5">Headscale UI</b>
      </div>
    </header>
    <main className="w-full py-3 px-2.5 min-h-[calc(100dvh-112px)] sm:min-h-[calc(100dvh-100px)]">
      <div className="w-full max-w-4xl m-auto">
        {children}
      </div>
    </main>
    <Footer />
  </>
}