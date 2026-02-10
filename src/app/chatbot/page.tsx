"use client";

import { useState, useEffect, useRef } from "react";
import { CornerDownLeft } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatbotPersonalizedGuidance } from "@/ai/flows/chatbot-personalized-guidance";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, useFirestore, useCollection, useDoc, addDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, doc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Create a new chat session when the user is available
  useEffect(() => {
    if (user && firestore && !sessionId) {
      const sessionsRef = collection(firestore, "users", user.uid, "chatbotSessions");
      addDocumentNonBlocking(sessionsRef, {
        userId: user.uid,
        startTime: serverTimestamp(),
      }).then(docRef => {
        if (docRef) {
          setSessionId(docRef.id);
        }
      });
    }
  }, [user, firestore, sessionId]);

  const messagesRef = useMemoFirebase(() => {
    if (!user || !firestore || !sessionId) return null;
    return collection(firestore, "users", user.uid, "chatbotSessions", sessionId, "chatMessages");
  }, [user, firestore, sessionId]);

  const messagesQuery = useMemoFirebase(() => {
    if (!messagesRef) return null;
    return query(messagesRef, orderBy("messageTime"));
  }, [messagesRef]);

  const { data: messages, isLoading: isLoadingMessages } = useCollection<Omit<Message, 'id'>>(messagesQuery);
  
  const scrollToBottom = () => {
    setTimeout(() => {
      const scrollableView = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableView) {
        scrollableView.scrollTo({ top: scrollableView.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };
  
  useEffect(() => {
      scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !messagesRef || !user || !firestore) return;

    const userInput = input;
    setInput("");
    
    // Save user message
    addDocumentNonBlocking(messagesRef, {
      role: 'user',
      content: userInput,
      messageTime: serverTimestamp(),
    });
    
    setIsLoading(true);
    scrollToBottom();

    try {
      // Fetch profile and journal for context
      const userRef = doc(firestore, "users", user.uid);
      const journalRef = collection(firestore, "users", user.uid, "journalEntries");
      
      const [userDoc, journalSnapshot] = await Promise.all([
        useDoc(userRef),
        getDocs(query(journalRef, orderBy("entryDate", "desc"))),
      ]);
      
      const profileData = (userDoc.data as any) ?? {};
      const journalEntries = journalSnapshot.docs.map(d => d.data().content).join("\n---\n");

      const profile = `Display Name: ${profileData.displayName}\nWellness Goals: ${profileData.wellnessGoals}`;

      const response = await chatbotPersonalizedGuidance({
        profile,
        journalEntries,
        query: userInput,
      });

      // Save assistant message
      addDocumentNonBlocking(messagesRef, {
        role: 'assistant',
        content: response.guidance,
        messageTime: serverTimestamp(),
      });

    } catch (error) {
      console.error("Error fetching guidance:", error);
      addDocumentNonBlocking(messagesRef, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        messageTime: serverTimestamp(),
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <DashboardLayout pageTitle="Wellness Chatbot">
      <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-gradient-to-br from-black to-sky-800">
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
          <div className="space-y-6 max-w-3xl mx-auto">
            {!isLoadingMessages && !messages?.length && (
               <div className="flex items-start gap-4">
                  <Avatar className="h-9 w-9"><AvatarFallback>A</AvatarFallback></Avatar>
                  <div className="rounded-lg p-3 text-sm bg-muted">
                    <p>Hello! I&apos;m your personal wellness assistant. How can I help you on your journey today?</p>
                  </div>
              </div>
            )}
            {messages?.map((message) => (
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
                     <AvatarImage src={user?.photoURL ?? "https://picsum.photos/seed/user/40/40"} alt={user?.displayName ?? "user"} />
                    <AvatarFallback>{user?.displayName?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
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
              disabled={isLoading || !user}
            />
            <div className="flex items-center p-3 pt-0">
              <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={isLoading || !user || !input.trim()}>
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
