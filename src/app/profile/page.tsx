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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userRef);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [wellnessGoals, setWellnessGoals] = useState("");

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || user?.displayName || "");
      setEmail(userProfile.email || user?.email || "");
      setWellnessGoals(userProfile.wellnessGoals || "");
    } else if (user) {
      // pre-fill from auth user if no profile yet
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [userProfile, user]);

  const handleSaveChanges = () => {
    if (!userRef || !user) return;
    const dataToSave = {
      id: user.uid,
      email: user.email, // email cannot be changed here
      displayName: displayName,
      wellnessGoals: wellnessGoals,
    };
    setDocumentNonBlocking(userRef, dataToSave, { merge: true });
    toast({
      title: "Profile Saved",
      description: "Your changes have been saved successfully.",
    });
  };
  
  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Profile">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-28" />
              </CardFooter>
            </Card>
            <Card className="lg:col-span-2">
               <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
              <CardFooter>
                 <Skeleton className="h-10 w-28" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Profile">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gradient-to-br from-black via-teal-800 to-green-800">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">Wellness Goals</CardTitle>
              <CardDescription>
                Define and track your wellness objectives. This will help the AI guide you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Meditate 10 minutes daily, exercise 3 times a week, practice gratitude..."
                className="min-h-[200px]"
                value={wellnessGoals}
                onChange={(e) => setWellnessGoals(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Goals</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
