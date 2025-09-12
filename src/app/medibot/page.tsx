'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { streamChat } from '@/ai/flows/medibot-flow';
import type { MediBotInput } from '@/ai/flows/medibot-flow';
import { Loader2, Bot, User, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const formSchema = z.object({
  query: z.string().min(1, 'Message cannot be empty.'),
});

export default function MediBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Hello! I am Medi+Bot, your personal health assistant from Sanjiwani. How can I help you today?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.children[0] as HTMLDivElement;
        if (viewport) {
             viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStreamResponse = async (stream: AsyncGenerator<string>) => {
    let fullResponse = '';
    for await (const chunk of stream) {
      fullResponse += chunk;
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1].role === 'model') {
          newMessages[newMessages.length - 1].content = fullResponse;
        }
        return newMessages;
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const newUserMessage: Message = { role: 'user', content: values.query };
    const newMessages: Message[] = [...messages, newUserMessage];
    setMessages([...newMessages, { role: 'model', content: '' }]);
    form.reset();

    try {
      const history = newMessages.slice(0, -1).filter(m => m.role === 'user' || m.role === 'model');
      const stream = await streamChat({
        history: history,
        query: values.query,
      } as MediBotInput);
      await handleStreamResponse(stream);
    } catch (error) {
      console.error('Error streaming chat:', error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'model',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="h-[80vh] flex flex-col shadow-2xl">
        <CardHeader className="text-center border-b">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline text-accent">Medi+Bot</CardTitle>
          <CardDescription>Your AI Health Assistant</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-4',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8 border-2 border-primary/50">
                      <AvatarFallback className="bg-primary/20">
                        <Bot className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-md',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    )}
                  >
                    {message.content ? (
                      <p>{message.content}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    )}
                  </div>
                   {message.role === 'user' && (
                    <Avatar className="h-8 w-8 border-2 border-muted">
                      <AvatarFallback className="bg-muted">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t bg-muted/50">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input
                          placeholder="Ask about services, doctors, or health topics..."
                          className="h-12 text-base"
                          autoComplete="off"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" disabled={isLoading} className="h-12 w-12 p-0">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
