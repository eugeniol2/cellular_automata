import { Agent, createAgent, GENOME_LENGTH } from "@/app/agents/agent";

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

  const susceptibles = agents.filter((a) => a.state === "suscetivel");

  for (const susceptible of susceptibles) {
    let infectedNeighbors = 0;
    for (const infector of infected) {
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
      updatedAgent.infectionTimer -= 1;
      if (updatedAgent.infectionTimer <= 0) {
        updatedAgent.state = "recuperado";
        updatedAgent.color = "green";
        updatedAgent.fitness += 3;
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
  const agentPositions = new Set(agents.map((a) => `${a.row},${a.col}`));

  return agents.map((agent) => {
    const dx = Math.floor(Math.random() * 3) - 1;
    const dy = Math.floor(Math.random() * 3) - 1;
    if (dx === 0 && dy === 0) return agent;

    const newRow = (agent.row + dx + numRows) % numRows;
    const newCol = (agent.col + dy + numCols) % numCols;

    const isNextCellPositionAvailable = grid[newRow]?.[newCol] === 1;
    if (isNextCellPositionAvailable) {
      return agent;
    }

    const newPosKey = `${newRow},${newCol}`;
    const isNextCellOccupiedByAnotherAgent = agentPositions.has(newPosKey);
    if (isNextCellOccupiedByAnotherAgent) {
      return agent;
    }

    agentPositions.delete(`${agent.row},${agent.col}`);
    agentPositions.add(newPosKey);
    return { ...agent, row: newRow, col: newCol };
  });
}

export function handleExtinction({
  agents,
  populationTarget,
  nextAgentIdRef,
  numRows,
  numCols,
  infectionDuration,
}: {
  agents: Agent[];
  populationTarget: number;
  nextAgentIdRef: React.MutableRefObject<number>;
  numRows: number;
  numCols: number;
  infectionDuration: number;
}): Agent[] | null {
  if (agents.length > 0) {
    return null;
  }

  const newAgents: Agent[] = [];
  for (let i = 0; i < populationTarget; i++) {
    newAgents.push(createAgent(nextAgentIdRef.current++, numRows, numCols));
  }
  for (let i = 0; i < 5; i++) {
    if (newAgents[i]) {
      newAgents[i].state = "infected";
      newAgents[i].color = "red";
      newAgents[i].infectionTimer = infectionDuration;
    }
  }
  return newAgents;
}

function reproduceAgents({
  parents,
  numToCreate,
  nextAgentIdRef,
  numRows,
  numCols,
}: {
  parents: Agent[];
  numToCreate: number;
  nextAgentIdRef: React.MutableRefObject<number>;
  numRows: number;
  numCols: number;
}): Agent[] {
  if (parents.length === 0 || numToCreate === 0) {
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

    const mutatedGenome = childGenome.map((gene) => {
      if (Math.random() < MUTATION_RATE) {
        const mutationAmount = (Math.random() - 0.5) * 0.1;
        return Math.max(0, Math.min(1, gene + mutationAmount));
      }
      return gene;
    });

    newAgents.push(
      createAgent(nextAgentIdRef.current++, numRows, numCols, mutatedGenome)
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
  analysisInterval,
  enableReproduction,
  onVirusDeath,
  onNaturalDeath,
  onReproduction,
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
  onVirusDeath?: () => void;
  onNaturalDeath?: () => void;
  onReproduction?: (count: number) => void;
}): Agent[] {
  let virusDeathCount = 0;
  let naturalDeathCount = 0;

  const survivingAgents = agents.filter((agent) => {
    if (
      agent.state === "infected" &&
      Math.random() < viralDeathRate &&
      simulationStep % analysisInterval === 0
    ) {
      virusDeathCount++;
      return false;
    }
    if (Math.random() < deathRate) {
      naturalDeathCount++;
      return false;
    }
    return true;
  });

  if (virusDeathCount > 0) onVirusDeath?.();
  if (naturalDeathCount > 0) onNaturalDeath?.();

  if (!enableReproduction) {
    return survivingAgents;
  }

  const numToCreate = enableReproduction
    ? populationTarget - survivingAgents.length
    : 0;

  const children = reproduceAgents({
    parents: survivingAgents,
    numToCreate,
    nextAgentIdRef,
    numRows,
    numCols,
  });

  if (numToCreate > 0) {
    onReproduction?.(numToCreate);
  }

  return [...survivingAgents, ...children];
}
