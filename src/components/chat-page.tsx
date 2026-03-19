"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useChat } from "@ai-sdk/react";
import { SiteHeader } from "@/components/site-header";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";

// Use dynamic import with SSR disabled to thoroughly resolve hydration mismatches
const WelcomeScreen = dynamic(
    () => import("@/components/welcome-screen").then((mod) => mod.WelcomeScreen),
    { ssr: false }
);

export function ChatPage() {
    const [input, setInput] = useState("");
    const [hasStartedChatting, setHasStartedChatting] = useState(false);

    const {
        messages,
        sendMessage,
        status,
        error,
        stop,
    } = useChat();

    const isLoading = status === "submitted" || status === "streaming";

    const handleSuggestedQuestion = (question: string) => {
        setHasStartedChatting(true);
        sendMessage({ text: question });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        setHasStartedChatting(true);
        sendMessage({ text: input });
        setInput("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    return (
        <div className="flex h-[100dvh] flex-col bg-[#1a1510]">
            <SiteHeader />

            <main className="flex flex-1 flex-col overflow-hidden">
                {messages.length === 0 && !hasStartedChatting ? (
                    <WelcomeScreen
                        onSelectQuestion={handleSuggestedQuestion}
                    />
                ) : (
                    <ChatMessages messages={messages} isLoading={isLoading} />
                )}

                {error && (
                    <div className="mx-auto w-full max-w-3xl px-4 pb-2">
                        <div className="rounded-lg border border-[#c0392b]/30 bg-[#c0392b]/10 px-4 py-2 text-sm text-[#e8d5b7]">
                            ⚠️ {error.message || "The arcane connection seems disrupted. Please try again."}
                        </div>
                    </div>
                )}

                <ChatInput
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    stop={stop}
                    autoFocus={true}
                />
            </main>
        </div>
    );
}
