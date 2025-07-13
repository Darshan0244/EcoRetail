'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  audioDataUri?: string;
}

export function ReportDialog({ open, onOpenChange, title, content, audioDataUri }: ReportDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {audioDataUri && (
            <div className="pt-4">
              <audio controls className="w-full">
                <source src={audioDataUri} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          <AlertDialogDescription asChild>
            <div 
              className="prose prose-sm max-w-none prose-p:text-foreground prose-ul:text-foreground prose-li:text-foreground prose-strong:text-foreground text-foreground pt-4"
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
