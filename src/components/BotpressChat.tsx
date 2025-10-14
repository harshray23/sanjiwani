
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
      // Use the variables to ensure we remove the correct elements.
      if (document.body.contains(script1)) {
        document.body.removeChild(script1);
      }
      if (document.body.contains(script2)) {
        document.body.removeChild(script2);
      }
    };
  }, []);

  return null;
}
