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
  AlertCircleIcon,
  CheckCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ReportType } from "./details";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DetailsCard({ report }: { report: ReportType }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>(report?.analysis || "");
  const [showAnalysis, setShowAnalysis] = useState(!!report?.analysis);
  const saveAnalysis = useMutation(api.uploader.saveAnalysis);

  useEffect(() => {
    if (report?.analysis) {
      setAnalysis(report.analysis);
      setShowAnalysis(true);
    }
  }, [report?.analysis]);

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

  const handleAnalyze = async () => {
    if (!report?.url) {
      toast.error("Error", { description: "No report URL available" });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis("");
    setShowAnalysis(true);

    try {
      const response = await fetch("/api/report/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: report.url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to start analysis");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAnalysis = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullAnalysis += chunk;
        setAnalysis(fullAnalysis);
      }

      // Save analysis to database upon completion
      if (report?._id) {
        await saveAnalysis({
          reportId: report._id,
          analysis: fullAnalysis,
        });
      }

      toast.success("Analysis Complete", {
        description: "AI report analysis has been generated successfully.",
        icon: <CheckCircleIcon className="h-4 w-4" />,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analysis Failed", {
        description:
          error instanceof Error ? error.message : "Something went wrong",
        icon: <AlertCircleIcon className="h-4 w-4" />,
      });
      setShowAnalysis(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearAnalysis = () => {
    setAnalysis("");
    setShowAnalysis(false);
  };

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

            {!showAnalysis ? (
              <Button
                className="w-full h-11 font-medium shadow-sm"
                onClick={handleAnalyze}
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
                    Analyze with AI
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-11 font-medium"
                  onClick={handleClearAnalysis}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Clear Analysis"
                  )}
                </Button>

                {/* Analysis Results */}
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                  <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4 text-primary" />
                    Analysis Results
                  </h5>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {analysis ? (
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                        <span className="text-sm">
                          Waiting for AI response...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  ⚠️ This is AI-assisted analysis. Always consult with a
                  veterinarian for medical decisions.
                </p>
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
