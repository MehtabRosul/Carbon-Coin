
"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { ref, update } from "firebase/database"

export default function ProjectDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [projectName, setProjectName] = React.useState("")
  const [location, setLocation] = React.useState("")

  const handleSaveAndContinue = async () => {
    if (!projectName || !location) {
      toast({
        title: "Missing Information",
        description: "Please fill out both project name and location.",
        variant: "destructive",
      })
      return
    }

    const projectData = {
      projectName,
      location,
    }

    let dbRef;
    const anonId = searchParams.get('anonId');

    if (user) {
      dbRef = ref(db, `users/${user.uid}/projectDetails`);
    } else if (anonId) {
      dbRef = ref(db, `anonymousUsers/${anonId}/projectDetails`);
    } else {
        if(!loading) {
            toast({
                title: "Error",
                description: "Could not identify user session. Please go back and start again.",
                variant: "destructive",
            });
        }
      return;
    }

    try {
      await set(dbRef, projectData);
      toast({
        title: "Project Details Saved!",
        description: "Your project information has been stored successfully.",
      })
      router.push("/onboarding")
    } catch (error) {
      console.error("Firebase error:", error);
      toast({
        title: "Save Failed",
        description: "Could not save your project details. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <PageHeader
          title="Tell Us About Your Project"
          description="Provide some basic details about your initiative."
        />
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Project Information</CardTitle>
            <CardDescription>
              This information will help us to categorize and track your carbon-saving activities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Name of Project</Label>
              <Input
                id="projectName"
                placeholder="e.g., Green Pastures Farm"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (Village/Pin/District/State)</Label>
              <Input
                id="location"
                placeholder="e.g., Anytown, 12345, Sample County, Example State"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-8">
          <Button size="lg" onClick={handleSaveAndContinue} disabled={loading}>
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
