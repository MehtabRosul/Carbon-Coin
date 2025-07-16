
"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Calculator, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
    const router = useRouter()

    const handleCardClick = (path: string) => {
        router.push(path)
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Choose Your Starting Point</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Select one of the modules below to begin your journey with Carbon Coin.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card
          className="flex flex-col items-center justify-center text-center p-8 hover:bg-accent/50 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => handleCardClick("/interventions")}
        >
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <Calculator className="h-10 w-10 text-primary" />
          </div>
          <CardHeader className="p-0">
            <CardTitle className="font-headline">CarbonCoin Impact Calculator</CardTitle>
            <CardDescription className="mt-2">
              Calculate the impact of your agricultural and tech interventions.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="flex flex-col items-center justify-center text-center p-8 hover:bg-accent/50 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => handleCardClick("/agricarbon")}
        >
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <BarChart className="h-10 w-10 text-primary" />
          </div>
          <CardHeader className="p-0">
            <CardTitle className="font-headline">CarbonCoin Cockpit</CardTitle>
            <CardDescription className="mt-2">
              Model your climate impact — from field to future.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
