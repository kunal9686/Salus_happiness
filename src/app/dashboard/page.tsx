
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useDoc } from "@/firebase/firestore/use-doc";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, query, orderBy, limit, serverTimestamp, doc } from "firebase/firestore";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Smile, Meh, Frown, Laugh, Flame, BookOpen, Target, Calendar } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

const moods = [
  { id: 'bad', label: '😞 Bad', color: 'text-red-400', val: 1 },
  { id: 'neutral', label: '😐 Neutral', color: 'text-yellow-400', val: 2 },
  { id: 'good', label: '🙂 Good', color: 'text-green-400', val: 3 },
  { id: 'great', label: '😄 Great', color: 'text-primary', val: 4 },
];

export default function HomeDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [moodSubmitted, setMoodSubmitted] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, "users", user.uid);
  }, [user, firestore]);

  const { data: userProfile } = useDoc(userDocRef);

  const moodLogsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    const ref = collection(firestore, "users", user.uid, "moodLogs");
    return query(ref, orderBy("timestamp", "desc"), limit(7));
  }, [user, firestore]);

  const { data: moodLogs } = useCollection(moodLogsQuery);

  const recentJournalQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    const ref = collection(firestore, "users", user.uid, "journalEntries");
    return query(ref, orderBy("timestamp", "desc"), limit(3));
  }, [user, firestore]);

  const { data: recentEntries } = useCollection(recentJournalQuery);

  const handleMoodCheckIn = (moodId: string) => {
    if (!user || !firestore) return;
    const moodLogsRef = collection(firestore, "users", user.uid, "moodLogs");
    addDocumentNonBlocking(moodLogsRef, {
      userId: user.uid,
      mood: moodId,
      timestamp: serverTimestamp(),
    });
    setMoodSubmitted(true);
  };

  const chartData = moodLogs?.map(log => ({
    date: log.timestamp ? format((log.timestamp as any).toDate(), 'MMM dd') : '...',
    val: moods.find(m => m.id === log.mood)?.val || 0
  })).reverse() || [];

  return (
    <DashboardLayout pageTitle="Welcome Back">
      <div className="p-6 lg:p-10 space-y-8 bg-gradient-to-br from-black via-black to-amaranth/10 min-h-full">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Daily Check-In */}
          <Card className="col-span-1 md:col-span-2 bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">How are you feeling today?</CardTitle>
              <CardDescription>Your emotional state guides your personal growth journey.</CardDescription>
            </CardHeader>
            <CardContent>
              {!moodSubmitted ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {moods.map((m) => (
                    <Button
                      key={m.id}
                      variant="outline"
                      className="h-20 flex flex-col gap-2 rounded-2xl border-2 hover:border-primary hover:bg-primary/5 transition-all"
                      onClick={() => handleMoodCheckIn(m.id)}
                    >
                      <span className="text-lg">{m.label.split(' ')[0]}</span>
                      <span className="text-xs font-semibold">{m.label.split(' ')[1]}</span>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center animate-in fade-in slide-in-from-bottom-2">
                  <Laugh className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-headline font-bold">Thank you for checking in.</h3>
                  <p className="text-muted-foreground mt-1">Consistency is key to understanding your patterns.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card/40 border-border/50 backdrop-blur-sm overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Flame className="h-20 w-20 text-amaranth" />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-primary/5">
                <div className="flex items-center gap-3">
                  <Flame className="h-5 w-5 text-amaranth" />
                  <span className="text-sm font-semibold">Streak</span>
                </div>
                <span className="text-2xl font-bold font-headline">{userProfile?.streakCount || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-heliotrope/5">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-heliotrope" />
                  <span className="text-sm font-semibold">Reflections</span>
                </div>
                <span className="text-2xl font-bold font-headline">{userProfile?.totalEntries || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Mood Trend Chart */}
          <Card className="col-span-1 md:col-span-3 lg:col-span-2 bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Emotional Landscape
              </CardTitle>
              <CardDescription>Your mood trend over the past week.</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                  <YAxis hide domain={[0, 4]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="val" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#000' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Reflections */}
          <Card className="col-span-1 md:col-span-3 lg:col-span-1 bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Recent Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentEntries && recentEntries.length > 0 ? recentEntries.map((entry) => (
                <div key={entry.id} className="p-3 rounded-xl bg-muted/20 border border-white/5 hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {entry.timestamp ? format((entry.timestamp as any).toDate(), 'MMM dd') : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2 group-hover:text-foreground transition-colors">{entry.content}</p>
                </div>
              )) : (
                <div className="py-10 text-center text-muted-foreground italic">
                  No reflections yet. Start your journey today.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
