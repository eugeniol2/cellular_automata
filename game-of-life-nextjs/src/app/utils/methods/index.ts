import { Agent, createAgent, GENOME_LENGTH } from "@/app/agents/agent";
import { AgentSpatialGrid } from "./spacialGrid";

const MUTATION_RATE = 0.15;

export function processInfection({
  agents,
  neighborRadius,
}: {
  agents: Agent[];
  neighborRadius: number;
}): Set<number> {
  const infected = agents.filter((a) => a.state === "infected");
  const newlyInfected = new Set<number>();

  if (infected.length === 0) {
    return newlyInfected;
  }

  const infectedGrid = new AgentSpatialGrid(neighborRadius * 2);
  for (const infector of infected) {
    infectedGrid.add(infector);
  }

  const susceptibles = agents.filter((a) => a.state === "suscetivel");

  for (const susceptible of susceptibles) {
    const nearbyInfected = infectedGrid.getNearby(susceptible, neighborRadius);

    if (nearbyInfected.length === 0) {
      continue;
    }

    let infectedNeighbors = 0;
    for (const infector of nearbyInfected) {
      const dist = Math.max(
        Math.abs(susceptible.row - infector.row),
        Math.abs(susceptible.col - infector.col)
      );
      if (dist <= neighborRadius) {
        infectedNeighbors++;
      }
    }

    if (infectedNeighbors > 0) {
      const perceptionIndex = Math.min(infectedNeighbors, GENOME_LENGTH - 1);
      const infectionProb = susceptible.genome[perceptionIndex];
      if (Math.random() < infectionProb) {
        newlyInfected.add(susceptible.id);
      }
    }
  }

  return newlyInfected;
}

export function updateAgentStates({
  agents,
  newlyInfected,
  infectionDuration,
}: {
  agents: Agent[];
  newlyInfected: Set<number>;
  infectionDuration: number;
}): Agent[] {
  return agents.map((agent) => {
    const updatedAgent = { ...agent };
    if (
      updatedAgent.state === "suscetivel" &&
      newlyInfected.has(updatedAgent.id)
    ) {
      updatedAgent.state = "infected";
      updatedAgent.color = "red";
      updatedAgent.infectionTimer = infectionDuration;
    } else if (updatedAgent.state === "infected") {
      updatedAgent.infectionTimer -= 0.5;
      if (updatedAgent.infectionTimer <= 0) {
        updatedAgent.state = "recuperado";
        updatedAgent.color = "green";
        updatedAgent.color = updatedAgent.isBornImmune ? "yellow" : "green";
      }
    }

    updatedAgent.fitness += 1;
    return updatedAgent;
  });
}

export function moveAgents({
  agents,
  grid,
  numRows,
  numCols,
}: {
  agents: Agent[];
  grid: number[][];
  numRows: number;
  numCols: number;
}): Agent[] {
  const occupancyGrid: number[][] = Array(numRows)
    .fill(0)
    .map(() => Array(numCols).fill(0));

  for (const agent of agents) {
    occupancyGrid[agent.row][agent.col] = 1;
  }

  return agents.map((agent) => {
    const dx = Math.floor(Math.random() * 3) - 1;
    const dy = Math.floor(Math.random() * 3) - 1;
    if (dx === 0 && dy === 0) return agent;

    const newRow = (agent.row + dx + numRows) % numRows;
    const newCol = (agent.col + dy + numCols) % numCols;

    if (grid[newRow]?.[newCol] === 1 || occupancyGrid[newRow][newCol] === 1) {
      return agent;
    }

    occupancyGrid[agent.row][agent.col] = 0;
    occupancyGrid[newRow][newCol] = 1;

    return { ...agent, row: newRow, col: newCol };
  });
}

