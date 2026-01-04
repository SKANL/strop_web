import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        weak: "border-transparent bg-status-weak text-status-weak-foreground hover:bg-status-weak/80",
        medium: "border-transparent bg-status-medium text-status-medium-foreground hover:bg-status-medium/80",
        strong: "border-transparent bg-status-strong text-status-strong-foreground hover:bg-status-strong/80",
        neutral: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/80",
      },
      outline: {
        true: "bg-transparent",
      },
    },
    compoundVariants: [
      {
        status: "weak",
        outline: true,
        class: "text-status-weak border-status-weak bg-transparent hover:bg-status-weak/10",
      },
      {
        status: "medium",
        outline: true,
        class: "text-status-medium border-status-medium bg-transparent hover:bg-status-medium/10",
      },
      {
        status: "strong",
        outline: true,
        class: "text-status-strong border-status-strong bg-transparent hover:bg-status-strong/10",
      },
      {
        status: "neutral",
        outline: true,
        class: "text-secondary-foreground border-secondary bg-transparent hover:bg-secondary/10",
      },
      {
        status: "info",
        outline: true,
        class: "text-info border-info bg-transparent hover:bg-info/10",
      },
    ],
    defaultVariants: {
      status: "neutral",
      outline: false,
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  label?: string;
}

export function StatusBadge({ className, status, outline, label, children, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ status, outline }), className)} {...props}>
      {label || children}
    </div>
  );
}
