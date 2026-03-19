"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMessageProps {
    content: string;
}

export function UserMessage({ content }: UserMessageProps) {
    return (
        <div className="flex gap-3 justify-end">
            {/* Message Content */}
            <div className="max-w-[80%] rounded-2xl rounded-br-sm border border-[#4a3f32] bg-[#3a2f24] px-4 py-3">
                <p
                    className="text-[#e8d5b7]"
                    style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.05rem" }}
                >
                    {content}
                </p>
            </div>

            {/* User Avatar */}
            <Avatar className="h-8 w-8 shrink-0 border border-[#4a3f32] bg-[#3a2f24]">
                <AvatarFallback className="bg-[#3a2f24] text-sm">⚔️</AvatarFallback>
            </Avatar>
        </div>
    );
}
