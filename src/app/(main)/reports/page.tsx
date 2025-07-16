import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText } from "lucide-react"

const reports = [
  {
    id: "REP-2023-Q4",
    title: "Q4 2023 Carbon Savings Summary",
    date: "2024-01-15",
    type: "Quarterly",
  },
  {
    id: "REP-2023-YR",
    title: "2023 Annual Impact Report",
    date: "2024-01-20",
    type: "Annual",
  },
  {
    id: "REP-AC-2023",
    title: "2023 AgriCarbon Detailed Analysis",
    date: "2024-02-01",
    type: "Detailed",
  },
    {
    id: "REP-INT-2023",
    title: "2023 Interventions Performance",
    date: "2024-02-05",
    type: "Detailed",
  },
]

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate and download reports of your carbon savings data."
      >
        <Button variant="outline">Generate New Report</Button>
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
              {reports.map((report) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
