"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMessageProps {
    content: string;
}

export function UserMessage({ content }: UserMessageProps) {
    return (
        <div className="flex gap-3 justify-end">
            {/* Message Content */}
            <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-[#4a3f32] bg-[#2a2118] px-5 py-3 shadow-md">
                <p
                    className="text-[#e8d5b7] leading-relaxed"
                    style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.1rem" }}
                >
                    {content}
                </p>
            </div>

            {/* User Avatar */}
            <div className="mt-1">
                <Avatar className="h-8 w-8 shrink-0 border border-[#4a3f32] bg-[#3a2f24] shadow-sm">
                    <AvatarFallback className="bg-[#3a2f24] text-xs">⚔️</AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}
