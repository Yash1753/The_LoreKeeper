import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const MAX_RETRIES = 2;
const COLD_START_WAIT_MS = 20000;

/**
 * Get the embedding vector for a given text using HuggingFace's
 * sentence-transformers/all-MiniLM-L6-v2 model.
 * Returns a 384-dimension float array.
 *
 * Handles cold start (503) errors by waiting and retrying.
 */
export async function getEmbedding(text: string): Promise<number[]> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await hf.featureExtraction({
                model: EMBEDDING_MODEL,
                inputs: text,
            });

            // The response is a nested array; flatten to a 1D array
            const embedding = Array.isArray(response[0])
                ? (response as number[][]).flat()
                : (response as number[]);

            return embedding;
        } catch (error: unknown) {
            lastError = error as Error;
            const message =
                error instanceof Error ? error.message : String(error);

            // Handle cold start — model loading
            if (message.includes("503") || message.includes("loading")) {
                console.warn(
                    `HuggingFace model loading (attempt ${attempt + 1}/${MAX_RETRIES}). Waiting ${COLD_START_WAIT_MS / 1000}s...`
                );
                await new Promise((resolve) =>
                    setTimeout(resolve, COLD_START_WAIT_MS)
                );
                continue;
            }

            throw error;
        }
    }

    throw new Error(
        `Failed to get embedding after ${MAX_RETRIES} attempts: ${lastError?.message}`
    );
}

/**
 * Get embeddings for multiple texts in a batch.
 * Used by the knowledge base build script.
 */
export async function getEmbeddingsBatch(
    texts: string[]
): Promise<number[][]> {
    const embeddings: number[][] = [];

    for (const text of texts) {
        const embedding = await getEmbedding(text);
        embeddings.push(embedding);
    }

    return embeddings;
}

export { hf, EMBEDDING_MODEL };
