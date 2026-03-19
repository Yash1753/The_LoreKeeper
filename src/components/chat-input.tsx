"use client";

import { type FormEvent, type ChangeEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
    input: string;
    handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    stop: () => void;
    autoFocus?: boolean;
}

export function ChatInput({
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    autoFocus,
}: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && !isLoading) {
                const form = e.currentTarget.closest("form");
                if (form) {
                    form.requestSubmit();
                }
            }
        }
    };

    return (
        <div className="border-t border-[#4a3f32] bg-[#1a1510] px-4 py-4">
            <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-3xl items-center gap-3"
            >
                <div className="relative flex-1 group">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about spells, monsters, or uncover hidden rules…"
                        rows={2}
                        className="w-full resize-none rounded-xl border-2 border-[#4a3f32] bg-[#2a2118] px-5 py-[14px] text-[#e8d5b7] placeholder-[#b8a080]/40 transition-all duration-300 focus:border-[#d4a853] focus:outline-none focus:ring-4 focus:ring-[#d4a853]/10 min-h-[60px] shadow-lg group-hover:border-[#4a3f32]/80"
                        style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.1rem" }}
                        disabled={isLoading}
                        autoFocus={autoFocus}
                    />
                </div>

                {isLoading ? (
                    <Button
                        type="button"
                        onClick={stop}
                        className="h-[60px] w-[60px] shrink-0 rounded-xl border-2 border-[#c0392b]/50 bg-[#c0392b]/10 text-[#e8d5b7] hover:bg-[#c0392b]/20 transition-all duration-300"
                    >
                        ■
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        disabled={!input.trim()}
                        className="h-[60px] px-6 shrink-0 rounded-xl border-2 border-transparent bg-[#d4a853] text-[#1a1510] hover:bg-[#e0b960] disabled:opacity-20 disabled:hover:bg-[#d4a853] transition-all duration-300 font-bold shadow-[0_4px_12px_rgba(212,168,83,0.2)] active:scale-95"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Ask →
                    </Button>
                )}
            </form>

        </div>
    );
}
