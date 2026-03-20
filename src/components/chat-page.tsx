"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useChat } from "@ai-sdk/react";
import { SiteHeader } from "@/components/site-header";
import { ChatMessages } from "@/components/chat-messages";

// Use dynamic import with SSR disabled to thoroughly resolve hydration mismatches
const ChatInput = dynamic(
    () => import("@/components/chat-input").then((mod) => mod.ChatInput),
    { ssr: false, loading: () => <div className="h-[90px] border-t border-[#4a3f32] bg-[#1a1510]" /> }
);

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
        regenerate,
        clearError,
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
                    <ChatMessages messages={messages} isLoading={isLoading} onFollowUp={handleSuggestedQuestion} />
                )}

                {error && (
                    <div className="mx-auto w-full max-w-3xl px-4 pb-3 animate-error-shake">
                        <div className="flex items-center justify-between gap-4 rounded-xl border border-[#c0392b]/40 bg-gradient-to-r from-[#2a1510] to-[#1a1510] px-5 py-4 shadow-[0_4px_20px_rgba(192,57,43,0.15)]">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl animate-icon-pulse">⚠️</span>
                                <div>
                                    <p className="text-sm font-semibold text-[#e8d5b7]" style={{ fontFamily: "'Cinzel', serif" }}>
                                        The Lorekeeper seems lost…
                                    </p>
                                    <p className="mt-1 text-xs text-[#b8a080]/70" style={{ fontFamily: "'Crimson Text', serif" }}>
                                        {error.message || "The arcane connection was disrupted. Try again."}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => { clearError(); regenerate(); }}
                                className="shrink-0 rounded-lg border border-[#d4a853]/40 bg-[#d4a853]/10 px-4 py-2.5 text-xs font-bold text-[#d4a853] transition-all hover:bg-[#d4a853]/25 hover:border-[#d4a853]/60 hover:shadow-[0_0_12px_rgba(212,168,83,0.2)] active:scale-95"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                ↻ Try Again
                            </button>
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
