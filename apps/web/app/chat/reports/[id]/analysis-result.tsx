"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklesIcon, Loader2Icon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { assistantProseClasses } from "../../components/message-list";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AnalysisResultProps {
  analysis: string;
  isAnalyzing: boolean;
  onClear: () => void;
}

export default function AnalysisResult({
  analysis,
  isAnalyzing,
  onClear,
}: AnalysisResultProps) {
  if (!analysis && !isAnalyzing) return null;

  return (
    <Card className="w-full shadow-sm border mt-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-primary" />
          AI Analysis Results
        </CardTitle>
        {analysis && !isAnalyzing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear Analysis
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={cn(
            assistantProseClasses,
            "prose-sm sm:prose-base transition-all duration-500",
          )}
        >
          {analysis ? (
            <ReactMarkdown>{analysis}</ReactMarkdown>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-4">
              <Loader2Icon className="h-8 w-8 animate-spin text-primary/40" />
              <p className="text-sm font-medium animate-pulse">
                Generating insights...
              </p>
            </div>
          )}
        </div>

        {analysis && (
          <div className="pt-6 border-t">
            <p className="text-xs text-muted-foreground text-center bg-muted/30 py-3 rounded-lg border border-dashed">
              ⚠️ <strong>Disclaimer:</strong> This is an AI-assisted analysis
              for educational purposes. Always consult with a qualified
              veterinarian for medical decisions concerning your pet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
