# 🎲 The Lorekeeper

The Lorekeeper is a dedicated Dungeons & Dragons 5th Edition (D&D 5e) rules companion and chatbot. It is designed to assist players and Dungeon Masters by providing quick access to rules, spells, monsters, and mechanics from the Systems Reference Document (SRD).

## ⚔️ Why This Project?

I've always been drawn to games especially the worlds, the mechanics, the depth behind every system. When I played **Baldur's Gate 3** (Game of the Year 2023), I was completely captivated. It was my gateway into the world of Dungeons & Dragons 5th Edition. Every spell, every saving throw, every class feature in BG3 traces back to the D&D 5e ruleset, and I found myself constantly looking things up mid-session.

That experience is exactly why I chose this topic for my chatbot. D&D 5e has a massive rulebook, hundreds of spells, complex monster stat blocks, and mechanics that interact in non-obvious ways. A chatbot that can instantly look up rules and explain them in plain language isn't just a technical exercise, it's something I genuinely wanted to build.

## ⚙️ How It Works

The Lorekeeper uses a **Retrieval-Augmented Generation (RAG)** architecture to provide accurate D&D 5e rule interpretations.

### 🔄 The Chat Flow

1.  **User Input**: The player asks a question about a rule, spell, or monster.
2.  **Semantic Embedding**: The query is converted into a high-dimensional vector using HuggingFace's `all-MiniLM-L6-v2` model.
3.  **Vector Search**: The system searches **Pinecone** for the top-5 most relevant rule chunks from the SRD.
4.  **Context Construction**: The retrieved rule text is injected into a specialized "Lorekeeper" system prompt.
5.  **Inference**: The augmented prompt is sent to **Llama 3.3 70B** (via Groq) for high-speed, accurate rule parsing.
6.  **Streaming Response**: The AI's response is streamed back to the frontend in real-time using the **AI SDK**.

### 📦 The Knowledge Base

The ruleset consists of **~2,000 unique records** from the [5e SRD JSON Database](https://github.com/5e-bits/5e-database).Each record is:
1.  **Normalized**: Structured JSON is converted into a readable, markdown-ready format.
2.  **Embedded**: Batch-processed into vectors for semantic indexing.
3.  **Indexed**: Stored in a specialized vector database for sub-second retrieval.

## 📚 Knowledge Base

The knowledge base contains **~2,000 chunks** built from the [5e SRD JSON Database](https://github.com/5e-bits/5e-database) (Open Game License). Chunks cover spells, monsters, classes, races, conditions, equipment, feats, magic items, and core rules.

## 📜 Features

- **Instant Rule Access**: Ask about any spell, class, or monster.
- **D&D 5e SRD Knowledge**: Built-in support for the full Systems Reference Document.
- **Smooth Interface**: A thematic, immersive chat experience designed for fantasy enthusiasts.
- **Suggested Queries**: Quickly find information about common mechanics like AC, Leveling, or specific spells.

## 🛠️ Built With

- **Next.js**: For a fast, responsive web application.
- **AI SDK**: Powering the intelligent rule-parsing and conversational interface.
- **Tailwind CSS**: For a custom, parchment-inspired fantasy aesthetic.
- **SRD Data**: Leveraging a comprehensive database of D&D 5e rules.

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
*The Lorekeeper references the D&D 5e SRD. Not affiliated with Wizards of the Coast.*
