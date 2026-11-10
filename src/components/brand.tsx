import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-accent text-primary",
        className,
      )}
    >
      <GraduationCap className="h-1/2 w-1/2" strokeWidth={2.2} />
    </span>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-bold tracking-tight text-foreground", className)}>
      Skill<span className="text-primary">Bridge</span>
    </span>
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <BrandMark className="h-9 w-9" />
      <BrandWordmark className="text-xl" />
    </div>
  );
}
