
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
import { Heart, Star, Globe, DollarSign, CheckCircle2 } from "lucide-react";

const steps = [
  {
    id: "love",
    title: "What You Love",
    description: "Activities that make you lose track of time.",
    questions: [
      "What activities make you lose track of time?",
      "What did you love doing as a child?",
      "What topics do you enjoy learning about?"
    ],
    icon: Heart,
    color: "text-amaranth"
  },
  {
    id: "goodAt",
    title: "What You Are Good At",
    description: "Skills and talents you've developed.",
    questions: [
      "What do people often ask you for help with?",
      "What skills have you developed over time?"
    ],
    icon: Star,
    color: "text-cyber-lime"
  },
  {
    id: "worldNeeds",
    title: "What The World Needs",
    description: "The impact you want to have.",
    questions: [
      "What societal problems frustrate you?",
      "What kind of impact would you like to have?"
    ],
    icon: Globe,
    color: "text-heliotrope"
  },
  {
    id: "paidFor",
    title: "What You Can Be Paid For",
    description: "Skills that generate value.",
    questions: [
      "What skills could realistically generate income?",
      "What professional paths interest you?"
    ],
    icon: DollarSign,
    color: "text-digital-lavender"
  }
];

export default function IkigaiPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!user || !firestore) return;
    const ref = collection(firestore, "users", user.uid, "journalEntries");
    addDocumentNonBlocking(ref, {
      userId: user.uid,
      type: 'ikigai',
      content: 'Completed Ikigai Discovery module.',
      moduleData: responses,
      timestamp: serverTimestamp(),
    });
    setIsFinished(true);
    toast({
      title: "Discovery Saved",
      description: "Your Ikigai reflection has been added to your journal.",
    });
  };

  if (isFinished) {
    return (
      <DashboardLayout pageTitle="Ikigai Summary">
        <div className="p-6 lg:p-10 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-black">
          <Card className="max-w-4xl w-full border-border/50 bg-card/40 backdrop-blur-md p-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-headline font-bold">Your Ikigai Discovery</h2>
              <p className="text-muted-foreground">The intersection of purpose and passion.</p>
            </div>
            
            <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
               {/* Simplified CSS Venn Diagram */}
               <div className="absolute w-64 h-64 rounded-full bg-amaranth/20 border border-amaranth/40 -translate-x-16 -translate-y-16 flex items-center justify-center">
                 <span className="text-[10px] font-bold uppercase tracking-tighter opacity-50">Passion</span>
               </div>
               <div className="absolute w-64 h-64 rounded-full bg-cyber-lime/20 border border-cyber-lime/40 translate-x-16 -translate-y-16 flex items-center justify-center">
                 <span className="text-[10px] font-bold uppercase tracking-tighter opacity-50">Mission</span>
               </div>
               <div className="absolute w-64 h-64 rounded-full bg-heliotrope/20 border border-heliotrope/40 -translate-x-16 translate-y-16 flex items-center justify-center">
                 <span className="text-[10px] font-bold uppercase tracking-tighter opacity-50">Profession</span>
               </div>
               <div className="absolute w-64 h-64 rounded-full bg-digital-lavender/20 border border-digital-lavender/40 translate-x-16 translate-y-16 flex items-center justify-center">
                 <span className="text-[10px] font-bold uppercase tracking-tighter opacity-50">Vocation</span>
               </div>
               <div className="z-10 bg-black/80 p-4 rounded-2xl border border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                 <span className="font-headline font-bold text-xl text-primary">IKIGAI</span>
               </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {steps.map(step => (
                <div key={step.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className={`size-4 ${step.color}`} />
                    <h4 className="font-bold text-sm uppercase tracking-wider">{step.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 italic">"{responses[step.id] || "No response provided."}"</p>
                </div>
              ))}
            </div>

            <Button onClick={() => router.push('/reflect')} className="w-full">Return to Reflect Hub</Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const step = steps[currentStep];

  return (
    <DashboardLayout pageTitle="Ikigai Discovery">
      <div className="p-6 lg:p-10 space-y-8 bg-gradient-to-br from-black via-black to-amaranth/10 min-h-full">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Step {currentStep + 1} of 4</span>
              <h2 className={`text-4xl font-headline font-bold flex items-center gap-4 ${step.color}`}>
                <step.icon className="size-10" />
                {step.title}
              </h2>
            </div>
          </div>

          <Card className="border-border/50 bg-card/40 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardDescription className="text-lg">{step.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step.questions.map((q, i) => (
                <div key={i} className="space-y-3">
                  <label className="text-sm font-medium text-foreground/80">{q}</label>
                  <Textarea 
                    placeholder="Type your reflection here..." 
                    className="min-h-[100px] bg-black/40 border-border/40 focus:border-primary/50"
                    value={responses[`${step.id}_${i}`] || ""}
                    onChange={(e) => setResponses({...responses, [step.id]: (responses[step.id] || "") + "\n" + e.target.value, [`${step.id}_${i}`]: e.target.value})}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between p-6 pt-0">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button onClick={handleNext} className="gap-2 px-8">
                {currentStep === steps.length - 1 ? "Complete Discovery" : "Next Section"}
                <CheckCircle2 className="size-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
