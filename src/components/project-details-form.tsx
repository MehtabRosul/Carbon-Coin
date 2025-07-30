
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { ref, update, get } from "firebase/database"
import { Separator } from "@/components/ui/separator"
import { encryptLocation, hashData, isCryptoSupported } from "@/lib/crypto"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Leaflet's CSS is included in layout.tsx to avoid direct import here

function toFirebaseKey(num: number) {
  return num.toString().replace(/\./g, 'd');
}

export default function ProjectDetailsForm() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [projectName, setProjectName] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [latitude, setLatitude] = React.useState<number | null>(null)
  const [longitude, setLongitude] = React.useState<number | null>(null)
  const [manualLatitude, setManualLatitude] = React.useState("")
  const [manualLongitude, setManualLongitude] = React.useState("")

  const mapRef = React.useRef<L.Map | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const markerRef = React.useRef<L.Marker | null>(null)

  const updateCoordsRef = React.useRef<(lat: number, lng: number) => void>(() => {});

  React.useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    // Dynamically import leaflet and plugins
    import('leaflet').then(L => {
      // These need to be required here to ensure they run on the client
      require('leaflet.locatecontrol')
      // @ts-ignore
      require('leaflet-control-geocoder')
      
      if (!containerRef.current || mapRef.current) return;

      // 1) Initialize map
      mapRef.current = L.map(containerRef.current, { attributionControl: false }).setView([20.59, 78.96], 5)

      // 2) Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current)

      const updateCoords = (lat: number, lng: number) => {
          setLatitude(lat);
          setLongitude(lng);
          setManualLatitude(lat.toFixed(6));
          setManualLongitude(lng.toFixed(6));
          if (mapRef.current) {
              const newLatLng = L.latLng(lat, lng);
              mapRef.current.flyTo(newLatLng, 15);
              if (markerRef.current) {
                  markerRef.current.setLatLng(newLatLng);
              } else {
                  markerRef.current = L.marker(newLatLng).addTo(mapRef.current);
              }
          }
      }
      updateCoordsRef.current = updateCoords;

      // 3) Geolocate control
      // @ts-ignore
      const locateControl = L.control.locate({
          flyTo: true,
          onLocationError: () => {
            toast({
              title: "Location Not Found",
              description: "Could not find your location. Please search manually.",
              variant: "destructive"
            })
          }
      }).addTo(mapRef.current);
      
      mapRef.current.on('locationfound', (e: any) => {
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
    });

    return () => {
        mapRef.current?.remove();
        mapRef.current = null;
    }
  }, [toast])

  const handleManualSearch = () => {
    const lat = parseFloat(manualLatitude)
    const lon = parseFloat(manualLongitude)

    if (!isNaN(lat) && !isNaN(lon)) {
        updateCoordsRef.current(lat, lon);
    } else {
        toast({
            title: "Invalid Coordinates",
            description: "Please enter valid numbers for latitude and longitude.",
            variant: "destructive"
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

    // Check if coordinates are selected
    if (latitude === null || longitude === null) {
      toast({
        title: "Location Required",
        description: "Please select a location on the map or enter coordinates.",
        variant: "destructive",
      })
      return
    }

    // Check if crypto is supported
    if (!isCryptoSupported()) {
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support encryption. Please use a modern browser.",
        variant: "destructive",
      })
      return
    }

    try {
      // Encrypt the location coordinates
      const encryptedLocation = await encryptLocation(latitude, longitude);
      
      // Generate hash for duplicate detection
      const locationHash = await hashData(encryptedLocation.data);
      
      const latKey = toFirebaseKey(latitude);
      const lngKey = toFirebaseKey(longitude);
      const coordinateKey = `${latKey}_${lngKey}`;

      // Check for duplicate coordinates using exact lat/long values
      const coordinatesRef = ref(db, `coordinates/${coordinateKey}`);
      const coordinatesSnapshot = await get(coordinatesRef);
      
      if (coordinatesSnapshot.exists()) {
        toast({
          title: "Coordinates Already Taken",
          description: "These exact coordinates are already registered by another user. Please select a different location.",
          variant: "destructive",
        })
        return
      }

      // Check for duplicate locations globally (any user) - keep existing hash check
      const globalLocationRef = ref(db, `locations/${locationHash}`);
      const globalLocationSnapshot = await get(globalLocationRef);
      
      if (globalLocationSnapshot.exists()) {
        toast({
          title: "Location Already Taken",
          description: "This plot location is already registered by another user. Please select a different location.",
          variant: "destructive",
        })
        return
      }



      let userPath;
      let queryString = '';

      if (user && user.uid) {
          userPath = `users/${user.uid}`;
          queryString = `?uid=${user.uid}`;
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

      // Prepare updates for atomic operation
      const updates: { [key: string]: any } = {};
      
      // Update user data - preserve existing data and add project details
      updates[`/${userPath}/projectDetails`] = {
        projectName,
        location,
        latitude: latitude,  // Store exact lat value
        longitude: longitude, // Store exact lng value
        encryptedLocation: encryptedLocation.data,
        locationIV: encryptedLocation.iv,
        keyVersion: encryptedLocation.keyVersion,
      };
      
      // Track exact coordinates usage (prevents any other user from using same lat/lng)
      updates[`/coordinates/${coordinateKey}`] = {
        userId: user?.uid || 'anonymous',
        timestamp: Date.now(),
        projectName: projectName,
        latitude: latitude,
        longitude: longitude
      };
      
      // Track global location usage (prevents any other user from using same coordinates)
      updates[`/locations/${locationHash}`] = {
        userId: user?.uid || 'anonymous',
        timestamp: Date.now(),
        projectName: projectName
      };

      // Save both user data and location hash atomically
      await update(ref(db), updates);
      
      toast({
        title: "Success!",
        description: "Project details saved successfully.",
      })
      
      // Navigate without exposing UID in URL
      router.push('/onboarding')
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save project details. Please try again.",
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
                    Search for an address, use your current location, or click on the map to select your plot. You can also enter coordinates manually.
                 </CardDescription>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="manualLat">Latitude</Label>
                        <Input id="manualLat" type="number" placeholder="e.g. 28.6139" value={manualLatitude} onChange={e => setManualLatitude(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="manualLon">Longitude</Label>
                        <Input id="manualLon" type="number" placeholder="e.g. 77.2090" value={manualLongitude} onChange={e => setManualLongitude(e.target.value)} />
                    </div>
                    <Button onClick={handleManualSearch} className="self-end">Search</Button>
                </div>

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

    
