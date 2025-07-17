import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import {dark} from "@clerk/themes"
import "./globals.css";
import { Header } from "@/components/Header";
const inter=Inter({subsets:['latin']})
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
export const metadata: Metadata = {
  title: "SpendWise",
  description: "One stop finance platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark,variables: {
      colorPrimary: "#5f5fff",
      colorBackground: "#181830",
      colorText: "#fff",
      borderRadius: "14px",
      fontFamily: "Inter, sans-serif",
    },
    elements: {
      card: "bg-[#23234a] border border-white/10 shadow-xl",
      formButtonPrimary: "bg-gradient-to-r from-[#5f5fff] to-[#38bdf8] text-white font-bold rounded-xl", }}}>
    <html lang="en">
      <body
        className={`
          ${inter.className} antialiased
          min-h-screen
          bg-gradient-to-br from-[#6f57ff] via-[#3a2e7b] to-[#181830]
          text-white
          flex flex-col
        `}
      >
        {/*header*/}
        <Header></Header>
        <main className="max-w-7xl mx-auto py-10 px-4 flex-1">
            {children}
          </main>
        <Toaster richColors></Toaster>
        {/*footer*/}
        <footer className="w-full py-8 bg-gradient-to-t from-[#181830] to-[#23233a] rounded-t-2xl bg-opacity-90 border-t border-[#2d2d5a] mt-auto">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center space-y-2">
    <h3 className="font-semibold text-white text-lg sm:text-xl">
      About Us
    </h3>
    <p className="text-[#b0b3c7] leading-relaxed text-base sm:text-lg max-w-2xl">
      We are a leading financial services company dedicated to providing innovative solutions to our customers.
    </p>
  </div>
</footer>  
      </body>
    </html>
    </ClerkProvider>
  );
}
