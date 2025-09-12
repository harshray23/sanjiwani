
"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { streamChat } from '@/ai/flows/medibot-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Lottie from 'lottie-react';
import botAnimation from '@/assets/animations/Loading_Screen.json';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export default function MediBotPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: "Hello! I'm MediBot. How can I assist you with Sanjiwani Health services today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the bottom when messages change
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        const currentInput = input;
        
        // Add user message and an empty bot message for the loading state
        setMessages((prev) => [...prev, userMessage, { role: 'model', content: '' }]);
        setInput('');
        setIsLoading(true);

        try {
            const historyWithoutWelcome = messages.slice(1); // Exclude initial hardcoded message
            const stream = await streamChat({
                history: historyWithoutWelcome,
                query: currentInput,
            });

            for await (const chunk of stream) {
                setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'model') {
                        lastMessage.content += chunk;
                    }
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Error calling MediBot flow:", error);
            setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'model') {
                    lastMessage.content = "I'm sorry, something went wrong on my end. Please try again in a moment.";
                }
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-[80vh] flex justify-center items-center py-8">
            <Card className="w-full max-w-2xl h-full flex flex-col shadow-2xl">
                <CardHeader className="text-center border-b">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                        <Bot className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-headline text-accent">MediBot</CardTitle>
                    <CardDescription>Your AI Health Assistant</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow p-0 overflow-hidden">
                    <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex items-start gap-3",
                                        message.role === 'user' && "justify-end"
                                    )}
                                >
                                    {message.role === 'model' && (
                                        <Avatar className="border-2 border-primary/50">
                                            <AvatarFallback className="bg-primary/20"><Bot className="text-primary" /></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div
                                        className={cn(
                                            "p-3 rounded-lg max-w-md",
                                            message.role === 'user'
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted",
                                            message.role === 'model' && message.content === '' && "flex items-center justify-center"
                                        )}
                                    >
                                        {message.role === 'model' && message.content === '' ? (
                                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                        ) : (
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        )}
                                    </div>
                                    {message.role === 'user' && (
                                        <Avatar>
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 border-t">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="w-full flex items-center gap-2"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about appointments, doctors, etc..."
                            className="h-12 text-base"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" className="h-12 w-12 shrink-0" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
