"use client";

import { useState } from "react";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatbotPersonalizedGuidance } from "@/ai/flows/chatbot-personalized-guidance";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Mock data as per the AI flow requirements
const mockProfile = `User is named Alex Doe. 
Wellness Goals: My main goal is to reduce stress and improve my sleep quality. I want to build a consistent morning routine that includes meditation and light exercise.`;

const mockJournalEntries = `July 20, 2024: Felt a bit overwhelmed today with work, but a short walk in the evening really helped clear my head.
July 19, 2024: Tried a 10-minute meditation this morning. It was difficult to focus, but I felt a bit calmer afterward.
July 18, 2024: Had a great conversation with a friend. It's amazing how much connecting with others can lift your spirits.`;

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello Alex! I'm your personal wellness assistant. How can I help you on your journey today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatbotPersonalizedGuidance({
        profile: mockProfile,
        journalEntries: mockJournalEntries,
        query: input,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.guidance,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching guidance:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Wellness Chatbot">
      <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-gradient-to-br from-gray-950 to-sky-900">
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${
                  message.role === "user" ? "justify-end" : ""
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 text-sm max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content.split('\n').map((line, index) => (
                    <p key={index} className={line.startsWith('*') ? 'font-bold mt-2' : ''}>{line}</p>
                  ))}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-9 w-9">
                     <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="@user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 text-sm bg-muted w-full max-w-[80%]">
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t bg-background/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSendMessage}
            className="relative overflow-hidden rounded-lg border max-w-3xl mx-auto"
          >
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                }
              }}
              disabled={isLoading}
            />
            <div className="flex items-center p-3 pt-0">
              <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={isLoading}>
                Send
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
