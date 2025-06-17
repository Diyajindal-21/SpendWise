import Hero from "@/components/Hero";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import {
  Card,
  CardContent
} from "@/components/ui/card"
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Home(){
  return (
  <div className="mt-30 bg-gradient-to-b from-[#23233a] to-[#181830] rounded-lg">
    <Hero></Hero>
    <section className="py-16">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="text-center rounded-2xl bg-[#23234a]/80 shadow-xl p-8 transition-transform hover:scale-105"
        >
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5f5fff] to-[#38bdf8] mb-2 drop-shadow">
            {stat.value}
          </div>
          <div className="text-[#b0b3c7] font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>

    <section className="py-16">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12 text-white drop-shadow-lg">
      Everything you need to manage your finances
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuresData.map((feature, index) => (
        <Card
          key={index}
          className="p-6 rounded-2xl bg-gradient-to-br from-[#23234a] to-[#181830] shadow-xl border border-[#32325d]/40 transition-transform hover:scale-105 hover:shadow-2xl"
        >
          <CardContent className="space-y-4 pt-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#5f5fff] to-[#38bdf8] text-white text-3xl shadow-lg mb-2">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            <p className="text-[#b0b3c7]">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
    {/* How It Works Section */}
<section className="py-14">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-16 pt-10 text-white drop-shadow-lg">
      How It Works
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {howItWorksData.map((step, index) => (
        <div
          key={index}
          className="text-center bg-[#23234a]/80 rounded-2xl shadow-xl p-8 transition-transform hover:scale-105"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[#5f5fff] to-[#38bdf8] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl shadow-lg">
            {step.icon}
          </div>
          <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
          <p className="text-[#b0b3c7]">{step.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* What Our Users Say Section */}
<section className="py-20 ">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12 text-white drop-shadow-lg">
      What Our Users Say
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonialsData.map((test, index) => (
        <Card
          key={index}
          className="p-6 rounded-2xl bg-[#23234a]/80 shadow-xl border border-[#32325d]/40 transition-transform hover:scale-105"
        >
          <CardContent className="pt-4">
            <div className="flex items-center mb-4">
              <Image
                src={test.image}
                alt={test.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-4">
                <div className="font-semibold text-white">{test.name}</div>
                <div className="text-sm text-[#b0b3c7]">{test.role}</div>
              </div>
            </div>
            <p className="text-[#b0b3c7]">{test.quote}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>

    <section className="py-8">
  <div className="container mx-auto px-4 text-center">
    <div className="max-w-2xl mx-auto rounded-2xl bg-[#2a2a40] backdrop-blur-md shadow-xl py-10 px-6">
      <h2 className="text-3xl font-bold text-white mb-4">
        Ready to Take Control of Your Finances?
      </h2>
      <p className="text-[#b0b3c7] mb-8">
        Join thousands of users who are already managing their finances smarter with SpendWise
      </p>
      <Link href="/dashboard">
        <Button
          size="lg"
          className="bg-gradient-to-r from-[#5f5fff] to-[#38bdf8] text-white font-bold rounded-xl px-8 py-3 shadow-md hover:from-[#38bdf8] hover:to-[#5f5fff] transition cursor-pointer"
        >
          Start Free trial
        </Button>
      </Link>
    </div>
  </div>
</section>

  </div>
  )
}