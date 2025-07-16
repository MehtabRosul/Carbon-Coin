"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import jsPDF from "jspdf"
import { createHash } from 'crypto'

export default function ImpactCalculatorPage() {
    const [report, setReport] = React.useState<string[]>([])
    const reportRef = React.useRef<HTMLPreElement>(null)

    const addToReport = (line: string) => {
        setReport(prev => [...prev, line])
    }

    const generateReport = () => {
        if (reportRef.current) {
            const sdgList = [
                "SDG 7: Affordable and Clean Energy",
                "SDG 13: Climate Action",
                "SDG 15: Life on Land",
            ].join("\n");
            const fullReport = `CarbonCoin Impact Report\n=========================\n\nAligned SDGs:\n${sdgList}\n\nCalculations:\n----------------\n${report.join("\n")}`
            reportRef.current.textContent = fullReport;
        }
    }

    const downloadPDF = () => {
        if (reportRef.current) {
            const doc = new jsPDF()
            doc.setFont("helvetica", "bold")
            doc.text("CarbonCoin Impact Report", 10, 10)
            doc.setFont("helvetica", "normal")
            doc.text(reportRef.current.textContent || "", 10, 20)
            doc.save("CarbonCoin_Report.pdf")
        }
    }

  return (
    <>
      <PageHeader
        title="CarbonCoin Impact Calculator"
        description="Calculate the impact of your agricultural and tech interventions."
      />
      <div className="space-y-8">
        <SolarEnergyCalculator addToReport={addToReport} />
        <SOCCalculator addToReport={addToReport} />
        <DripIrrigationCalculator addToReport={addToReport} />
        <AgriPVCalculator addToReport={addToReport} />
        <EVCalculator addToReport={addToReport} />

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Final Report</CardTitle>
                <CardDescription>Generate and download a summary of all calculations.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4">
                    <Button onClick={generateReport}>Generate Report</Button>
                    <Button onClick={downloadPDF} variant="outline">Download as PDF</Button>
                </div>
                <pre ref={reportRef} className="mt-4 p-4 border rounded-md bg-muted/50 whitespace-pre-wrap"></pre>
            </CardContent>
        </Card>
      </div>
    </>
  )
}

function SolarEnergyCalculator({ addToReport }: { addToReport: (s: string) => void }) {
    const [result, setResult] = React.useState<string | null>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const solarMW = parseFloat(formData.get("solarMW") as string) || 0
        const solarMWh = parseFloat(formData.get("solarMWh") as string) || 0
        const total = solarMW * solarMWh * 0.82
        const resultString = `Solar: ${total.toFixed(2)} tCO₂e/year saved`
        setResult(resultString)
        addToReport(resultString)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>1. Solar Energy Savings</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid gap-2"><Label htmlFor="solarMW">Installed Capacity (MW)</Label><Input name="solarMW" id="solarMW" type="number" step="any" /></div>
                    <div className="grid gap-2"><Label htmlFor="solarMWh">Annual Generation per MW (MWh)</Label><Input name="solarMWh" id="solarMWh" type="number" step="any" /></div>
                    <Button type="submit">Calculate Solar</Button>
                    {result && <p className="font-bold mt-2">{result}</p>}
                </CardContent>
            </form>
        </Card>
    )
}

function SOCCalculator({ addToReport }: { addToReport: (s: string) => void }) {
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
        addToReport(resultString)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>2. Soil Organic Carbon Sequestration</CardTitle>
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
                    {result && <p className="font-bold mt-2">{result}</p>}
                </CardContent>
            </form>
        </Card>
    )
}

function DripIrrigationCalculator({ addToReport }: { addToReport: (s: string) => void }) {
    const [result, setResult] = React.useState<string | null>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const areaDrip = parseFloat(formData.get("areaDrip") as string) || 0
        const dripFactor = parseFloat(formData.get("dripFactor") as string) || 1.5
        const savings = areaDrip * dripFactor
        const resultString = `Drip Irrigation: ${savings.toFixed(2)} tCO₂e/year saved`
        setResult(resultString)
        addToReport(resultString)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>3. Drip Irrigation Savings</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                     <div className="grid gap-2"><Label htmlFor="areaDrip">Area Covered (hectares)</Label><Input name="areaDrip" id="areaDrip" type="number" step="any" /></div>
                    <div className="grid gap-2"><Label htmlFor="dripFactor">Savings Factor (tCO₂e/ha/year)</Label><Input name="dripFactor" id="dripFactor" type="number" step="any" defaultValue="1.5" /></div>
                    <Button type="submit">Calculate Drip</Button>
                    {result && <p className="font-bold mt-2">{result}</p>}
                </CardContent>
            </form>
        </Card>
    )
}

function AgriPVCalculator({ addToReport }: { addToReport: (s: string) => void }) {
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

        const resultString = `Agri-PV: ${savings.toFixed(2)} tCO₂e/year saved\nTrace ID: ${traceId}\nPlot Hash: ${plotHash.substring(0, 12)}...`
        setResult(<>
            <p>Agri-PV: {savings.toFixed(2)} tCO₂e/year saved</p>
            <p>Trace ID: {traceId}</p>
            <p>Plot Hash: {plotHash.substring(0, 12)}...</p>
        </>)
        addToReport(resultString)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>4. Agri-PV Savings</CardTitle>
            </CardHeader>
             <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid gap-2"><Label htmlFor="agriPVArea">Land Area under Agri-PV (hectares)</Label><Input name="agriPVArea" id="agriPVArea" type="number" step="any" /></div>
                    <div className="grid gap-2"><Label htmlFor="agriPVRate">Offset Rate (tCO₂e/ha/year)</Label><Input name="agriPVRate" id="agriPVRate" type="number" step="any" defaultValue="5" /></div>
                    <Button type="submit">Calculate Agri-PV</Button>
                    {result && <div className="font-bold mt-2">{result}</div>}
                </CardContent>
            </form>
        </Card>
    )
}

function EVCalculator({ addToReport }: { addToReport: (s: string) => void }) {
    const [result, setResult] = React.useState<string | null>(null)
     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const evKm = parseFloat(formData.get("evKm") as string) || 0
        const evEfficiency = parseFloat(formData.get("evEfficiency") as string) || 0
        const gridEF = parseFloat(formData.get("gridEF") as string) || 0
        const iceEF = parseFloat(formData.get("iceEF") as string) || 0
        
        const evCO2e = evKm * evEfficiency * gridEF
        const iceCO2e = evKm * (iceEF / 1000000)
        const savings = iceCO2e - evCO2e
        
        const resultString = `EV vs ICE: ${savings.toFixed(2)} tCO₂e/year saved`
        setResult(resultString)
        addToReport(resultString)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>5. EV vs ICE Comparison</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2"><Label htmlFor="evKm">Annual Distance (km)</Label><Input name="evKm" id="evKm" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="evEfficiency">EV Efficiency (kWh/km)</Label><Input name="evEfficiency" id="evEfficiency" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="gridEF">Grid Emission Factor (tCO₂/MWh)</Label><Input name="gridEF" id="gridEF" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="iceEF">ICE Emission Factor (gCO₂/km)</Label><Input name="iceEF" id="iceEF" type="number" step="any" /></div>
                    </div>
                    <Button type="submit">Calculate EV Savings</Button>
                    {result && <p className="font-bold mt-2">{result}</p>}
                </CardContent>
            </form>
        </Card>
    )
}

    