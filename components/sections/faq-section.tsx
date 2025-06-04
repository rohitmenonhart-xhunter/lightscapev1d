"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What file formats do you support for floorplans?",
    answer: "We support a wide range of formats including PDF, DWG, DXF, JPG, PNG, and SVG. If you have your floorplan in a different format, please contact our support team for assistance."
  },
  {
    question: "Do I need any special hardware to run the lighting simulations?",
    answer: "No, our platform is cloud-based and runs in your browser. You can use it on any modern device with an internet connection. For the best experience, we recommend using a device with a larger screen to see the details of your lighting design."
  },
  {
    question: "How accurate are the lighting simulations?",
    answer: "Our simulations use physically-based rendering techniques that accurately model how light behaves in real-world environments. We account for factors like light intensity, color temperature, reflections, and material properties to provide results that closely match real-world lighting conditions."
  },
  {
    question: "Can I export my lighting designs to other software?",
    answer: "Yes, you can export your lighting designs in various formats compatible with most CAD and BIM software. We support exports to DWG, DXF, PDF, and high-resolution images. Premium plans also include IES file exports for professional lighting design software."
  },
  {
    question: "Is there a limit to the size of floorplans I can upload?",
    answer: "Free accounts can upload floorplans up to 1000 sq ft (93 sq m). Professional and Enterprise plans support unlimited floorplan sizes. If you have extremely large or complex projects, our Enterprise plan offers dedicated resources for optimal performance."
  },
  {
    question: "Do you have lighting fixtures from specific manufacturers?",
    answer: "Yes, our library includes thousands of fixtures from leading manufacturers with accurate photometric data. Premium plans allow you to import custom IES files for specific fixtures not in our database."
  }
];

const FAQSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
  
  return (
    <section id="faq" ref={sectionRef} className="py-20 md:py-32 bg-muted/20">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={cn(
            "max-w-3xl mx-auto text-center mb-16",
            "transition-all duration-700",
            isTitleInView ? "opacity-100" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Have questions about our lighting simulation tool? Find answers to common questions below.
          </p>
        </div>
        
        <div 
          className={cn(
            "max-w-3xl mx-auto",
            "transition-all duration-700 delay-200",
            isInView ? "opacity-100" : "opacity-0 translate-y-10"
          )}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-lg border border-border px-6"
              >
                <AccordionTrigger className="text-left text-lg py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help.
            </p>
            <Button variant="outline" className="font-medium">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;