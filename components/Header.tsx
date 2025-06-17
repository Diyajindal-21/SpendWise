import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { LayoutDashboard, PenBox } from "lucide-react"
import { checkUser } from "@/lib/checkUser"
import SpendWiseLogo from "@/public/logo"

export const Header = async() => {
  await checkUser();
  return (
    <div className="fixed top-0 w-full z-50 bg-[#181830] border-b border-[#23234a] shadow-lg">
      <nav className="max-w-7xl mx-auto py-4 px-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
  <SpendWiseLogo style={{ height: 48 }} />
</Link>
      <div className="flex items-center gap-5">
  <SignedIn>
  <div className="flex items-center gap-2">
  {/* Dashboard Button */}
  <Link href="/dashboard">
    <div className="flex items-center justify-center rounded-2xl md:bg-[#23234a] shadow-lg px-4 py-2">
      <div className="w-10 h-10 md:w-10 md:h-10 flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#5f5fff] to-[#38bdf8] shadow-lg">
        <LayoutDashboard className="text-white" size={22} />
      </div>
      <span className="hidden md:inline-block ml-3 text-white font-medium text-base">
        Dashboard
      </span>
    </div>
  </Link>
  {/* Add Transaction Button */}
  <Link href="/transaction/create">
    <div className="flex items-center justify-center rounded-2xl md:bg-[#23234a] shadow-lg px-4 py-2">
    <div className="w-10 h-10 md:w-10 md:h-10 flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#5f5fff] to-[#38bdf8] shadow-lg">
        <PenBox className="text-white"  size={20} />
      </div>
      <span className="hidden md:inline-block ml-3 text-white font-medium text-base">
        Add Transaction
      </span>
    </div>
  </Link>
</div>

  </SignedIn>
  <SignedOut>
    <SignInButton forceRedirectUrl="/dashboard">
    <div className="flex items-center justify-center rounded-lg bg-[#23234a] shadow-md hover:bg-[#32325d] transition cursor-pointer px-5 py-2">
  <div className="text-white font-semibold">Login</div>
</div>
    </SignInButton>
    <SignUpButton />
  </SignedOut>
  <SignedIn>
    <UserButton
      appearance={{
        elements: {
          avatarBox:
            "w-14 h-14 rounded-full ring-2 ring-[#a78bfa] bg-gradient-to-tr from-[#5f5fff] to-[#a78bfa] flex items-center justify-center shadow-lg ",
        },
      }}
    />
  </SignedIn>
</div>
    </nav>
  </div>
  )
}