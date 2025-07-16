
"use client"

import * as React from "react"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-screen">
      {children}
    </div>
  );
}
