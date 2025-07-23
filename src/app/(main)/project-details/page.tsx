
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
import { Map, MapMarker } from "maplibre-gl"
import 'maplibre-gl/dist/maplibre-gl.css';
import { Separator } from "@/components/ui/separator"
import { Target } from "lucide-react"

export default function ProjectDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [projectName, setProjectName] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [latitude, setLatitude] = React.useState("")
  const [longitude, setLongitude] = React.useState("")

  const mapContainer = React.useRef<HTMLDivElement>(null)
  const map = React.useRef<Map | null>(null)
  const marker = React.useRef<MapMarker | null>(null)

  const updateMap = (lon: number, lat: number) => {
    if (map.current) {
        map.current.setCenter([lon, lat]);
        if (marker.current) {
            marker.current.setLngLat([lon, lat]);
        } else {
            marker.current = new MapMarker().setLngLat([lon, lat]).addTo(map.current);
        }
    }
  }

  React.useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [77.5946, 12.9716], // Default to Bangalore
        zoom: 9
    });

     map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        setLongitude(lng.toString());
        setLatitude(lat.toString());
        updateMap(lng, lat);
    });

    return () => {
        map.current?.remove();
    };
  }, []);

  const handleFetchLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { longitude: lon, latitude: lat } = position.coords;
            setLongitude(lon.toString());
            setLatitude(lat.toString());
            updateMap(lon, lat);
        }, (error) => {
            toast({
                title: "Location Error",
                description: "Could not fetch your location. Please enable location services or enter it manually.",
                variant: "destructive"
            })
        })
    }
  }

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
        latitude: parseFloat(latitude) || null,
        longitude: parseFloat(longitude) || null,
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
  
  React.useEffect(() => {
    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);
    if (!isNaN(lon) && !isNaN(lat)) {
        updateMap(lon, lat);
    }
  }, [latitude, longitude])


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
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label htmlFor="latitude">Latitude</Label>
                         <Input id="latitude" placeholder="e.g., 12.9716" value={latitude} onChange={e => setLatitude(e.target.value)} />
                     </div>
                     <div className="space-y-2">
                         <Label htmlFor="longitude">Longitude</Label>
                         <Input id="longitude" placeholder="e.g., 77.5946" value={longitude} onChange={e => setLongitude(e.target.value)} />
                     </div>
                 </div>
                 <Button variant="outline" onClick={handleFetchLocation}>
                    <Target className="mr-2" /> Use My Location
                 </Button>
                <div ref={mapContainer} className="h-64 w-full rounded-md border" />
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
