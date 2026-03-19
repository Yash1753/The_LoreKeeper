"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ThinkingIndicator() {
    return (
        <div className="flex gap-3 animate-fade-in">
            {/* Bot Avatar */}
            <Avatar className="h-8 w-8 shrink-0 border border-[#d4a853]/30 bg-[#2a2118] animate-pulse-glow">
                <AvatarFallback className="bg-[#2a2118] text-sm">🎲</AvatarFallback>
            </Avatar>

            {/* Thinking indicator */}
            <div className="space-y-2">
                <p
                    className="text-xs font-semibold text-[#d4a853]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                >
                    The Lorekeeper
                </p>

                <div className="flex items-center gap-2 rounded-xl border border-[#4a3f32] bg-[#2a2118] px-4 py-3">
                    <span
                        className="text-sm italic text-[#b8a080]"
                        style={{ fontFamily: "'Crimson Text', serif" }}
                    >
                        The Lorekeeper whispers...
                    </span>
                    <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d4a853] dot-bounce-1" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d4a853] dot-bounce-2" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d4a853] dot-bounce-3" />
                    </span>
                </div>
            </div>
        </div>
    );
}
