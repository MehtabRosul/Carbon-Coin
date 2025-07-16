"use client"

import * as React from "react"
import { Bar, BarChart, Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, Leaf, Car, Droplets, Flame, Zap } from "lucide-react"

const chartData = [
  { month: "January", savings: 186 },
  { month: "February", savings: 305 },
  { month: "March", savings: 237 },
  { month: "April", savings: 273 },
  { month: "May", savings: 209 },
  { month: "June", savings: 214 },
]

const chartConfig = {
  savings: {
    label: "CO₂e Saved (kg)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const categoryData = [
    { category: "AgriCarbon", savings: 1250, fill: "var(--chart-1)" },
    { category: "Solar", savings: 850, fill: "var(--chart-2)" },
    { category: "EV", savings: 450, fill: "var(--chart-3)" },
    { category: "Drip Irrigation", savings: 600, fill: "var(--chart-4)" },
    { category: "Biogas", savings: 300, fill: "var(--chart-5)" },
]

const categoryChartConfig = {
    savings: {
        label: "CO₂e Saved (kg)",
    },
    AgriCarbon: {
        label: "AgriCarbon",
        color: "hsl(var(--chart-1))",
    },
    Solar: {
        label: "Solar",
        color: "hsl(var(--chart-2))",
    },
    EV: {
        label: "EV",
        color: "hsl(var(--chart-3))",
    },
    "Drip Irrigation": {
        label: "Drip Irrigation",
        color: "hsl(var(--chart-4))",
    },
    Biogas: {
        label: "Biogas",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig


const recentActivities = [
  { id: "ACT-001", type: "AgriCarbon", amount: 250, date: "2023-10-26", icon: <Leaf className="h-4 w-4" /> },
  { id: "ACT-002", type: "Solar", amount: 120, date: "2023-10-25", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "ACT-003", type: "EV", amount: 75, date: "2023-10-24", icon: <Car className="h-4 w-4" /> },
  { id: "ACT-004", type: "Drip Irrigation", amount: 50, date: "2023-10-22", icon: <Droplets className="h-4 w-4" /> },
  { id: "ACT-005", type: "Biogas", amount: 30, date: "2023-10-21", icon: <Flame className="h-4 w-4" /> },
]

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Here's an overview of your carbon savings."
      >
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total CO₂e Saved</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,450 kg</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AgriCarbon Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250 kg</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intervention Savings</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,200 kg</div>
            <p className="text-xs text-muted-foreground">+25% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Interventions</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Savings Overview</CardTitle>
            <CardDescription>Your total CO₂e savings over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="savings"
                  type="natural"
                  fill="var(--color-savings)"
                  fillOpacity={0.4}
                  stroke="var(--color-savings)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Savings by Category</CardTitle>
            <CardDescription>Breakdown of savings by intervention type.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryChartConfig} className="h-[250px] w-full">
                <BarChart accessibilityLayer data={categoryData} layout="vertical" margin={{ left: 10 }}>
                    <YAxis
                        dataKey="category"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => categoryChartConfig[value as keyof typeof categoryChartConfig]?.label}
                    />
                    <XAxis dataKey="savings" type="number" hide />
                    <Tooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="savings" layout="vertical" radius={5} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>A log of your most recent carbon-saving entries.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>CO₂e Saved (kg)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Entry ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {activity.icon}
                      <span>{activity.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">+{activity.amount}</Badge>
                  </TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell className="font-mono text-xs">{activity.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
