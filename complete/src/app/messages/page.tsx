"use client";

import { items, users, messages as allMessages } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal, ArrowLeft, MessageSquare, Languages } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";
import { translateText } from "@/ai/flows/translate-text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Message = (typeof allMessages)['1'][0];
type TranslatedMessage = Message & { translatedText?: string };

// Mocking current user
const currentUserId = 'user-1';

export default function MessagesPage() {
  const { toast } = useToast();
  // For demonstration, we'll use the first conversation.
  const activeConversationId = '1';
  const initialMessages = allMessages[activeConversationId as keyof typeof allMessages] || [];
  const relatedItem = items.find(item => item.id === activeConversationId);
  const otherUser = users.find(user => user.id !== currentUserId);

  const [messages, setMessages] = useState<TranslatedMessage[]>(initialMessages);
  const [targetLanguage, setTargetLanguage] = useState<string>("original");
  const [isTranslating, setIsTranslating] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageChange = async (lang: string) => {
    setTargetLanguage(lang);
    if (lang === "original") {
      setMessages(initialMessages.map(m => ({ ...m, translatedText: undefined })));
      return;
    }

    setIsTranslating(true);
    try {
      const translatedMessages = await Promise.all(
        initialMessages.map(async (msg) => {
          const result = await translateText({ text: msg.text, targetLanguage: lang });
          return { ...msg, translatedText: result.translatedText };
        })
      );
      setMessages(translatedMessages);
    } catch (error) {
      console.error("Translation failed", error);
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: "Could not translate messages. Please try again.",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message: TranslatedMessage = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      timestamp: new Date().toISOString(),
      senderId: currentUserId,
      receiverId: otherUser?.id || '',
    };
    
    // Optimistically add the new message
    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // If a language is selected, translate the new message
    if (targetLanguage !== "original") {
       translateText({ text: message.text, targetLanguage })
         .then(result => {
           setMessages(prev => prev.map(m => m.id === message.id ? { ...m, translatedText: result.translatedText } : m));
         })
         .catch(err => console.error("Failed to translate new message", err));
    }
  };

  return (
    <div className="flex-1 w-full">
      <Card className="h-full shadow-lg flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full flex-1">
          <div className="hidden md:flex flex-col border-r">
            <CardHeader className="p-4 border-b">
              <h2 className="text-xl font-bold font-headline">Conversations</h2>
            </CardHeader>
            <ScrollArea className="flex-1">
              {/* Active Conversation */}
              <div className="p-4 bg-accent/50 border-b-2 border-l-4 border-l-primary cursor-pointer">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                     <Image src={relatedItem?.imageUrl || ''} alt={relatedItem?.name || ''} width={48} height={48} className="object-cover" />
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold truncate">{relatedItem?.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{messages.at(-1)?.text}</p>
                  </div>
                </div>
              </div>
              {/* Other conversations can be listed here */}
            </ScrollArea>
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col h-full">
            {relatedItem && otherUser ? (
              <>
                <CardHeader className="p-4 border-b flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Button variant="ghost" size="icon" className="md:hidden" asChild>
                        <Link href="#"><ArrowLeft /></Link>
                     </Button>
                    <Avatar>
                      <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                      <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{otherUser.name}</p>
                      <p className="text-sm text-muted-foreground">Regarding: <Link href={`/item/${relatedItem.id}`} className="hover:underline text-primary">{relatedItem.name}</Link></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-muted-foreground"/>
                    <Select onValueChange={handleLanguageChange} value={targetLanguage} disabled={isTranslating}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Translate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original Language</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Telugu">Telugu</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>

                <ScrollArea className="flex-1 p-4 md:p-6 bg-secondary/20">
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div key={msg.id} className={cn("flex gap-3", msg.senderId === currentUserId ? 'justify-end' : 'justify-start')}>
                        {msg.senderId !== currentUserId && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={otherUser.avatarUrl} />
                            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={cn(
                          "max-w-xs lg:max-w-md p-3 rounded-xl shadow-sm",
                          msg.senderId === currentUserId
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background'
                        )}>
                          <p>{msg.text}</p>
                          {msg.translatedText && (
                            <p className="border-t border-dashed mt-2 pt-2 opacity-80">{msg.translatedText}</p>
                          )}
                           {isClient && <p className={cn("text-xs mt-1 text-right", msg.senderId === currentUserId ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                        </div>
                      </div>
                    ))}
                    {isTranslating && (
                       <div className="text-center py-4 text-sm text-muted-foreground">Translating...</div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t bg-background">
                  <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
                    <Input placeholder="Type your message..." className="flex-1" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                    <Button type="submit" size="icon">
                      <SendHorizonal className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageSquare className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-xl font-semibold">Select a conversation</h3>
                <p className="text-muted-foreground">Your chats about lost and found items will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
