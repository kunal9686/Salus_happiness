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

const journalEntries = [
  {
    date: "July 20, 2024",
    content: "Felt a bit overwhelmed today with work, but a short walk in the evening really helped clear my head. I need to remember to take breaks more often. Grateful for the quiet moments.",
  },
  {
    date: "July 19, 2024",
    content: "Tried a 10-minute meditation this morning. It was difficult to focus, but I felt a bit calmer afterward. I'll try again tomorrow. The quiet start to the day was nice.",
  },
  {
    date: "July 18, 2024",
    content: "Had a great conversation with a friend. It's amazing how much connecting with others can lift your spirits. I should make more time for people who matter.",
  },
];

export default function JournalPage() {
  return (
    <DashboardLayout pageTitle="Journal">
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-gradient-to-br from-gray-950 to-green-900 min-h-full">
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
            />
          </CardContent>
          <CardFooter>
            <Button>Save Entry</Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight font-headline">Past Entries</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {journalEntries.map((entry, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{entry.date}</CardTitle>
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
