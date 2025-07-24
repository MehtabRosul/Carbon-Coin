
"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart, Droplets } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useSearchParams } from "next/navigation"

export default function OnboardingPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  const getLinkWithParams = (basePath: string) => {
    const uid = searchParams.get('uid');
    const anonId = searchParams.get('anonId');
    let queryString = '';

    if (user && user.uid) {
        queryString = `?uid=${user.uid}`;
    } else if (uid) {
        queryString = `?uid=${uid}`;
    } else if (anonId) {
        queryString = `?anonId=${anonId}`;
    }
    return `${basePath}${queryString}`;
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-headline font-bold">
            Carbon Impact Calculators
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Select a calculator below to quantify your sustainability efforts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <Link href={getLinkWithParams("/agripv")} className="flex">
            <Card className="flex flex-col w-full hover:bg-accent/50 hover:shadow-lg transition-all cursor-pointer">
              <CardHeader className="items-center text-center p-8 flex-grow">
                 <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <BarChart className="h-10 w-10 text-primary" />
                 </div>
                <CardTitle className="font-headline text-2xl">Run AgriPV Calculator</CardTitle>
                <CardDescription>
                  Model your carbon savings from AgriPV systems.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href={getLinkWithParams("/interventions")} className="flex">
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

        <div className="text-center mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-headline font-bold">Ready to Make an Impact?</h2>
          <p className="text-muted-foreground mt-3">
             Use our powerful tools to quantify your sustainability efforts, gain valuable insights, and generate compelling reports. Whether you're tracking farm-level carbon sequestration or the benefits of new technology, Carbon Coin provides the clarity you need to showcase your positive environmental impact. Start by selecting a module above to log your first data points.
          </p>
        </div>
      </div>
    </div>
  )
}
