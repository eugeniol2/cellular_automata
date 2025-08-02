import { useState, useCallback, useRef, useEffect } from "react";
import { createRandomGrid, createEmptyGrid } from "../utils/functions";
import { Agent, createAgent, GENOME_LENGTH } from "../agents/agent";
import { highLifeStep, Grid as CA_Grid } from "../utils/caRules";
import { calculateBoxCountingDimension } from "../utils/analysis";
import {
  handleExtinction,
  moveAgents,
  processInfection,
  updateAgentStates,
} from "./methods";

const MUTATION_RATE = 0.05;
const GA_INTERVAL = 100;
const POPULATION_TARGET = 150;
const INFECTION_DURATION = 20;

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
  const [agents, setAgents] = useState<Agent[]>([]);
  const nextAgentId = useRef(initialAgentCount);
  const [generation, setGeneration] = useState(1);

  const [extinctionCount, setExtinctionCount] = useState(0);
  const [avgFitnessHistory, setAvgFitnessHistory] = useState<number[]>([]);
  const [dimensionHistory, setDimensionHistory] = useState<number[]>([]);

  useEffect(() => {
    setGrid(createRandomGrid(numRows, numCols));
    setAgents(() => {
      const initialAgents: Agent[] = [];
      for (let i = 0; i < initialAgentCount; i++) {
        initialAgents.push(createAgent(i, numRows, numCols));
      }

      for (let i = 0; i < 5; i++) {
        if (initialAgents[i]) {
          initialAgents[i].state = "infected";
          initialAgents[i].color = "red";
          initialAgents[i].infectionTimer = INFECTION_DURATION;
        }
      }
      nextAgentId.current = initialAgentCount;
      return initialAgents;
    });
    setIsMounted(true);
  }, [numRows, numCols, initialAgentCount]);

  const runGeneticAlgorithm = useCallback(
    (currentAgents: Agent[]): Agent[] => {
      if (currentAgents.length === 0) return [];
      const newGeneration: Agent[] = [];
      const sortedAgents = [...currentAgents].sort(
        (a, b) => b.fitness - a.fitness
      );
      const eliteCount = Math.max(1, Math.floor(sortedAgents.length * 0.1));

      for (let i = 0; i < eliteCount; i++) {
        newGeneration.push(
          createAgent(
            nextAgentId.current++,
            numRows,
            numCols,
            sortedAgents[i].genome
          )
        );
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

        const mutatedGenome = childGenome.map((gene) => {
          if (Math.random() < MUTATION_RATE) {
            const mutationAmount = (Math.random() - 0.5) * 0.1;
            return Math.max(0, Math.min(1, gene + mutationAmount));
          }
          return gene;
        });
        newGeneration.push(
          createAgent(nextAgentId.current++, numRows, numCols, mutatedGenome)
        );
      }
      return newGeneration.slice(0, POPULATION_TARGET);
    },
    [numRows, numCols]
  );

  const runSimulationStep = useCallback(() => {
    if (!runningRef.current || !isMounted) return;

    setSimulationStep((prev) => prev + 1);
    setGrid((prevGrid) => caRuleStepFn(prevGrid, numRows, numCols));

    setAgents((prevAgents) => {
      const newlyInfected = processInfection(prevAgents);
      const processedAgents = updateAgentStates(prevAgents, newlyInfected);

      const newPopulation = handleExtinction(
        processedAgents,
        POPULATION_TARGET,
        nextAgentId,
        numRows,
        numCols
      );
      if (newPopulation) {
        setExtinctionCount((c) => c + 1);
        setGeneration(1);
        return newPopulation;
      }

      const movedAgents = moveAgents(processedAgents, numRows, numCols);

      if ((simulationStep + 1) % GA_INTERVAL === 0) {
        const avgFitness =
          movedAgents.reduce((sum, a) => sum + a.fitness, 0) /
          movedAgents.length;
        setAvgFitnessHistory((hist) => [...hist, avgFitness]);

        const dimension = calculateBoxCountingDimension(
          gridRef.current,
          movedAgents
        );
        setDimensionHistory((hist) => [...hist, dimension]);

        setGeneration((g) => g + 1);
        return runGeneticAlgorithm(movedAgents);
      }

      return movedAgents;
    });

    setTimeout(runSimulationStep, 50);
  }, [
    isMounted,
    caRuleStepFn,
    numRows,
    numCols,
    runGeneticAlgorithm,
    simulationStep,
  ]);

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
    setSimulationStep(0);
    setExtinctionCount(0);
    setGeneration(1);
    setAgents(() => {
      const initialAgents: Agent[] = [];
      for (let i = 0; i < initialAgentCount; i++) {
        initialAgents.push(createAgent(i, numRows, numCols));
      }
      nextAgentId.current = initialAgentCount;
      return initialAgents;
    });
    setAvgFitnessHistory([]);
    setDimensionHistory([]);
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
    dimensionHistory,
    extinctionCount,
    agents,
    generation,
    avgFitnessHistory,
    start,
    stop,
    reset,
    toggleCell,
  };
};
