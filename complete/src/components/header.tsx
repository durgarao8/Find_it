'use client';
import Link from 'next/link';
import {
  Search,
  PlusCircle,
  ImageIcon,
  MessageSquare,
  Menu,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import RguktLogo from './rgukt-logo';
import { items } from '@/lib/data';

const navLinks = [
  { href: '/', label: 'Browse', icon: Search, id: 'browse' },
  { href: '/submit', label: 'Submit Item', icon: PlusCircle, id: 'submit' },
  {
    href: '/search-by-image',
    label: 'Search by Image',
    icon: ImageIcon,
    id: 'search-by-image'
  },
  { href: '/messages', label: 'Messages', icon: MessageSquare, id: 'messages' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [hasNewItems, setHasNewItems] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastVisit = localStorage.getItem('findit_last_visit');
      if (lastVisit) {
        const lastVisitDate = new Date(lastVisit);
        const mostRecentItemDate = items.reduce((maxDate, item) => {
          const itemDate = new Date(item.dateLost);
          return itemDate > maxDate ? itemDate : maxDate;
        }, new Date(0));

        if (mostRecentItemDate > lastVisitDate) {
          setHasNewItems(true);
        }
      } else {
        // If it's the first visit, we can assume everything is "new" or just not show the indicator.
        // For a better UX, let's not show it on the very first visit.
        // The timestamp will be set when they navigate.
      }
    }
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href === '/') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('findit_last_visit', new Date().toISOString());
      }
      setHasNewItems(false);
    }
  };


  const NavLink = ({ href, label, icon: Icon, id }: (typeof navLinks)[0]) => (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 text-sm font-headline font-bold transition-colors hover:text-primary relative',
        pathname === href ? 'text-primary' : 'text-muted-foreground'
      )}
      onClick={() => handleNavClick(href)}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {id === 'browse' && hasNewItems && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </span>
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center gap-4">
          <Logo />
          <RguktLogo />
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium mx-6">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>

          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="p-4 flex items-center gap-4">
                <Logo />
                <RguktLogo />
              </div>
              <nav className="grid gap-2 p-4">
                {navLinks.map((link) => (
                  <NavLink key={link.href} {...link} />
                ))}
              </nav>
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                <Button variant="ghost" asChild onClick={() => setMenuOpen(false)}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild onClick={() => setMenuOpen(false)}>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
