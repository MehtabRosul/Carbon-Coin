"use client"

import * as React from "react"
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Sun, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { ref, push, set } from "firebase/database"

const steps = [
  {
    title: "Plot Details",
    description: "Basic information about your agricultural plot.",
    icon: <Leaf className="h-6 w-6" />,
  },
  {
    title: "Environmental Factors",
    description: "Climate and soil conditions of your plot.",
    icon: <Sun className="h-6 w-6" />,
  },
  {
    title: "Review & Submit",
    description: "Confirm your data before calculating savings.",
    icon: <CheckCircle className="h-6 w-6" />,
  },
]

export default function AgriCarbonPage() {
  const [step, setStep] = React.useState(0)
  const { toast } = useToast()
  const { user } = useAuth()
  const methods = useForm()
  const { getValues, reset } = methods

  const handleNext = () => setStep((prev) => Math.min(prev + 1, steps.length - 1))
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0))

  const onSubmit = async (data: any) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit data.",
        variant: "destructive",
      })
      return
    }
    try {
      const agriCarbonRef = ref(db, `users/${user.uid}/agriCarbon`)
      const newEntryRef = push(agriCarbonRef)
      await set(newEntryRef, { ...data, createdAt: new Date().toISOString() })
      toast({
        title: "AgriCarbon Data Submitted!",
        description: "Your carbon savings have been calculated and added to your dashboard.",
      })
      reset()
      setStep(0)
    } catch (error) {
      console.error("Firebase Error:", error)
      toast({
        title: "Submission Failed",
        description: "Could not save your data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const progressValue = ((step + 1) / steps.length) * 100

  return (
    <FormProvider {...methods}>
      <PageHeader
        title="AgriCarbon Wizard"
        description="Enter your agricultural data to calculate carbon savings."
      />
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">{steps[step].icon}</div>
              <div>
                <CardTitle className="font-headline">{steps[step].title}</CardTitle>
                <CardDescription>{steps[step].description}</CardDescription>
              </div>
            </div>
            <Progress value={progressValue} className="w-full" />
          </CardHeader>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <CardContent className="min-h-[250px]">
              {step === 0 && <Step1 />}
              {step === 1 && <Step2 />}
              {step === 2 && <Step3 formData={getValues()} />}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : <div />}
              {step < steps.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit">Submit for Calculation</Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </FormProvider>
  )
}

function Step1() {
  const { register, control } = useFormContext()
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="plotId">Plot ID</Label>
        <Input id="plotId" placeholder="e.g., PLOT-001" {...register("plotId")} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="landUse">Land Use</Label>
        <Controller
          name="landUse"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="landUse">
                <SelectValue placeholder="Select land use type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cropland">Cropland</SelectItem>
                <SelectItem value="grassland">Grassland</SelectItem>
                <SelectItem value="forest">Forest</SelectItem>
                <SelectItem value="wetland">Wetland</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
       <div className="grid gap-2">
        <Label htmlFor="plotSize">Plot Size (Hectares)</Label>
        <Input id="plotSize" type="number" placeholder="e.g., 10.5" {...register("plotSize")} />
      </div>
    </div>
  )
}

function Step2() {
  const { register, control } = useFormContext()
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="climateZone">Climate Zone</Label>
        <Controller
          name="climateZone"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="climateZone">
                <SelectValue placeholder="Select climate zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tropical">Tropical</SelectItem>
                <SelectItem value="temperate">Temperate</SelectItem>
                <SelectItem value="arid">Arid</SelectItem>
                <SelectItem value="continental">Continental</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="soilType">Soil Type</Label>
        <Controller
          name="soilType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="soilType">
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="loam">Loam</SelectItem>
                <SelectItem value="silt">Silt</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
       <div className="grid gap-2">
        <Label htmlFor="organicMatter">Soil Organic Matter (%)</Label>
        <Input id="organicMatter" type="number" placeholder="e.g., 2.5" {...register("organicMatter")} />
      </div>
    </div>
  )
}

function Step3({ formData }: { formData: any }) {
    return (
        <div>
            <h3 className="text-lg font-medium mb-4">Review Your Entry</h3>
            <div className="space-y-4 rounded-md border p-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Plot ID:</span>
                    <span className="font-medium">{formData.plotId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Land Use:</span>
                    <span className="font-medium">{formData.landUse || "N/A"}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Plot Size:</span>
                    <span className="font-medium">{formData.plotSize ? `${formData.plotSize} Ha` : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Climate Zone:</span>
                    <span className="font-medium">{formData.climateZone || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Soil Type:</span>
                    <span className="font-medium">{formData.soilType || "N/A"}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Soil Organic Matter:</span>
                    <span className="font-medium">{formData.organicMatter ? `${formData.organicMatter}%` : "N/A"}</span>
                </div>
            </div>
             <p className="text-sm text-muted-foreground mt-4">
                By submitting, you confirm that the provided data is accurate. The CO₂e calculation will be based on established scientific models.
            </p>
        </div>
    )
}