
"use client"

import * as React from "react"
import { Phone, Mail, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { ref, set, push } from "firebase/database"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function StartPage() {
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [name, setName] = React.useState("")

  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleContinue = async () => {
    const dataToSave = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    };

    if (!dataToSave.name && !dataToSave.phone && !dataToSave.email) {
      toast({ title: "Input Required", description: "Please enter at least one detail.", variant: "destructive" })
      return
    }

    try {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        await set(userRef, dataToSave);
        router.push(`/project-details?uid=${user.uid}`);
      } else {
        const anonUsersRef = ref(db, 'anonymousUsers');
        const newAnonUserRef = push(anonUsersRef);
        await set(newAnonUserRef, dataToSave);
        router.push(`/project-details?anonId=${newAnonUserRef.key}`);
      }
      toast({
        title: "Details Saved",
        description: "Your information has been stored successfully. Now, let's get your project details.",
      });
    } catch (error) {
      console.error("Firebase error:", error);
      toast({
        title: "Save Failed",
        description: "Could not save your details. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <PageHeader
          title="Your Journey to Impact Starts Here"
          description="By providing your details, you're taking the first step towards accurately measuring and understanding your environmental impact."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <Card
            className={cn(
              "flex flex-col cursor-pointer transition-all"
            )}
          >
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline">Company</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="space-y-4 flex-grow">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" type="text" placeholder="Enter your company name" value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "flex flex-col cursor-pointer transition-all"
            )}
          >
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
                  <Input id="phone" type="tel" placeholder="Enter your phone number" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card
            className={cn(
              "flex flex-col cursor-pointer transition-all"
            )}
          >
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
                  <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-8">
            <Button size="lg" onClick={handleContinue}>Continue</Button>
        </div>

        <div className="text-center mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-headline font-bold">Personalize Your Experience</h2>
          <p className="text-muted-foreground mt-3">
             Choose one of the options below to start your Carbon Coin journey. This information allows Carbon Coin to prepare a personalized dashboard for you. After this step, you'll be able to explore our powerful calculators and visualization tools.
          </p>
        </div>
      </div>
    </div>
  )
}