function reproduceAgents({
  parents,
  numToCreate,
  nextAgentIdRef,
  numRows,
  numCols,
  simulationStep,
  analysisInterval,
  bornImmunityChance = 0.7,
}: {
  parents: Agent[];
  numToCreate: number;
  nextAgentIdRef: React.MutableRefObject<number>;
  numRows: number;
  numCols: number;
  simulationStep: number;
  analysisInterval: number;
  bornImmunityChance?: number;
}): Agent[] {
  if (
    parents.length === 0 ||
    numToCreate === 0 ||
    !(simulationStep % analysisInterval === 0)
  ) {
    return [];
  }

  const newAgents: Agent[] = [];
  const sortedParents = [...parents].sort((a, b) => b.fitness - a.fitness);
  const tournamentSize = 5;

  for (let i = 0; i < numToCreate; i++) {
    const selectParent = (): Agent => {
      let best: Agent | null = null;
      for (let j = 0; j < tournamentSize; j++) {
        const randomIndex = Math.floor(Math.random() * sortedParents.length);
        const contender = sortedParents[randomIndex];
        if (!best || contender.fitness > best.fitness) {
          best = contender;
        }
      }
      return best!;
    };

    const parent1 = selectParent();
    const parent2 = selectParent();

    const crossoverPoint = Math.floor(Math.random() * GENOME_LENGTH);
    const childGenome = [
      ...parent1.genome.slice(0, crossoverPoint),
      ...parent2.genome.slice(crossoverPoint),
    ];

    const isEitherParentImmune =
      parent1.state === "recuperado" || parent2.state === "recuperado";

    const isBornImmune =
      isEitherParentImmune && Math.random() < bornImmunityChance;

    const mutatedGenome = childGenome.map((gene) => {
      if (Math.random() < MUTATION_RATE) {
        const mutationAmount = (Math.random() - 0.5) * 0.1;
        return Math.max(0, Math.min(1, gene + mutationAmount));
      }
      return gene;
    });

    newAgents.push(
      createAgent(
        nextAgentIdRef.current++,
        numRows,
        numCols,
        mutatedGenome,
        isBornImmune
      )
    );
  }

  return newAgents;
}

export function processDeathAndReproduction({
  agents,
  deathRate,
  populationTarget,
  nextAgentIdRef,
  numRows,
  numCols,
  viralDeathRate,
  simulationStep,
  analysisInterval = 1,
  enableReproduction,
  setVirusDeathCount,
  setNaturalDeathCount,
  setReproductionCount,
  bornImmuneChance,
}: {
  agents: Agent[];
  deathRate: number;
  populationTarget: number;
  nextAgentIdRef: React.MutableRefObject<number>;
  numRows: number;
  numCols: number;
  viralDeathRate: number;
  simulationStep: number;
  analysisInterval: number;
  enableReproduction: boolean;
  bornImmuneChance: number;
  setVirusDeathCount: React.Dispatch<React.SetStateAction<number>>;
  setNaturalDeathCount: React.Dispatch<React.SetStateAction<number>>;
  setReproductionCount: React.Dispatch<React.SetStateAction<number>>;
}): Agent[] {
  let virusDeathsVar = 0;
  let naturalDeathsVar = 0;

  const survivingAgents: Agent[] = [];

  agents.forEach((agent) => {
    let survived = true;
    if (
      agent.state === "infected" &&
      Math.random() < viralDeathRate &&
      simulationStep % analysisInterval === 0
    ) {
      virusDeathsVar++;
      survived = false;
    } else if (
      Math.random() < deathRate &&
      simulationStep % analysisInterval === 0
    ) {
      naturalDeathsVar++;
      survived = false;
    }

    if (survived) {
      survivingAgents.push(agent);
    }
  });

  if (virusDeathsVar > 0) setVirusDeathCount((prev) => prev + virusDeathsVar);
  if (naturalDeathsVar > 0)
    setNaturalDeathCount((prev) => prev + naturalDeathsVar);

  if (!enableReproduction) {
    return survivingAgents;
  }

  const numToCreate = populationTarget - survivingAgents.length;

  if (numToCreate <= 0) {
    return survivingAgents;
  }
  const children = reproduceAgents({
    parents: survivingAgents,
    numToCreate,
    nextAgentIdRef,
    numRows,
    numCols,
    analysisInterval,
    simulationStep,
    bornImmunityChance: bornImmuneChance,
  });

  if (simulationStep % analysisInterval === 0) {
    setReproductionCount((prev) => prev + children.length);
  }

  return [...survivingAgents, ...children];
}
