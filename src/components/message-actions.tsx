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
        <div className="flex items-center gap-1 pt-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-xs text-[#b8a080]/60 hover:bg-[#3a2f24] hover:text-[#d4a853]"
            >
                {copied ? "✓ Copied" : "📋 Copy"}
            </Button>
        </div>
    );
}
