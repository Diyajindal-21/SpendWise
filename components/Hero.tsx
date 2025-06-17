"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";

const Hero=()=>{
    const imageRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        const imageEle=imageRef.current;
        const handleScroll=()=>{
            const scrollPosition=window.scrollY;
            const scrollThreshold=100;
            if(scrollPosition>scrollThreshold){
                (imageEle as HTMLElement).classList.add("scrolled");
            }else{
                (imageEle as HTMLElement).classList.remove("scrolled");
            }
        }
        window.addEventListener("scroll",handleScroll);
        return ()=>{
            window.removeEventListener("scroll",handleScroll);
        }
    },[]);
    return(
        // <div className="w-full max-w-3xl rounded-2xl shadow-2xl px-8 py-12 bg-gradient-to-br from-[#23233a] via-[#341539] to-[#1a102a]">
  <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-3 py-16 ">
  <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-10 bg-gradient-to-br from-[#6a7cff] to-[#8f5fff] text-transparent bg-clip-text drop-shadow-sm leading-tight">
  Manage Your Finances <br /> with Intelligence
</h1>

        <p className="text-lg md:text-xl text-[#b0b3c7] text-center mb-8 font-medium max-w-2xl">
          An AI-powered financial management platform that helps you track, analyze and optimize your spending with real-time insights.
        </p>
        <div className="flex justify-center mb-8">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#4b6cb7] to-[#182848] text-white font-semibold rounded-full px-8 py-3 shadow-md hover:from-[#182848] hover:to-[#4b6cb7] transition cursor-pointer"
              
            >
              Get Started
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-8 flex justify-center">
                    <div ref={imageRef} className="hero-image rounded-3xl bg-[#23234a]/80 shadow-2xl border-2 border-[#3a2e7b] p-2 transition-all duration-500">
                        <Image src="/banner.jpeg"
                        alt="Dashboard"
                        width={980}
              height={540}
              className="rounded-2xl shadow-xl object-cover"
                        priority></Image>
                        
                    </div>
                </div>
            </div>
        // </div>
    )
}
export default Hero;