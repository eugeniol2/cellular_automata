import { useState, useCallback, useRef, useEffect } from "react";
import { createRandomGrid, createEmptyGrid } from "../utils/functions";
import { Agent, createAgent } from "../agents/agent";
import { highLifeStep, Grid as CA_Grid } from "../utils/caRules";
import { calculateBoxCountingDimension } from "../utils/analysis";
import {
  moveAgents,
  processDeathAndReproduction,
  processInfection,
  updateAgentStates,
} from "./methods";

const DEATH_RATE = 0.001;
const ANALYSIS_INTERVAL = 10;
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
  const agentsRef = useRef(agents);
  agentsRef.current = agents;
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

  const runSimulationStep = useCallback(() => {
    if (!runningRef.current || !isMounted) return;

    setGrid((prevGrid) => {
      const nextGrid = caRuleStepFn(prevGrid, numRows, numCols);

      setAgents((prevAgents) => {
        const currentPopulation = processDeathAndReproduction(
          prevAgents,
          DEATH_RATE,
          POPULATION_TARGET,
          nextAgentId,
          numRows,
          numCols
        );

        const newlyInfected = processInfection(currentPopulation);
        const processedAgents = updateAgentStates(
          currentPopulation,
          newlyInfected
        );

        const movedAgents = moveAgents(
          processedAgents,
          nextGrid,
          numRows,
          numCols
        );

        const currentStep = simulationStepRef.current;
        if ((currentStep + 1) % ANALYSIS_INTERVAL === 0) {
          const avgFitness =
            movedAgents.reduce((sum, a) => sum + a.fitness, 0) /
            movedAgents.length;
          setAvgFitnessHistory((hist) => [...hist, avgFitness]);

          const dimension = calculateBoxCountingDimension(
            nextGrid,
            movedAgents
          );
          setDimensionHistory((hist) => [...hist, dimension]);
        }

        return movedAgents;
      });

      return nextGrid;
    });

    setSimulationStep((prev) => prev + 1);
    setTimeout(runSimulationStep, 50);
  }, [isMounted, caRuleStepFn, numRows, numCols]);

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
    setAvgFitnessHistory([]);
    setDimensionHistory([]);
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
  };
};
