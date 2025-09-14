import Link from 'next/link';
import Logo from './logo';

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Find what you've lost. Help others find what they're missing.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/admin/dashboard"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Admin
            </Link>
            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-foreground font-bold">
          © {new Date().getFullYear()} FindIt. All rights reserved.
          <p className="mt-2">Created by <span className="text-primary">LEARNING LOOPERS</span>,studying E1 in <span className="text-primary">RGUKT</span>.</p>
        </div>
      </div>
    </footer>
  );
}
