"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MousePointerClick, SunMoon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Modern geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/30 to-primary/5 rounded-full blur-3xl opacity-70 transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/20 to-violet-500/5 rounded-full blur-3xl opacity-60 transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/3 w-1/4 h-1/4 bg-gradient-to-r from-amber-400/20 to-rose-500/10 rounded-full blur-3xl opacity-70"></div>
        
        {/* Animated grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        {/* Text content */}
        <div className={cn(
          "max-w-2xl lg:w-1/2 space-y-8",
          "transition-all duration-1000",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Next-Generation Lighting Design
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            <span className="block mb-2">Illuminate Your Space</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-violet-500">
              With Perfect Lighting
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground/90 leading-relaxed">
            Upload any floorplan and watch as Belecure transforms your space with intelligent light simulation. 
            Design with precision using our advanced AI-powered technology.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button size="lg" className="font-medium px-8 h-12 bg-primary hover:bg-primary/90 text-white rounded-full group shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="font-medium h-12 rounded-full border-muted-foreground/20 hover:bg-muted/50 backdrop-blur-sm">
              Watch Demo
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="pt-8 border-t border-muted/20">
            <p className="text-sm text-muted-foreground mb-4">Trusted by leading design firms</p>
            <div className="flex flex-wrap items-center gap-8">
              {['Company 1', 'Company 2', 'Company 3', 'Company 4'].map((company, i) => (
                <div key={i} className="text-muted-foreground/50 font-medium">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Hero visualization */}
        <div className={cn(
          "lg:w-1/2 w-full",
          "transition-all duration-1000 delay-300",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        )}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/10 backdrop-blur-sm">
            {/* Interactive 3D visualization mockup */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-900/90 to-gray-800/90 relative overflow-hidden">
              {/* 3D room visualization */}
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400&auto=format&fit=crop"
                alt="Modern room with lighting simulation" 
                className="w-full h-full object-cover opacity-90 mix-blend-luminosity"
              />
              
              {/* Lighting effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-60 mix-blend-overlay"></div>
              
              {/* Interactive elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Light source indicators */}
                  <div className="absolute top-1/4 left-1/3 h-6 w-6 rounded-full bg-primary/80 animate-pulse shadow-lg shadow-primary/50"></div>
                  <div className="absolute top-1/2 right-1/4 h-4 w-4 rounded-full bg-blue-400/80 animate-pulse shadow-lg shadow-blue-400/50 animation-delay-700"></div>
                  <div className="absolute bottom-1/3 left-1/4 h-5 w-5 rounded-full bg-amber-400/80 animate-pulse shadow-lg shadow-amber-400/50 animation-delay-1000"></div>
                  
                  {/* Light rays */}
                  <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
                  <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
                  <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-amber-400/20 rounded-full blur-xl"></div>
                </div>
              </div>
              
              {/* UI overlay elements */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg text-white text-sm font-medium">
                  Living Room • 3 Light Sources
                </div>
                <div className="bg-primary/90 backdrop-blur-md px-4 py-2 rounded-lg text-white text-sm font-medium">
                  Optimal Lighting
                </div>
              </div>
            </div>
            
            {/* Control panel */}
            <div className="bg-background/80 backdrop-blur-xl border-t border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm font-medium">Real-time simulation active</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs">Edit</Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs">Share</Button>
                <Button size="sm" className="h-8 rounded-full text-xs bg-primary/90 hover:bg-primary">Save</Button>
              </div>
            </div>
          </div>
          
          {/* Floating badges */}
          <div className="absolute -top-4 right-8 bg-blue-500/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg text-white text-sm font-medium flex items-center gap-1.5 transform rotate-2">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered
          </div>
          
          <div className="absolute -bottom-3 left-12 bg-background/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/10 text-sm font-medium flex items-center gap-1.5 transform -rotate-1">
            <span>Energy Efficient</span>
          </div>
        </div>
      </div>
      
      {/* Subtle scroll indicator */}
      <div className={cn(
        "absolute bottom-8 left-1/2 transform -translate-x-1/2",
        "transition-all duration-1000 delay-700",
        isLoaded ? "opacity-60" : "opacity-0"
      )}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground/70">Scroll to explore</span>
          <div className="h-10 w-5 rounded-full border border-muted-foreground/30 flex justify-center">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full mt-1.5 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;