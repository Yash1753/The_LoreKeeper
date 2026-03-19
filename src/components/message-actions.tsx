"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MessageActionsProps {
    content: string;
    messageId: string;
}

export function MessageActions({ content }: MessageActionsProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = content;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <div className="relative group/copy">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 w-8 p-0 text-[#b8a080] transition-all hover:bg-[#3a2f24] hover:text-[#d4a853] active:scale-90 relative shadow-md border border-[#4a3f32]/40 rounded-lg bg-[#2a2118]/90"
                >
                    {copied ? (
                        <span className="text-xs font-bold text-[#27ae60] animate-in fade-in zoom-in duration-300">✓</span>
                    ) : (
                        <span className="text-sm opacity-80 group-hover/copy:opacity-100 transition-opacity">📋</span>
                    )}
                </Button>

                {/* Custom Tooltip */}
                <div className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#d4a853] px-2.5 py-1 text-[11px] font-bold text-[#1a1510] opacity-0 transition-all pointer-events-none shadow-[0_4px_12px_rgba(212,168,83,0.3)] ${copied ? 'opacity-100 translate-y-0' : 'group-hover/copy:opacity-100 translate-y-1'}`}>
                    {copied ? "Copied!" : "Copy Rules"}
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#d4a853]" />
                </div>
            </div>
        </div>
    );
}
