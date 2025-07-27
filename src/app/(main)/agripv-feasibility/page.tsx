"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, CheckCircle, XCircle } from "lucide-react"

function AgriPVFeasibilityCalculator() {
  const [results, setResults] = React.useState<{
    isFeasible: boolean;
    rValue: number;
    cropSuitability: number;
    potential: number;
  } | null>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  // State to track which fields have been cleared
  const [clearedFields, setClearedFields] = React.useState<Set<string>>(new Set())
  
  // State for form values
  const [formValues, setFormValues] = React.useState({
    district: "Example District",
    crop: "30",
    crop_area: "1000",
    total_area: "2000",
    suitable_area: "1000",
    ghi: "5",
    road: "8",
    substation: "20",
    slope: "5",
    power_type: "650"
  })

  const handleFieldClick = (fieldName: string) => {
    if (!clearedFields.has(fieldName)) {
      setClearedFields(prev => new Set(prev).add(fieldName));
      // Clear the field value when first clicked
      setFormValues(prev => ({
        ...prev,
        [fieldName]: ""
      }));
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Use formValues for calculations
    const district = formValues.district
    const crop = parseFloat(formValues.crop) || 0
    const cropArea = parseFloat(formValues.crop_area) || 0
    const totalArea = parseFloat(formValues.total_area) || 0
    const suitableArea = parseFloat(formValues.suitable_area) || 0
    const ghi = parseFloat(formValues.ghi) || 0
    const road = parseFloat(formValues.road) || 0
    const substation = parseFloat(formValues.substation) || 0
    const slope = parseFloat(formValues.slope) || 0
    const powerDensity = parseFloat(formValues.power_type) || 0

    // Feasibility check
    const isFeasible = ghi >= 4.5 && road <= 10 && substation <= 25 && slope <= 8;
    const rValue = suitableArea / totalArea;
    const potential = cropArea * rValue * (crop / 100) * powerDensity;

    const calculationResults = {
      isFeasible,
      rValue,
      cropSuitability: crop,
      potential
    };
    
    setResults(calculationResults);
  }
  
  const handleClear = () => {
    setResults(null);
    setClearedFields(new Set());
    setFormValues({
      district: "Example District",
      crop: "30",
      crop_area: "1000",
      total_area: "2000",
      suitable_area: "1000",
      ghi: "5",
      road: "8",
      substation: "20",
      slope: "5",
      power_type: "650"
    });
    if (formRef.current) {
      formRef.current.reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          AgriPV Feasibility Calculator
        </CardTitle>
        <CardDescription>Assess the feasibility of AgriPV implementation for your land.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-headline font-semibold flex items-center gap-2">
              🌾 INPUTS
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input 
                  id="district" 
                  name="district" 
                  type="text" 
                  value={formValues.district}
                  onFocus={() => handleFieldClick("district")}
                  onChange={(e) => handleInputChange("district", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="crop">Crop</Label>
                <Select 
                  name="crop" 
                  value={formValues.crop}
                  onValueChange={(value) => {
                    handleFieldClick("crop");
                    handleInputChange("crop", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Eggplants</SelectItem>
                    <SelectItem value="35">Chickpeas</SelectItem>
                    <SelectItem value="45">Wheat</SelectItem>
                    <SelectItem value="60">Lemons and limes</SelectItem>
                    <SelectItem value="75">Spinach</SelectItem>
                    <SelectItem value="65">Tomatoes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="crop_area">Crop Area under Cultivation (ha)</Label>
                <Input 
                  id="crop_area" 
                  name="crop_area" 
                  type="number" 
                  value={formValues.crop_area}
                  onFocus={() => handleFieldClick("crop_area")}
                  onChange={(e) => handleInputChange("crop_area", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="total_area">Total Agricultural Area X (ha)</Label>
                <Input 
                  id="total_area" 
                  name="total_area" 
                  type="number" 
                  value={formValues.total_area}
                  onFocus={() => handleFieldClick("total_area")}
                  onChange={(e) => handleInputChange("total_area", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="suitable_area">Suitable Area Y (ha)</Label>
                <Input 
                  id="suitable_area" 
                  name="suitable_area" 
                  type="number" 
                  value={formValues.suitable_area}
                  onFocus={() => handleFieldClick("suitable_area")}
                  onChange={(e) => handleInputChange("suitable_area", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ghi">GHI (kWh/m²/day)</Label>
                <Input 
                  id="ghi" 
                  name="ghi" 
                  type="number" 
                  value={formValues.ghi}
                  onFocus={() => handleFieldClick("ghi")}
                  onChange={(e) => handleInputChange("ghi", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="road">Distance from Road/Rail (km)</Label>
                <Input 
                  id="road" 
                  name="road" 
                  type="number" 
                  value={formValues.road}
                  onFocus={() => handleFieldClick("road")}
                  onChange={(e) => handleInputChange("road", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="substation">Distance from Substation (km)</Label>
                <Input 
                  id="substation" 
                  name="substation" 
                  type="number" 
                  value={formValues.substation}
                  onFocus={() => handleFieldClick("substation")}
                  onChange={(e) => handleInputChange("substation", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slope">Slope (degrees)</Label>
                <Input 
                  id="slope" 
                  name="slope" 
                  type="number" 
                  value={formValues.slope}
                  onFocus={() => handleFieldClick("slope")}
                  onChange={(e) => handleInputChange("slope", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="power_type">Power Density Type</Label>
                <Select 
                  name="power_type" 
                  value={formValues.power_type}
                  onValueChange={(value) => {
                    handleFieldClick("power_type");
                    handleInputChange("power_type", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select power density..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="650">Overhead South (650 kWp/ha)</SelectItem>
                    <SelectItem value="750">Overhead EW (750 kWp/ha)</SelectItem>
                    <SelectItem value="400">Inter Space (400 kWp/ha)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button type="submit" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              🔍 Calculate Feasibility
            </Button>
            {results && <Button variant="outline" onClick={handleClear}>Clear</Button>}
          </div>
        </form>

        {results && (
          <div className="mt-6 p-6 bg-muted/50 rounded-lg space-y-3">
            <h4 className="font-bold text-lg flex items-center gap-2">
              {results.isFeasible ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  ✅ Feasible
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  ❌ Not Feasible
                </>
              )}
            </h4>
            
            {results.isFeasible ? (
              <div className="space-y-2 text-sm">
                <p>📈 <strong>R-Value:</strong> {results.rValue.toFixed(2)}</p>
                <p>🌱 <strong>Crop Suitability:</strong> {results.cropSuitability}%</p>
                <p>⚡ <strong>AgriPV Potential:</strong> {results.potential.toFixed(2)} kWp</p>
              </div>
            ) : (
              <p className="text-sm">One or more restriction criteria not met.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function AgriPVFeasibilityPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AgriPV Feasibility Calculator"
        description="Assess the feasibility of implementing AgriPV systems on your agricultural land."
      />
      
      <AgriPVFeasibilityCalculator />
    </div>
  )
} 