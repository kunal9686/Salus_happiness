
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Quote, ChevronRight, PenLine, Sparkles } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const stories = [
  {
    id: 'viktor-frankl',
    title: 'Viktor Frankl: Meaning in the Midst of Suffering',
    category: 'Resilience',
    background: 'A Jewish psychiatrist who survived four different Nazi concentration camps.',
    struggle: 'The loss of his family, his dignity, and nearly his life in the camps.',
    turningPoint: 'Realizing that while he couldn\'t control his circumstances, he could control his response.',
    lessons: 'Life is never made unbearable by circumstances, but only by lack of meaning and purpose.',
    reflectionPrompt: 'What gives your life meaning when everything else is stripped away?',
    color: 'from-heliotrope/20'
  },
  {
    id: 'malala',
    title: 'Malala Yousafzai: The Power of a Single Voice',
    category: 'Courage',
    background: 'A Pakistani girl who stood up for the right of girls to be educated.',
    struggle: 'Surviving an assassination attempt by the Taliban at age 15.',
    turningPoint: 'Choosing to use her survival as a platform rather than hiding in fear.',
    lessons: 'One child, one teacher, one book, and one pen can change the world.',
    reflectionPrompt: 'What is a value you are willing to stand up for, despite the risk?',
    color: 'from-amaranth/20'
  },
  {
    id: 'stephen-hawking',
    title: 'Stephen Hawking: A Mind Without Bounds',
    category: 'Persistence',
    background: 'Renowned theoretical physicist diagnosed with motor neuron disease at 21.',
    struggle: 'Losing the ability to walk, speak, and eventually move any part of his body.',
    turningPoint: 'Refusing to let his physical limitations stop him from exploring the universe.',
    lessons: 'However difficult life may seem, there is always something you can do and succeed at.',
    reflectionPrompt: 'What limitations in your life are you currently allowing to define you?',
    color: 'from-primary/20'
  }
];

export default function InspirePage() {
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null);

  return (
    <DashboardLayout pageTitle="Inspire">
      <div className="p-6 lg:p-10 space-y-8 bg-gradient-to-br from-black via-black to-amaranth/10 min-h-full">
        {selectedStory ? (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <Button variant="ghost" onClick={() => setSelectedStory(null)} className="mb-4">
              <ChevronRight className="rotate-180 mr-2 h-4 w-4" /> Back to Stories
            </Button>
            
            <div className="space-y-6">
              <Badge variant="outline" className="px-3 py-1 border-primary text-primary">{selectedStory.category}</Badge>
              <h2 className="text-4xl font-headline font-bold tracking-tight">{selectedStory.title}</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-primary" /> Background
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedStory.background}</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-destructive" /> The Struggle
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedStory.struggle}</p>
                </div>
              </div>

              <Card className="bg-card/40 border-primary/20 border-l-4">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" /> The Turning Point
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">{selectedStory.turningPoint}</p>
                </CardContent>
              </Card>

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">The Lesson</h3>
                <blockquote className="text-2xl font-headline italic border-l-2 pl-6 py-2 border-border">
                  "{selectedStory.lessons}"
                </blockquote>
              </div>

              <Card className="bg-primary/5 border-primary/30 mt-10">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <PenLine className="h-6 w-6 text-primary" /> Reflect
                  </CardTitle>
                  <CardDescription className="text-foreground/80">{selectedStory.reflectionPrompt}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full py-6 text-lg rounded-xl">
                    <Link href="/journal">Write in Journal</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="space-y-3">
              <h2 className="text-4xl font-headline font-bold">Resilience & Perspective</h2>
              <p className="text-muted-foreground text-lg">Real stories of human spirit overcoming darkness.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <Card 
                  key={story.id} 
                  className={`group relative overflow-hidden cursor-pointer bg-card/40 border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]`}
                  onClick={() => setSelectedStory(story)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${story.color} to-transparent opacity-30 group-hover:opacity-50 transition-opacity`} />
                  <CardHeader>
                    <Badge className="w-fit mb-2">{story.category}</Badge>
                    <CardTitle className="font-headline text-xl leading-snug">{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {story.background}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-0 border-t border-white/5 mt-4 group-hover:bg-primary/5 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Read Story</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
