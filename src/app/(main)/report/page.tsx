
"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase"
import { ref, get } from "firebase/database"
import { decryptLocation, isCryptoSupported } from "@/lib/crypto"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import html2canvas from "html2canvas"
import { Download } from "lucide-react"
import { Logo } from "@/components/logo"

import { SDG_ICON_URLS, FALLBACK_URLS } from "@/components/sdg-icons"

interface UserData {
  name?: string;
  projectDetails?: {
    projectName?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    encryptedLocation?: string;
    locationIV?: string;
    keyVersion?: string;
  };
  calculations?: {
    solarCarbon?: {
      results: Array<{
        name: string;
        capacity: string;
        energy: string;
        emission: string;
        credits: number;
      }>;
      totalCredits: number;
      timeframe: string;
    };
    dripIrrigation?: {
      totalSavings: number;
    };
    socSequestration?: {
      co2e: number;
    };
  };
  agriCarbonPlots?: {
    [key: string]: {
      plotId: string;
      co2e: number;
    }
  }
}

function ReportSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                 <Skeleton className="h-10 w-48" />
                 <Skeleton className="h-10 w-32" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                         <Skeleton className="h-48 w-full" />
                         <Skeleton className="h-48 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


function ReportPageContent() {
  const { user, loading: authLoading } = useAuth()
  const [userData, setUserData] = React.useState<UserData | null>(null)
  const [decryptedCoordinates, setDecryptedCoordinates] = React.useState<{latitude: number, longitude: number} | null>(null)
  const [loading, setLoading] = React.useState(true)
  const { toast } = useToast()
  const reportRef = React.useRef<HTMLDivElement>(null)

  const getDbPath = React.useCallback(() => {
    // Use only authenticated user data
    if (user?.uid) return `users/${user.uid}`;
    return null;
  }, [user]);

  React.useEffect(() => {
    const fetchData = async () => {
      const dbPath = getDbPath();
      if (!dbPath || authLoading) return;

      setLoading(true);
      try {
        const userRef = ref(db, dbPath);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          
          // Decrypt location data if it exists
          if (data.projectDetails?.encryptedLocation && data.projectDetails?.locationIV) {
            try {
              if (isCryptoSupported()) {
                const coordinates = await decryptLocation(
                  data.projectDetails.encryptedLocation,
                  data.projectDetails.locationIV,
                  data.projectDetails.keyVersion || 'v1'
                );
                setDecryptedCoordinates(coordinates);
              } else {
                // Fallback to unencrypted data if crypto not supported
                if (data.projectDetails.latitude && data.projectDetails.longitude) {
                  setDecryptedCoordinates({
                    latitude: data.projectDetails.latitude,
                    longitude: data.projectDetails.longitude
                  });
                }
              }
            } catch (decryptError) {
              console.error("Decryption failed:", decryptError);
              // Fallback to unencrypted data
              if (data.projectDetails.latitude && data.projectDetails.longitude) {
                setDecryptedCoordinates({
                  latitude: data.projectDetails.latitude,
                  longitude: data.projectDetails.longitude
                });
              }
            }
          } else if (data.projectDetails?.latitude && data.projectDetails?.longitude) {
            // Handle legacy unencrypted data
            setDecryptedCoordinates({
              latitude: data.projectDetails.latitude,
              longitude: data.projectDetails.longitude
            });
          }
        } else {
          toast({ title: "No Data Found", description: "Could not find any data for this user.", variant: "destructive" });
        }
      } catch (error) {
        console.error("Firebase error:", error);
        toast({ title: "Error Fetching Data", description: "Could not fetch user data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    if(!authLoading) {
      fetchData();
    }
  }, [getDbPath, authLoading, toast]);
  
  const handleDownload = async () => {
    const reportElement = reportRef.current;
    if (!reportElement) {
        toast({ title: "Error", description: "Could not find report content to download.", variant: "destructive" });
        return;
    }

    // Show loading state
    toast({ title: "Generating PDF", description: "Please wait while we prepare your report..." });

    try {
        // Pre-load all images before generating PDF
        const images = reportElement.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map(img => {
            return new Promise((resolve) => {
              if (img.complete) {
                resolve(null);
              } else {
                img.onload = () => resolve(null);
                img.onerror = () => resolve(null);
              }
            });
          })
        );

        // Wait additional time for any remaining images
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const canvas = await html2canvas(reportElement, { 
            scale: 2, 
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 15000, // 15 seconds timeout for images
            onclone: (clonedDoc) => {
              // Ensure all images in the cloned document are loaded
              const clonedImages = clonedDoc.querySelectorAll('img');
              clonedImages.forEach(img => {
                if (img.src.includes('via.placeholder.com')) {
                  // Use fallback for placeholder images
                  img.crossOrigin = 'anonymous';
                }
              });
            }
        });
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            floatPrecision: 16
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const ratio = canvasWidth / canvasHeight;
        const widthInPdf = pdfWidth - 20;
        const heightInPdf = widthInPdf / ratio;

        pdf.addImage(imgData, 'PNG', 10, 10, widthInPdf, heightInPdf);

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `CarbonCoin-Report-${timestamp}.pdf`;
        
        pdf.save(filename);
        
        toast({ 
            title: "PDF Downloaded", 
            description: `Your report has been saved as ${filename}` 
        });

    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({ 
            title: "Download Failed", 
            description: "Could not generate PDF. Please try again or contact support.", 
            variant: "destructive" 
        });
    }
  };

  if (loading || authLoading) {
    return <ReportSkeleton />;
  }
  
  if (!userData) {
      return (
          <PageHeader title="Report" description="No data available to generate a report." />
      )
  }
  
  const { name, projectDetails, calculations, agriCarbonPlots } = userData;
  const interventions: string[] = [];
  const hasAgriPV = calculations?.solarCarbon?.results || calculations?.dripIrrigation;
  const hasSOC = calculations?.socSequestration || (agriCarbonPlots && Object.keys(agriCarbonPlots).length > 0);

  if (hasAgriPV) interventions.push("AgriPV");
  if (hasSOC) interventions.push("SOC");

  const totalAgriCarbonCo2e = agriCarbonPlots ? Object.values(agriCarbonPlots).reduce((sum, plot) => sum + plot.co2e, 0) : 0;
  
  const getActiveSdgs = () => {
    const active = new Set<number>();

    // Rule 7: Always active in report
    active.add(8);
    active.add(12);
    active.add(13);
    active.add(17);

    // Rule 1: Project registration
    if (projectDetails?.projectName) {
      active.add(9);
      active.add(17);
    }
    
    // Rule 6: Location details
    if (projectDetails?.latitude && projectDetails?.longitude && projectDetails?.location) {
      active.add(9);
      active.add(16);
    }
    
    // Rule 2: SOC calculation
    if (calculations?.socSequestration?.co2e || totalAgriCarbonCo2e > 0) {
        active.add(13);
        active.add(15);
    }
    
    // Rule 3: Drip irrigation
    if (calculations?.dripIrrigation?.totalSavings) {
        active.add(6);
        active.add(12);
    }
    
    // Rule 4: AgriPV (solar, agro, bio)
    if (calculations?.solarCarbon?.results) {
        const hasSolar = calculations.solarCarbon.results.some(r => r.name.includes('Solar'));
        const hasAgro = calculations.solarCarbon.results.some(r => r.name.includes('Agroforestry'));
        const hasBiomass = calculations.solarCarbon.results.some(r => r.name.includes('Biomass'));
        
        if (hasSolar || hasAgro || hasBiomass) {
            active.add(7);
            active.add(13);
        }
    }
    
    // Rule 5: Wind calculation
    if (calculations?.solarCarbon?.results?.some(r => r.name.includes('Wind'))) {
        active.add(7);
        active.add(13);
    }
    
    return active;
  }
  
  const activeSdgs = getActiveSdgs();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-5xl">
       <PageHeader title="Generated Report">
            <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Report
            </Button>
        </PageHeader>
      </div>
      
      <div id="report-container" className="flex justify-center bg-muted/30 p-4 sm:p-8 rounded-lg w-full">
        <div ref={reportRef} className="bg-card text-card-foreground shadow-lg" style={{ width: '210mm', minHeight: '297mm', padding: '15mm'}}>
          <div id="report-content" style={{fontFamily: 'Alegreya, serif'}}>
              <header className="flex items-center justify-between pb-4 border-b-2 border-primary">
                  <Logo />
                  <h1 className="text-3xl font-headline font-bold text-primary">Carbon Impact Report</h1>
              </header>
              <main className="mt-8">
                  <p className="text-base leading-relaxed text-justify">
                      The Company <strong>{name || 'N/A'}</strong> is working on {interventions.length > 0 ? interventions.join(' and ') : 'carbon reduction initiatives'}. The project name is <strong>{projectDetails?.projectName || 'N/A'}</strong> and the address is <strong>{projectDetails?.location || 'N/A'}</strong>. The location coordinates are Latitude: <strong>{decryptedCoordinates?.latitude?.toFixed(6) || 'N/A'}</strong>, Longitude: <strong>{decryptedCoordinates?.longitude?.toFixed(6) || 'N/A'}</strong>. This project is expected to generate carbon credits, impacting Sustainable Development Goals.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-8">
                      <Card className="col-span-1 border">
                          <CardHeader>
                              <CardTitle className="font-headline">AgriPV & Irrigation</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                              {calculations?.solarCarbon?.results ? (
                                <>
                                  {calculations.solarCarbon.results.map((result, index) => (
                                    <p key={index}>{result.name}: <strong>{result.credits.toFixed(2)} tCO₂e</strong></p>
                                  ))}
                                  <hr className="my-2" />
                                  <p className="font-bold pt-2">Total Carbon Credits: <strong>{calculations.solarCarbon.totalCredits?.toFixed(2) || '0.00'} tCO₂e {calculations.solarCarbon.timeframe}</strong></p>
                                </>
                              ) : (
                                <>
                                  <p>Solar: <strong>0.00 tCO₂e</strong></p>
                                  <p>Agroforestry: <strong>0.00 tCO₂e</strong></p>
                                  <p>Drip Irrigation: <strong>{calculations?.dripIrrigation?.totalSavings?.toFixed(2) || '0.00'} tCO₂e</strong></p>
                                </>
                              )}
                          </CardContent>
                      </Card>

                       <Card className="col-span-1 border">
                          <CardHeader>
                              <CardTitle className="font-headline">Soil Organic Carbon</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                               <p>SOC Sequestration: <strong>{calculations?.socSequestration?.co2e?.toFixed(2) || '0.00'} tCO₂e</strong></p>
                               <hr className="my-2" />
                               <div className="font-bold">AgriCarbon Plots:</div>
                               {agriCarbonPlots && Object.keys(agriCarbonPlots).length > 0 ? Object.values(agriCarbonPlots).map(plot => (
                                   <div key={plot.plotId} className="flex justify-between">
                                       <span>Plot {plot.plotId}:</span>
                                       <strong>{plot.co2e.toFixed(2)} tCO₂e</strong>
                                   </div>
                               )) : <p>No plots added.</p>}
                               <hr className="my-2"/>
                               <p className="font-bold pt-2">Total from Plots: <strong>{totalAgriCarbonCo2e.toFixed(2)} tCO₂e</strong></p>
                          </CardContent>
                      </Card>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t-2 border-muted">
                    <h3 className="text-xl font-headline font-bold text-center mb-4">Sustainable Development Goals Impacted</h3>
                    <div className="grid grid-cols-9 gap-2">
                      {SDG_ICON_URLS.map((url, index) => {
                          const sdgNumber = index + 1;
                          const isActive = activeSdgs.has(sdgNumber);
                          const fallbackUrl = FALLBACK_URLS[index];
                          return (
                              <div key={sdgNumber} className="relative">
                                <img
                                  src={url}
                                  alt={`SDG ${sdgNumber}`}
                                  className={`aspect-square w-12 h-12 ${isActive ? '' : 'opacity-20 grayscale'}`}
                                  loading="lazy"
                                  onError={(e) => {
                                    console.warn(`Failed to load SDG ${sdgNumber} icon, using fallback`);
                                    // Use fallback image
                                    const img = e.target as HTMLImageElement;
                                    img.src = fallbackUrl;
                                  }}
                                />
                              </div>
                          );
                      })}
                    </div>
                  </div>
              </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReportPage() {
    return (
        <React.Suspense fallback={<ReportSkeleton />}>
            <ReportPageContent />
        </React.Suspense>
    )
}
