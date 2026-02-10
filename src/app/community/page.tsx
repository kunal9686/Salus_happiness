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

const threads = [
  {
    title: "Morning Meditation - Tips for Beginners",
    author: "Jane D.",
    category: "Mindfulness",
    replies: 12,
    likes: 34,
    excerpt: "I'm new to meditation and struggling to stay focused. What are your tips for building a consistent morning practice? Any apps or guided meditations you recommend?",
  },
  {
    title: "Favorite Healthy & Quick Recipes",
    author: "Carlos R.",
    category: "Nutrition",
    replies: 45,
    likes: 102,
    excerpt: "Let's share our go-to healthy meals that don't take forever to make! I'll start: quinoa bowls with black beans, corn, and avocado.",
  },
  {
    title: "Dealing with Mid-day Slumps",
    author: "Aisha K.",
    category: "Energy",
    replies: 23,
    likes: 56,
    excerpt: "Around 2 PM, my energy just crashes. What do you all do to stay energized and focused through the afternoon without relying on tons of caffeine?",
  },
  {
    title: "Best local hiking trails?",
    author: "Tom B.",
    category: "Fitness",
    replies: 8,
    likes: 21,
    excerpt: "Looking for some new scenery for my weekend walks. Does anyone have recommendations for beautiful and moderately challenging hiking trails in the area?",
  },
];

export default function CommunityPage() {
  return (
    <DashboardLayout pageTitle="Community Forum">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-gradient-to-br from-gray-950 to-teal-900 min-h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight font-headline">Discussions</h2>
          <Button>Start New Thread</Button>
        </div>
        <div className="space-y-4">
          {threads.map((thread, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="secondary" className="mb-2">{thread.category}</Badge>
                    <CardTitle className="font-headline text-xl">{thread.title}</CardTitle>
                    <CardDescription>by {thread.author}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{thread.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{thread.replies} Replies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{thread.likes} Likes</span>
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
