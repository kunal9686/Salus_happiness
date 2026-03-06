
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, PenLine, TrendingUp } from "lucide-react";

/**
 * @fileOverview Splash landing page for Salus.
 * Features an entry animation and automatically redirects to the dashboard.
 */
export default function Home() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show the "Salus" title for 3 seconds before starting the exit transition
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Once exiting starts, wait for the transition (1s) then redirect to the dashboard
    if (isExiting) {
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 1100); // 1.1s to ensure transition finishes
      return () => clearTimeout(redirectTimer);
    }
  }, [isExiting, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-heliotrope/20 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <main
        className={`flex flex-col items-center justify-center text-center z-10 transition-all duration-1000 ease-in-out ${
          isExiting ? "scale-95 opacity-0 blur-lg" : "scale-100 opacity-100 blur-0"
        }`}
      >
        <div className="flex gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 animate-bounce delay-100">
            <PenLine className="text-primary size-6" />
          </div>
          <div className="p-3 rounded-2xl bg-heliotrope/10 border border-heliotrope/20 animate-bounce delay-200">
            <Sparkles className="text-heliotrope size-6" />
          </div>
          <div className="p-3 rounded-2xl bg-cyber-lime/10 border border-cyber-lime/20 animate-bounce delay-300">
            <TrendingUp className="text-cyber-lime size-6" />
          </div>
        </div>
        
        <h1 className="font-headline text-8xl md:text-[10rem] font-bold text-foreground tracking-tighter leading-none mb-4">
          Salus
        </h1>
        
        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary to-transparent mb-8" />
        
        <p className="font-headline text-2xl md:text-3xl text-muted-foreground/80 font-light italic tracking-wide">
          “Mens sana in corpore sano”
        </p>
        
        <div className="mt-20 flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-4">Your Private Space for Reflection</p>
          <div className="size-1 rounded-full bg-primary animate-ping" />
        </div>
      </main>
    </div>
  );
}
