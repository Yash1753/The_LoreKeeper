/**
 * build-knowledge-base.ts
 *
 * One-time script to build the D&D 5e knowledge base.
 * Reads JSON files from /data, formats them into readable chunks,
 * embeds them using HuggingFace, and uploads to Pinecone.
 *
 * Usage: npx tsx scripts/build-knowledge-base.ts
 */

import * as fs from "fs";
import * as path from "path";
import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");
const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const BATCH_SIZE_EMBED = 50;
const BATCH_SIZE_UPSERT = 100;
const RATE_LIMIT_MS = 1000;
const COLD_START_WAIT_MS = 20000;

const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface Chunk {
    id: string;
    text: string;
    metadata: Record<string, string | number | boolean | string[]>;
}

interface VectorRecord {
    id: string;
    values: number[];
    metadata: Record<string, string | number | boolean | string[]>;
}

// ─────────────────────────────────────────────
// Helper: Read a JSON file from /data
// ─────────────────────────────────────────────

function readJsonFile(filename: string): unknown[] {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found: ${filename}, skipping...`);
        return [];
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return Array.isArray(data) ? data : [];
}

// ─────────────────────────────────────────────
// Formatting Functions (one per data type)
// ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatSpell(spell: any): Chunk {
    const desc = Array.isArray(spell.desc) ? spell.desc.join("\n") : spell.desc || "";
    const higherLevel = spell.higher_level
        ? `\nAt Higher Levels: ${Array.isArray(spell.higher_level) ? spell.higher_level.join("\n") : spell.higher_level}`
        : "";
    const components = spell.components ? spell.components.join(", ") : "None";
    const material = spell.material ? ` (${spell.material})` : "";
    const classes = spell.classes
        ? spell.classes.map((c: { name: string }) => c.name).join(", ")
        : "";
    const damage = spell.damage?.damage_type?.name || "";
    const dc = spell.dc?.dc_type?.name ? `Save: ${spell.dc.dc_type.name}` : "";

    const text = `${spell.name}
Level: ${spell.level === 0 ? "Cantrip" : `${spell.level}th-level`} ${spell.school?.name || ""}
Casting Time: ${spell.casting_time || "Unknown"}
Range: ${spell.range || "Unknown"}
Components: ${components}${material}
Duration: ${spell.duration || "Unknown"}
Concentration: ${spell.concentration ? "Yes" : "No"}
Ritual: ${spell.ritual ? "Yes" : "No"}
Classes: ${classes}
Description:
${desc}${higherLevel}
${damage ? `Damage Type: ${damage}` : ""}
${dc}`.trim();

    return {
        id: `spell-${spell.index || spell.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: {
            type: "spell",
            name: spell.name,
            level: spell.level,
            school: spell.school?.name || "",
            classes: classes,
            concentration: spell.concentration || false,
            text,
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatMonster(monster: any): Chunk {
    const speed = monster.speed
        ? Object.entries(monster.speed)
            .map(([k, v]) => `${k} ${v}`)
            .join(", ")
        : "";

    const saves = monster.proficiencies
        ? monster.proficiencies
            .filter((p: { proficiency: { name: string } }) => p.proficiency.name.startsWith("Saving Throw"))
            .map((p: { proficiency: { name: string }; value: number }) => `${p.proficiency.name.replace("Saving Throw: ", "")} +${p.value}`)
            .join(", ")
        : "";

    const skills = monster.proficiencies
        ? monster.proficiencies
            .filter((p: { proficiency: { name: string } }) => p.proficiency.name.startsWith("Skill"))
            .map((p: { proficiency: { name: string }; value: number }) => `${p.proficiency.name.replace("Skill: ", "")} +${p.value}`)
            .join(", ")
        : "";

    const immunities = monster.damage_immunities?.join(", ") || "None";
    const resistances = monster.damage_resistances?.join(", ") || "None";
    const senses = monster.senses
        ? Object.entries(monster.senses)
            .map(([k, v]) => `${k.replace(/_/g, " ")} ${v}`)
            .join(", ")
        : "";

    const specialAbilities = monster.special_abilities
        ? monster.special_abilities
            .map((a: { name: string; desc: string }) => `  ${a.name}: ${a.desc}`)
            .join("\n")
        : "";

    const actions = monster.actions
        ? monster.actions
            .map((a: { name: string; desc: string }) => `  - ${a.name}: ${a.desc}`)
            .join("\n")
        : "";

    const legendaryActions = monster.legendary_actions
        ? monster.legendary_actions
            .map((a: { name: string; desc: string }) => `  - ${a.name}: ${a.desc}`)
            .join("\n")
        : "";

    const text = `${monster.name}
Size: ${monster.size || "Unknown"} | Type: ${monster.type || "Unknown"} | CR: ${monster.challenge_rating ?? "Unknown"}
AC: ${monster.armor_class?.[0]?.value ?? "Unknown"} (${monster.armor_class?.[0]?.type || "natural"}) | HP: ${monster.hit_points || "Unknown"} (${monster.hit_points_roll || ""})
Speed: ${speed}
STR ${monster.strength || 10} DEX ${monster.dexterity || 10} CON ${monster.constitution || 10} INT ${monster.intelligence || 10} WIS ${monster.wisdom || 10} CHA ${monster.charisma || 10}
${saves ? `Saves: ${saves}` : ""}
${skills ? `Skills: ${skills}` : ""}
Damage Immunities: ${immunities}
Damage Resistances: ${resistances}
Senses: ${senses}
Languages: ${monster.languages || "None"}
${specialAbilities ? `Special Abilities:\n${specialAbilities}` : ""}
${actions ? `Actions:\n${actions}` : ""}
${legendaryActions ? `Legendary Actions:\n${legendaryActions}` : ""}`.trim();

    return {
        id: `monster-${monster.index || monster.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: {
            type: "monster",
            name: monster.name,
            cr: monster.challenge_rating ?? 0,
            type_category: monster.type || "",
            size: monster.size || "",
            text,
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatClass(dndClass: any): Chunk {
    const proficiencies = dndClass.proficiencies
        ? dndClass.proficiencies.map((p: { name: string }) => p.name).join(", ")
        : "";
    const savingThrows = dndClass.saving_throws
        ? dndClass.saving_throws.map((s: { name: string }) => s.name).join(", ")
        : "";
    const subclasses = dndClass.subclasses
        ? dndClass.subclasses.map((s: { name: string }) => s.name).join(", ")
        : "";

    const text = `Class: ${dndClass.name}
Hit Die: d${dndClass.hit_die || "?"}
Proficiencies: ${proficiencies}
Saving Throws: ${savingThrows}
Subclasses: ${subclasses}
${dndClass.spellcasting ? `Spellcasting Ability: ${dndClass.spellcasting.spellcasting_ability?.name || "None"}` : "Non-spellcasting class"}`.trim();

    return {
        id: `class-${dndClass.index || dndClass.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: {
            type: "class",
            name: dndClass.name,
            hit_die: dndClass.hit_die || 0,
            text,
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatCondition(condition: any): Chunk {
    const desc = Array.isArray(condition.desc)
        ? condition.desc.join("\n")
        : condition.desc || "";

    const text = `Condition: ${condition.name}\n${desc}`.trim();

    return {
        id: `condition-${condition.index || condition.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: { type: "condition", name: condition.name, text },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatEquipment(item: any): Chunk {
    const cost = item.cost ? `${item.cost.quantity} ${item.cost.unit}` : "Unknown";
    const weight = item.weight ? `${item.weight} lb` : "Unknown";
    const properties = item.properties
        ? item.properties.map((p: { name: string }) => p.name).join(", ")
        : "";
    const damage = item.damage
        ? `Damage: ${item.damage.damage_dice} ${item.damage.damage_type?.name || ""}`
        : "";
    const armorClass = item.armor_class
        ? `AC: ${item.armor_class.base}${item.armor_class.dex_bonus ? " + DEX" : ""}`
        : "";

    const text = `Equipment: ${item.name}
Category: ${item.equipment_category?.name || "Unknown"}
Cost: ${cost}
Weight: ${weight}
${properties ? `Properties: ${properties}` : ""}
${damage}
${armorClass}
${Array.isArray(item.desc) ? item.desc.join("\n") : item.desc || ""}`.trim();

    return {
        id: `equipment-${item.index || item.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: {
            type: "equipment",
            name: item.name,
            category: item.equipment_category?.name || "",
            text,
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatRace(race: any): Chunk {
    const traits = race.traits
        ? race.traits.map((t: { name: string }) => t.name).join(", ")
        : "";
    const abilityBonuses = race.ability_bonuses
        ? race.ability_bonuses
            .map((b: { ability_score: { name: string }; bonus: number }) => `${b.ability_score.name} +${b.bonus}`)
            .join(", ")
        : "";
    const languages = race.languages
        ? race.languages.map((l: { name: string }) => l.name).join(", ")
        : "";

    const text = `Race: ${race.name}
Speed: ${race.speed || "30"} ft
Size: ${race.size || "Medium"}
Ability Bonuses: ${abilityBonuses}
Languages: ${languages}
Traits: ${traits}
${race.age || ""}
${race.alignment || ""}
${race.size_description || ""}`.trim();

    return {
        id: `race-${race.index || race.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: { type: "race", name: race.name, text },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatSubclass(subclass: any): Chunk {
    const desc = Array.isArray(subclass.desc)
        ? subclass.desc.join("\n")
        : subclass.desc || "";

    const text = `Subclass: ${subclass.name}
Class: ${subclass.class?.name || "Unknown"}
${desc}`.trim();

    return {
        id: `subclass-${subclass.index || subclass.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: {
            type: "subclass",
            name: subclass.name,
            class: subclass.class?.name || "",
            text,
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatSubrace(subrace: any): Chunk {
    const desc = subrace.desc || "";
    const abilityBonuses = subrace.ability_bonuses
        ? subrace.ability_bonuses
            .map((b: { ability_score: { name: string }; bonus: number }) => `${b.ability_score.name} +${b.bonus}`)
            .join(", ")
        : "";

    const text = `Subrace: ${subrace.name}
Race: ${subrace.race?.name || "Unknown"}
Ability Bonuses: ${abilityBonuses}
${desc}`.trim();

    return {
        id: `subrace-${subrace.index || subrace.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: {
            type: "subrace",
            name: subrace.name,
            race: subrace.race?.name || "",
            text,
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatFeat(feat: any): Chunk {
    const desc = Array.isArray(feat.desc)
        ? feat.desc.join("\n")
        : feat.desc || "";
    const prerequisites = feat.prerequisites
        ? feat.prerequisites
            .map((p: { type: string; minimum_score?: number; ability_score?: { name: string } }) =>
                `${p.ability_score?.name || p.type} ${p.minimum_score || ""}`
            )
            .join(", ")
        : "None";

    const text = `Feat: ${feat.name}
Prerequisites: ${prerequisites}
${desc}`.trim();

    return {
        id: `feat-${feat.index || feat.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: { type: "feat", name: feat.name, text },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatFeature(feature: any): Chunk {
    const desc = Array.isArray(feature.desc)
        ? feature.desc.join("\n")
        : feature.desc || "";

    const text = `Class Feature: ${feature.name}
Class: ${feature.class?.name || "Unknown"}
Level: ${feature.level || "Unknown"}
${desc}`.trim();

    return {
        id: `feature-${feature.index || feature.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: {
            type: "feature",
            name: feature.name,
            class: feature.class?.name || "",
            level: feature.level || 0,
            text,
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatMagicItem(item: any): Chunk {
    const desc = Array.isArray(item.desc)
        ? item.desc.join("\n")
        : item.desc || "";

    const text = `Magic Item: ${item.name}
Rarity: ${item.rarity?.name || "Unknown"}
Category: ${item.equipment_category?.name || "Unknown"}
${desc}`.trim();

    return {
        id: `magic-item-${item.index || item.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: {
            type: "magic-item",
            name: item.name,
            rarity: item.rarity?.name || "",
            text,
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatRule(rule: any): Chunk {
    const desc = rule.desc || "";

    const text = `Rule: ${rule.name}\n${desc}`.trim();

    return {
        id: `rule-${rule.index || rule.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: { type: "rule", name: rule.name, text },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatRuleSection(section: any): Chunk {
    const desc = section.desc || "";

    const text = `Rule Section: ${section.name}\n${desc}`.trim();

    return {
        id: `rule-section-${section.index || section.name.toLowerCase().replace(/\s+/g, "-")}`,
        text,
        metadata: { type: "rule-section", name: section.name, text },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatLevel(level: any): Chunk {
    const features = level.features
        ? level.features.map((f: { name: string }) => f.name).join(", ")
        : "None";

    const text = `${level.class?.name || "Unknown"} Level ${level.level || "?"}
Proficiency Bonus: +${level.prof_bonus || "?"}
Features: ${features}
${level.spellcasting ? `Spell Slots: ${JSON.stringify(level.spellcasting)}` : ""}`.trim();

    return {
        id: `level-${level.class?.index || "unknown"}-${level.level || 0}`,
        text,
        metadata: {
            type: "level",
            name: `${level.class?.name || "Unknown"} Level ${level.level || "?"}`,
            class: level.class?.name || "",
            level: level.level || 0,
            text,
        },
    };
}

// ─────────────────────────────────────────────
// Embedding Logic
// ─────────────────────────────────────────────

async function embedBatch(texts: string[]): Promise<number[][]> {
    try {
        const response = await hf.featureExtraction({
            model: EMBEDDING_MODEL,
            inputs: texts,
        });

        // Handle response format
        if (Array.isArray(response) && Array.isArray(response[0])) {
            if (Array.isArray((response as number[][][])[0][0])) {
                // 3D array - batch of embeddings
                return (response as number[][][]).map((emb: number[][]) =>
                    emb.flat ? emb.flat() : emb[0]
                );
            }
            return response as number[][];
        }

        return [response as number[]];
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes("503") || message.includes("loading")) {
            console.log(`⏳ Model loading, waiting ${COLD_START_WAIT_MS / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, COLD_START_WAIT_MS));
            return embedBatch(texts); // Retry
        }
        throw error;
    }
}

// ─────────────────────────────────────────────
// Main Build Function
// ─────────────────────────────────────────────

async function buildKnowledgeBase() {
    console.log("🎲 Starting D&D 5e Knowledge Base Build\n");
    console.log("═".repeat(50));

    // Step 1: Read and format all data
    const allChunks: Chunk[] = [];

    const dataFiles: Array<{ file: string; formatter: (item: unknown) => Chunk; label: string }> = [
        { file: "5e-SRD-Spells.json", formatter: formatSpell, label: "Spells" },
        { file: "5e-SRD-Monsters.json", formatter: formatMonster, label: "Monsters" },
        { file: "5e-SRD-Classes.json", formatter: formatClass, label: "Classes" },
        { file: "5e-SRD-Conditions.json", formatter: formatCondition, label: "Conditions" },
        { file: "5e-SRD-Equipment.json", formatter: formatEquipment, label: "Equipment" },
        { file: "5e-SRD-Races.json", formatter: formatRace, label: "Races" },
        { file: "5e-SRD-Subclasses.json", formatter: formatSubclass, label: "Subclasses" },
        { file: "5e-SRD-Subraces.json", formatter: formatSubrace, label: "Subraces" },
        { file: "5e-SRD-Feats.json", formatter: formatFeat, label: "Feats" },
        { file: "5e-SRD-Features.json", formatter: formatFeature, label: "Features" },
        { file: "5e-SRD-Magic-Items.json", formatter: formatMagicItem, label: "Magic Items" },
        { file: "5e-SRD-Rules.json", formatter: formatRule, label: "Rules" },
        { file: "5e-SRD-Rule-Sections.json", formatter: formatRuleSection, label: "Rule Sections" },
        { file: "5e-SRD-Levels.json", formatter: formatLevel, label: "Levels" },
    ];

    for (const { file, formatter, label } of dataFiles) {
        const data = readJsonFile(file);
        if (data.length > 0) {
            const chunks = data.map(formatter);
            allChunks.push(...chunks);
            console.log(`✅ Loaded ${data.length} ${label}`);
        }
    }

    console.log(`\n📦 Total chunks: ${allChunks.length}`);
    console.log("═".repeat(50));

    if (allChunks.length === 0) {
        console.error("❌ No data found! Make sure JSON files are in the /data directory.");
        process.exit(1);
    }

    // Step 2: Embed all chunks in batches
    console.log("\n🧠 Embedding chunks...\n");
    const vectors: VectorRecord[] = [];

    for (let i = 0; i < allChunks.length; i += BATCH_SIZE_EMBED) {
        const batch = allChunks.slice(i, i + BATCH_SIZE_EMBED);
        const texts = batch.map((c) => c.text);

        console.log(
            `  Embedding batch ${Math.floor(i / BATCH_SIZE_EMBED) + 1}/${Math.ceil(allChunks.length / BATCH_SIZE_EMBED)} (${batch.length} chunks)...`
        );

        const embeddings = await embedBatch(texts);

        for (let j = 0; j < batch.length; j++) {
            vectors.push({
                id: batch[j].id,
                values: embeddings[j],
                metadata: batch[j].metadata,
            });
        }

        // Rate limiting
        if (i + BATCH_SIZE_EMBED < allChunks.length) {
            await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));
        }
    }

    console.log(`\n✅ Embeddings complete: ${vectors.length} vectors`);
    console.log("═".repeat(50));

    // Step 3: Upload to Pinecone in batches
    console.log("\n📤 Uploading to Pinecone...\n");
    const indexName = process.env.PINECONE_INDEX_NAME || "dnd5e-knowledge";
    const index = pinecone.index(indexName);

    for (let i = 0; i < vectors.length; i += BATCH_SIZE_UPSERT) {
        const batch = vectors.slice(i, i + BATCH_SIZE_UPSERT);

        console.log(
            `  Upserting batch ${Math.floor(i / BATCH_SIZE_UPSERT) + 1}/${Math.ceil(vectors.length / BATCH_SIZE_UPSERT)} (${batch.length} vectors)...`
        );

        await index.upsert({
            records: batch,
        });
    }

    console.log(`\n✅ Pinecone upload complete: ${vectors.length} vectors`);

    // Step 4: Verify
    console.log("\n🔍 Verifying...\n");
    const stats = await index.describeIndexStats();
    console.log(`  Total vectors in index: ${stats.totalRecordCount}`);

    console.log("\n" + "═".repeat(50));
    console.log("🎲 Knowledge base build complete!");
    console.log("═".repeat(50));
}

// Run
buildKnowledgeBase().catch((error) => {
    console.error("❌ Build failed:", error);
    process.exit(1);
});
