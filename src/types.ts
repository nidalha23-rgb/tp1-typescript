// Generics base: reusable repository stores any entity with an id.
export interface Identifiable {
  id: number;
}

export type House = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";

export interface Wizard extends Identifiable {
  name: string;
  house: House;
}

// Utility type: caller provides all required Wizard properties except id.
export type NewWizard = Omit<Wizard, "id">;

export interface Spell extends Identifiable {
  name: string;
  power: number;
  casterId?: number;
}

export type NewSpell = Omit<Spell, "id">;

// Discriminated union of academy events.
export type AcademyEvent =
  | { type: "wizard-enrolled"; wizard: Wizard }
  | { type: "spell-cast"; wizardId: number; spellName: string; power: number }
  | { type: "points-awarded"; house: House; points: number };

// Exercice 3: extract only the spell-cast event type.
export type SpellCastEvent = Extract<AcademyEvent, { type: "spell-cast" }>;
