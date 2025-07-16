"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

type PanelType = "agri" | "solar"

interface AgriData {
  plotId: string;
  landUse: string;
  climate: string;
  soil: string;
  initialSOC: number;
  finalSOC: number;
  time: number;
  area: number;
  co2e: number;
}

export default function DashboardPage() {
  const [activePanel, setActivePanel] = React.useState<PanelType>("agri")
  const [agriData, setAgriData] = React.useState<AgriData[]>([])
  const [solarResults, setSolarResults] = React.useState<Record<string, number | string>>({})
  const { toast } = useToast()

  const handleAddAgri = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: any = Object.fromEntries(formData.entries())

    for (const key of ['initialSOC', 'finalSOC', 'time', 'area']) {
      if (!data[key] || isNaN(parseFloat(data[key]))) {
        toast({ title: "Validation Error", description: `Please enter a valid number for ${key}.`, variant: "destructive"})
        return
      }
    }
    
    const initialSOC = parseFloat(data.initialSOC)
    const finalSOC = parseFloat(data.finalSOC)
    const time = parseFloat(data.time)
    const area = parseFloat(data.area)

    const deltaSOC = finalSOC - initialSOC
    const totalSOCGain = deltaSOC * area
    const co2e = totalSOCGain * 3.67

    const newEntry: AgriData = {
      plotId: data.plotId,
      landUse: data.landUse,
      climate: data.climate,
      soil: data.soil,
      initialSOC,
      finalSOC,
      time,
      area,
      co2e,
    }

    setAgriData(prev => [...prev, newEntry])
    e.currentTarget.reset()
  }

  const handleCalcSolar = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const data: any = Object.fromEntries(formData.entries())

      const s = parseFloat(data.solarMwh) || 0
      const agroArea = parseFloat(data.agroArea) || 0
      const dripArea = parseFloat(data.dripArea) || 0
      const biogasUsage = parseFloat(data.biogasUsage) || 0
      const evKm = parseFloat(data.evKm) || 0

      const solarCO2e = s * 0.82
      const agroCO2e = agroArea * 7
      const dripCO2e = (dripArea * 1200 / 1000) * 0.82
      const biogasCO2e = (biogasUsage * 1.8) / 1000
      const evCO2e = evKm * 0.12
      
      const total = solarCO2e + agroCO2e + dripCO2e + biogasCO2e + evCO2e

      setSolarResults({
          solar: solarCO2e.toFixed(2),
          agro: agroCO2e.toFixed(2),
          drip: dripCO2e.toFixed(2),
          biogas: biogasCO2e.toFixed(2),
          ev: evCO2e.toFixed(2),
          total: total.toFixed(2)
      })
  }

  return (
    <>
      <PageHeader
        title="Carbon Dashboard"
        description="Add your carbon data and see the impact."
      />
      <div className="max-w-md mx-auto mb-8">
        <Select value={activePanel} onValueChange={(v) => setActivePanel(v as PanelType)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a panel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agri">AgriCarbon Panel</SelectItem>
            <SelectItem value="solar">SolarCarbon Panel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activePanel === "agri" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">AgriCarbon Panel</CardTitle>
            <CardDescription>Enter agricultural data to calculate and log CO₂e savings.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="agriForm" className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddAgri}>
              <Input name="plotId" placeholder="Plot ID" required />
              <Input name="landUse" placeholder="Land Use" required />
              <Input name="climate" placeholder="Climate Zone" required />
              <Input name="soil" placeholder="Soil Type" required />
              <Input name="initialSOC" type="number" step="any" placeholder="Initial SOC (t/ha)" required />
              <Input name="finalSOC" type="number" step="any" placeholder="Final SOC (t/ha)" required />
              <Input name="time" type="number" step="any" placeholder="Time Period (years)" required />
              <Input name="area" type="number" step="any" placeholder="Area (ha)" required />
              <Button type="submit" className="md:col-span-2">Add Agri Entry</Button>
            </form>
            <Table className="mt-6">
              <TableHeader>
                <TableRow>
                  <TableHead>Plot ID</TableHead>
                  <TableHead>Area (ha)</TableHead>
                  <TableHead>ΔSOC (tC)</TableHead>
                  <TableHead className="text-right">CO₂e (t)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agriData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.plotId}</TableCell>
                    <TableCell>{row.area.toFixed(2)}</TableCell>
                    <TableCell>{(row.finalSOC - row.initialSOC).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{row.co2e.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activePanel === "solar" && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">SolarCarbon Panel</CardTitle>
            <CardDescription>Enter technology data to calculate total CO₂e savings.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="solarForm" className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCalcSolar}>
              <Input name="solarMwh" type="number" step="any" placeholder="Solar Generation (MWh)" />
              <Input name="agroArea" type="number" step="any" placeholder="Agroforestry Area (ha)" />
              <Input name="dripArea" type="number" step="any" placeholder="Drip Irrigation Area (ha)" />
              <Input name="biogasUsage" type="number" step="any" placeholder="Biogas Usage (m³)" />
              <Input name="evKm" type="number" step="any" placeholder="EV Distance (km/year)" />
              <Button type="submit" className="md:col-span-2">Calculate Solar Impact</Button>
            </form>
            {Object.keys(solarResults).length > 0 && (
                <div className="mt-6 p-4 border rounded-lg space-y-2">
                    <p>Solar Savings: <strong>{solarResults.solar} tCO₂e/year</strong></p>
                    <p>Agroforestry Savings: <strong>{solarResults.agro} tCO₂e/year</strong></p>
                    <p>Irrigation Savings: <strong>{solarResults.drip} tCO₂e/year</strong></p>
                    <p>Biogas Savings: <strong>{solarResults.biogas} tCO₂e/year</strong></p>
                    <p>EV Savings: <strong>{solarResults.ev} tCO₂e/year</strong></p>
                    <hr className="my-2"/>
                    <p className="font-bold text-lg">Total Savings: <strong>{solarResults.total} tCO₂e/year</strong></p>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}

    