import { Agent, createAgent, GENOME_LENGTH } from "@/app/agents/agent";

const NEIGHBOR_RADIUS = 2;
const INFECTION_DURATION = 20;

export function processInfection(agents: Agent[]): Set<number> {
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
      if (dist <= NEIGHBOR_RADIUS) {
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

export function updateAgentStates(
  agents: Agent[],
  newlyInfected: Set<number>
): Agent[] {
  return agents.map((agent) => {
    const updatedAgent = { ...agent };

    if (
      updatedAgent.state === "suscetivel" &&
      newlyInfected.has(updatedAgent.id)
    ) {
      updatedAgent.state = "infected";
      updatedAgent.color = "red";
      updatedAgent.infectionTimer = INFECTION_DURATION;
    } else if (updatedAgent.state === "infected") {
      updatedAgent.infectionTimer -= 1;
      if (updatedAgent.infectionTimer <= 0) {
        updatedAgent.state = "recuperado";
        updatedAgent.color = "green";
      }
    }

    updatedAgent.fitness += 1;
    return updatedAgent;
  });
}

export function moveAgents(
  agents: Agent[],
  numRows: number,
  numCols: number
): Agent[] {
  return agents.map((agent) => {
    const dx = Math.floor(Math.random() * 3) - 1;
    const dy = Math.floor(Math.random() * 3) - 1;
    if (dx === 0 && dy === 0) return agent;

    const newRow = (agent.row + dx + numRows) % numRows;
    const newCol = (agent.col + dy + numCols) % numCols;

    const isOccupied = agents.some(
      (other) =>
        other.id !== agent.id && other.row === newRow && other.col === newCol
    );

    if (!isOccupied) {
      return { ...agent, row: newRow, col: newCol };
    }
    return agent;
  });
}

export function handleExtinction(
  agents: Agent[],
  populationTarget: number,
  nextAgentIdRef: React.MutableRefObject<number>,
  numRows: number,
  numCols: number
): Agent[] | null {
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
      newAgents[i].infectionTimer = INFECTION_DURATION;
    }
  }
  return newAgents;
}
