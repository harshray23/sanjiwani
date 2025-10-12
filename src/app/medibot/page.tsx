
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
import ReactMarkdown from 'react-markdown';


interface Message {
  role: 'user' | 'model';
  content: string;
}

const formSchema = z.object({
  query: z.string().min(1, 'Message cannot be empty.'),
});

export default function MediBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });
  
  // Effect to send initial greeting
  useEffect(() => {
    // Set a predefined initial greeting from the bot.
    if (messages.length === 0) {
        setMessages([
            { role: 'model', content: "Hello! I'm Sanjiwani Health Assistant, your AI health assistant. How can I help you today?" }
        ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTo({ top: scrollViewportRef.current.scrollHeight, behavior: 'smooth' });
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
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'model') {
          newMessages[newMessages.length - 1].content = fullResponse;
        }
        return newMessages;
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true);

    const newUserMessage: Message = { role: 'user', content: values.query };
    const currentMessages = [...messages, newUserMessage];
    setMessages([...currentMessages, { role: 'model', content: '' }]);
    form.reset();

    try {
      // Clean & sanitize before sending to API
      const history = currentMessages
        .slice(0, -1)
        .filter(m => m.role === 'user' || m.role === 'model')
        .map(m => ({
          role: m.role,
          content: String(m.content ?? '').trim(),
        }));

      const stream = await streamChat({
        history,
        query: String(values.query ?? '').trim(),
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
          <ScrollArea className="flex-1 p-6" viewportRef={scrollViewportRef}>
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
                      'max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-md prose dark:prose-invert',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    )}
                  >
                    {message.content ? (
                      <ReactMarkdown
                         components={{
                           p: ({node, ...props}) => <p className="my-0" {...props} />,
                           ul: ({node, ...props}) => <ul className="my-2 pl-4" {...props} />,
                           li: ({node, ...props}) => <li className="my-1" {...props} />
                         }}
                      >{message.content}</ReactMarkdown>
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
               {messages.length === 0 && isLoading && (
                 <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Contacting Medi+Bot...</span>
                  </div>
              )}
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
