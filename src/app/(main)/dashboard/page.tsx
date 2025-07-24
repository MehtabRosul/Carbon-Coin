
"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

function SolarCarbonCalculator() {
    const { toast } = useToast()
    const [results, setResults] = React.useState<{ [key: string]: number } | null>(null)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        
        const s = parseFloat(formData.get("solar") as string) || 0
        const a = parseFloat(formData.get("agroforestry") as string) || 0
        const d = parseFloat(formData.get("irrigation") as string) || 0
        const b = parseFloat(formData.get("biogas") as string) || 0
        const ev = parseFloat(formData.get("ev") as string) || 0

        const solar = s * 0.82
        const agro = a * 7
        const drip = ((d * 1200) / 1000) * 0.82
        const bio = (b * 1.8) / 1000
        const evSavings = ev * 0.12
        const total = solar + agro + drip + bio + evSavings

        setResults({ solar, agro, drip, bio, ev: evSavings, total })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>SolarCarbon (Intervention-Based)</CardTitle>
                <CardDescription>Calculate CO₂e savings from various technological interventions.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="solar">Solar Generated (MWh)</Label>
                            <Input id="solar" name="solar" type="number" step="any" placeholder="e.g., 100" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="agroforestry">Agroforestry Area (ha)</Label>
                            <Input id="agroforestry" name="agroforestry" type="number" step="any" placeholder="e.g., 10" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="irrigation">Drip Irrigation Area (ha)</Label>
                            <Input id="irrigation" name="irrigation" type="number" step="any" placeholder="e.g., 50" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="biogas">Biogas Used (m³)</Label>
                            <Input id="biogas" name="biogas" type="number" step="any" placeholder="e.g., 500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ev">EV Distance (km/year)</Label>
                            <Input id="ev" name="ev" type="number" step="any" placeholder="e.g., 15000" />
                        </div>
                    </div>
                    <Button type="submit">Calculate</Button>
                </form>

                {results && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
                        <h4 className="font-bold text-lg">Calculation Results:</h4>
                        <p>Solar: {results.solar.toFixed(2)} tCO₂e/year</p>
                        <p>Agroforestry: {results.agro.toFixed(2)} tCO₂e/year</p>
                        <p>Irrigation: {results.drip.toFixed(2)} tCO₂e/year</p>
                        <p>Biogas: {results.bio.toFixed(2)} tCO₂e/year</p>
                        <p>EV: {results.ev.toFixed(2)} tCO₂e/year</p>
                        <p className="font-bold text-primary pt-2">Total: {results.total.toFixed(2)} tCO₂e/year</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function DripIrrigationCalculator() {
    const [result, setResult] = React.useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const area = parseFloat(formData.get("areaDrip") as string) || 0
        const factor = parseFloat(formData.get("dripFactor") as string) || 1.5

        const total = area * factor
        setResult(`Drip Irrigation: ${total.toFixed(2)} tCO₂e/year saved`)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Drip Irrigation vs Flood</CardTitle>
                <CardDescription>Estimate savings from switching to drip irrigation.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="areaDrip">Area Covered (ha)</Label>
                            <Input id="areaDrip" name="areaDrip" type="number" step="any" placeholder="e.g., 25" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dripFactor">Savings per ha/year (tCO₂e)</Label>
                            <Input id="dripFactor" name="dripFactor" type="number" step="any" defaultValue="1.5" />
                        </div>
                    </div>
                    <Button type="submit">Calculate</Button>
                </form>
                 {result && <p className="font-bold mt-4 text-primary">{result}</p>}
            </CardContent>
        </Card>
    )
}

export default function TechInterventionsPage() {
  return (
    <>
      <PageHeader
        title="Tech Interventions"
        description="Quantify your carbon savings from technology adoption."
      />

      <div className="grid gap-8">
        <SolarCarbonCalculator />
        <DripIrrigationCalculator />
      </div>
    </>
  )
}
