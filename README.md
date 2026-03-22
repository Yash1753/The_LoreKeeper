# 🎲 The Lorekeeper

**The Lorekeeper** is a purpose-built AI chatbot for **Dungeons &
Dragons 5th Edition (D&D 5e)**.\
It helps players and Dungeon Masters instantly understand rules, spells,
monsters, and mechanics from the **Systems Reference Document (SRD)**.

------------------------------------------------------------------------

## ⚔️ Why This Project?

I've always been drawn to games, the worlds, the mechanics, and the
depth behind every system.

While playing **Baldur's Gate 3 (Game of the Year 2023)**, I constantly
found myself pausing to look up spell effects, saving throws, and class
features. Since BG3 is built on D&D 5e rules, this friction came from
how dense and scattered the rule system is.

> **What if you could just ask and instantly understand any D&D rule in
> plain language?**

That idea led to The Lorekeeper which is a **focused assistant for rule
discovery and decision-making during gameplay**.

------------------------------------------------------------------------

## 🧠 UX & Frontend Thinking

This project focuses heavily on **how the chatbot is experienced**, not
just how it works.

### 🎯 Key Design Decisions

-   **Guided Onboarding**
    -   Starter prompts reduce decision fatigue and guide first
        interaction
-   **Capability Framing**
    -   Clearly communicates value: \> Explain spells • Compare
        mechanics • Understand combat instantly
-   **Thematic Experience**
    -   Designed as a *Lorekeeper* persona for immersive interaction
-   **Strong Primary Action**
    -   Input box is visually dominant and easy to use
-   **Conversation Clarity**
    -   Timeline-style chat improves readability and flow
-   **Streaming Feedback**
    -   Real-time responses reduce perceived latency
-   **Post-Response Interaction (Key UX Improvement)**
    -   Quick actions like *Simplify*, *Example*, and *Compare* reduce
        friction
    -   "Continue Exploring" suggestions guide users deeper into the
        topic
    -   Transforms the chatbot into an **interactive learning system**

------------------------------------------------------------------------

## ⚙️ How It Works

The Lorekeeper uses a **Retrieval-Augmented Generation (RAG)**
architecture.

### 🔄 Chat Flow

1.  User Input\
2.  Embedding using `all-MiniLM-L6-v2`\
3.  Vector Search via Pinecone\
4.  Context Injection\
5.  LLM Inference (Llama 3.3 via Groq)\
6.  Streaming Response via AI SDK

------------------------------------------------------------------------

## 📦 Knowledge Base

-   \~2,000 structured chunks from the\
    https://github.com/5e-bits/5e-database
-   Covers spells, monsters, classes, races, conditions, equipment,
    feats, and core rules

------------------------------------------------------------------------

## 📜 Features

-   ⚡ Context-aware rule explanations grounded in SRD\
-   🧠 Guided exploration with curated starter prompts\
-   🎲 Domain-specific chatbot (not a generic wrapper)\
-   ⚡ Streaming responses for better responsiveness\
-   🎨 Thematic fantasy UI\
-   🔁 Interactive follow-ups via quick actions

------------------------------------------------------------------------

## ⚖️ Challenges & Decisions

-   Designing a chatbot that feels purpose-built, not generic\
-   Structuring SRD data into meaningful retrieval chunks\
-   Balancing speed vs accuracy using Groq + RAG\
-   Ensuring responses are interpretable, not just raw data

------------------------------------------------------------------------

## 🛠️ Built With

-   Next.js\
-   Tailwind CSS\
-   AI SDK\
-   Groq (Llama 3.3 70B)\
-   Pinecone\
-   HuggingFace

------------------------------------------------------------------------

## 🚀 Getting Started

### Clone the repository

``` bash
git clone https://github.com/Yash1753/The_LoreKeeper.git
cd The_LoreKeeper/dnd-lorekeeper
```

### Environment variables

``` env
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_TOKEN=your_huggingface_token
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
```

### Run locally

``` bash
npm install
npm run dev
```

------------------------------------------------------------------------

## 🎥 Loom Walkthrough

https://www.loom.com/share/03db4f989f0b4ff3b5c71a93c2f52d45

------------------------------------------------------------------------

## 🧠 What This Project Demonstrates

-   Product-focused AI design\
-   RAG implementation\
-   UX-driven chatbot systems

------------------------------------------------------------------------

*Not affiliated with Wizards of the Coast.*
