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
import { useUser, useFirestore, useCollection, addDocumentNonBlocking, useMemoFirebase } from "@/firebase";
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

  const entriesRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, "users", user.uid, "journalEntries");
  }, [user, firestore]);

  const entriesQuery = useMemoFirebase(() => {
    if (!entriesRef) return null;
    return query(entriesRef, orderBy("entryDate", "desc"));
  }, [entriesRef]);

  const { data: journalEntries, isLoading } = useCollection(entriesQuery);

  const handleSaveEntry = () => {
    if (!entriesRef || !newEntry.trim()) return;
    addDocumentNonBlocking(entriesRef, {
      userId: user?.uid,
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
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-gradient-to-br from-black to-green-800 min-h-full">
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
            <Button onClick={handleSaveEntry}>Save Entry</Button>
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
              <Card key={entry.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                     {entry.entryDate ? format(entry.entryDate.toDate(), 'MMMM dd, yyyy') : "Just now"}
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
