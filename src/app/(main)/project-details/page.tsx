
import * as React from "react"
import { Suspense } from "react"
import ProjectDetailsForm from "@/components/project-details-form"
import { Skeleton } from "@/components/ui/skeleton"

function ProjectDetailsSkeleton() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-2">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
        </div>
        <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-80 w-full" />
        </div>
         <div className="text-center">
            <Skeleton className="h-12 w-32 mx-auto" />
        </div>
      </div>
    </div>
  )
}


export default function ProjectDetailsPage() {
  return (
    <Suspense fallback={<ProjectDetailsSkeleton />}>
      <ProjectDetailsForm />
    </Suspense>
  )
}
