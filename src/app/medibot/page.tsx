
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { useEffect } from 'react';

export default function MediBotPage() {
    useEffect(() => {
        // The Botpress webchat is injected globally via the script tags in layout.tsx.
        // This page component can be used to provide context or specific instructions.
        // If the chat widget has an API, you could use it here to open it automatically, for example:
        // (window as any).botpressWebChat.send({ type: 'show' });
    }, []);

  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-center h-[70vh]">
      <Card className="text-center p-8 shadow-2xl">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <Bot className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline text-accent">AI Health Assistant</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Our AI-powered assistant is here to help you.
            <br />
            You can open it anytime using the chat icon at the bottom right of your screen.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
