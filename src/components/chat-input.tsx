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
        <div className="border-t border-[#4a3f32] bg-[#1a1510] p-4">
            <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-3xl items-end gap-3"
            >
                <div className="relative flex-1">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask The Lorekeeper anything about D&D 5e..."
                        rows={1}
                        className="w-full resize-none rounded-xl border border-[#4a3f32] bg-[#2a2118] px-4 py-3 text-[#e8d5b7] placeholder-[#b8a080]/60 transition-all duration-200 focus:border-[#d4a853] focus:outline-none focus:ring-1 focus:ring-[#d4a853]/50"
                        style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.05rem" }}
                        disabled={isLoading}
                        autoFocus={autoFocus}
                    />
                </div>

                {isLoading ? (
                    <Button
                        type="button"
                        onClick={stop}
                        className="h-12 w-12 shrink-0 rounded-xl border border-[#c0392b]/50 bg-[#c0392b]/20 text-[#e8d5b7] hover:bg-[#c0392b]/30 transition-colors"
                    >
                        ■
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        disabled={!input.trim()}
                        className="h-12 w-12 shrink-0 rounded-xl bg-[#d4a853] text-[#1a1510] hover:bg-[#e0b960] disabled:opacity-30 disabled:hover:bg-[#d4a853] transition-colors"
                    >
                        🎲
                    </Button>
                )}
            </form>

            <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-[#b8a080]/50">
                The Lorekeeper references the D&D 5e SRD. Not affiliated with Wizards of the Coast.
            </p>
        </div>
    );
}
