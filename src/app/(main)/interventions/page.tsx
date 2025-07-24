
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
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { ref, set, onValue } from "firebase/database"
import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"


interface AgriCarbonPlot {
  id: string;
  plotId: string;
  landUse: string;
  climateZone: string;
  soilType: string;
  deltaSOC: number;
  rate: number;
  totalSOC: number;
  co2e: number;
}


function AgriCarbonCalculator() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [plots, setPlots] = React.useState<AgriCarbonPlot[]>([]);
  const formRef = React.useRef<HTMLFormElement>(null);

  const getDbPath = React.useCallback(() => {
    const uid = searchParams.get('uid');
    const anonId = searchParams.get('anonId');
    if (user?.uid) return `users/${user.uid}/agriCarbonPlots`;
    if (uid) return `users/${uid}/agriCarbonPlots`;
    if (anonId) return `anonymousUsers/${anonId}/agriCarbonPlots`;
    return null;
  }, [user, searchParams]);

  React.useEffect(() => {
    const dbPath = getDbPath();
    if (!dbPath) return;

    const plotsRef = ref(db, dbPath);
    const unsubscribe = onValue(plotsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const plotsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setPlots(plotsList);
      } else {
        setPlots([]);
      }
    });

    return () => unsubscribe();
  }, [getDbPath]);
  
  const handleDeletePlot = (plotId: string) => {
    setPlots(prevPlots => prevPlots.filter(plot => plot.id !== plotId));
    toast({ title: "Plot Removed", description: "The plot has been removed from the view." });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dbPath = getDbPath();
    const uid = searchParams.get('uid');
    const anonId = searchParams.get('anonId');

    if (!user && !uid && !anonId) {
      toast({ title: "Not Logged In", description: "You need to be logged in to add a plot.", variant: "destructive" });
      router.push('/login');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const plotId = formData.get("plotID") as string;
    const landUse = formData.get("landUse") as string;
    const climateZone = formData.get("climateZone") as string;
    const soilType = formData.get("soilType") as string;
    const initialSOC = parseFloat(formData.get("initialSOC") as string);
    const finalSOC = parseFloat(formData.get("finalSOC") as string);
    const timePeriod = parseFloat(formData.get("timePeriod") as string);
    const area = parseFloat(formData.get("area") as string);

    if (!plotId || !landUse || !climateZone || !soilType || isNaN(initialSOC) || isNaN(finalSOC) || isNaN(timePeriod) || isNaN(area)) {
      toast({ title: "Missing Fields", description: "Please fill all AgriCarbon fields.", variant: "destructive" });
      return;
    }
    
    if (timePeriod <= 0) {
       toast({ title: "Invalid Input", description: "Time period must be greater than zero.", variant: "destructive" });
       return;
    }

    const delta = finalSOC - initialSOC;
    const rate = delta / timePeriod;
    const total = delta * area;
    const co2 = total * 3.67;

    const newPlotData = {
      plotId,
      landUse,
      climateZone,
      soilType,
      initialSOC,
      finalSOC,
      timePeriod,
      area,
      deltaSOC: delta,
      rate,
      totalSOC: total,
      co2e: co2,
    };
    
    try {
        if (!dbPath) throw new Error("Database path not available");
        const plotRef = ref(db, `${dbPath}/${plotId}`);
        await set(plotRef, newPlotData);
        toast({ title: "Plot Added", description: "Your plot data has been saved successfully." });
        if (formRef.current) formRef.current.reset();
    } catch (error) {
        console.error("Firebase error:", error);
        toast({ title: "Save Failed", description: "Could not save plot data. Please try again.", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AgriCarbon (SOC-Based)</CardTitle>
        <CardDescription>Add plot data to calculate carbon sequestration based on soil organic carbon changes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="grid gap-2"><Label htmlFor="plotID">Plot ID</Label><Input name="plotID" id="plotID" /></div>
            <div className="grid gap-2">
              <Label htmlFor="landUse">Land Use</Label>
              <Select name="landUse">
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent><SelectItem value="Agriculture">Agriculture</SelectItem><SelectItem value="Forest">Forest</SelectItem><SelectItem value="Grassland">Grassland</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
              </Select>
            </div>
             <div className="grid gap-2">
              <Label htmlFor="climateZone">Climate Zone</Label>
              <Select name="climateZone">
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent><SelectItem value="Tropical">Tropical</SelectItem><SelectItem value="Temperate">Temperate</SelectItem><SelectItem value="Arid">Arid</SelectItem><SelectItem value="Humid">Humid</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <Select name="soilType">
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent><SelectItem value="Sandy">Sandy</SelectItem><SelectItem value="Loamy">Loamy</SelectItem><SelectItem value="Clayey">Clayey</SelectItem><SelectItem value="Silty">Silty</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label htmlFor="initialSOC">Initial SOC (tC/ha)</Label><Input name="initialSOC" id="initialSOC" type="number" step="any" /></div>
            <div className="grid gap-2"><Label htmlFor="finalSOC">Final SOC (tC/ha)</Label><Input name="finalSOC" id="finalSOC" type="number" step="any" /></div>
            <div className="grid gap-2"><Label htmlFor="timePeriod">Time Period (years)</Label><Input name="timePeriod" id="timePeriod" type="number" step="any" /></div>
            <div className="grid gap-2"><Label htmlFor="area">Area (ha)</Label><Input name="area" id="area" type="number" step="any" /></div>
          </div>
          <Button type="submit" className="w-full">Add Plot</Button>
        </form>

        <div className="mt-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plot</TableHead><TableHead>Land Use</TableHead><TableHead>Climate</TableHead><TableHead>Soil</TableHead><TableHead>SOC Δ</TableHead><TableHead>Rate</TableHead><TableHead>Total SOC</TableHead><TableHead>CO₂e</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plots.map((plot) => (
                  <TableRow key={plot.id}>
                    <TableCell>{plot.plotId}</TableCell><TableCell>{plot.landUse}</TableCell><TableCell>{plot.climateZone}</TableCell><TableCell>{plot.soilType}</TableCell><TableCell>{plot.deltaSOC.toFixed(2)}</TableCell><TableCell>{plot.rate.toFixed(2)}</TableCell><TableCell>{plot.totalSOC.toFixed(2)}</TableCell><TableCell>{plot.co2e.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePlot(plot.id)}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
      </CardContent>
    </Card>
  );
}


function SOCCalculator() {
    const { toast } = useToast()
    const { user } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [result, setResult] = React.useState<string | null>(null)
    const formRef = React.useRef<HTMLFormElement>(null);

    const getDbPath = React.useCallback(() => {
        const uid = searchParams.get('uid');
        const anonId = searchParams.get('anonId');
        if(user?.uid) return `users/${user.uid}/calculations/socSequestration`;
        if (uid) return `users/${uid}/calculations/socSequestration`;
        if (anonId) return `anonymousUsers/${anonId}/calculations/socSequestration`;
        return null;
    }, [user, searchParams]);

    React.useEffect(() => {
        const dbPath = getDbPath();
        if (!dbPath) return;

        const calcRef = ref(db, dbPath);
        const unsubscribe = onValue(calcRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.co2e) {
                const resultString = `${data.co2e.toFixed(2)} tCO₂e sequestered (Soil Type adjusted)`;
                setResult(resultString);
                if (formRef.current && data.inputs) {
                    (formRef.current.elements.namedItem("socInit") as HTMLInputElement).value = data.inputs.socInit || "";
                    (formRef.current.elements.namedItem("socFinal") as HTMLInputElement).value = data.inputs.socFinal || "";
                    (formRef.current.elements.namedItem("bd") as HTMLInputElement).value = data.inputs.bd || "";
                    (formRef.current.elements.namedItem("depth") as HTMLInputElement).value = data.inputs.depth || "";
                    (formRef.current.elements.namedItem("areaSOC") as HTMLInputElement).value = data.inputs.areaSOC || "";
                    const soilTypeSelect = formRef.current.elements.namedItem("soilTypeSOC") as HTMLSelectElement;
                    if(soilTypeSelect) soilTypeSelect.value = data.inputs.soilFactor || "1";
                }
            }
        });
        return () => unsubscribe();
    }, [getDbPath]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const uid = searchParams.get('uid');
        const anonId = searchParams.get('anonId');

        if (!user && !uid && !anonId) {
            toast({ title: "Not Logged In", description: "You need to be logged in to save calculations.", variant: "destructive" });
            router.push('/login');
            return;
        }

        const formData = new FormData(e.currentTarget)
        const socInitP = parseFloat(formData.get("socInit") as string) || 0
        const socFinalP = parseFloat(formData.get("socFinal") as string) || 0
        const bd = parseFloat(formData.get("bd") as string) || 0
        const depth = parseFloat(formData.get("depth") as string) || 0
        const areaSOC = parseFloat(formData.get("areaSOC") as string) || 0
        const soilFactor = parseFloat(formData.get("soilTypeSOC") as string) || 1
        
        const socInit = socInitP / 100
        const socFinal = socFinalP / 100

        const deltaSOC = socFinal - socInit
        const deltaSOCMass = deltaSOC * bd * depth
        const totalCkg = deltaSOCMass * 10000 * areaSOC * soilFactor
        const co2e = (totalCkg) * 3.67
        
        const resultString = `${co2e.toFixed(2)} tCO₂e sequestered (Soil Type adjusted)`
        setResult(resultString)

        const dbPath = getDbPath();
        if (!dbPath) {
             toast({ title: "Error", description: "Could not identify user session.", variant: "destructive" });
             return;
        }

         try {
            const dataToSave = { 
                inputs: { socInit: socInitP, socFinal: socFinalP, bd, depth, areaSOC, soilFactor }, 
                co2e 
            };
            const calcRef = ref(db, dbPath);
            await set(calcRef, dataToSave);
            toast({ title: "Calculation Saved", description: "Your SOC Sequestration results have been saved." });
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
                <CardTitle>Soil Organic Carbon (SOC) Sequestration</CardTitle>
            </CardHeader>
             <form onSubmit={handleSubmit} ref={formRef}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="grid gap-2"><Label htmlFor="socInit">Initial SOC (%)</Label><Input name="socInit" id="socInit" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="socFinal">Final SOC (%)</Label><Input name="socFinal" id="socFinal" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="bd">Bulk Density (g/cm³)</Label><Input name="bd" id="bd" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="depth">Soil Depth (m)</Label><Input name="depth" id="depth" type="number" step="any" /></div>
                        <div className="grid gap-2"><Label htmlFor="areaSOC">Area (hectares)</Label><Input name="areaSOC" id="areaSOC" type="number" step="any" /></div>
                        <div className="grid gap-2">
                          <Label htmlFor="soilTypeSOC">Soil Type</Label>
                          <Select name="soilTypeSOC" defaultValue="1">
                             <SelectTrigger><SelectValue /></SelectTrigger>
                             <SelectContent>
                                <SelectItem value="1">Loamy</SelectItem>
                                <SelectItem value="0.95">Sandy</SelectItem>
                                <SelectItem value="1.05">Clayey</SelectItem>
                             </SelectContent>
                          </Select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button type="submit">Calculate SOC</Button>
                        {result && <Button variant="outline" onClick={handleClear}>Clear</Button>}
                    </div>
                    {result && <p className="font-bold mt-4">{result}</p>}
                </CardContent>
            </form>
        </Card>
    )
}


export default function InterventionsPage() {
  const [step, setStep] = React.useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const getQueryString = () => {
    const uid = searchParams.get('uid');
    const anonId = searchParams.get('anonId');
    let queryString = '';

    if (user?.uid) {
        queryString = `?uid=${user.uid}`;
    } else if (uid) {
        queryString = `?uid=${uid}`;
    } else if (anonId) {
        queryString = `?anonId=${anonId}`;
    }
    return queryString;
  }

  const handleNext = () => {
    if (step < 2) {
      setStep(s => s + 1);
    }
  };

  const handlePrevious = () => {
    const queryString = getQueryString();
    
    if (step > 1) {
      setStep(s => s - 1);
    } else {
       const separator = queryString.includes('?') ? '&' : '?';
       router.push(`/agripv${queryString}${separator}step=2`);
    }
  };


  return (
    <>
      <PageHeader
        title="SOC Calculators"
        description="Quantify your soil carbon savings from agricultural practices."
      />

      <div className="space-y-8">
        {step === 1 && <SOCCalculator />}
        {step === 2 && <AgriCarbonCalculator />}

         <div className="flex justify-between mt-8">
            <Button onClick={handlePrevious}>
                {step === 1 ? 'Move to AgriPV' : 'Previous'}
            </Button>
            <Button onClick={handleNext} disabled={step === 2}>
                Next
            </Button>
        </div>
      </div>
    </>
  )
}
