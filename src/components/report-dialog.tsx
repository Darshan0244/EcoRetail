
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from './ui/skeleton';
import { handleGenerateReport } from '@/app/actions';
import { type GenerateReportOutput } from '@/ai/flows/generate-report';
import { useToast } from '@/hooks/use-toast';
import { Bot } from 'lucide-react';

interface ReportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  featureTitle: string;
  contentSummary: string;
}

export function ReportDialog({
  isOpen,
  onOpenChange,
  featureTitle,
  contentSummary,
}: ReportDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateReportOutput | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && contentSummary) {
      setIsLoading(true);
      setResult(null);

      handleGenerateReport({ featureTitle, contentSummary })
        .then(({ data, error }) => {
          if (error) {
            toast({
              variant: 'destructive',
              title: 'Error generating report',
              description: error,
            });
            onOpenChange(false); // Close dialog on error
          } else {
            setResult(data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, featureTitle, contentSummary, onOpenChange, toast]);

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot /> AI-Generated Report
          </DialogTitle>
          <DialogDescription>
            An AI summary for: <strong>{featureTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 relative min-h-0">
            <ScrollArea className="h-full">
                <div className="py-4 pr-6">
                {isLoading && (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                )}
                {!isLoading && !result && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
                    <p>Generating your report...</p>
                  </div>
                )}
                {result && (
                  <div className="space-y-4">
                    <div
                      className="prose prose-sm max-w-none prose-p:text-foreground prose-ul:text-foreground prose-li:text-foreground text-foreground"
                      dangerouslySetInnerHTML={{ __html: result.reportText }}
                    />
                  </div>
                )}
                </div>
            </ScrollArea>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
