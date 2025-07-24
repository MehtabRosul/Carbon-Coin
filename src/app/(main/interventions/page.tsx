
"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


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
        
        const resultString = `${co2e.toFixed(2)} tCO₂e sequestered (Soil Type adjusted)`
        setResult(resultString)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>1. Soil Organic Carbon Sequestration</CardTitle>
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
                    {result && <p className="font-bold mt-4">{result}</p>}
                </CardContent>
            </form>
        </Card>
    )
}

function DripIrrigationCalculator() {
    const [result, setResult] = React.useState<string | null>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const areaDrip = parseFloat(formData.get("areaDrip") as string) || 0
        const waterSaved = parseFloat(formData.get("waterSaved") as string) || 0
        const energySaved = parseFloat(formData.get("energySaved") as string) || 0
        const co2e = (areaDrip * waterSaved * energySaved * 0.0005).toFixed(2)
        setResult(`${co2e} tCO₂e/year saved`)
    }
    return (
         <Card>
            <CardHeader>
                <CardTitle>2. Drip Irrigation Savings</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2"><Label htmlFor="areaDrip">Area under Drip (hectares)</Label><Input name="areaDrip" id="areaDrip" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="waterSaved">Water Saved (m³/ha)</Label><Input name="waterSaved" id="waterSaved" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="energySaved">Energy Saved (kWh/m³)</Label><Input name="energySaved" id="energySaved" type="number" step="any" /></div>
                    </div>
                    <Button type="submit">Calculate Drip Savings</Button>
                    {result && <p className="font-bold mt-4">{result}</p>}
                </CardContent>
            </form>
        </Card>
    )
}


function AgriPVCalculator() {
    const [result, setResult] = React.useState<string | null>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const agriPVArea = parseFloat(formData.get("agriPVArea") as string) || 0
        const agriPVRate = parseFloat(formData.get("agriPVRate") as string) || 5
        const savings = (agriPVArea * agriPVRate).toFixed(2)
        setResult(`${savings} tCO₂e/year saved`)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>3. Agri-PV Savings</CardTitle>
            </CardHeader>
             <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2"><Label htmlFor="agriPVArea">Land Area under Agri-PV (hectares)</Label><Input name="agriPVArea" id="agriPVArea" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="agriPVRate">Offset Rate (tCO₂e/ha/year)</Label><Input name="agriPVRate" id="agriPVRate" type="number" step="any" defaultValue="5" /></div>
                    </div>
                    <Button type="submit">Calculate Agri-PV</Button>
                    {result && <p className="font-bold mt-4">{result}</p>}
                </CardContent>
            </form>
        </Card>
    )
}

export default function InterventionsPage() {
  return (
    <>
      <PageHeader
        title="CarbonCoin Impact Calculator"
        description="Quantify your carbon savings from various interventions."
      />

      <div className="grid gap-8">
        <SOCCalculator />
        <DripIrrigationCalculator />
        <AgriPVCalculator />
      </div>
    </>
  )
}
