import { useState, useCallback, useRef, useEffect } from "react";
import { createRandomGrid, createEmptyGrid } from "../utils/functions";
import { Agent, createAgent, GENOME_LENGTH } from "../agents/agent";
import { highLifeStep, Grid as CA_Grid } from "../utils/caRules";

const MUTATION_RATE = 0.01;
const GA_INTERVAL = 100;
const POPULATION_TARGET = 50;
const SHELTER_DURATION = 10;

export type CARuleStepFn = (
  prevGrid: CA_Grid,
  numRows: number,
  numCols: number
) => CA_Grid;

export const useSimulation = (
  numRows: number,
  numCols: number,
  initialAgentCount: number = POPULATION_TARGET,
  caRuleStepFn: CARuleStepFn = highLifeStep
) => {
  const [grid, setGrid] = useState<number[][]>(() =>
    createEmptyGrid(numRows, numCols)
  );
  const gridRef = useRef(grid);
  gridRef.current = grid;

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;
  const [simulationStep, setSimulationStep] = useState(0);
  const simulationStepRef = useRef(simulationStep);
  simulationStepRef.current = simulationStep;
  const [isMounted, setIsMounted] = useState(false);

  const [isRaining, setIsRaining] = useState(false);

  const [agents, setAgents] = useState<Agent[]>([]);
  const nextAgentId = useRef(initialAgentCount);

  const [generation, setGeneration] = useState(1);
  const generationRef = useRef(generation);
  generationRef.current = generation;

  useEffect(() => {
    setGrid(createRandomGrid(numRows, numCols));
    setAgents(() => {
      const initialAgents: Agent[] = [];
      for (let i = 0; i < initialAgentCount; i++) {
        initialAgents.push(createAgent(i, numRows, numCols));
      }
      nextAgentId.current = initialAgentCount;
      return initialAgents;
    });
    setIsMounted(true);
  }, [numRows, numCols, initialAgentCount, caRuleStepFn]);

  const runGeneticAlgorithm = (currentAgents: Agent[]): Agent[] => {
    if (currentAgents.length === 0) return [];
    const newGeneration: Agent[] = [];
    const sortedAgents = [...currentAgents].sort(
      (a, b) => b.fitness - a.fitness
    );
    const eliteCount = Math.max(1, Math.floor(sortedAgents.length * 0.1));
    for (let i = 0; i < eliteCount; i++) {
      const eliteAgent = sortedAgents[i];
      newGeneration.push({
        ...eliteAgent,
        id: nextAgentId.current++,
        row: Math.floor(Math.random() * numRows),
        col: Math.floor(Math.random() * numCols),
        fitness: 0,
        state: "normal",
        color: "#fff",
        prediction: false,
        shelterTimer: 0,
        cooldownTimer: 0,
      });
    }
    const tournamentSize = 5;
    while (newGeneration.length < POPULATION_TARGET) {
      const selectParent = (): Agent => {
        let best: Agent | null = null;
        for (let i = 0; i < tournamentSize; i++) {
          const randomIndex = Math.floor(Math.random() * sortedAgents.length);
          const contender = sortedAgents[randomIndex];
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
      const mutatedGenome = childGenome.map((bit) =>
        Math.random() < MUTATION_RATE ? 1 - bit : bit
      );
      newGeneration.push({
        id: nextAgentId.current++,
        row: Math.floor(Math.random() * numRows),
        col: Math.floor(Math.random() * numCols),
        state: "normal",
        color: "#fff",
        fitness: 0,
        prediction: false,
        genome: mutatedGenome,
        shelterTimer: 0,
        cooldownTimer: 0,
      });
    }
    return newGeneration.slice(0, POPULATION_TARGET);
  };

  const runSimulationStep = useCallback(() => {
    if (!runningRef.current || !isMounted) {
      return;
    }
    setSimulationStep((prev) => {
      const next = prev + 1;
      simulationStepRef.current = next;
      return next;
    });

    let blockCountForRainCheck = 0;
    const currentGrid = gridRef.current;
    for (let i = 0; i < numRows - 1; i++) {
      for (let j = 0; j < numCols - 1; j++) {
        const isBlock =
          currentGrid[i]?.[j] === 1 &&
          currentGrid[i + 1]?.[j] === 1 &&
          currentGrid[i]?.[j + 1] === 1 &&
          currentGrid[i + 1]?.[j + 1] === 1;
        if (isBlock) {
          let isIsolated = true;
          const surroundingCoords = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [-1, 2],
            [0, -1],
            [0, 2],
            [1, -1],
            [1, 2],
            [2, -1],
            [2, 0],
            [2, 1],
            [2, 2],
          ];
          for (const [dx, dy] of surroundingCoords) {
            const checkRow = i + dx;
            const checkCol = j + dy;
            const wrappedCheckRow = (checkRow + numRows) % numRows;
            const wrappedCheckCol = (checkCol + numCols) % numCols;
            if (currentGrid[wrappedCheckRow]?.[wrappedCheckCol] === 1) {
              isIsolated = false;
              break;
            }
          }
          if (isIsolated) {
            blockCountForRainCheck++;
          }
        }
      }
    }
    const currentRainStatus = blockCountForRainCheck === 3;
    setIsRaining(currentRainStatus);

    setAgents((prevAgents) => {
      const processedAgents = prevAgents
        .map((agent) => {
          if (agent.state === "sheltered") {
            agent.shelterTimer -= 1;
            if (agent.shelterTimer <= 0) {
              agent.state = "normal";
              agent.color = "#fff";
              agent.cooldownTimer = SHELTER_DURATION * 2;
            }
          } else if (agent.cooldownTimer && agent.cooldownTimer > 0) {
            agent.cooldownTimer -= 1;
          }

          let perceptionIndex = 0;
          let powerOfTwo = 1;
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              const wrappedI = (agent.row + x + numRows) % numRows;
              const wrappedJ = (agent.col + y + numCols) % numCols;
              if (currentGrid[wrappedI]?.[wrappedJ] === 1) {
                perceptionIndex += powerOfTwo;
              }
              powerOfTwo *= 2;
            }
          }

          const agentPredictsRain = agent.genome[perceptionIndex] === 1;
          agent.prediction = agentPredictsRain;

          if (
            agentPredictsRain &&
            agent.state === "normal" &&
            agent.shelterTimer === 0 &&
            (!agent.cooldownTimer || agent.cooldownTimer <= 0)
          ) {
            agent.state = "sheltered";
            agent.color = "orange";
            agent.shelterTimer = SHELTER_DURATION;
          } else if (!agentPredictsRain && agent.state === "normal") {
            agent.color = "#fff";
          }

          if (currentRainStatus && agent.state !== "sheltered") {
            return null;
          } else {
            agent.fitness += 1;
            return agent;
          }
        })
        .filter((agent) => agent !== null) as Agent[];

      if (processedAgents.length === 0) {
        const newAgents: Agent[] = [];
        for (let i = 0; i < POPULATION_TARGET; i++) {
          newAgents.push(createAgent(nextAgentId.current++, numRows, numCols));
        }
        return newAgents;
      }

      const movedAgents = processedAgents.map((agent) => {
        const dx = Math.floor(Math.random() * 3) - 1;
        const dy = Math.floor(Math.random() * 3) - 1;
        if (dx === 0 && dy === 0) return agent;

        const newRow = agent.row + dx;
        const newCol = agent.col + dy;
        const wrappedNewRow = (newRow + numRows) % numRows;
        const wrappedNewCol = (newCol + numCols) % numCols;

        if (currentGrid[wrappedNewRow]?.[wrappedNewCol] === 0) {
          const occupied = processedAgents.some(
            (other) =>
              other.id !== agent.id &&
              other.row === wrappedNewRow &&
              other.col === wrappedNewCol
          );
          if (!occupied) {
            agent.row = wrappedNewRow;
            agent.col = wrappedNewCol;
          }
        }
        return agent;
      });

      const nextStep = simulationStepRef.current;
      if (nextStep % GA_INTERVAL === 0) {
        if (generationRef.current === generation) {
          const nextGen = generation + 1;
          generationRef.current = nextGen;
          setGeneration(nextGen);
        }
        return runGeneticAlgorithm(movedAgents);
      } else {
        return movedAgents;
      }
    });

    setGrid((prevGrid) => caRuleStepFn(prevGrid, numRows, numCols));

    setTimeout(runSimulationStep, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numRows, numCols, isMounted, simulationStep, caRuleStepFn]);

  const start = () => {
    if (!isMounted) return;
    setRunning(true);
    runningRef.current = true;
    setSimulationStep(0);
    runSimulationStep();
  };

  const stop = () => {
    setRunning(false);
    runningRef.current = false;
  };

  const reset = () => {
    if (!isMounted) return;
    stop();
    setGrid(createRandomGrid(numRows, numCols));
    setIsRaining(false);
    setSimulationStep(0);
    setAgents(() => {
      const initialAgents: Agent[] = [];
      for (let i = 0; i < initialAgentCount; i++) {
        initialAgents.push(createAgent(i, numRows, numCols));
      }
      nextAgentId.current = initialAgentCount;
      return initialAgents;
    });
  };

  const toggleCell = (row: number, col: number) => {
    if (running || !isMounted) return;
    setGrid((g) => {
      if (!g || g.length === 0) return [];
      const newGrid = g.map((arr) => [...arr]);
      if (newGrid[row] !== undefined && newGrid[row][col] !== undefined) {
        newGrid[row][col] = g[row][col] ? 0 : 1;
      }
      return newGrid;
    });
  };

  return {
    grid,
    running,
    simulationStep,
    isRaining,
    agents,
    generation,
    start,
    stop,
    reset,
    toggleCell,
  };
};
