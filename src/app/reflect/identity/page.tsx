
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
import { UserCircle2, ArrowRight } from "lucide-react";

const prompts = [
  { id: "before", label: "Who were you before life became difficult?", placeholder: "Reflect on your past self..." },
  { id: "values", label: "What values matter most to you?", placeholder: "Integrity, kindness, growth..." },
  { id: "future", label: "What kind of person do you want to become?", placeholder: "Your aspirational self..." },
  { id: "strengths", label: "What strengths have helped you survive hard times?", placeholder: "Resilience, patience, humor..." }
];

export default function IdentityPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!user || !firestore) return;
    setIsSubmitting(true);
    const ref = collection(firestore, "users", user.uid, "journalEntries");
    addDocumentNonBlocking(ref, {
      userId: user.uid,
      type: 'identity',
      content: 'Reflected on personal identity and core values.',
      moduleData: responses,
      timestamp: serverTimestamp(),
    });
    toast({
      title: "Reflection Saved",
      description: "Your identity journey has been updated.",
    });
    router.push('/reflect');
  };

  return (
    <DashboardLayout pageTitle="Identity Reflection">
      <div className="p-6 lg:p-10 space-y-8 bg-gradient-to-br from-black via-black to-digital-lavender/10 min-h-full">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4 text-center">
            <div className="size-16 rounded-full bg-digital-lavender/20 flex items-center justify-center mx-auto border border-digital-lavender/40">
              <UserCircle2 className="size-8 text-digital-lavender" />
            </div>
            <h2 className="text-4xl font-headline font-bold">Reclaim Your Narrative</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Identity isn't fixed. It's something you build, day by day, through your choices and values.
            </p>
          </div>

          <div className="space-y-6">
            {prompts.map((p) => (
              <Card key={p.id} className="border-border/50 bg-card/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-headline text-digital-lavender">{p.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    placeholder={p.placeholder} 
                    className="min-h-[120px] bg-black/20"
                    value={responses[p.id] || ""}
                    onChange={(e) => setResponses({...responses, [p.id]: e.target.value})}
                  />
                </CardContent>
              </Card>
            ))}
            
            <Button onClick={handleSubmit} className="w-full py-8 text-xl font-headline rounded-2xl group" disabled={isSubmitting}>
              Seal Reflection
              <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
