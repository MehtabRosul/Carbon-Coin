"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome to your Carbon Coin dashboard."
      />
      <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg bg-card">
        <p className="text-muted-foreground">Your dashboard is ready to be built.</p>
      </div>
    </>
  )
}
