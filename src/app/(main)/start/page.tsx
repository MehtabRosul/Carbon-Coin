
"use client"

import * as React from "react"
import { Phone, Mail, User as UserIcon, CheckCircle } from "lucide-react"
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

type SelectedOption = "newUser" | "phone" | "email"

export default function StartPage() {
  const [selectedOption, setSelectedOption] = React.useState<SelectedOption>("newUser")
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
        // Logged-in user
        const userRef = ref(db, `users/${user.uid}/startProfile`);
        await set(userRef, dataToSave);
      } else {
        // Anonymous user - always create a new entry with a unique ID
        const anonUsersRef = ref(db, 'anonymousUsers');
        const newAnonUserRef = push(anonUsersRef);
        await set(newAnonUserRef, dataToSave);
      }
      toast({
        title: "Details Saved",
        description: "Your information has been stored successfully.",
      });
      // Optionally, clear fields and navigate away
      setPhone("");
      setEmail("");
      setName("");
      router.push('/onboarding');
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
          title="How would you like to begin?"
          description="Choose one of the options below to start your Carbon Coin journey."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <Card
            className={cn(
              "flex flex-col cursor-pointer transition-all",
              selectedOption === "newUser" ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"
            )}
            onClick={() => setSelectedOption("newUser")}
          >
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <UserIcon className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline">New User</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="space-y-4 flex-grow">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} onClick={() => setSelectedOption("newUser")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "flex flex-col cursor-pointer transition-all",
              selectedOption === "phone" ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"
            )}
            onClick={() => setSelectedOption("phone")}
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
                  <Input id="phone" type="tel" placeholder="Enter your phone number" value={phone} onChange={e => setPhone(e.target.value)} onClick={() => setSelectedOption("phone")} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card
            className={cn(
              "flex flex-col cursor-pointer transition-all",
              selectedOption === "email" ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"
            )}
            onClick={() => setSelectedOption("email")}
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
                  <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} onClick={() => setSelectedOption("email")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-8">
            <Button size="lg" onClick={handleContinue}>Continue</Button>
        </div>
      </div>
    </div>
  )
}
