
"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { ref, set } from "firebase/database"
import { useRouter } from "next/navigation"

function SolarCarbonCalculator() {
    const { toast } = useToast()
    const { user } = useAuth()
    const router = useRouter()
    const [results, setResults] = React.useState<{ [key: string]: number } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!user) {
            toast({ title: "Not Logged In", description: "You need to be logged in to save calculations.", variant: "destructive" });
            router.push('/login');
            return;
        }

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

        const calculationResults = { solar, agro, drip, bio, ev: evSavings, total };
        setResults(calculationResults);

        try {
            const calcRef = ref(db, `users/${user.uid}/calculations/solarCarbon`);
            await set(calcRef, calculationResults);
            toast({ title: "Calculation Saved", description: "Your SolarCarbon results have been saved." });
        } catch (error) {
            console.error("Firebase error:", error);
            toast({ title: "Save Failed", description: "Could not save calculation data.", variant: "destructive" });
        }
    }
    
    const handleClear = () => {
        setResults(null);
        // Note: This does not clear the data from Firebase, only from the UI state.
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>SolarCarbon Calculator</CardTitle>
                <CardDescription>Calculate CO₂e savings from various interventions.</CardDescription>
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
                    <div className="flex gap-4">
                        <Button type="submit">Calculate</Button>
                        {results && <Button variant="outline" onClick={handleClear}>Clear</Button>}
                    </div>
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
    const { toast } = useToast()
    const { user } = useAuth()
    const router = useRouter()
    const [result, setResult] = React.useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
         if (!user) {
            toast({ title: "Not Logged In", description: "You need to be logged in to save calculations.", variant: "destructive" });
            router.push('/login');
            return;
        }

        const formData = new FormData(e.currentTarget)
        const area = parseFloat(formData.get("areaDrip") as string) || 0
        const factor = parseFloat(formData.get("dripFactor") as string) || 1.5

        const total = area * factor;
        const resultString = `Drip Irrigation: ${total.toFixed(2)} tCO₂e/year saved`;
        setResult(resultString);

        try {
            const calcRef = ref(db, `users/${user.uid}/calculations/dripIrrigation`);
            await set(calcRef, { area, factor, totalSavings: total });
            toast({ title: "Calculation Saved", description: "Your drip irrigation results have been saved." });
        } catch (error) {
            console.error("Firebase error:", error);
            toast({ title: "Save Failed", description: "Could not save calculation data.", variant: "destructive" });
        }
    }

     const handleClear = () => {
        setResult(null);
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
                     <div className="flex gap-4">
                        <Button type="submit">Calculate</Button>
                        {result && <Button variant="outline" onClick={handleClear}>Clear</Button>}
                    </div>
                </form>
                 {result && <p className="font-bold mt-4 text-primary">{result}</p>}
            </CardContent>
        </Card>
    )
}

export default function AgriPVPage() {
  const [step, setStep] = React.useState(1);

  return (
    <>
      <PageHeader
        title="Agri-PV & Irrigation Savings"
        description="Quantify your carbon savings from solar and water management."
      />

      <div className="space-y-8">
        {step === 1 && <SolarCarbonCalculator />}
        {step === 2 && <DripIrrigationCalculator />}

        <div className="flex justify-between mt-8">
            <Button onClick={() => setStep(s => s - 1)} disabled={step === 1}>
                Previous
            </Button>
            <Button onClick={() => setStep(s => s + 1)} disabled={step === 2}>
                Next
            </Button>
        </div>
      </div>
    </>
  )
}
