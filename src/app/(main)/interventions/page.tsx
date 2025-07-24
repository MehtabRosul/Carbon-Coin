
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

interface AgriCarbonPlot {
  id: string;
  landUse: string;
  climateZone: string;
  soilType: string;
  deltaSOC: number;
  rate: number;
  totalSOC: number;
  co2e: number;
}


function AgriCarbonCalculator() {
  const [plots, setPlots] = React.useState<AgriCarbonPlot[]>([]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = formData.get("plotID") as string;
    const landUse = formData.get("landUse") as string;
    const climateZone = formData.get("climateZone") as string;
    const soilType = formData.get("soilType") as string;
    const initialSOC = parseFloat(formData.get("initialSOC") as string);
    const finalSOC = parseFloat(formData.get("finalSOC") as string);
    const timePeriod = parseFloat(formData.get("timePeriod") as string);
    const area = parseFloat(formData.get("area") as string);

    if (!id || !landUse || !climateZone || !soilType || isNaN(initialSOC) || isNaN(finalSOC) || isNaN(timePeriod) || isNaN(area)) {
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

    const newPlot: AgriCarbonPlot = {
      id,
      landUse,
      climateZone,
      soilType,
      deltaSOC: delta,
      rate,
      totalSOC: total,
      co2e: co2,
    };

    setPlots([...plots, newPlot]);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AgriCarbon (SOC-Based)</CardTitle>
        <CardDescription>Add plot data to calculate carbon sequestration based on soil organic carbon changes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <Button type="submit">Add Plot</Button>
        </form>

        {plots.length > 0 && (
          <div className="mt-8">
            <h4 className="font-bold mb-2">Plot Data</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plot</TableHead><TableHead>Land Use</TableHead><TableHead>Climate</TableHead><TableHead>Soil</TableHead><TableHead>SOC Δ</TableHead><TableHead>Rate</TableHead><TableHead>Total SOC</TableHead><TableHead>CO₂e</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plots.map((plot, index) => (
                  <TableRow key={index}>
                    <TableCell>{plot.id}</TableCell><TableCell>{plot.landUse}</TableCell><TableCell>{plot.climateZone}</TableCell><TableCell>{plot.soilType}</TableCell><TableCell>{plot.deltaSOC.toFixed(2)}</TableCell><TableCell>{plot.rate.toFixed(2)}</TableCell><TableCell>{plot.totalSOC.toFixed(2)}</TableCell><TableCell>{plot.co2e.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


function SOCCalculator() {
    const [result, setResult] = React.useState<string | null>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const socInit = (parseFloat(formData.get("socInit") as string) || 0) / 100
        const socFinal = (parseFloat(formData.get("socFinal") as string) || 0) / 100
        const bd = parseFloat(formData.get("bd") as string) || 0
        const depth = parseFloat(formData.get("depth") as string) || 0
        const areaSOC = parseFloat(formData.get("areaSOC") as string) || 0
        const soilFactor = parseFloat(formData.get("soilTypeSOC") as string) || 1

        const deltaSOC = socFinal - socInit
        const deltaSOCMass = deltaSOC * bd * depth
        const totalCkg = deltaSOCMass * 10000 * areaSOC * soilFactor
        const co2e = (totalCkg) * 3.67
        
        const resultString = `${co2e.toFixed(2)} tCO₂e sequestered (Soil Type adjusted)`
        setResult(resultString)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>🌱 Soil Organic Carbon (SOC) Sequestration</CardTitle>
            </CardHeader>
             <form onSubmit={handleSubmit}>
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
                    <Button type="submit">Calculate SOC</Button>
                    {result && <p className="font-bold mt-4">{result}</p>}
                </CardContent>
            </form>
        </Card>
    )
}


export default function InterventionsPage() {
  return (
    <>
      <PageHeader
        title="SOC Calculators"
        description="Quantify your soil carbon savings from agricultural practices."
      />

      <div className="grid gap-8">
        <SOCCalculator />
        <AgriCarbonCalculator />
      </div>
    </>
  )
}
