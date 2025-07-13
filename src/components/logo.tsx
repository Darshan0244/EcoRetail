
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-sidebar-foreground", className)}>
      <Leaf className="h-7 w-7 text-primary-foreground" />
      <span className="font-headline text-xl font-bold">EcoRetail</span>
    </div>
  );
}
