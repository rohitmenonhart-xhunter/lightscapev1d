"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Belecure transformed our design process. We can now show clients exactly how their spaces will look before installation, saving time and preventing costly mistakes.",
    author: "Jessica Chen",
    role: "Interior Designer",
    rating: 5
  },
  {
    quote: "As an architect, lighting is crucial to how my designs are experienced. This tool has become indispensable for communicating lighting concepts to clients and contractors.",
    author: "Marcus Johnson",
    role: "Principal Architect",
    rating: 5
  },
  {
    quote: "The energy efficiency analysis helped us reduce our office lighting costs by 32% while improving the overall lighting quality. It paid for itself in the first year.",
    author: "Sarah Williams",
    role: "Facility Manager",
    rating: 4
  }
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  
  return (
    <div 
      ref={cardRef}
      className={cn(
        "bg-card border border-border rounded-xl p-6 shadow-sm",
        "transition-all duration-700",
        isInView 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10",
      )}
      style={{ 
        transitionDelay: `${index * 200}ms` 
      }}
    >
      {/* Rating */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-5 w-5",
              i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-muted"
            )}
          />
        ))}
      </div>
      
      {/* Quote */}
      <div className="relative">
        <Quote className="absolute -top-2 -left-2 h-10 w-10 text-primary/10" />
        <p className="text-foreground relative z-10 mb-6 pl-4">"{testimonial.quote}"</p>
      </div>
      
      {/* Author info */}
      <div className="flex items-center mt-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          {testimonial.author.charAt(0)}
        </div>
        <div className="ml-3">
          <h4 className="font-medium">{testimonial.author}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={cn(
            "max-w-3xl mx-auto text-center mb-16",
            "transition-all duration-700",
            isTitleInView ? "opacity-100" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of design professionals who have transformed their lighting design process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
        
        {/* Stats */}
        <div 
          className={cn(
            "mt-20 grid grid-cols-2 md:grid-cols-4 gap-8",
            "transition-all duration-700 delay-600",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {[
            { value: "10,000+", label: "Active Users" },
            { value: "50,000+", label: "Projects Completed" },
            { value: "35%", label: "Avg. Energy Savings" },
            { value: "4.8/5", label: "Customer Rating" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;