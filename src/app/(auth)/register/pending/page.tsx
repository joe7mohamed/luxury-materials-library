// app/(auth)/register/pending/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-primary" />
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Registration Successful
        </h2>

        <div className="rounded-lg bg-secondary/20 p-6 mt-6">
          <p className="text-lg mb-4 font-medium">
            Your supplier account is pending approval
          </p>

          <p className="text-muted-foreground mb-4">
            Our team will review your application and approve your account as
            soon as possible. You'll receive an email notification when your
            account is approved.
          </p>

          <p className="text-muted-foreground">Thank you for your patience.</p>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex justify-center py-3 px-6 border border-transparent rounded-full shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
