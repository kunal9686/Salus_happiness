
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser, useFirestore } from "@/firebase/provider";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Wind, ShieldCheck, Scale, History } from "lucide-react";

const stoicSteps = [
  { id: "worry", title: "The Worry", label: "What are you currently worrying about?", icon: Wind, color: "text-amaranth" },
  { id: "control", title: "Circle of Control", label: "Is this within your absolute control?", icon: ShieldCheck, color: "text-cyber-lime" },
  { id: "worstCase", title: "Negative Visualization", label: "What is the worst realistic outcome?", icon: History, color: "text-heliotrope" },
  { id: "action", title: "Virtuous Action", label: "What small step could reduce this worry?", icon: Scale, color: "text-digital-lavender" }
];

export default function AnxietyPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);

  const handleNext = () => {
    if (currentStep < stoicSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const ref = collection(firestore!, "users", user!.uid, "journalEntries");
      addDocumentNonBlocking(ref, {
        userId: user!.uid,
        type: 'anxiety',
        content: 'Completed Stoic Anxiety Reflection.',
        moduleData: responses,
        timestamp: serverTimestamp(),
      });
      setFinished(true);
      toast({ title: "Perspective Gained", description: "Your Stoic reflection has been saved." });
    }
  };

  if (finished) {
    return (
      <DashboardLayout pageTitle="Perspective Found">
        <div className="p-6 lg:p-10 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-black">
          <Card className="max-w-2xl w-full border-border/50 bg-card/40 backdrop-blur-md p-8 text-center space-y-6">
            <h2 className="text-3xl font-headline font-bold italic">"We suffer more often in imagination than in reality."</h2>
            <p className="text-muted-foreground">— Seneca</p>
            <div className="space-y-4 text-left mt-8">
               {stoicSteps.map(s => (
                 <div key={s.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                   <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.title}</span>
                   <p className="mt-1">{responses[s.id]}</p>
                 </div>
               ))}
            </div>
            <Button onClick={() => router.push('/reflect')} className="w-full mt-4">Return to Sanctuary</Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const step = stoicSteps[currentStep];

  return (
    <DashboardLayout pageTitle="Stoic Perspective">
      <div className="p-6 lg:p-10 space-y-8 bg-gradient-to-br from-black via-black to-amaranth/10 min-h-full">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-headline font-bold">Dichotomy of Control</h2>
            <p className="text-muted-foreground">Focus on what you can change, accept what you cannot.</p>
          </div>

          <Card className="border-border/50 bg-card/40 backdrop-blur-sm animate-in zoom-in duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${step.color}`}>
                <step.icon className="size-8" />
              </div>
              <div>
                <CardTitle className="font-headline">{step.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="text-lg text-foreground/90 leading-relaxed">{step.label}</label>
              <Textarea 
                placeholder="Write your honest thought..." 
                className="min-h-[150px] text-lg bg-black/20"
                value={responses[step.id] || ""}
                onChange={(e) => setResponses({...responses, [step.id]: e.target.value})}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>Back</Button>
              <Button onClick={handleNext} className="px-10">
                {currentStep === stoicSteps.length - 1 ? "Anchor Thoughts" : "Next Principle"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
