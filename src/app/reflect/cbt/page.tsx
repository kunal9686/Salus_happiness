
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
import { BrainCircuit, RefreshCw, AlertCircle, Smile } from "lucide-react";

export default function CBTPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [data, setData] = useState({
    situation: "",
    thought: "",
    emotion: "",
    alternative: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!user || !firestore) return;
    setIsSubmitting(true);
    const ref = collection(firestore, "users", user.uid, "journalEntries");
    addDocumentNonBlocking(ref, {
      userId: user.uid,
      type: 'cbt',
      content: `Reframed thought: "${data.thought}" into "${data.alternative}"`,
      moduleData: data,
      timestamp: serverTimestamp(),
    });
    toast({
      title: "Thought Reframed",
      description: "Consistency builds new neural pathways. Great job.",
    });
    router.push('/reflect');
  };

  return (
    <DashboardLayout pageTitle="CBT Reframing">
      <div className="p-6 lg:p-10 space-y-8 bg-gradient-to-br from-black via-black to-primary/10 min-h-full">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-headline font-bold">Rewire Your Mind</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Break the cycle of automatic negative thoughts by identifying distortions and building balanced alternatives.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card/40 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amaranth">
                  <AlertCircle className="size-5" /> The Situation
                </CardTitle>
                <CardDescription>What happened? Stick to objective facts.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="e.g. Received a critical email from my manager." 
                  className="min-h-[100px] bg-black/20"
                  value={data.situation}
                  onChange={(e) => setData({...data, situation: e.target.value})}
                />
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-heliotrope">
                  <BrainCircuit className="size-5" /> Automatic Thought
                </CardTitle>
                <CardDescription>What was the first thing you told yourself?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="e.g. 'I'm going to get fired, I'm useless at this job.'" 
                  className="min-h-[100px] bg-black/20"
                  value={data.thought}
                  onChange={(e) => setData({...data, thought: e.target.value})}
                />
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-digital-lavender">
                  <Smile className="size-5" /> The Emotion
                </CardTitle>
                <CardDescription>How did this thought make you feel?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="e.g. Intense anxiety, shame, hopelessness." 
                  className="min-h-[100px] bg-black/20"
                  value={data.emotion}
                  onChange={(e) => setData({...data, emotion: e.target.value})}
                />
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/30 ring-1 ring-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <RefreshCw className="size-5" /> Balanced Alternative
                </CardTitle>
                <CardDescription>What is a more realistic, supportive view?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="e.g. 'Feedback is for growth. One email doesn't define my career.'" 
                  className="min-h-[100px] bg-black/20"
                  value={data.alternative}
                  onChange={(e) => setData({...data, alternative: e.target.value})}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center pt-6">
            <Button onClick={handleSubmit} size="lg" className="px-12 py-8 text-xl font-headline rounded-2xl" disabled={isSubmitting}>
              Apply Reframe
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
