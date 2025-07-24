
"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"

export default function DashboardPage() {
    return (
    <>
      <PageHeader
        title="AgriPV Calculator"
        description="Model the carbon savings from Agri-PV projects."
      />
      <div className="grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Agri-PV Carbon Savings</CardTitle>
                <CardDescription>Enter the details of your Agri-PV installation to calculate the estimated CO₂e savings.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>AgriPV Calculator form will be here.</p>
            </CardContent>
        </Card>
      </div>
    </>
  )
}
