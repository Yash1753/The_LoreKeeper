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
            <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="active-scale h-8 w-8 p-0 text-[#b8a080]/60 transition-all hover:bg-[#3a2f24] hover:text-[#d4a853] relative group/copy"
            >
                {copied ? (
                    <span className="text-xs font-bold text-[#27ae60] animate-in fade-in zoom-in duration-200">✓</span>
                ) : (
                    <span className="text-sm">📋</span>
                )}

                {/* Custom Tooltip */}
                <span className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#1a1510] border border-[#4a3f32] px-2 py-1 text-[10px] text-[#e8d5b7] opacity-0 transition-opacity group-hover/copy:opacity-100 pointer-events-none shadow-xl ${copied ? 'opacity-100' : ''}`}>
                    {copied ? "Copied!" : "Copy rules"}
                </span>
            </Button>
        </div>
    );
}
