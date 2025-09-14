import { Fingerprint } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Fingerprint className="h-8 w-8 text-primary drop-shadow-[0_2px_2px_rgba(var(--primary-foreground-rgb),0.2)]" />
      <span className="text-xl font-bold tracking-tight font-headline">
        FindIt
      </span>
    </Link>
  );
}
