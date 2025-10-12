
import { streamChat } from "@/ai/flows/medibot-flow";

(async () => {
  console.log("Starting AI flow test for MediBot...");
  
  const testInput = {
    history: [
      { role: "user", content: "Hi MediBot" },
      { role: "model", content: "Hello! How can I assist you today?" },
    ],
    query: "Find a cardiologist in Pune",
  };

  try {
    const stream = await streamChat(testInput);
    
    console.log("\n--- MediBot Response Stream ---\n");
    let fullResponse = "";
    for await (const chunk of stream) {
      process.stdout.write(chunk);
      fullResponse += chunk;
    }
    console.log("\n\n--- End of Stream ---");

    if (fullResponse.length > 0) {
      console.log("\n\n✅ Test Passed: Stream received content successfully.");
    } else {
      console.error("\n\n❌ Test Failed: Stream completed but produced no content.");
    }

  } catch (error) {
    console.error("\n\n❌ Test Failed: An error occurred during the test run.", error);
  }
})();
