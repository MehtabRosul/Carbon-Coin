"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createHash } from 'crypto';

export default function OnboardingPage() {
  return (
    <div className="flex-grow flex flex-col">
      <div className="pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold">
            Carbon Impact Calculators
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Select a calculator below to quantify your sustainability efforts.
          </p>
        </div>

        <Tabs defaultValue="agripv" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="agripv">AgriPV Calculator</TabsTrigger>
            <TabsTrigger value="soc">SOC Calculator</TabsTrigger>
          </TabsList>
          <TabsContent value="agripv">
            <AgriPVCalculator />
          </TabsContent>
          <TabsContent value="soc">
            <SOCCalculator />
          </TabsContent>
        </Tabs>
      </div>

      <div className="text-center mt-auto pb-24 max-w-4xl mx-auto">
        <h2 className="text-3xl font-headline font-bold">
          Ready to Make an Impact?
        </h2>
        <p className="text-muted-foreground mt-4">
          Use our powerful tools to quantify your sustainability efforts, gain
          valuable insights, and generate compelling reports. Whether you're
          tracking farm-level carbon sequestration or the benefits of new
          technology, Carbon Coin provides the clarity you need to showcase
          your positive environmental impact. Start by selecting a module above
          to log your first data points.
        </p>
      </div>
    </div>
  );
}

function AgriPVCalculator() {
    const [result, setResult] = React.useState<React.ReactNode | null>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const agriPVArea = parseFloat(formData.get("agriPVArea") as string) || 0
        const agriPVRate = parseFloat(formData.get("agriPVRate") as string) || 5
        const savings = agriPVArea * agriPVRate
        
        const timestamp = new Date().toISOString()
        const dataToHash = `${agriPVArea}-${agriPVRate}-${timestamp}`
        const plotHash = createHash('sha256').update(dataToHash).digest('hex')
        const traceId = `AGPV-${new Date().getTime()}-${Math.random().toString(36).substring(2, 7)}`

        setResult(<>
            <p>Agri-PV: {savings.toFixed(2)} tCO₂e/year saved</p>
            <p>Trace ID: {traceId}</p>
            <p>Plot Hash: {plotHash.substring(0, 12)}...</p>
        </>)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Agri-PV Savings</CardTitle>
                <CardDescription>Calculate the CO₂e savings from your Agri-PV projects.</CardDescription>
            </CardHeader>
             <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2"><Label htmlFor="agriPVArea">Land Area under Agri-PV (hectares)</Label><Input name="agriPVArea" id="agriPVArea" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="agriPVRate">Offset Rate (tCO₂e/ha/year)</Label><Input name="agriPVRate" id="agriPVRate" type="number" step="any" defaultValue="5" /></div>
                    </div>
                    <Button type="submit">Calculate Agri-PV</Button>
                    {result && <div className="font-bold mt-4 p-4 border rounded-lg space-y-2">{result}</div>}
                </CardContent>
            </form>
        </Card>
    )
}


function SOCCalculator() {
    const [result, setResult] = React.useState<string | null>(null)
     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const socInit = (parseFloat(formData.get("socInit") as string) || 0) / 100
        const socFinal = (parseFloat(formData.get("socFinal") as string) || 0) / 100
        const bd = parseFloat(formData.get("bd") as string) || 0
        const depth = parseFloat(formData.get("depth") as string) || 0
        const areaSOC = parseFloat(formData.get("areaSOC") as string) || 0
        const soilFactor = parseFloat(formData.get("soilFactor") as string) || 1

        const deltaSOC = socFinal - socInit
        const deltaSOCMass = deltaSOC * bd * depth * 10000 * soilFactor
        const totalCkg = deltaSOCMass * areaSOC
        const co2e = (totalCkg / 1000) * 3.67
        
        const resultString = `SOC: ${co2e.toFixed(2)} tCO₂e sequestered (Soil Type adjusted)`
        setResult(resultString)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Soil Organic Carbon Sequestration</CardTitle>
                <CardDescription>Calculate the Soil Organic Carbon sequestration in your fields.</CardDescription>
            </CardHeader>
             <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2"><Label htmlFor="socInit">Initial SOC (%)</Label><Input name="socInit" id="socInit" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="socFinal">Final SOC (%)</Label><Input name="socFinal" id="socFinal" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="bd">Bulk Density (g/cm³)</Label><Input name="bd" id="bd" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="depth">Soil Depth (m)</Label><Input name="depth" id="depth" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="areaSOC">Area (hectares)</Label><Input name="areaSOC" id="areaSOC" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="soilFactor">Soil Type Factor</Label><Input name="soilFactor" id="soilFactor" type="number" step="any" defaultValue="1" /></div>
                    </div>
                    <Button type="submit">Calculate SOC</Button>
                    {result && <p className="font-bold mt-4 p-4 border rounded-lg">{result}</p>}
                </CardContent>
            </form>
        </Card>
    )
}
