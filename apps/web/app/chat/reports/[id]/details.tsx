"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeftIcon, AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import DetailsCard from "./details-card";
import DetailsReportPreview from "./details-report-preview";

export type ReportType =
  | {
      url: string | null;
      createdAt: number;
      _id: Id<"reports">;
      _creationTime: number;
      updatedAt?: number | undefined;
      chatId?: Id<"chats"> | undefined;
      userId: string;
      fileId: Id<"_storage">;
      fileName: string;
      mimeType: string;
      sizeBytes: number;
    }
  | undefined;

export default function Details({ id }: { id: Id<"reports"> }) {
  const report = useQuery(api.uploader.getReport, { id });

  if (report === undefined) {
    return <DetailedReportSkeleton />;
  }

  if (report === null) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="text-center space-y-4">
          <AlertCircleIcon className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold">Report Not Found</h1>
          <p className="text-muted-foreground">
            This report may have been deleted or you {"don't"} have permission
            to view it.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/chat/reports">
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              Back to Reports
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          className="pl-0 hover:pl-2 transition-all"
        >
          <Link href="/chat/reports">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to Reports
          </Link>
        </Button>
      </div>

      {/* Main Content - Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left Side - PDF Preview (takes 3/5 on desktop) */}
        <DetailsReportPreview report={report} />

        {/* Right Side - Details (takes 2/5 on desktop) */}
        <DetailsCard report={report} />
      </div>
    </div>
  );
}

function DetailedReportSkeleton() {
  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center">
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Skeleton className="h-[calc(100vh-280px)] min-h-[500px] w-full rounded-xl" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
