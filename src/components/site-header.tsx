"use client";

import Link from "next/link";

export function SiteHeader() {
    return (
        <header className="flex items-center justify-between border-b border-[#4a3f32] bg-[#1a1510]/95 px-4 py-3 backdrop-blur-sm sticky top-0 z-50">
            <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center gap-3 transition-all hover:opacity-80 active:scale-95 text-left"
            >
                <span className="text-2xl">🎲</span>
                <div>
                    <h1
                        className="text-lg font-bold tracking-wider text-[#d4a853]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        The Lorekeeper
                    </h1>
                    <p
                        className="text-xs text-[#b8a080]/70"
                        style={{ fontFamily: "'Crimson Text', serif" }}
                    >
                        D&D 5e Rules Companion
                    </p>
                </div>
            </button>

            <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#4a3f32] bg-[#2a2118] px-3 py-1 text-xs text-[#b8a080]">
                    SRD 5.1
                </span>
            </div>
        </header>
    );
}
