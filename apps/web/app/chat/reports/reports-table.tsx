"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileTextIcon, Trash2Icon, Loader2, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatRelativeTime } from "@/lib/format-time";
import { Badge } from "@/components/ui/badge";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

interface Report {
  _id: Id<"reports">;
  fileName: string;
  sizeBytes: number;
  createdAt: number;
  mimeType: string;
  analysis?: string;
}

export default function ReportsTable() {
  const reports = useQuery(api.uploader.getUserReports);
  const deleteReport = useMutation(api.uploader.deleteReport);

  const handleSelect = (id: Id<"reports">, checked: boolean) => {
    if (checked) {
      console.log("Selected report ID:", id);
    }
  };

  const handleDelete = async (id: Id<"reports">, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this report?")) {
      await deleteReport({ reportId: id });
    }
  };

  if (reports === undefined) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileTextIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
        <p>No reports uploaded yet</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Your recent medical reports and documents</TableCaption>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-12"></TableHead>
          <TableHead>Document Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead className="w-24 text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(reports as Report[]).map((report) => {
          // Type-safe route construction for Next.js Link
          const reportUrl = `/chat/reports/${report._id}` as const;

          return (
            <TableRow
              key={report._id}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  className="border-primary"
                  onCheckedChange={(checked) =>
                    handleSelect(report._id, checked as boolean)
                  }
                  aria-label={`Select ${report.fileName}`}
                />
              </TableCell>

              <TableCell>
                <Link
                  href={reportUrl}
                  className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
                >
                  <FileTextIcon className="h-4 w-4 text-red-500 shrink-0" />
                  <span className="truncate max-w-50 sm:max-w-75">
                    {report.fileName}
                  </span>
                  {report.analysis && (
                    <Badge
                      variant="secondary"
                      className="ml-2 gap-1 bg-primary/10 text-primary hover:bg-primary/20 border-none px-1.5 py-0"
                    >
                      <SparklesIcon className="h-3 w-3" />
                      Analyzed
                    </Badge>
                  )}
                </Link>
              </TableCell>

              <TableCell className="text-muted-foreground text-sm">
                {formatFileSize(report.sizeBytes)}
              </TableCell>

              <TableCell className="text-muted-foreground text-sm">
                {formatRelativeTime(report.createdAt)}
              </TableCell>

              <TableCell
                className="text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => handleDelete(report._id, e)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
