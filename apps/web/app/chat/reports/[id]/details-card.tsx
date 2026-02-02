"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  FileTextIcon,
  FileTypeIcon,
  HardDriveIcon,
  SparklesIcon,
  Loader2Icon,
} from "lucide-react";
import { ReportType } from "./details";

interface DetailsCardProps {
  report: ReportType;
  isAnalyzing: boolean;
  onAnalyze: () => Promise<void>;
  hasAnalysis: boolean;
}

export default function DetailsCard({
  report,
  isAnalyzing,
  onAnalyze,
  hasAnalysis,
}: DetailsCardProps) {
  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  return (
    <div className="lg:col-span-2 space-y-4">
      <Card className="shadow-sm border sticky top-6">
        <CardHeader>
          <CardTitle className="text-xl">Report Details</CardTitle>
          <CardDescription>
            Medical report information and analysis options
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* File Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileTypeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Filename</p>
                <p className="text-sm text-muted-foreground break-all">
                  {report?.fileName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HardDriveIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">File Size</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(report?.sizeBytes || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Uploaded On</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(report?.createdAt || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileTextIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Format</p>
                <p className="text-sm text-muted-foreground uppercase">
                  {report?.mimeType === "application/pdf"
                    ? "PDF Document"
                    : report?.mimeType}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* AI Analysis Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 text-primary" />
              AI Analysis
            </h4>
            <p className="text-xs text-muted-foreground">
              Analyze this report with PashuCare AI to extract insights,
              identify potential concerns, and get recommendations.
            </p>

            {!hasAnalysis || isAnalyzing ? (
              <Button
                className="w-full h-11 font-medium shadow-sm"
                onClick={onAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="mr-2 h-4 w-4" />
                    {hasAnalysis ? "Re-analyze with AI" : "Analyze with AI"}
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-11 font-medium border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary"
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                >
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  Re-analyze with AI
                </Button>
              </div>
            )}
          </div>

          {/* Download Option */}
          <div className="pt-2">
            <Button variant="outline" className="w-full" asChild>
              <a href={report?.url || "#"} download={report?.fileName}>
                Download Original
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
