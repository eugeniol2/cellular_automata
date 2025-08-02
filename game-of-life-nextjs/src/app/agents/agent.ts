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
  genome?: number[]
): Agent {
  return {
    id,
    row: Math.floor(Math.random() * numRows),
    col: Math.floor(Math.random() * numCols),
    state: "suscetivel",
    color: "#fff",
    fitness: 0,
    genome: genome || createRandomGenome(),
    infectionTimer: 0,
    cooldownTimer: 0,
  };
}
