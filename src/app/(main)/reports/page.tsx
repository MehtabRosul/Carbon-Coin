"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { ref, push, set, onValue, serverTimestamp, get } from "firebase/database"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  userId: string;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [reports, setReports] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchReports = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          // Process reports data
          setReports([userData]); // Simplified for now
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  const handleGenerateReport = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to generate a report.",
        variant: "destructive",
      });
      return;
    }
    
    // Instead of creating a report here, we navigate to the start of the flow
    router.push('/start');

  };

  return (
    <>
      <PageHeader
        title="Reports"
        description="View and download reports of your carbon savings data."
      >
        <Button onClick={handleGenerateReport}>Start New Calculation</Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Saved Reports</CardTitle>
          <CardDescription>
            Here is a list of your previously generated reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Generated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{report.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" asChild>
                          <Link href={`/report?uid=${report.userId}&reportId=${report.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                          </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No reports generated yet. Start a calculation to create your first report.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

    