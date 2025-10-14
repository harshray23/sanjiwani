
"use client";

import { useEffect } from "react";

export default function BotpressChat() {
  useEffect(() => {
    // Defer script injection until after the current browser event loop has finished.
    // This helps prevent race conditions where the script tries to initialize
    // while the React component tree is still mounting or unmounting (e.g., AppLoader).
    const timer = setTimeout(() => {
      const script1 = document.createElement("script");
      script1.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
      script1.async = true;
      script1.id = "botpress-inject";
      document.body.appendChild(script1);

      const script2 = document.createElement("script");
      script2.src = "https://files.bpcontent.cloud/2025/10/13/18/20251013185801-Z3TVPZ4W.js";
      script2.defer = true;
      script2.id = "botpress-config";
      document.body.appendChild(script2);
    }, 0);

    return () => {
      clearTimeout(timer);
      const script1 = document.getElementById("botpress-inject");
      const script2 = document.getElementById("botpress-config");
      
      if (script1 && document.body.contains(script1)) {
        document.body.removeChild(script1);
      }
      if (script2 && document.body.contains(script2)) {
        document.body.removeChild(script2);
      }
    };
  }, []);

  return null;
}
