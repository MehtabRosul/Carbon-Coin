
"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { BarChart, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar, Line } from 'recharts'
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { ref, onValue, set, push } from "firebase/database"
import { useToast } from "@/hooks/use-toast"


const placeholderData = [
  { month: 'Jan', savings: 400, credits: 240 },
  { month: 'Feb', savings: 300, credits: 139 },
  { month: 'Mar', savings: 200, credits: 980 },
  { month: 'Apr', savings: 278, credits: 390 },
  { month: 'May', savings: 189, credits: 480 },
  { month: 'Jun', savings: 239, credits: 380 },
];

interface AgriPVSystem {
    id: string;
    systemId: string;
    capacity: number;
    landUse: string;
    cropType: string;
    co2eSavings: number;
}

function AgriPVCalculator() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [systems, setSystems] = React.useState<AgriPVSystem[]>([]);

    React.useEffect(() => {
        if (!user) return;
        const systemsRef = ref(db, `users/${user.uid}/agriPVSystems`);
        const unsubscribe = onValue(systemsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const systemsList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setSystems(systemsList);
            } else {
                setSystems([]);
            }
        });
        return () => unsubscribe();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            toast({ title: "Not Logged In", description: "You must be logged in to add a system.", variant: "destructive" });
            return;
        }

        const formData = new FormData(e.currentTarget);
        const systemId = formData.get("systemId") as string;
        const capacity = parseFloat(formData.get("capacity") as string);
        const landUse = formData.get("landUse") as string;
        const cropType = formData.get("cropType") as string;

        if (!systemId || isNaN(capacity) || !landUse || !cropType) {
            toast({ title: "Missing Fields", description: "Please fill all fields.", variant: "destructive" });
            return;
        }

        const co2eSavings = capacity * 0.709 * 25; // Example calculation
        const newSystemData = { systemId, capacity, landUse, cropType, co2eSavings };

        try {
            const systemsRef = ref(db, `users/${user.uid}/agriPVSystems`);
            const newSystemRef = push(systemsRef);
            await set(newSystemRef, newSystemData);
            toast({ title: "System Added", description: "AgriPV system data has been saved." });
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error("Firebase error:", error);
            toast({ title: "Save Failed", description: "Could not save system data.", variant: "destructive" });
        }
    };
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>AgriPV System Calculator</CardTitle>
        <CardDescription>Calculate CO₂e savings from your Agri-Photovoltaic systems.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="systemId">System ID</Label>
                <Input id="systemId" name="systemId" placeholder="e.g., Farm-West-01" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="capacity">System Capacity (kWp)</Label>
                <Input id="capacity" name="capacity" type="number" step="any" placeholder="e.g., 50" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="landUse">Land Use Before AgriPV</Label>
                 <Select name="landUse">
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Cropland">Cropland</SelectItem>
                        <SelectItem value="Fallow">Fallow Land</SelectItem>
                        <SelectItem value="Pasture">Pasture</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type Under Panels</Label>
                <Input id="cropType" name="cropType" placeholder="e.g., Lettuce, Wheat" />
            </div>
          </div>
          <Button type="submit">Add System & Calculate</Button>
        </form>
         <div className="mt-6 space-y-2">
            <h4 className="font-medium">Saved Systems:</h4>
            <ul className="list-disc pl-5 text-sm">
                {systems.map(s => <li key={s.id}>{s.systemId} ({s.capacity} kWp): {s.co2eSavings.toFixed(2)} tCO₂e saved</li>)}
            </ul>
        </div>
      </CardContent>
    </Card>
  )
}


export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visualize your carbon savings and impact data."
      />

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Carbon Savings Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={placeholderData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="savings" fill="var(--color-chart-1)" name="CO₂e Saved (t)" />
                <Bar dataKey="credits" fill="var(--color-chart-2)" name="Credits Earned" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <AgriPVCalculator />

      </div>
    </>
  )
}
