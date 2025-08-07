export interface Agent {
  id: number;
  row: number;
  col: number;
  state: "suscetivel" | "infected" | "recuperado";
  color: string;
  fitness: number;
  genome: number[];
  infectionTimer: number;
  cooldownTimer?: number;
  isBornImmune?: boolean;
}

export const GENOME_LENGTH = 101;

export function createRandomGenome(): number[] {
  return Array.from(
    { length: GENOME_LENGTH },
    () => Math.random() * 0.5 + 0.25
  );
}

export function createAgent(
  id: number,
  numRows: number,
  numCols: number,
  genome?: number[],
  isBornImmune: boolean = false
): Agent {
  const state = isBornImmune ? "recuperado" : "suscetivel";
  const color = isBornImmune ? "yellow" : "#fff";

  return {
    id,
    row: Math.floor(Math.random() * numRows),
    col: Math.floor(Math.random() * numCols),
    state,
    color,
    fitness: 0,
    genome: genome || createRandomGenome(),
    infectionTimer: 0,
    cooldownTimer: 0,
    isBornImmune,
  };
}
