
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function JournalPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [newEntry, setNewEntry] = useState("");

  const entriesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    const entriesRef = collection(firestore, "users", user.uid, "journalEntries");
    return query(entriesRef, orderBy("entryDate", "desc"));
  }, [user, firestore]);

  const { data: journalEntries, isLoading } = useCollection(entriesQuery);

  const handleSaveEntry = () => {
    if (!firestore || !user || !newEntry.trim()) return;
    const entriesRef = collection(firestore, "users", user.uid, "journalEntries");
    addDocumentNonBlocking(entriesRef, {
      userId: user.uid,
      content: newEntry,
      entryDate: serverTimestamp(),
    });
    setNewEntry("");
    toast({
      title: "Entry Saved",
      description: "Your journal entry has been saved.",
    });
  };

  return (
    <DashboardLayout pageTitle="Journal">
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-gradient-to-br from-black to-indigo-900 min-h-full">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">New Entry</CardTitle>
            <CardDescription>
              What&apos;s on your mind today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Reflect on your day, your feelings, and your experiences..."
              className="min-h-[150px]"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveEntry} disabled={!newEntry.trim() || !user}>Save Entry</Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight font-headline">Past Entries</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading && Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
              </Card>
            ))}
            {journalEntries?.map((entry) => (
              <Card key={entry.id} className="transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]">
                <CardHeader>
                  <CardTitle className="text-lg">
                     {entry.entryDate ? format((entry.entryDate as any).toDate(), 'MMMM dd, yyyy') : "Just now"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{entry.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
