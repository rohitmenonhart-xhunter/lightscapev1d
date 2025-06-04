"use client";

import { useRef, useEffect } from "react";
import { Lightbulb, Check, Layers, Database, Zap, MoveRight, Smartphone, CloudLightning, ArrowRight } from "lucide-react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
    title: "Real-time Lighting Simulation",
    description: "Experience instant, physically accurate lighting simulations that update in real-time as you make changes.",
  },
  {
    icon: <Check className="h-6 w-6 text-green-500" />,
    title: "Photorealistic Rendering",
    description: "View your space with photorealistic lighting that accurately depicts how light interacts with different materials and surfaces.",
  },
  {
    icon: <Layers className="h-6 w-6 text-blue-500" />,
    title: "Multiple Light Sources",
    description: "Add and customize multiple light sources with different temperatures, intensities, and positions to achieve the perfect ambiance.",
  },
  {
    icon: <Database className="h-6 w-6 text-violet-500" />,
    title: "Extensive Fixture Library",
    description: "Choose from thousands of real-world lighting fixtures with accurate specifications from leading manufacturers.",
  },
  {
    icon: <Smartphone className="h-6 w-6 text-rose-500" />,
    title: "Cross-device Compatibility",
    description: "Access your lighting designs from any device - desktop, tablet, or mobile - with a responsive interface that adapts to your screen.",
  },
  {
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    title: "Energy Efficiency Analysis",
    description: "Get detailed reports on energy consumption and suggestions for optimizing your lighting setup for efficiency.",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  
  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative bg-background/50 backdrop-blur-sm border border-muted/30 rounded-xl p-8 transition-all duration-500",
        "hover:border-primary/20 hover:shadow-[0_0_30px_rgba(0,0,0,0.05)]",
        isInView 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10",
      )}
      style={{ 
        transitionDelay: `${index * 100}ms` 
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-background to-muted/80 border border-muted/20 shadow-sm">
          {feature.icon}
        </div>
        <h3 className="text-xl font-semibold">{feature.title}</h3>
      </div>
      
      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
      
      <div className="mt-6 flex justify-end">
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-xs rounded-full">
          Learn more <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });

  return (
    <section id="features" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.015]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={titleRef}
          className={cn(
            "max-w-3xl mx-auto text-center mb-20 transition-all duration-700",
            isTitleInView ? "opacity-100" : "opacity-0 translate-y-10"
          )}
        >
          <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary backdrop-blur-sm">
            <Layers className="mr-2 h-4 w-4" />
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Design with Light Like Never Before</h2>
          <p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto">
            Our cutting-edge technology enables you to visualize and perfect your lighting design with precision and ease.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
        
        <div className={cn(
          "mt-16 text-center",
          "transition-all duration-700 delay-500",
          isInView ? "opacity-100" : "opacity-0"
        )}>
          <Button size="lg" className="font-medium px-8 h-12 bg-primary hover:bg-primary/90 text-white rounded-full group shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
            Explore All Features
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;