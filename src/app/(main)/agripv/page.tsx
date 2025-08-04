
"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/firebase"
import { ref, push, set, onValue, serverTimestamp } from "firebase/database"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart, Droplets, Calculator, ArrowLeft, ArrowRight } from "lucide-react"
import { SDG_ICON_URLS, FALLBACK_URLS } from "@/components/sdg-icons"

interface CalculationResult {
  name: string;
  capacity: string;
  energy: string;
  emission: string;
  credits: number;
}

interface CalculationSummary {
  results: CalculationResult[];
  totalCredits: number;
  timeframe: string;
  inputs: {
    capacity: number;
    dripArea: number;
    agroArea: number;
    timeframe: string;
  };
}

function SolarCarbonCalculator() {
    const { toast } = useToast()
    const { user } = useAuth()
    const router = useRouter()
    const [calculationSummary, setCalculationSummary] = React.useState<CalculationSummary | null>(null)
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
                setCalculationSummary(data);
                if (formRef.current && data.inputs) {
                    (formRef.current.elements.namedItem("capacity") as HTMLInputElement).value = data.inputs.capacity || "";
                    (formRef.current.elements.namedItem("dripArea") as HTMLInputElement).value = data.inputs.dripArea || "";
                    (formRef.current.elements.namedItem("agroArea") as HTMLInputElement).value = data.inputs.agroArea || "";
                    const timeframeSelect = formRef.current.elements.namedItem("timeframe") as HTMLSelectElement;
                    if(timeframeSelect) timeframeSelect.value = data.inputs.timeframe || "year";
                }
            }
        });
        return () => unsubscribe();
    }, [getDbPath]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!user) {
            toast({ title: "Not Logged In", description: "You need to be logged in to save calculations.", variant: "destructive" });
            router.push('/login');
            return;
        }

        const formData = new FormData(e.currentTarget)
        
        const capacity = parseFloat(formData.get("capacity") as string) || 0
        const dripArea = parseFloat(formData.get("dripArea") as string) || 0
        const agroArea = parseFloat(formData.get("agroArea") as string) || 0
        const timeframe = formData.get("timeframe") as string || "year"

        if (capacity <= 0) {
            toast({ title: "Invalid Input", description: "Please enter a valid Installed Capacity (MW).", variant: "destructive" });
            return;
        }

        const hoursYear = 8760;
        const divisor = (timeframe === "month") ? 12 : 1;
        const label = (timeframe === "month") ? "per Month" : "per Year";

        const results: CalculationResult[] = [];

        // Solar PV and Biomass calculations
        const projects = [
            { name: "Solar PV", factor: 0.19, emission: 0.82 },
            { name: "Biomass/WtE", factor: 0.80, emission: 0.95 }
        ];

        for (let p of projects) {
            const energy = (capacity * hoursYear * p.factor) / divisor;
            const credits = (energy * p.emission);
            results.push({
                name: p.name,
                capacity: `${capacity} MW`,
                energy: `${energy.toLocaleString(undefined, { maximumFractionDigits: 0 })} MWh`,
                emission: `${p.emission} tCO₂/MWh`,
                credits: credits
            });
        }

        // Agroforestry
        if (agroArea > 0) {
            const agroEmission = 6.11;
            const agroCredits = (agroArea * agroEmission) / divisor;
            results.push({
                name: "Agroforestry",
                capacity: `${agroArea} ha`,
                energy: "—",
                emission: "6.11 tCO₂/ha/year",
                credits: agroCredits
            });
        }

        // Drip Irrigation
        if (dripArea > 0) {
            const dieselPerSqm = 0.4;
            const CO2perLitre = 2.68;
            const sqm = dripArea * 10000;
            const litresSaved = (dieselPerSqm * sqm) / divisor;
            const dripCredits = (litresSaved * CO2perLitre) / 1000;
            results.push({
                name: "Drip Irrigation",
                capacity: `${dripArea} ha`,
                energy: `${litresSaved.toLocaleString(undefined, { maximumFractionDigits: 0 })} L diesel saved`,
                emission: "2.68 kg CO₂/L",
                credits: dripCredits
            });
        }

        const totalCredits = results.reduce((sum, result) => sum + result.credits, 0);

        const summary: CalculationSummary = {
            results,
            totalCredits,
            timeframe: label,
            inputs: { capacity, dripArea, agroArea, timeframe }
        };

        setCalculationSummary(summary);

        const dbPath = getDbPath();
        if (!dbPath) {
            toast({ title: "Error", description: "Could not identify user session.", variant: "destructive" });
            return;
        }

        try {
            const calcRef = ref(db, dbPath);
            await set(calcRef, summary);
            toast({ title: "Calculation Saved", description: "Your SolarCarbon results have been saved." });
        } catch (error) {
            console.error("Firebase error:", error);
            toast({ title: "Save Failed", description: "Could not save calculation data.", variant: "destructive" });
        }
    }
    
    const handleClear = async () => {
        setCalculationSummary(null);
        if (formRef.current) {
            formRef.current.reset();
        }
        
        // Clear data from database
        const dbPath = getDbPath();
        if (dbPath) {
            try {
                const calcRef = ref(db, dbPath);
                await set(calcRef, null);
                toast({ title: "Cleared", description: "Calculation data has been cleared." });
            } catch (error) {
                console.error("Error clearing data:", error);
                toast({ title: "Clear Failed", description: "Could not clear calculation data.", variant: "destructive" });
            }
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-6 w-6" />
                    Carbon Credit Estimator Tool
                </CardTitle>
                <CardDescription>Calculate carbon credits from various renewable energy and agricultural interventions.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Installed Capacity (MW)</Label>
                            <Input id="capacity" name="capacity" type="number" step="0.1" placeholder="e.g., 35" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dripArea">Drip Irrigation Area (ha)</Label>
                            <Input id="dripArea" name="dripArea" type="number" step="0.1" placeholder="e.g., 20" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="agroArea">Agroforestry Area (ha)</Label>
                            <Input id="agroArea" name="agroArea" type="number" step="0.1" placeholder="e.g., 50" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timeframe">Select Timeframe</Label>
                            <Select name="timeframe" defaultValue="year">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="year">Yearly</SelectItem>
                                    <SelectItem value="month">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button type="submit">Calculate</Button>
                        {calculationSummary && <Button variant="outline" onClick={() => handleClear()}>Clear</Button>}
                    </div>
                </form>

                {calculationSummary && (
                    <div className="mt-8 space-y-6">
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Capacity / Area</TableHead>
                                        <TableHead>Energy / Output</TableHead>
                                        <TableHead>Emission Factor</TableHead>
                                        <TableHead>Carbon Credits (tCO₂e)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {calculationSummary.results.map((result, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{result.name}</TableCell>
                                            <TableCell>{result.capacity}</TableCell>
                                            <TableCell>{result.energy}</TableCell>
                                            <TableCell>{result.emission}</TableCell>
                                            <TableCell className="font-bold">
                                                {result.credits.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">Calculation Summary ({calculationSummary.timeframe})</h3>
                            <div className="space-y-2 text-sm">
                                {calculationSummary.results.map((result, index) => (
                                    <p key={index}>
                                        <strong>{result.name}</strong>: {result.capacity} → {result.energy} → <strong>{result.credits.toFixed(2)} tCO₂e {calculationSummary.timeframe}</strong>
                                    </p>
                                ))}
                                <Separator className="my-3" />
                                <p className="text-lg font-bold text-primary">
                                    Total Carbon Credits: {calculationSummary.totalCredits.toLocaleString(undefined, { maximumFractionDigits: 2 })} tCO₂e {calculationSummary.timeframe}
                                </p>
                            </div>
                        </div>
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

     const handleClear = async () => {
        setResult(null);
        if (formRef.current) {
            formRef.current.reset();
        }
        
        // Clear data from database
        const dbPath = getDbPath();
        if (dbPath) {
            try {
                const calcRef = ref(db, dbPath);
                await set(calcRef, null);
                toast({ title: "Cleared", description: "Calculation data has been cleared." });
            } catch (error) {
                console.error("Error clearing data:", error);
                toast({ title: "Clear Failed", description: "Could not clear calculation data.", variant: "destructive" });
            }
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
                        {result && <Button variant="outline" onClick={() => handleClear()}>Clear</Button>}
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

    