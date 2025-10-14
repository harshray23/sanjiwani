"use client";

import Script from "next/script";

export default function BotpressChat() {
  return (
    <>
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://files.bpcontent.cloud/2025/10/13/18/20251013185801-Z3TVPZ4W.js"
        strategy="afterInteractive"
        defer
      />
    </>
  );
}
