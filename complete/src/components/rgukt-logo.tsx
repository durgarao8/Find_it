import { cn } from "@/lib/utils";

export default function RguktLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="h-8 w-8 text-destructive"
        fill="currentColor"
      >
        <path d="M50 25C54.4183 25 58 28.5817 58 33C58 37.4183 54.4183 41 50 41C45.5817 41 42 37.4183 42 33C42 28.5817 45.5817 25 50 25ZM20 90C25 40 42 45 42 55V80L35 90H20ZM80 90C75 40 58 45 58 55V80L65 90H80ZM20 20C40 30 45 45 40 50L20 40V20ZM80 20C60 30 55 45 60 50L80 40V20Z" />
      </svg>
      <span className="text-sm font-bold tracking-tight">RGUKT</span>
    </div>
  );
}
