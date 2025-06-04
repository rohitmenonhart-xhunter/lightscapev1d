"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const benefits = [
  "Free 14-day trial, no credit card required",
  "Unlimited projects during trial period",
  "Export options for all your designs",
  "Priority customer support"
];

const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  
  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.02]"></div>
      </div>
      
      <div 
        className={cn(
          "container mx-auto px-4 relative z-10",
          "transition-all duration-1000",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="max-w-5xl mx-auto bg-background/70 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-primary/5 overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Content side */}
            <div className="p-8 md:p-12 md:col-span-3 relative z-10">
              <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary">
                <Sparkles className="mr-2 h-4 w-4" />
                Limited Time Offer
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Elevate Your Space With <span className="text-primary">Perfect Lighting</span>
              </h2>
              
              <p className="text-lg text-muted-foreground/90 mb-8 max-w-md">
                Join thousands of designers and architects who are creating stunning lighting experiences with Belecure.
              </p>
              
              {/* Benefits list */}
              <ul className="space-y-4 mb-10">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm md:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="font-medium px-8 h-12 bg-primary hover:bg-primary/90 text-white rounded-full group shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" className="font-medium h-12 rounded-full border-muted-foreground/20 hover:bg-muted/50">
                  Schedule a Demo
                </Button>
              </div>
              
              {/* Fine print */}
              <p className="text-xs text-muted-foreground/70 mt-6">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
            
            {/* Image side */}
            <div className="relative md:col-span-2 h-64 md:h-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent z-10 md:block hidden"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 md:hidden"></div>
              
              <img 
                src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=1000&auto=format&fit=crop"
                alt="Modern interior with beautiful lighting" 
                className="w-full h-full object-cover"
              />
              
              {/* Floating elements */}
              <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/20 z-20 hidden md:block">
                <div className="text-sm font-medium">Lighting perfected</div>
              </div>
              
              <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 z-20 hidden md:flex">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonial snippet */}
        <div className="max-w-md mx-auto mt-12 text-center">
          <p className="text-muted-foreground italic">
            "Belecure has completely transformed how we present lighting designs to our clients. It's an essential tool for our studio."
          </p>
          <div className="mt-4 font-medium">
            — Alex Morgan, Principal Designer
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;