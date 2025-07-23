
"use client"

import * as React from "react"
import { Phone, Mail, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"

export default function StartPage() {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <PageHeader
          title="How would you like to begin?"
          description="Choose one of the options below to start your Carbon Coin journey."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <Card
            className="flex flex-col items-center justify-center text-center p-8 hover:bg-accent/50 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleNavigation("/login?method=phone")}
          >
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Phone className="h-10 w-10 text-primary" />
            </div>
            <CardHeader className="p-0">
              <CardTitle className="font-headline">Phone</CardTitle>
            </CardHeader>
          </Card>
          
          <Card
            className="flex flex-col items-center justify-center text-center p-8 hover:bg-accent/50 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleNavigation("/login")}
          >
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <CardHeader className="p-0">
              <CardTitle className="font-headline">Email</CardTitle>
            </CardHeader>
          </Card>

          <Card
            className="flex flex-col items-center justify-center text-center p-8 hover:bg-accent/50 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleNavigation("/signup")}
          >
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <User className="h-10 w-10 text-primary" />
            </div>
            <CardHeader className="p-0">
              <CardTitle className="font-headline">New User</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
