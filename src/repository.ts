import { ValidateSpellPower } from "./decorators";
import type { Identifiable, NewSpell, NewWizard, Spell, Wizard } from "./types";

// Generics — reusable repository capable of storing wizards, spells, and other entities.
export class Repository<T extends Identifiable> {
  protected items: T[] = [];
  private nextId = 1;

  add(data: Omit<T, "id">): T {
    const entity = { ...(data as object), id: this.nextId++ } as T;
    this.items.push(entity);
    return entity;
  }

  getAll(): T[] {
    return [...this.items];
  }

  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }
}

// Exercice 1 — record a wizard using NewWizard, then assign an identifier (via repository).
export class WizardRepository extends Repository<Wizard> {
  addWizard(wizard: NewWizard): Wizard {
    return this.add(wizard);
  }

  // Exercice 2 — filter wizards by house (indexed access type Wizard["house"]).
  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.items.filter((wizard) => wizard.house === house);
  }
}

export class SpellRepository extends Repository<Spell> {
  // Exercice 4 — apply decorator: reject spell when power is negative.
  @ValidateSpellPower
  add(spell: NewSpell): Spell {
    return super.add(spell);
  }
}
