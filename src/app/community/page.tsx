"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { useUser, useFirestore, useCollection, addDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query, serverTimestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CommunityPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newThreadCategory, setNewThreadCategory] = useState("");

  const postsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "communityPosts");
  }, [firestore]);

  const postsQuery = useMemoFirebase(() => {
    if (!postsRef) return null;
    return query(postsRef, orderBy("postDate", "desc"));
  }, [postsRef]);

  const { data: threads, isLoading } = useCollection(postsQuery);

  const handleStartNewThread = () => {
    if (!postsRef || !user || !newThreadTitle.trim() || !newThreadContent.trim()) return;

    addDocumentNonBlocking(postsRef, {
      title: newThreadTitle,
      content: newThreadContent,
      category: newThreadCategory,
      authorName: user.displayName,
      userId: user.uid,
      postDate: serverTimestamp(),
      likes: 0,
      replies: 0,
    });
    
    setNewThreadTitle("");
    setNewThreadContent("");
    setNewThreadCategory("");
    setOpen(false);
    toast({
      title: "Thread Posted",
      description: "Your new discussion has been started.",
    });
  };

  return (
    <DashboardLayout pageTitle="Community Forum">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-gradient-to-br from-black to-teal-800 min-h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight font-headline">Discussions</h2>
           <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={!user}>Start New Thread</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Start a New Discussion</DialogTitle>
                <DialogDescription>
                  Share your thoughts with the community. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" value={newThreadTitle} onChange={(e) => setNewThreadTitle(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input id="category" value={newThreadCategory} onChange={(e) => setNewThreadCategory(e.target.value)} className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="content" className="text-right mt-2">
                    Content
                  </Label>
                  <Textarea id="content" value={newThreadContent} onChange={(e) => setNewThreadContent(e.target.value)} className="col-span-3 min-h-[100px]" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleStartNewThread}>Post Thread</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4">
          {isLoading && Array.from({ length: 4 }).map((_, index) => (
             <Card key={index}>
              <CardHeader>
                 <Skeleton className="h-5 w-1/4 mb-2" />
                 <Skeleton className="h-7 w-3/4" />
                 <Skeleton className="h-4 w-1/2 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-10 w-32" />
              </CardFooter>
            </Card>
          ))}
          {threads?.map((thread) => (
            <Card key={thread.id} className="hover:shadow-lg transition-all duration-300 ease-in-out">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    {thread.category && <Badge variant="secondary" className="mb-2">{thread.category}</Badge>}
                    <CardTitle className="font-headline text-xl">{thread.title}</CardTitle>
                    <CardDescription>by {thread.authorName}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{thread.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{thread.replies || 0} Replies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{thread.likes || 0} Likes</span>
                  </div>
                </div>
                <Button variant="outline">Join Discussion</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
