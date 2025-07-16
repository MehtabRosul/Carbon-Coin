"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sun, Car, Droplets, Flame } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { ref, push, set } from "firebase/database"

type InterventionType = "solar" | "ev" | "irrigation" | "biogas"

const interventionOptions = {
  solar: {
    label: "Solar Panels",
    icon: <Sun className="h-5 w-5" />,
    description: "Calculate savings from solar energy generation.",
    form: SolarForm,
  },
  ev: {
    label: "Electric Vehicle (EV)",
    icon: <Car className="h-5 w-5" />,
    description: "Calculate savings by switching to an electric vehicle.",
    form: EVForm,
  },
  irrigation: {
    label: "Drip Irrigation",
    icon: <Droplets className="h-5 w-5" />,
    description: "Calculate savings from efficient water usage.",
    form: IrrigationForm,
  },
  biogas: {
    label: "Biogas Plant",
    icon: <Flame className="h-5 w-5" />,
    description: "Calculate savings from biogas production.",
    form: BiogasForm,
  },
}

export default function InterventionsPage() {
  const [intervention, setIntervention] = React.useState<InterventionType | "">("")
  const { toast } = useToast()
  const { user } = useAuth()
  const { handleSubmit, control, register, reset } = useForm()

  const onSubmit = async (data: any) => {
    if (!intervention) return
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit data.",
        variant: "destructive",
      })
      return
    }

    const payload = {
      type: intervention,
      ...data,
      createdAt: new Date().toISOString(),
    }

    try {
      const interventionsRef = ref(db, `users/${user.uid}/interventions`)
      const newEntryRef = push(interventionsRef)
      await set(newEntryRef, payload)
      
      toast({
        title: `${interventionOptions[intervention].label} Data Submitted!`,
        description: "Your carbon savings have been calculated and added to your dashboard.",
      })
      reset()
      setIntervention("")
    } catch (error) {
      console.error("Firebase Error:", error)
      toast({
        title: "Submission Failed",
        description: "Could not save your data. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const selectedIntervention = intervention ? interventionOptions[intervention] : null
  const FormComponent = selectedIntervention?.form

  return (
    <>
      <PageHeader
        title="Interventions Wizard"
        description="Log your technological interventions to track carbon savings."
      />
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Select Intervention Type</CardTitle>
              <CardDescription>Choose the type of intervention you want to log.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={intervention} onValueChange={(v) => {
                setIntervention(v as InterventionType)
                reset()
              }}>
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

          {selectedIntervention && FormComponent && (
            <Card className="mt-6">
              <CardHeader>
                  <div className="flex items-center gap-3">
                      <span className="p-2 bg-primary/10 rounded-full text-primary">{selectedIntervention.icon}</span>
                      <CardTitle className="font-headline">{selectedIntervention.label}</CardTitle>
                  </div>
                <CardDescription>{selectedIntervention.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <FormComponent control={control} register={register} />
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

function SolarForm({ register }: { register: any }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="panelCapacity">Panel Capacity (kW)</Label>
        <Input id="panelCapacity" type="number" placeholder="e.g., 5" {...register("panelCapacity")} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sunshineHours">Average Sunshine Hours/Day</Label>
        <Input id="sunshineHours" type="number" placeholder="e.g., 6" {...register("sunshineHours")} />
      </div>
      <p className="text-xs text-muted-foreground">Formula: Capacity (kW) × Hours/Day × 365 days × Emission Factor (kgCO₂e/kWh)</p>
    </div>
  )
}

function EVForm({ control, register }: { control: any, register: any }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="vehicleType">Vehicle Type Replaced</Label>
        <Controller
          name="vehicleType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="vehicleType">
                    <SelectValue placeholder="Select a vehicle type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sedan">Gasoline Sedan</SelectItem>
                    <SelectItem value="suv">Gasoline SUV</SelectItem>
                    <SelectItem value="truck">Diesel Truck</SelectItem>
                </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="kmDriven">Annual Kilometers Driven</Label>
        <Input id="kmDriven" type="number" placeholder="e.g., 15000" {...register("kmDriven")} />
      </div>
      <p className="text-xs text-muted-foreground">Formula: Km/Year × Emission Factor (kgCO₂e/km of replaced vehicle)</p>
    </div>
  )
}

function IrrigationForm({ register }: { register: any }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="area">Area Under Drip Irrigation (Hectares)</Label>
        <Input id="area" type="number" placeholder="e.g., 20" {...register("area")} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="waterSaved">Estimated Water Saved (Cubic Meters/Year)</Label>
        <Input id="waterSaved" type="number" placeholder="e.g., 5000" {...register("waterSaved")} />
      </div>
      <p className="text-xs text-muted-foreground">Formula: Water Saved (m³) × Energy Savings/m³ × Emission Factor (kgCO₂e/kWh)</p>
    </div>
  )
}

function BiogasForm({ control, register }: { control: any, register: any }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="plantSize">Biogas Plant Size (m³)</Label>
        <Input id="plantSize" type="number" placeholder="e.g., 50" {...register("plantSize")} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="feedstock">Feedstock Type</Label>
        <Controller
          name="feedstock"
          control={control}
          render={({ field }) => (
             <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="feedstock">
                    <SelectValue placeholder="Select a feedstock type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="manure">Animal Manure</SelectItem>
                    <SelectItem value="crop-residue">Crop Residue</SelectItem>
                    <SelectItem value="food-waste">Food Waste</SelectItem>
                </SelectContent>
            </Select>
          )}
        />
      </div>
      <p className="text-xs text-muted-foreground">Formula: Methane Captured (kg) × Global Warming Potential of Methane</p>
    </div>
  )
}