"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const showcaseItems = [
  {
    title: "Modern Apartment",
    description: "Optimized lighting for open-plan living spaces with smart control systems.",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
  },
  {
    title: "Office Space",
    description: "Productivity-focused lighting design with minimal glare and optimal brightness.",
    image: "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg"
  },
  {
    title: "Retail Store",
    description: "Strategic lighting to highlight products and create an inviting atmosphere.",
    image: "https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg"
  }
];

const ShowcaseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });

  return (
    <section id="showcase" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-chart-1/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-chart-2/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={titleRef}
          className={cn(
            "max-w-3xl mx-auto text-center mb-16",
            "transition-all duration-700",
            isTitleInView ? "opacity-100" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Showcase Gallery</h2>
          <p className="text-lg text-muted-foreground">
            Explore our gallery of lighting transformations across different spaces and design styles.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {showcaseItems.map((item, index) => {
            const itemRef = useRef<HTMLDivElement>(null);
            const isItemInView = useInView(itemRef, { once: true, amount: 0.3 });
            
            return (
              <div 
                key={index} 
                ref={itemRef}
                className={cn(
                  "group relative bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl",
                  isItemInView 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-10",
                )}
                style={{ 
                  transitionDelay: `${index * 150}ms` 
                }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  <img 
                    src={item.image}
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </div>
                </div>
                
                {/* View details button */}
                <div className="p-4 flex justify-end">
                  <Button variant="ghost" size="sm" className="group">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            View More Examples
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;