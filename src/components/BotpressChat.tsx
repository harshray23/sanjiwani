"use client";

import { useEffect } from "react";

export default function BotpressChat() {
  useEffect(() => {
    // Check if the script has already been injected
    if (document.getElementById("botpress-webchat-script")) {
      return;
    }

    const injectScript = document.createElement("script");
    injectScript.id = "botpress-webchat-script";
    injectScript.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
    injectScript.async = true;
    document.body.appendChild(injectScript);

    injectScript.onload = () => {
      const configScript = document.createElement("script");
      configScript.src =
        "https://files.bpcontent.cloud/2025/10/13/18/20251013185801-Z3TVPZ4W.js";
      configScript.defer = true;
      document.body.appendChild(configScript);
    };

    // No cleanup needed as we want the bot to persist across navigations
  }, []);

  return null; // The component itself doesn't render anything
}
