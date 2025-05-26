export interface Agent {
  id: number;
  row: number;
  col: number;
  state: "normal" | "sheltered";
  color: string;
  fitness: number;
  prediction: boolean;
  genome: number[];
  shelterTimer: number;
  cooldownTimer?: number;
}

export const GENOME_LENGTH = 512;

export function createRandomGenome(): number[] {
  return Array.from({ length: GENOME_LENGTH }, () => Math.round(Math.random()));
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
    state: "normal",
    color: "#fff",
    fitness: 0,
    prediction: false,
    genome: genome || createRandomGenome(),
    shelterTimer: 0,
    cooldownTimer: 0,
  };
}
