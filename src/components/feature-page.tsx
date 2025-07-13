
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FeaturePageProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function FeaturePage({ title, description, children, className }: FeaturePageProps) {
  return (
    <div className={cn("p-4 sm:p-6 lg:p-8", className)}>
      <header className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">{title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{description}</p>
      </header>
      <main>{children}</main>
    </div>
  );
}
