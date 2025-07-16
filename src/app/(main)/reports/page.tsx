"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { ref, push, set, onValue } from "firebase/database"

interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = React.useState<Report[]>([]);

  React.useEffect(() => {
    if (!user) return;
    const reportsRef = ref(db, `users/${user.uid}/reports`);
    const unsubscribe = onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reportsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setReports(reportsList);
      } else {
        setReports([]);
      }
    });

    return () => unsubscribe();
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

    const newReport: Omit<Report, 'id'> = {
      title: `Monthly Summary - ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`,
      date: new Date().toISOString().split('T')[0],
      type: "Monthly"
    };

    try {
      const reportsRef = ref(db, `users/${user.uid}/reports`);
      const newReportRef = push(reportsRef);
      await set(newReportRef, newReport);
      toast({
        title: "Report Generated",
        description: "A new report has been added to your list.",
      });
    } catch (error) {
      console.error("Firebase error:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate and download reports of your carbon savings data."
      >
        <Button variant="outline" onClick={handleGenerateReport}>Generate New Report</Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
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
                    <TableCell>{report.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No reports generated yet.
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