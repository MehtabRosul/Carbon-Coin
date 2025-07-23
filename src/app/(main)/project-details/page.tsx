
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
import { Separator } from "@/components/ui/separator"
import L from 'leaflet'
import 'leaflet.locatecontrol'
// @ts-ignore
import 'leaflet-control-geocoder'

// Leaflet's CSS is included in layout.tsx to avoid direct import here

export default function ProjectDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [projectName, setProjectName] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [latitude, setLatitude] = React.useState<number | null>(null)
  const [longitude, setLongitude] = React.useState<number | null>(null)

  const mapRef = React.useRef<L.Map | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const markerRef = React.useRef<L.Marker | null>(null)

  React.useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    // 1) Initialize map
    mapRef.current = L.map(containerRef.current).setView([20.59, 78.96], 5)

    // 2) Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current)

    const updateCoords = (lat: number, lng: number) => {
        setLatitude(lat);
        setLongitude(lng);
        if (mapRef.current) {
            const newLatLng = L.latLng(lat, lng);
            mapRef.current.setView(newLatLng, 15);
            if (markerRef.current) {
                markerRef.current.setLatLng(newLatLng);
            } else {
                markerRef.current = L.marker(newLatLng).addTo(mapRef.current);
            }
        }
    }

    // 3) Geolocate control
    // @ts-ignore
    L.control.locate({
        flyTo: true,
        onLocationError: console.error
    }).addTo(mapRef.current)
        .on('locationfound', (e: any) => {
            updateCoords(e.latitude, e.longitude);
        });
    
    // 4) Click to pick
    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        updateCoords(e.latlng.lat, e.latlng.lng);
    });

    // 5) Address search box
    // @ts-ignore
    L.Control.geocoder({
        defaultMarkGeocode: false
    })
    .on('markgeocode', (e: any) => {
        const { center } = e.geocode;
        updateCoords(center.lat, center.lng);
    })
    .addTo(mapRef.current);

    return () => {
        mapRef.current?.remove();
        mapRef.current = null;
    }
  }, [])


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
      projectDetails: {
        projectName,
        location,
        latitude,
        longitude,
      }
    }

    let dbRef;
    const anonId = searchParams.get('anonId');
    const uid = searchParams.get('uid');

    if (user && uid) {
        dbRef = ref(db, `users/${uid}`);
    } else if (anonId) {
        dbRef = ref(db, `anonymousUsers/${anonId}`);
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
      await update(dbRef, projectData);
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
            <Separator />
            <div className="space-y-4">
                <CardTitle className="font-headline text-lg">Plot Location</CardTitle>
                 <CardDescription>
                    Search for an address, use your current location, or click on the map to select your plot.
                 </CardDescription>
                <div ref={containerRef} className="h-80 w-full rounded-md border" />
                {latitude !== null && longitude !== null && (
                    <div className="text-sm text-muted-foreground">
                        <p>
                           Selected Latitude: <strong>{latitude.toFixed(6)}</strong>
                        </p>
                        <p>
                           Selected Longitude: <strong>{longitude.toFixed(6)}</strong>
                        </p>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-8">
          <Button size="lg" onClick={handleSaveAndContinue}>
            Save &amp; Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
