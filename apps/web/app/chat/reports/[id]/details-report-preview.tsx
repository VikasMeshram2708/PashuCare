"use client";

import { useState } from "react";
import { FileTextIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { ReportType } from "./details";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DetailsReportPreview({
  report,
}: {
  report: ReportType;
}) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="lg:col-span-3 space-y-4">
      <div className="bg-muted/30 rounded-xl border overflow-hidden shadow-sm">
        <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileTextIcon className="h-4 w-4 text-red-500" />
            <span className="truncate max-w-75">{report?.fileName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">PDF Preview</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsVisible(!isVisible)}
              aria-label={isVisible ? "Hide preview" : "Show preview"}
            >
              {isVisible ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div
          className={cn(
            "bg-white transition-all duration-500 ease-in-out overflow-hidden relative",
            isVisible
              ? "h-[calc(100vh-280px)] min-h-[600px] opacity-100"
              : "h-0 min-h-0 opacity-0",
          )}
        >
          {report?.url ? (
            <iframe
              src={report.url}
              className="w-full h-full border-0 absolute inset-0"
              title={report.fileName}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground bg-slate-50">
              <div className="text-center space-y-2">
                <FileTextIcon className="h-8 w-8 mx-auto opacity-20" />
                <p>Unable to load preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
