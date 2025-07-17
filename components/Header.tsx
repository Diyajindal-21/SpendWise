import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkUser";
import SpendWiseLogo from "@/public/logo";

export const Header = async () => {
  await checkUser();
  return (
    <div className="fixed top-0 w-full z-50 bg-[#181830] border-b border-[#23234a] shadow-lg">
      <nav className="max-w-7xl mx-auto py-3 px-4 flex flex-wrap items-center justify-between gap-4 sm:gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <SpendWiseLogo style={{ height: 40 }} />
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-end">
          <SignedIn>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Dashboard Button */}
              <Link href="/dashboard">
                <div className="flex items-center justify-center rounded-xl bg-[#23234a] hover:bg-[#2f2f55] px-3 py-2 shadow">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-r from-[#5f5fff] to-[#38bdf8]">
                    <LayoutDashboard className="text-white" size={20} />
                  </div>
                  <span className="hidden sm:inline-block ml-2 text-white font-medium text-sm">
                    Dashboard
                  </span>
                </div>
              </Link>

              {/* Add Transaction Button */}
              <Link href="/transaction/create">
                <div className="flex items-center justify-center rounded-xl bg-[#23234a] hover:bg-[#2f2f55] px-3 py-2 shadow">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-r from-[#5f5fff] to-[#38bdf8]">
                    <PenBox className="text-white" size={18} />
                  </div>
                  <span className="hidden sm:inline-block ml-2 text-white font-medium text-sm">
                    Add
                  </span>
                </div>
              </Link>
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <div className="flex items-center justify-center rounded-lg bg-[#23234a] hover:bg-[#32325d] text-white font-medium text-sm px-4 py-2 transition shadow">
                Login
              </div>
            </SignInButton>
            <SignUpButton>
              <div className="hidden sm:block text-white text-sm underline cursor-pointer">Sign Up</div>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-11 h-11 rounded-full ring-2 ring-[#a78bfa] bg-gradient-to-tr from-[#5f5fff] to-[#a78bfa] flex items-center justify-center shadow-md",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};
