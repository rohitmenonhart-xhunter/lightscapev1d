"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { SunMoon, Upload, Sparkles, Settings, LogOut, User, LayoutGrid } from "lucide-react";
import Link from "next/link";
import FloorPlanUpload from "@/components/dashboard/floor-plan-upload";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState("converter");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.02]"></div>
      </div>

      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <SunMoon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Belecure</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>{session?.user?.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Welcome section */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {greeting}, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Welcome to your Belecure dashboard. Start designing your perfect lighting experience.
          </p>
        </section>

        {/* Dashboard tabs */}
        <div className="mb-8 border-b border-border/40">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab("converter")}
              className={`pb-2 px-1 font-medium text-sm flex items-center ${
                activeTab === "converter"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Upload className="mr-2 h-4 w-4" />
              Floor Plan Converter
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`pb-2 px-1 font-medium text-sm flex items-center ${
                activeTab === "projects"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              My Projects
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-2 px-1 font-medium text-sm flex items-center ${
                activeTab === "settings"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "converter" && (
            <FloorPlanUpload />
          )}

          {activeTab === "projects" && (
            <div className="bg-background/70 backdrop-blur-sm border border-border/40 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6">My Projects</h2>
              <div className="text-center py-12">
                <div className="mx-auto p-3 rounded-lg bg-primary/10 w-fit mb-4">
                  <LayoutGrid className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  You haven't saved any lighting design projects yet. Convert a floor plan to get started.
                </p>
                <Button 
                  className="rounded-full bg-primary hover:bg-primary/90"
                  onClick={() => setActiveTab("converter")}
                >
                  Convert a Floor Plan
                </Button>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-background/70 backdrop-blur-sm border border-border/40 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
              <div className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input 
                      type="text" 
                      value={session?.user?.name || ""} 
                      disabled
                      className="w-full p-2 rounded-md bg-muted/50 border border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      value={session?.user?.email || ""} 
                      disabled
                      className="w-full p-2 rounded-md bg-muted/50 border border-border"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subscription Plan</label>
                  <div className="flex items-center justify-between p-3 rounded-md bg-primary/10 border border-primary/20">
                    <div>
                      <div className="font-medium">Free Trial</div>
                      <div className="text-sm text-muted-foreground">Basic features included</div>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 rounded-full">
                      Upgrade
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 