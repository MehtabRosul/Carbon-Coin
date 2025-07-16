import { PageHeader } from "@/components/page-header"

export default function StartPage() {
  return (
    <>
      <PageHeader
        title="Get Started"
        description="This is a blank page for logged in users."
      />
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">This page is under construction.</p>
      </div>
    </>
  )
}
