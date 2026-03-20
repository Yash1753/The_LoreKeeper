"use client";

import { type UIMessage } from "ai";
import { useEffect, useRef } from "react";
import { BotMessage } from "@/components/bot-message";
import { UserMessage } from "@/components/user-message";
import { ThinkingIndicator } from "@/components/thinking-indicator";
import { FollowUpSuggestions } from "@/components/follow-up-suggestions";

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
    onFollowUp?: (question: string) => void;
}

export function ChatMessages({ messages, isLoading, onFollowUp }: ChatMessagesProps) {
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

    // Group messages into Q&A pairs
    const messageGroups: { user?: UIMessage; bot?: UIMessage }[] = [];
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].role === "user") {
            const nextMessage = messages[i + 1];
            if (nextMessage && nextMessage.role === "assistant") {
                messageGroups.push({ user: messages[i], bot: nextMessage });
                i++;
            } else {
                messageGroups.push({ user: messages[i] });
            }
        } else {
            messageGroups.push({ bot: messages[i] });
        }
    }

    return (
        <div className="flex-1 overflow-y-auto px-4" ref={scrollRef}>
            <div className="mx-auto max-w-3xl py-6 pb-20 space-y-12 relative">
                {/* Continuous Timeline Spine */}
                <div className="absolute left-[15px] top-10 bottom-24 w-[2px] bg-gradient-to-b from-[#d4a853] via-[#4a3f32] to-transparent hidden md:block timeline-glow" />

                {messageGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-1.5 animate-fade-in relative">
                        {group.user && (
                            <div className="animate-fade-in-up relative">
                                {/* Spine Node for User */}
                                <div className="absolute left-[-18.5px] top-[14px] h-2 w-2 rounded-full border border-[#d4a853] bg-[#1a1510] hidden md:block z-10" />
                                <UserMessage content={getMessageText(group.user)} />
                            </div>
                        )}

                        {group.bot && (
                            <div className="animate-fade-in-up delay-75 relative">
                                {/* Spine Node for Bot */}
                                <div className="absolute left-[-18.5px] top-[14px] h-2 w-2 rounded-full border border-[#d4a853] bg-[#1a1510] hidden md:block z-10" />
                                <BotMessage content={getMessageText(group.bot)} id={group.bot.id} />

                                {/* Follow-up suggestions after the LAST bot response when idle */}
                                {!isLoading && onFollowUp && groupIndex === messageGroups.length - 1 && (
                                    <FollowUpSuggestions
                                        lastBotMessage={getMessageText(group.bot)}
                                        onSelect={onFollowUp}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {isLoading &&
                    messages.length > 0 &&
                    messages[messages.length - 1].role === "user" && (
                        <div className="animate-fade-in-up delay-75">
                            <ThinkingIndicator />
                        </div>
                    )}

                <div ref={bottomRef} className="h-px w-full" />
            </div>
        </div>
    );
}
