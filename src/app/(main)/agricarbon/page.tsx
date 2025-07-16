"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Sun, Zap, Car, Droplets } from "lucide-react"

type Module = "agri" | "solar"
type TechType = "solar" | "ev" | "drip"

export default function CarbonCockpitPage() {
  const [activeModule, setActiveModule] = React.useState<Module>("agri")
  
  // State for calculation results
  const [agriCO2, setAgriCO2] = React.useState(0)
  const [solarCO2, setSolarCO2] = React.useState(0)

  const updateTotalImpact = (agri: number, solar: number) => {
    // This function doesn't need to do anything here as the state update will trigger re-render
  }

  const totalImpact = agriCO2 + solarCO2

  return (
    <>
      <PageHeader
        title="CarbonCoin Cockpit"
        description="Model your climate impact — from field to future."
      />

      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={activeModule === "agri" ? "default" : "outline"}
          onClick={() => setActiveModule("agri")}
        >
          <Leaf className="mr-2" /> AgriCarbon
        </Button>
        <Button
          variant={activeModule === "solar" ? "default" : "outline"}
          onClick={() => setActiveModule("solar")}
        >
          <Sun className="mr-2" /> SolarCarbon
        </Button>
      </div>

      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="font-headline">Total CO₂e Impact</CardTitle>
          <CardDescription className="text-4xl font-bold text-primary tracking-tight">
            {totalImpact.toFixed(2)} tCO₂e
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="max-w-2xl mx-auto">
        {activeModule === "agri" && <AgriCarbonModule setAgriCO2={setAgriCO2} solarCO2={solarCO2} updateTotalImpact={updateTotalImpact} />}
        {activeModule === "solar" && <SolarCarbonModule setSolarCO2={setSolarCO2} agriCO2={agriCO2} updateTotalImpact={updateTotalImpact} />}
      </div>
    </>
  )
}

function AgriCarbonModule({ setAgriCO2, solarCO2, updateTotalImpact }: { setAgriCO2: (n: number) => void, solarCO2: number, updateTotalImpact: (a: number, s: number) => void }) {
  const [initialSOC, setInitialSOC] = React.useState("")
  const [finalSOC, setFinalSOC] = React.useState("")
  const [agriYears, setAgriYears] = React.useState("1")

  const calculateAgri = () => {
    const iSOC = parseFloat(initialSOC) || 0
    const fSOC = parseFloat(finalSOC) || 0
    const years = parseInt(agriYears) || 1
    
    const agriResult = (fSOC - iSOC) / years
    setAgriCO2(agriResult)
    updateTotalImpact(agriResult, solarCO2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Leaf /> AgriCarbon Module</CardTitle>
        <CardDescription>Calculate annual carbon change from soil organic content.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="initialSOC">Initial Soil Organic Carbon (tC/ha)</Label>
          <Input id="initialSOC" type="number" placeholder="e.g., 50" value={initialSOC} onChange={(e) => setInitialSOC(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="finalSOC">Final Soil Organic Carbon (tC/ha)</Label>
          <Input id="finalSOC" type="number" placeholder="e.g., 55" value={finalSOC} onChange={(e) => setFinalSOC(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="agriYears">Years of Change</Label>
          <Input id="agriYears" type="number" placeholder="e.g., 5" value={agriYears} onChange={(e) => setAgriYears(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={calculateAgri}>Calculate Agri Impact</Button>
      </CardFooter>
    </Card>
  )
}

function SolarCarbonModule({ setSolarCO2, agriCO2, updateTotalImpact }: { setSolarCO2: (n: number) => void, agriCO2: number, updateTotalImpact: (a: number, s: number) => void }) {
  const [techType, setTechType] = React.useState<TechType>("solar")
  const [fields, setFields] = React.useState<Record<string, string>>({})

  const handleFieldChange = (id: string, value: string) => {
    setFields(prev => ({ ...prev, [id]: value }))
  }

  const calculateSolar = () => {
    const emissionFactor = parseFloat(fields.emissionFactor) || 0
    let result = 0

    if (techType === "solar") {
      const capacity = parseFloat(fields.capacity) || 0
      const hours = parseFloat(fields.hours) || 0
      const days = parseFloat(fields.days) || 0
      result = (capacity * hours * days * emissionFactor) / 1000
    } else if (techType === "ev") {
      const distance = parseFloat(fields.distance) || 0
      const efficiency = parseFloat(fields.efficiency) || 1
      result = ((distance / efficiency) * emissionFactor) / 1000
    } else if (techType === "drip") {
      const savedEnergy = parseFloat(fields.savedEnergy) || 0
      result = (savedEnergy * emissionFactor) / 1000
    }
    
    setSolarCO2(result)
    updateTotalImpact(agriCO2, result)
  }

  const renderTechFields = () => {
    switch (techType) {
      case "solar":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="capacity">System Capacity (kW)</Label>
              <Input id="capacity" type="number" value={fields.capacity || ""} onChange={(e) => handleFieldChange(e.target.id, e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hours">Hours of Operation/Day</Label>
              <Input id="hours" type="number" value={fields.hours || ""} onChange={(e) => handleFieldChange(e.target.id, e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="days">Days/Year</Label>
              <Input id="days" type="number" value={fields.days || ""} onChange={(e) => handleFieldChange(e.target.id, e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emissionFactor">Grid Emission Factor (kgCO₂e/kWh)</Label>
              <Input id="emissionFactor" type="number" value={fields.emissionFactor || ""} onChange={(e) => handleFieldChange(e.target.id, e.target.value)} />
            </div>
          </>
        )
      case "ev":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="distance">Annual Distance Traveled (km)</Label>
              <Input id="distance" type="number" value={fields.distance || ""} onChange={(e) => handleFieldChange(e.target.id, e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="efficiency">Vehicle Efficiency (km/kWh)</Label>
              <Input id="efficiency" type="number" value={fields.efficiency || ""} onChange={(e) => handleFieldChange(e.target.id, e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emissionFactor">Grid Emission Factor (kgCO₂e/kWh)</Label>
              <Input id="emissionFactor" type="number" value={fields.emissionFactor || ""} onChange={(e) => handleFieldChange(e.target.id, e.target.value)} />
            </div>
          </>
        )
      case "drip":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="savedEnergy">Annual Energy Saved (kWh)</Label>
              <Input id="savedEnergy" type="number" value={fields.savedEnergy || ""} onChange={(e) => handleFieldChange(e.target.id, e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emissionFactor">Grid Emission Factor (kgCO₂e/kWh)</Label>
              <Input id="emissionFactor" type="number" value={fields.emissionFactor || ""} onChange={(e) => handleFieldChange(e.target.id, e.target.value)} />
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Sun /> SolarCarbon Module</CardTitle>
        <CardDescription>Calculate impact from technological interventions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="techType">Intervention Type</Label>
          <Select value={techType} onValueChange={(v: TechType) => { setTechType(v); setFields({}); }}>
            <SelectTrigger id="techType">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solar"><div className="flex items-center gap-2"><Zap /> Solar Pump</div></SelectItem>
              <SelectItem value="ev"><div className="flex items-center gap-2"><Car /> Electric Vehicle</div></SelectItem>
              <SelectItem value="drip"><div className="flex items-center gap-2"><Droplets /> Drip Irrigation</div></SelectItem>
            </SelectContent>
          </Select>
        </div>
        {renderTechFields()}
      </CardContent>
      <CardFooter>
        <Button onClick={calculateSolar}>Calculate Solar Impact</Button>
      </CardFooter>
    </Card>
  )
}

    