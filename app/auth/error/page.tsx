"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, SunMoon } from "lucide-react";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An unknown error occurred during authentication.";
  
  // Handle specific error messages
  if (error === "CredentialsSignin") {
    errorMessage = "Invalid email or password. Please try again.";
  } else if (error === "AccessDenied") {
    errorMessage = "Access denied. You don't have permission to access this resource.";
  } else if (error === "OAuthAccountNotLinked") {
    errorMessage = "This email is already associated with another account.";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/30 to-primary/5 rounded-full blur-3xl opacity-70 transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/20 to-violet-500/5 rounded-full blur-3xl opacity-60 transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-background/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-primary/5 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <SunMoon className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Belecure</span>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-full bg-red-500/10">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          
          <p className="text-muted-foreground mb-8">
            {errorMessage}
          </p>

          <div className="flex flex-col gap-4">
            <Button asChild className="w-full font-medium bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              <Link href="/auth/signin">
                Try Again
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full font-medium rounded-full">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 