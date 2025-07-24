
"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart, Droplets } from "lucide-react"

export default function OnboardingPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-headline font-bold">
            Carbon Impact Calculators
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Select a calculator below to quantify your sustainability efforts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/dashboard" className="flex">
            <Card className="flex flex-col w-full hover:bg-accent/50 hover:shadow-lg transition-all cursor-pointer">
              <CardHeader className="items-center text-center p-8 flex-grow">
                 <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <BarChart className="h-10 w-10 text-primary" />
                 </div>
                <CardTitle className="font-headline text-2xl">Run AgriPV Calculator</CardTitle>
                <CardDescription>
                  Model the carbon savings from Agri-PV projects.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/interventions" className="flex">
            <Card className="flex flex-col w-full hover:bg-accent/50 hover:shadow-lg transition-all cursor-pointer">
              <CardHeader className="items-center text-center p-8 flex-grow">
                 <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Droplets className="h-10 w-10 text-primary" />
                 </div>
                <CardTitle className="font-headline text-2xl">Run SOC Calculator</CardTitle>
                <CardDescription>
                  Calculate the impact of your agricultural and tech interventions.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="text-center mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-headline font-bold">Ready to Make an Impact?</h2>
          <p className="text-muted-foreground mt-3">
             Use our powerful tools to quantify your sustainability efforts, gain valuable insights, and generate compelling reports. Whether you're tracking farm-level carbon sequestration or the benefits of new technology, Carbon Coin provides the clarity you need to showcase your positive environmental impact. Start by selecting a module above to log your first data points.
          </p>
        </div>
      </div>
    </div>
  )
}

