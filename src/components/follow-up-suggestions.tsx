"use client";

interface FollowUpSuggestionsProps {
    lastBotMessage: string;
    onSelect: (question: string) => void;
}

const KEYWORD_FOLLOWUPS: { keywords: string[]; suggestions: string[] }[] = [
    {
        keywords: ["spell", "cantrip", "casting time", "components", "duration", "range"],
        suggestions: [
            "What level is this spell?",
            "Can this spell be upcast?",
            "Which classes can learn this?",
        ],
    },
    {
        keywords: ["monster", "creature", "beast", "dragon", "undead", "fiend", "challenge rating", "cr "],
        suggestions: [
            "What are its legendary actions?",
            "What loot does it drop?",
            "What's the best strategy against it?",
        ],
    },
    {
        keywords: ["class", "hit die", "proficiency", "subclass", "feature"],
        suggestions: [
            "What are its subclass options?",
            "What proficiencies does it get?",
            "How does multiclassing work with this?",
        ],
    },
    {
        keywords: ["combat", "attack", "damage", "armor class", "initiative", "grappl"],
        suggestions: [
            "How do opportunity attacks work?",
            "What bonus actions can I use in combat?",
            "How does cover affect AC?",
        ],
    },
    {
        keywords: ["rest", "long rest", "short rest", "hit dice", "recovery"],
        suggestions: [
            "What resets on a short rest vs long rest?",
            "How do hit dice recovery work?",
            "Can a rest be interrupted?",
        ],
    },
    {
        keywords: ["condition", "blinded", "charmed", "frightened", "stunned", "paralyzed", "poisoned"],
        suggestions: [
            "How can this condition be removed?",
            "Which spells cause this condition?",
            "Does this condition stack?",
        ],
    },
    {
        keywords: ["weapon", "armor", "shield", "potion", "magic item", "attunement", "equipment", "item"],
        suggestions: [
            "Does this require attunement?",
            "What are the best items for this build?",
            "How does magical vs. non-magical matter?",
        ],
    },
    {
        keywords: ["elf", "dwarf", "halfling", "human", "dragonborn", "gnome", "tiefling", "race", "lineage"],
        suggestions: [
            "What ability score bonuses does this race get?",
            "What are its notable racial traits?",
            "Which classes pair well with this race?",
        ],
    },
    {
        keywords: ["skill check", "ability score", "saving throw", "advantage", "disadvantage", "modifier"],
        suggestions: [
            "When would I make this kind of check?",
            "How does advantage/disadvantage interact?",
            "What gives proficiency in this?",
        ],
    },
    {
        keywords: ["travel", "exploration", "trap", "treasure", "dungeon", "encounter", "adventur"],
        suggestions: [
            "How do random encounters work?",
            "What are the rules for traps?",
            "How does travel pace affect stealth?",
        ],
    },
];

const GENERIC_FOLLOWUPS = [
    "Tell me more about this topic.",
    "What are common house rules for this?",
    "How does this interact with other mechanics?",
];

/** Quick-actions that always show — universal follow-up intents. */
const QUICK_ACTIONS: { icon: string; label: string; prompt: string }[] = [
    {
        icon: "📖",
        label: "Simplify",
        prompt: "Can you explain that in simpler terms?",
    },
    {
        icon: "⚔️",
        label: "Example",
        prompt: "Give me a practical in-game example of this.",
    },
    {
        icon: "🔄",
        label: "Compare",
        prompt: "How does this compare with similar alternatives?",
    },
];

function getFollowUps(botMessage: string): string[] {
    const lower = botMessage.toLowerCase();

    for (const entry of KEYWORD_FOLLOWUPS) {
        if (entry.keywords.some((kw) => lower.includes(kw))) {
            return entry.suggestions.slice(0, 3);
        }
    }

    return GENERIC_FOLLOWUPS;
}

export function FollowUpSuggestions({ lastBotMessage, onSelect }: FollowUpSuggestionsProps) {
    const suggestions = getFollowUps(lastBotMessage);

    return (
        <div className="mt-5 space-y-3 animate-fade-in-up pl-11">
            {/* Quick Actions Row */}
            <div className="flex flex-wrap gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#b8a080]/40 w-full mb-0.5" style={{ fontFamily: "'Cinzel', serif" }}>
                    Quick actions
                </span>
                {QUICK_ACTIONS.map((action, i) => (
                    <button
                        key={`qa-${i}`}
                        type="button"
                        onClick={() => onSelect(action.prompt)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#d4a853]/20 bg-[#d4a853]/5 px-3 py-1.5 text-xs text-[#d4a853]/80 transition-all hover:border-[#d4a853]/50 hover:bg-[#d4a853]/15 hover:text-[#d4a853] hover:shadow-[0_0_10px_rgba(212,168,83,0.1)] active:scale-95"
                        style={{ fontFamily: "'Crimson Text', serif" }}
                    >
                        <span className="text-sm">{action.icon}</span>
                        {action.label}
                    </button>
                ))}
            </div>

            {/* Contextual Suggestions Row */}
            <div className="flex flex-wrap gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#b8a080]/40 w-full mb-0.5" style={{ fontFamily: "'Cinzel', serif" }}>
                    Continue exploring
                </span>
                {suggestions.map((s, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onSelect(s)}
                        className="rounded-full border border-[#4a3f32]/60 bg-[#2a2118]/80 px-3 py-1.5 text-xs text-[#b8a080] transition-all hover:border-[#d4a853]/50 hover:bg-[#3a2f24] hover:text-[#d4a853] active:scale-95"
                        style={{ fontFamily: "'Crimson Text', serif" }}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}
