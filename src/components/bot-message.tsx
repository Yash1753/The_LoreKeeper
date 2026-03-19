"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageActions } from "@/components/message-actions";

interface BotMessageProps {
    content: string;
    id: string;
}

export function BotMessage({ content, id }: BotMessageProps) {
    return (
        <div className="flex gap-3">
            {/* Bot Avatar */}
            <Avatar className="h-8 w-8 shrink-0 border border-[#d4a853]/30 bg-[#2a2118]">
                <AvatarFallback className="bg-[#2a2118] text-sm">🎲</AvatarFallback>
            </Avatar>

            {/* Message Content */}
            <div className="flex-1 space-y-2 relative group">
                <p
                    className="text-xs font-semibold text-[#d4a853]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                >
                    The Lorekeeper
                </p>

                <div className="relative">
                    <div
                        className="prose prose-invert max-w-none rounded-2xl border border-[#4a3f32] bg-[#2a2118]/40 px-5 py-4 text-[#e8d5b7] shadow-sm prose-headings:font-bold prose-headings:text-[#d4a853] prose-strong:text-[#e8d5b7] prose-code:rounded prose-code:bg-[#3a2f24] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#d4a853] prose-pre:border prose-pre:border-[#4a3f32] prose-pre:bg-[#2a2118]"
                        style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.1rem" }}
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
                    />

                    <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <MessageActions content={content} messageId={id} />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Basic markdown → HTML conversion for bot responses.
 * For a production build, consider using react-markdown or similar.
 */
function formatMarkdown(text: string): string {
    return text
        // Headers
        .replace(/^### (.*$)/gm, '<h3 class="text-lg mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-xl mt-4 mb-2">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl mt-4 mb-2">$1</h1>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Italic
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        // Inline code
        .replace(/`(.*?)`/g, "<code>$1</code>")
        // Unordered lists
        .replace(/^\s*[-*] (.*$)/gm, "<li>$1</li>")
        // Wrap consecutive <li> in <ul>
        .replace(/((<li>.*<\/li>\n?)+)/g, '<ul class="list-disc pl-5 space-y-1">$1</ul>')
        // Line breaks (double newline → paragraph)
        .replace(/\n\n/g, "</p><p>")
        // Single newline → line break
        .replace(/\n/g, "<br/>")
        // Wrap in paragraph
        .replace(/^(.*)$/, "<p>$1</p>");
}
