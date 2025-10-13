"use client";

import { useEffect } from "react";

export default function BotpressChat() {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2025/10/13/18/20251013185801-Z3TVPZ4W.js";
    script2.defer = true;
    document.body.appendChild(script2);

    return () => {
      // Find and remove the scripts by their src to avoid issues if they are moved in the DOM
      const injectedScript1 = document.querySelector('script[src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"]');
      if (injectedScript1 && document.body.contains(injectedScript1)) {
        document.body.removeChild(injectedScript1);
      }

      const injectedScript2 = document.querySelector('script[src="https://files.bpcontent.cloud/2025/10/13/18/20251013185801-Z3TVPZ4W.js"]');
      if (injectedScript2 && document.body.contains(injectedScript2)) {
        document.body.removeChild(injectedScript2);
      }
    };
  }, []);

  return null;
}
