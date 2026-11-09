import { Cache } from "./decorators";
import { SpellRepository, WizardRepository } from "./repository";
import type { House, SpellCastEvent, Wizard } from "./types";

// Exercice 6 — Strengthen the type guard.
// Step 1: dedicated type guard for House (type predicate).
export function isHouse(value: unknown): value is House {
  return (
    value === "Gryffindor" ||
    value === "Slytherin" ||
    value === "Ravenclaw" ||
    value === "Hufflepuff"
  );
}

// Step 2: update isWizard() to use isHouse() instead of accepting any string.
export function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house)
  );
}

// Exercice 3 — handler that only accepts spell-cast events.
export function handleSpellCast(event: SpellCastEvent): void {
  console.log(
    `Spell cast: wizard #${event.wizardId} used ${event.spellName} (power ${event.power})`
  );
}

// Exercice 5 — service with a cached synchronous method.
export class ArithmancyService {
  @Cache
  computeScore(name: string, level: number): number {
    // Simulate an expensive calculation.
    console.log(`[ArithmancyService] computing for ${name}, level ${level}...`);
    return name.length * 10 + level;
  }
}

function main() {
  console.log("=== Exercice 1 — Ajouter un nouvel sorcier (NewWizard, id attribué) ===");
  const wizardRepo = new WizardRepository();
  const harry = wizardRepo.addWizard({ name: "Harry Potter", house: "Gryffindor" });
  const draco = wizardRepo.addWizard({ name: "Draco Malfoy", house: "Slytherin" });
  const luna = wizardRepo.addWizard({ name: "Luna Lovegood", house: "Ravenclaw" });
  const hermione = wizardRepo.addWizard({ name: "Hermione Granger", house: "Gryffindor" });
  console.log("Tous les sorciers:", wizardRepo.getAll());
  console.log("Harry (id auto):", harry);

  console.log("\n=== Exercice 2 — Filtrer les sorciers par maison (findByHouse) ===");
  const gryffindors = wizardRepo.findByHouse("Gryffindor");
  console.log("Gryffindor:", gryffindors);

  console.log("\n=== Exercice 3 — Extract pour événements de sort (SpellCastEvent) ===");
  const spellEvent: SpellCastEvent = {
    type: "spell-cast",
    wizardId: harry.id,
    spellName: "Expelliarmus",
    power: 40,
  };
  handleSpellCast(spellEvent);

  console.log("\n=== Exercice 4 — Valider la puissance d'un sort (@ValidateSpellPower) ===");
  const spellRepo = new SpellRepository();
  const valid = spellRepo.add({ name: "Lumos", power: 10 });
  console.log("Sort valide ajouté:", valid);
  try {
    spellRepo.add({ name: "Broken Curse", power: -5 });
  } catch (error) {
    console.log("Sort invalide rejeté (attendu):", (error as Error).message);
  }

  console.log("\n=== Exercice 5 — Décorateur de méthode avec mise en cache (@Cache) ===");
  const service = new ArithmancyService();
  console.log("Résultat 1:", service.computeScore("Harry", 3));
  console.log("Résultat 2 (même args, cache):", service.computeScore("Harry", 3));
  console.log("Résultat 3 (args différents):", service.computeScore("Luna", 2));
  const otherService = new ArithmancyService();
  console.log("Résultat 4 (autre instance, cache séparé):", otherService.computeScore("Harry", 3));

  console.log("\n=== Exercice 6 — Type guard strict (isHouse / isWizard) ===");
  const validWizard = { id: 99, name: "Cedric Diggory", house: "Hufflepuff" };
  const invalidHouse = { id: 100, name: "Viktor Krum", house: "Durmstrang" };
  const missingFields = { name: "Mystery" };
  console.log("validWizard:", isWizard(validWizard));
  console.log("invalidHouse (Durmstrang):", isWizard(invalidHouse));
  console.log("missingFields:", isWizard(missingFields));

  console.log("\n=== Generics — référentiel réutilisable ===");
  console.log("WizardRepository/SpellRepository héritent de Repository<T extends Identifiable>.");
  console.log(`Wizards: ${wizardRepo.getAll().length} | Spells: ${spellRepo.getAll().length}`);
}

main();
