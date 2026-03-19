# LoreKeeper - D&D 5e Assistant

A specialized chatbot for D&D 5e lore and rules, built with Next.js and AI tools.

## Tech Stack
- **Framework**: Next.js 16.2.0 (App Router)
- **Styling**: Tailwind CSS 4, shadcn/ui
- **AI/ML**: Vercel AI SDK, Groq, Hugging Face (Inference), Pinecone (Vector DB)
- **Language**: TypeScript, React 19

## Key Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint

## Project Structure
- `src/app`: Routing and layout
- `src/components`: UI components (bot/user messages, chat input, etc.)
- `src/lib`: Logic for Hugging Face, Pinecone, and prompt engineering
- `data/`: Knowledge base and D&D lore data
