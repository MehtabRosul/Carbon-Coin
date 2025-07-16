"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sun, Car, Droplets, Flame } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type InterventionType = "solar" | "ev" | "irrigation" | "biogas" | ""

const interventionOptions = {
  solar: {
    label: "Solar Panels",
    icon: <Sun className="h-5 w-5" />,
    description: "Calculate savings from solar energy generation.",
    form: <SolarForm />,
  },
  ev: {
    label: "Electric Vehicle (EV)",
    icon: <Car className="h-5 w-5" />,
    description: "Calculate savings by switching to an electric vehicle.",
    form: <EVForm />,
  },
  irrigation: {
    label: "Drip Irrigation",
    icon: <Droplets className="h-5 w-5" />,
    description: "Calculate savings from efficient water usage.",
    form: <IrrigationForm />,
  },
  biogas: {
    label: "Biogas Plant",
    icon: <Flame className="h-5 w-5" />,
    description: "Calculate savings from biogas production.",
    form: <BiogasForm />,
  },
}

export default function InterventionsPage() {
  const [intervention, setIntervention] = React.useState<InterventionType>("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!intervention) return
    toast({
      title: `${interventionOptions[intervention].label} Data Submitted!`,
      description: "Your carbon savings have been calculated and added to your dashboard.",
    })
    setIntervention("")
  }
  
  const selectedIntervention = intervention ? interventionOptions[intervention] : null

  return (
    <>
      <PageHeader
        title="Interventions Wizard"
        description="Log your technological interventions to track carbon savings."
      />
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Select Intervention Type</CardTitle>
              <CardDescription>Choose the type of intervention you want to log.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={intervention} onValueChange={(v) => setIntervention(v as InterventionType)}>
                <SelectTrigger id="intervention-type">
                  <SelectValue placeholder="Select an intervention..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(interventionOptions).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {value.icon}
                        <span>{value.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedIntervention && (
            <Card className="mt-6">
              <CardHeader>
                  <div className="flex items-center gap-3">
                      <span className="p-2 bg-primary/10 rounded-full text-primary">{selectedIntervention.icon}</span>
                      <CardTitle className="font-headline">{selectedIntervention.label}</CardTitle>
                  </div>
                <CardDescription>{selectedIntervention.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedIntervention.form}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit">Add Intervention</Button>
              </CardFooter>
            </Card>
          )}
        </form>
      </div>
    </>
  )
}

function SolarForm() {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="panel-capacity">Panel Capacity (kW)</Label>
        <Input id="panel-capacity" type="number" placeholder="e.g., 5" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sunshine-hours">Average Sunshine Hours/Day</Label>
        <Input id="sunshine-hours" type="number" placeholder="e.g., 6" />
      </div>
      <p className="text-xs text-muted-foreground">Formula: Capacity (kW) × Hours/Day × 365 days × Emission Factor (kgCO₂e/kWh)</p>
    </div>
  )
}

function EVForm() {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="vehicle-type">Vehicle Type Replaced</Label>
        <Select>
            <SelectTrigger id="vehicle-type">
                <SelectValue placeholder="Select a vehicle type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="sedan">Gasoline Sedan</SelectItem>
                <SelectItem value="suv">Gasoline SUV</SelectItem>
                <SelectItem value="truck">Diesel Truck</SelectItem>
            </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="km-driven">Annual Kilometers Driven</Label>
        <Input id="km-driven" type="number" placeholder="e.g., 15000" />
      </div>
      <p className="text-xs text-muted-foreground">Formula: Km/Year × Emission Factor (kgCO₂e/km of replaced vehicle)</p>
    </div>
  )
}

function IrrigationForm() {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="area">Area Under Drip Irrigation (Hectares)</Label>
        <Input id="area" type="number" placeholder="e.g., 20" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="water-saved">Estimated Water Saved (Cubic Meters/Year)</Label>
        <Input id="water-saved" type="number" placeholder="e.g., 5000" />
      </div>
      <p className="text-xs text-muted-foreground">Formula: Water Saved (m³) × Energy Savings/m³ × Emission Factor (kgCO₂e/kWh)</p>
    </div>
  )
}

function BiogasForm() {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="plant-size">Biogas Plant Size (m³)</Label>
        <Input id="plant-size" type="number" placeholder="e.g., 50" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="feedstock">Feedstock Type</Label>
        <Select>
            <SelectTrigger id="feedstock">
                <SelectValue placeholder="Select a feedstock type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="manure">Animal Manure</SelectItem>
                <SelectItem value="crop-residue">Crop Residue</SelectItem>
                <SelectItem value="food-waste">Food Waste</SelectItem>
            </SelectContent>
        </Select>
      </div>
      <p className="text-xs text-muted-foreground">Formula: Methane Captured (kg) × Global Warming Potential of Methane</p>
    </div>
  )
}
