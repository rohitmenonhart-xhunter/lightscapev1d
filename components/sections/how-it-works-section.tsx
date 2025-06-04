"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Upload, 
  Sparkles, 
  Sliders, 
  Download, 
  ArrowRight,
  LightbulbIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: <Upload className="h-6 w-6 text-blue-500" />,
    title: "Upload Your Floorplan",
    description: "Simply upload your existing floorplan in PDF, CAD, or image format. Our system automatically recognizes rooms, walls, and spaces.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
    color: "from-blue-500/20 to-blue-600/5"
  },
  {
    icon: <Sparkles className="h-6 w-6 text-violet-500" />,
    title: "AI-Powered Analysis",
    description: "Our advanced AI instantly analyzes your space and suggests optimal lighting placement based on room types, size, and best practices.",
    image: "https://images.unsplash.com/photo-1623126908029-58cb08a2b272?q=80&w=1200&auto=format&fit=crop",
    color: "from-violet-500/20 to-purple-600/5"
  },
  {
    icon: <Sliders className="h-6 w-6 text-amber-500" />,
    title: "Customize & Visualize",
    description: "Fine-tune your lighting design with intuitive controls. Adjust brightness, color temperature, fixture types, and positioning in real-time.",
    image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=1200&auto=format&fit=crop",
    color: "from-amber-500/20 to-orange-600/5"
  },
  {
    icon: <Download className="h-6 w-6 text-emerald-500" />,
    title: "Export & Implement",
    description: "Download detailed lighting plans, fixture lists, and installation guides. Share with contractors or use for DIY implementation.",
    image: "https://images.unsplash.com/photo-1618219740975-d40978bb7378?q=80&w=1200&auto=format&fit=crop",
    color: "from-emerald-500/20 to-green-600/5"
  }
];

const StepCard = ({ step, index }: { step: typeof steps[0], index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  
  return (
    <div 
      ref={cardRef}
      className={cn(
        "group relative",
        "transition-all duration-1000",
        isInView 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10",
      )}
      style={{ 
        transitionDelay: `${index * 200}ms` 
      }}
    >
      {/* Connection line */}
      {index < steps.length - 1 && (
        <div className="absolute left-[28px] top-[60px] bottom-0 w-px bg-gradient-to-b from-primary/30 to-primary/5 hidden md:block"></div>
      )}
      
      <div className="flex gap-6 md:gap-10">
        {/* Step number and icon */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5 z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-primary font-semibold">{index + 1}</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 pb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${step.color} backdrop-blur-sm`}>
              {step.icon}
            </div>
            <h3 className="text-xl md:text-2xl font-semibold">{step.title}</h3>
          </div>
          
          <p className="text-muted-foreground/90 mb-6 max-w-xl">
            {step.description}
          </p>
          
          {/* Image card */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-white/10">
            {/* Image */}
            <div className="aspect-[16/9] overflow-hidden">
              <img 
                src={step.image}
                alt={step.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
            
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm text-white/70 mb-1">Step {index + 1}</div>
                  <div className="text-lg font-medium text-white">{step.title}</div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="secondary" size="sm" className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white text-xs">
                    Learn more
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.02]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={titleRef}
          className={cn(
            "max-w-3xl mx-auto text-center mb-20",
            "transition-all duration-700",
            isTitleInView ? "opacity-100" : "opacity-0 translate-y-10"
          )}
        >
          <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary backdrop-blur-sm">
            <LightbulbIcon className="mr-2 h-4 w-4" />
            Simple Process
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Transform Your Space in Four Easy Steps</h2>
          <p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto">
            Our intuitive process makes lighting design accessible to everyone, from professional designers to homeowners.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>
        
        {/* CTA */}
        <div className={cn(
          "mt-16 text-center",
          "transition-all duration-700 delay-500",
          isInView ? "opacity-100" : "opacity-0"
        )}>
          <Button size="lg" className="font-medium px-8 h-12 bg-primary hover:bg-primary/90 text-white rounded-full group shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;