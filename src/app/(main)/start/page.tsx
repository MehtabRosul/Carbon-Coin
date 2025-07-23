
"use client"

import * as React from "react"
import { Phone, Mail, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function StartPage() {

  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <PageHeader
          title="How would you like to begin?"
          description="Choose one of the options below to start your Carbon Coin journey."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <Card className="flex flex-col">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Phone className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline">Phone</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="space-y-4 flex-grow">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="Enter your phone number" />
                </div>
              </div>
              <Button className="mt-4 w-full">Continue</Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Mail className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline">Email</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="space-y-4 flex-grow">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
              </div>
              <Button className="mt-4 w-full">Continue</Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline">New User</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="space-y-4 flex-grow">
                <div className="space-y-2">
                  <Label htmlFor="new-email">Email Address</Label>
                  <Input id="new-email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Create a password" />
                </div>
              </div>
              <Button className="mt-4 w-full">Sign Up</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
