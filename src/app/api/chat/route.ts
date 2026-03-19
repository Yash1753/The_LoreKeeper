import { createGroq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages } from "ai";
import { getEmbedding } from "@/lib/huggingface";
import { searchPinecone } from "@/lib/pinecone";
import { buildSystemPrompt } from "@/lib/prompts";

// Initialize Groq client
const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        // Step 1: Parse the incoming messages
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(
                JSON.stringify({ error: "Invalid request: messages array is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Extract text from the latest message's parts array
        const lastMessage = messages[messages.length - 1];
        const latestQuestion = (lastMessage.parts || [])
            .filter((p: { type: string }) => p.type === "text")
            .map((p: { text: string }) => p.text)
            .join("") || lastMessage.content || "";

        // Step 2: Embed the question using HuggingFace
        let embedding: number[];
        try {
            embedding = await getEmbedding(latestQuestion);
        } catch (error) {
            console.error("Embedding error:", error);
            return new Response(
                JSON.stringify({
                    error:
                        "The knowledge archives are still waking up. Try again in a moment.",
                }),
                { status: 503, headers: { "Content-Type": "application/json" } }
            );
        }

        // Step 3: Search Pinecone for relevant D&D context
        let contextChunks: string;
        try {
            const matches = await searchPinecone(embedding, 5);

            if (matches.length === 0) {
                contextChunks =
                    "No specific SRD information found for this query. Answer based on general D&D 5e knowledge if possible, but note that the information may not be from the official SRD.";
            } else {
                contextChunks = matches
                    .map(
                        (match) =>
                            `[${(match.metadata.type as string) || "unknown"}: ${(match.metadata.name as string) || "unknown"}]\n${(match.metadata.text as string) || ""}`
                    )
                    .join("\n\n---\n\n");
            }
        } catch (error) {
            console.error("Pinecone search error:", error);
            contextChunks =
                "Unable to search the knowledge base at this time. Provide general guidance but note limitations.";
        }

        // Step 4: Build the system prompt with retrieved context
        const systemPrompt = buildSystemPrompt(contextChunks);

        // Step 5: Call Groq (Llama 3.1 70B) with streaming
        const result = streamText({
            model: groq('llama-3.3-70b-versatile'),
            system: systemPrompt,
            messages: await convertToModelMessages(messages),
        });

        // Step 6: Return the streaming response
        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Chat API error:", error);
        return new Response(
            JSON.stringify({
                error:
                    "The arcane connection seems disrupted. Please try again.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
