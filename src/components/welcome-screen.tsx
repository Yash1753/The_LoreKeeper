"use client";

import { Card } from "@/components/ui/card";
import { suggestedQuestions } from "@/lib/prompts";

interface WelcomeScreenProps {
    onSelectQuestion: (question: string) => void;
}

export function WelcomeScreen({ onSelectQuestion }: WelcomeScreenProps) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
            <div className="mb-10 text-center">
                {/* Logo / Icon */}
                <div className="mb-4 text-6xl">🎲</div>

                <h1
                    className="mb-2 text-5xl font-bold tracking-tight text-[#d4a853] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                >
                    The Lorekeeper
                </h1>

                <p
                    className="text-xl text-[#b8a080]/90"
                    style={{ fontFamily: "'Crimson Text', serif" }}
                >
                    Your D&D 5e Rules Companion
                </p>

                <p className="mt-4 max-w-md text-sm text-[#b8a080]/40 italic" style={{ fontFamily: 'var(--font-crimson)' }}>Ask me about spells, monsters, classes, races, and mechanics from the Systems Reference Document.</p>
            </div>

            {/* Suggested Questions Grid */}
            <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {suggestedQuestions.map((question, index) => (
                    <Card
                        key={index}
                        className="group cursor-pointer border-[#4a3f32]/50 bg-[#2a2118]/50 p-4 transition-all duration-300 hover:border-[#d4a853]/40 hover:bg-[#3a2f24] hover:shadow-[0_0_20px_rgba(212,168,83,0.08)]"
                        onClick={() => onSelectQuestion(question)}
                    >
                        <p
                            className="text-sm text-[#b8a080] transition-colors group-hover:text-[#e8d5b7]"
                            style={{ fontFamily: "'Crimson Text', serif" }}
                        >
                            {question}
                        </p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
