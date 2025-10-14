
"use client";

import { useEffect } from "react";

export default function BotpressChat() {
  useEffect(() => {
    // Defer script injection until after the current browser event loop has finished.
    // This helps prevent race conditions where the script tries to initialize
    // while the React component tree is still mounting or unmounting (e.g., AppLoader).
    const timer = setTimeout(() => {
      // Set configuration on the window object before injecting the scripts
      (window as any).botpressWebChat = {
        "composerPlaceholder": "Chat with Sanjiwani Health Assistant",
        "botConversationDescription": "Your AI health assistant. How can I help you today?",
        "botId": "5e17a157-12c5-455c-af73-b7f32a762953",
        "hostUrl": "https://cdn.botpress.cloud/webchat/v3.3",
        "messagingUrl": "https://messaging.botpress.cloud",
        "clientId": "5e17a157-12c5-455c-af73-b7f32a762953",
        "webhookId": "2025/10/13/18",
        "lazySocket": true,
        "themeName": "prism",
        "botName": "Sanjiwani",
        "stylesheet": "https://files.bpcontent.cloud/2025/10/13/18/20251013185801-HP3GRNLV.css",
        "frontendVersion": "v3.3",
        "useSessionStorage": true,
        "enableConversationDeletion": true,
        "theme": "prism",
        "themeColor": "#2563eb",
        // This is the new line that adds the subtitle
        "subtitle": "Ask your questions here"
      };

      const script1 = document.createElement("script");
      script1.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
      script1.async = true;
      script1.id = "botpress-inject";
      document.body.appendChild(script1);

    }, 0);

    return () => {
      clearTimeout(timer);
      const script1 = document.getElementById("botpress-inject");
      if (script1 && document.body.contains(script1)) {
        document.body.removeChild(script1);
      }
      const chatContainer = document.getElementById("botpress-webchat-container");
      if (chatContainer && chatContainer.parentElement) {
          chatContainer.parentElement.removeChild(chatContainer);
      }
    };
  }, []);

  return null;
}
