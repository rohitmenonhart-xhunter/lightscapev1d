"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, SunMoon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <SunMoon className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">Belecure</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="#features" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link 
            href="#showcase" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Showcase
          </Link>
          <Link 
            href="#pricing" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Button className="font-medium" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-2"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[62px] z-50 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col space-y-4 p-4">
            <Link
              href="#features"
              className="text-foreground py-3 px-4 text-lg border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-foreground py-3 px-4 text-lg border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#showcase"
              className="text-foreground py-3 px-4 text-lg border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Showcase
            </Link>
            <Link
              href="#pricing"
              className="text-foreground py-3 px-4 text-lg border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-4 flex flex-col space-y-3 px-4">
              <Button className="w-full font-medium" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;