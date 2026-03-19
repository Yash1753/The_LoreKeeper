"use client";

import { type UIMessage } from "ai";
import { useEffect, useRef } from "react";
import { BotMessage } from "@/components/bot-message";
import { UserMessage } from "@/components/user-message";
import { ThinkingIndicator } from "@/components/thinking-indicator";

/** Extract the concatenated text content from a UIMessage's parts array. */
function getMessageText(message: UIMessage): string {
    return message.parts
        .filter((part): part is Extract<typeof part, { type: "text" }> => part.type === "text")
        .map((part) => part.text)
        .join("");
}

interface ChatMessagesProps {
    messages: UIMessage[];
    isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic: only scroll if the user was already near the bottom
    useEffect(() => {
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;

        // Auto-scroll if near bottom or if it's the very first message from the user
        if (isNearBottom) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto px-4" ref={scrollRef}>
            <div className="mx-auto max-w-3xl space-y-6 py-6 pb-20">
                {messages.map((message) => {
                    const text = getMessageText(message);
                    return (
                        <div key={message.id} className="animate-fade-in">
                            {message.role === "user" ? (
                                <UserMessage content={text} />
                            ) : (
                                <BotMessage content={text} id={message.id} />
                            )}
                        </div>
                    );
                })}

                {isLoading &&
                    messages.length > 0 &&
                    messages[messages.length - 1].role === "user" && (
                        <ThinkingIndicator />
                    )}

                <div ref={bottomRef} className="h-px w-full" />
            </div>
        </div>
    );
}
