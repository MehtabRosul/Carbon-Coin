
"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/firebase"
import { ref, push, set, onValue, serverTimestamp } from "firebase/database"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart, Droplets, Calculator, ArrowLeft, ArrowRight } from "lucide-react"
import { SDG_ICON_URLS, FALLBACK_URLS } from "@/components/sdg-icons"

function SolarCarbonCalculator() {
    const { toast } = useToast()
    const { user } = useAuth()
    const router = useRouter()
    const [results, setResults] = React.useState<{ [key: string]: number } | null>(null)
    const formRef = React.useRef<HTMLFormElement>(null)

     const getDbPath = React.useCallback(() => {
        if (user?.uid) return `users/${user.uid}/calculations/solarCarbon`;
        return null;
    }, [user]);

    React.useEffect(() => {
        const dbPath = getDbPath();
        if (!dbPath) return;

        const calcRef = ref(db, dbPath);
        const unsubscribe = onValue(calcRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.results) {
                setResults(data.results);
                if (formRef.current && data.inputs) {
                    (formRef.current.elements.namedItem("solar") as HTMLInputElement).value = data.inputs.s || "";
                    (formRef.current.elements.namedItem("agroforestry") as HTMLInputElement).value = data.inputs.a || "";
                    (formRef.current.elements.namedItem("irrigation") as HTMLInputElement).value = data.inputs.d || "";
                    (formRef.current.elements.namedItem("biogas") as HTMLInputElement).value = data.inputs.b || "";
                    (formRef.current.elements.namedItem("ev") as HTMLInputElement).value = data.inputs.evInput || "";
                }
            }
        });
        return () => unsubscribe();
    }, [getDbPath]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const uid = user?.uid

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
        const evInput = parseFloat(formData.get("ev") as string) || 0

        const solar = s * 0.82
        const agro = a * 7
        const drip = ((d * 1200) / 1000) * 0.82
        const bio = (b * 1.8) / 1000
        const evSavings = evInput * 0.12
        const total = solar + agro + drip + bio + evSavings

        const calculationResults = { solar, agro, drip, bio, ev: evSavings, total };
        setResults(calculationResults);

        const dbPath = getDbPath();
        if (!dbPath) {
             toast({ title: "Error", description: "Could not identify user session.", variant: "destructive" });
             return;
        }

        try {
            const dataToSave = {
                inputs: { s, a, d, b, evInput },
                results: calculationResults
            };
            const calcRef = ref(db, dbPath);
            await set(calcRef, dataToSave);
            toast({ title: "Calculation Saved", description: "Your SolarCarbon results have been saved." });
        } catch (error) {
            console.error("Firebase error:", error);
            toast({ title: "Save Failed", description: "Could not save calculation data.", variant: "destructive" });
        }
    }
    
    const handleClear = () => {
        setResults(null);
        if (formRef.current) {
            formRef.current.reset();
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>SolarCarbon Calculator</CardTitle>
                <CardDescription>Calculate CO₂e savings from various interventions.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
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
    const formRef = React.useRef<HTMLFormElement>(null);

    const getDbPath = React.useCallback(() => {
        if (user?.uid) return `users/${user.uid}/calculations/dripIrrigation`;
        return null;
    }, [user]);

    React.useEffect(() => {
        const dbPath = getDbPath();
        if (!dbPath) return;

        const calcRef = ref(db, dbPath);
        const unsubscribe = onValue(calcRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.totalSavings) {
                const resultString = `Drip Irrigation: ${data.totalSavings.toFixed(2)} tCO₂e/year saved`;
                setResult(resultString);
                if (formRef.current) {
                    (formRef.current.elements.namedItem("areaDrip") as HTMLInputElement).value = data.area || "";
                    (formRef.current.elements.namedItem("dripFactor") as HTMLInputElement).value = data.factor || "1.5";
                }
            }
        });
        return () => unsubscribe();
    }, [getDbPath]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const uid = user?.uid

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

        const dbPath = getDbPath();
        if (!dbPath) {
            toast({ title: "Error", description: "Could not identify user session.", variant: "destructive" });
            return;
        }

        try {
            const calcRef = ref(db, dbPath);
            await set(calcRef, { area, factor, totalSavings: total });
            toast({ title: "Calculation Saved", description: "Your drip irrigation results have been saved." });
        } catch (error) {
            console.error("Firebase error:", error);
            toast({ title: "Save Failed", description: "Could not save calculation data.", variant: "destructive" });
        }
    }

     const handleClear = () => {
        setResult(null);
        if (formRef.current) {
            formRef.current.reset();
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Drip Irrigation vs Flood</CardTitle>
                <CardDescription>Estimate savings from switching to drip irrigation.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
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

function AgriPVPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  
  const initialStep = 1;
  const [step, setStep] = React.useState(initialStep);

  // Remove URL parameter handling - use only authenticated user data
  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      router.push('/interventions');
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(s => s - 1);
    }
  };

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
            <Button onClick={handlePrevious} disabled={step === 1}>
                Previous
            </Button>
            <Button onClick={handleNext}>
                {step === 2 ? 'Finish & Go to SOC' : 'Next'}
            </Button>
        </div>
      </div>
    </>
  );
}


export default function AgriPVPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <AgriPVPageContent />
    </React.Suspense>
  )
}

    