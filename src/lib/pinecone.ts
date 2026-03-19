import { Pinecone } from "@pinecone-database/pinecone";

// Initialize the Pinecone client
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

// Get the index reference
const indexName = process.env.PINECONE_INDEX_NAME || "dnd5e-knowledge";

/**
 * Search Pinecone for the most similar chunks to the given embedding vector.
 * @param embedding - The 384-dimension embedding vector from HuggingFace
 * @param topK - Number of top results to return (default: 5)
 * @returns Array of matching chunks with score, metadata, and text
 */
export async function searchPinecone(
    embedding: number[],
    topK: number = 5
): Promise<
    Array<{
        id: string;
        score: number;
        metadata: Record<string, unknown>;
    }>
> {
    const index = pinecone.index(indexName);

    const queryResponse = await index.query({
        vector: embedding,
        topK,
        includeMetadata: true,
    });

    return (queryResponse.matches || []).map((match) => ({
        id: match.id,
        score: match.score || 0,
        metadata: (match.metadata as Record<string, unknown>) || {},
    }));
}

/**
 * Get the Pinecone index stats (useful for verification).
 */
export async function getIndexStats() {
    const index = pinecone.index(indexName);
    return await index.describeIndexStats();
}

export { pinecone, indexName };
