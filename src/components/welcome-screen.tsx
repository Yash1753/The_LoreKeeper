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

            <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {suggestedQuestions.map((question, index) => {
                    const isPrimary = index === 0;
                    return (
                        <Card
                            key={index}
                            className={`group cursor-pointer p-4 transition-all duration-300 active:scale-[0.98] animate-fade-in-up opacity-0 
                                ${isPrimary
                                    ? 'border-[#d4a853] bg-[#2a2118]/90 ring-1 ring-[#d4a853]/10 shadow-[0_4px_20px_rgba(212,168,83,0.1)]'
                                    : 'border-[#4a3f32]/60 bg-[#1a1510]/80'
                                } 
                                hover:-translate-y-1 hover:border-[#d4a853]/60 hover:shadow-[0_8px_30px_rgba(212,168,83,0.2)] hover:bg-[#221a12]`}
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animationFillMode: 'forwards'
                            }}
                            onClick={() => onSelectQuestion(question)}
                        >
                            <p
                                className={`text-sm leading-snug transition-colors ${isPrimary ? 'text-[#e8d5b7] font-medium' : 'text-[#b8a080] group-hover:text-[#e8d5b7]'}`}
                                style={{ fontFamily: "'Crimson Text', serif" }}
                            >
                                {question}
                            </p>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
