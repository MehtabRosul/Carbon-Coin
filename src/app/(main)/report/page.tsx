
"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { ref, get } from "firebase/database"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Logo } from "@/components/logo"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import { useToast } from "@/hooks/use-toast"
import html2canvas from "html2canvas"

interface UserData {
  name?: string;
  projectDetails?: {
    projectName?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
  };
  calculations?: {
    solarCarbon?: {
      results: {
        solar: number;
        agro: number;
        drip: number;
        bio: number;
        ev: number;
        total: number;
      }
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
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [userData, setUserData] = React.useState<UserData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const { toast } = useToast()
  const reportRef = React.useRef<HTMLDivElement>(null)

  const getDbPath = React.useCallback(() => {
    const uid = searchParams.get('uid');
    const anonId = searchParams.get('anonId');
    if (user?.uid) return `users/${user.uid}`;
    if (uid) return `users/${uid}`;
    if (anonId) return `anonymousUsers/${anonId}`;
    return null;
  }, [user, searchParams]);

  React.useEffect(() => {
    const fetchData = async () => {
      const dbPath = getDbPath();
      if (!dbPath || authLoading) return;

      setLoading(true);
      try {
        const userRef = ref(db, dbPath);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserData(snapshot.val());
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

    try {
        const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts:true,
            floatPrecision: 16
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const ratio = canvasWidth / canvasHeight;
        const widthInPdf = pdfWidth - 20; // with margin
        const heightInPdf = widthInPdf / ratio;

        pdf.addImage(imgData, 'PNG', 10, 10, widthInPdf, heightInPdf);
        pdf.save('CarbonCoin-Report.pdf');

    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({ title: "Download Failed", description: "Could not generate PDF for download.", variant: "destructive" });
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
  const hasAgriPV = calculations?.solarCarbon || calculations?.dripIrrigation;
  const hasSOC = calculations?.socSequestration || (agriCarbonPlots && Object.keys(agriCarbonPlots).length > 0);

  if (hasAgriPV) interventions.push("AgriPV");
  if (hasSOC) interventions.push("SOC");

  const totalAgriCarbonCo2e = agriCarbonPlots ? Object.values(agriCarbonPlots).reduce((sum, plot) => sum + plot.co2e, 0) : 0;


  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <PageHeader title="Generated Report">
            <Button onClick={handleDownload} disabled={!reportRef.current}>
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
                      The Company <strong>{name || 'N/A'}</strong> is working on {interventions.length > 0 ? interventions.join(' and ') : 'carbon reduction initiatives'}. The project name is <strong>{projectDetails?.projectName || 'N/A'}</strong> and the address is <strong>{projectDetails?.location || 'N/A'}</strong>. The location coordinates are Latitude: <strong>{projectDetails?.latitude?.toFixed(6) || 'N/A'}</strong>, Longitude: <strong>{projectDetails?.longitude?.toFixed(6) || 'N/A'}</strong>. This project is expected to generate carbon credits, impacting Sustainable Development Goals.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-8">
                      <Card className="col-span-1">
                          <CardHeader>
                              <CardTitle className="font-headline">AgriPV & Irrigation</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                              <p>Solar: <strong>{calculations?.solarCarbon?.results.solar?.toFixed(2) || '0.00'} tCO₂e</strong></p>
                              <p>Agroforestry: <strong>{calculations?.solarCarbon?.results.agro?.toFixed(2) || '0.00'} tCO₂e</strong></p>
                              <p>Biogas: <strong>{calculations?.solarCarbon?.results.bio?.toFixed(2) || '0.00'} tCO₂e</strong></p>
                              <p>EV Savings: <strong>{calculations?.solarCarbon?.results.ev?.toFixed(2) || '0.00'} tCO₂e</strong></p>
                              <hr className="my-2" />
                              <p className="font-bold pt-2">Total Agri-PV: <strong>{calculations?.solarCarbon?.results.total?.toFixed(2) || '0.00'} tCO₂e</strong></p>
                              <hr className="my-2" />
                              <p>Drip Irrigation: <strong>{calculations?.dripIrrigation?.totalSavings?.toFixed(2) || '0.00'} tCO₂e</strong></p>
                          </CardContent>
                      </Card>

                       <Card className="col-span-1">
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

    