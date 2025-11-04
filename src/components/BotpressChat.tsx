"use client";

import { useEffect } from "react";

export default function BotpressChat() {
  useEffect(() => {
    // Check if the script has already been injected to prevent re-adding it
    if (document.getElementById("botpress-webchat-script")) {
      return;
    }

    const injectScript = document.createElement("script");
    injectScript.id = "botpress-webchat-script";
    injectScript.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
    injectScript.async = true;
    
    injectScript.onload = () => {
      // Once the main script is loaded, load the specific bot configuration.
      const configScript = document.createElement("script");
      configScript.src =
        "https://files.bpcontent.cloud/2025/10/13/18/20251013185801-Z3TVPZ4W.js";
      configScript.defer = true;
      document.body.appendChild(configScript);
    };

    document.body.appendChild(injectScript);
    
    // We don't return a cleanup function to remove the scripts,
    // as the chatbot should persist across page navigations.
  }, []);

  return null; // This component does not render any visible UI itself.
}
