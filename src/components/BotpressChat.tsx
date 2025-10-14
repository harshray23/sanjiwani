"use client";

import Script from "next/script";

export default function BotpressChat() {
  return (
    <>
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"
        strategy="afterInteractive"
        onLoad={() => {
          if ((window as any).botpressWebChat) {
            (window as any).botpressWebChat.init({
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
              "subtitle": "Ask your questions here",
            });
          } else {
             console.error("Botpress webchat script not loaded.");
          }
        }}
      />
    </>
  );
}
