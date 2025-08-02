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

export type CARuleStepFn = (
  prevGrid: CA_Grid,
  numRows: number,
  numCols: number
) => CA_Grid;

export const useSimulation = (
  numRows: number,
  numCols: number,
  initialAgentCount: number = 150,
  caRuleStepFn: CARuleStepFn = highLifeStep,
  deathRate: number = 0.001,
  analysisInterval: number = 10,
  populationTarget: number = 150,
  infectionDuration: number = 20,
  infectionContagiousRange: number = 2
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
          initialAgents[i].infectionTimer = infectionDuration;
        }
      }
      nextAgentId.current = initialAgentCount;
      return initialAgents;
    });
    setIsMounted(true);
  }, [numRows, numCols, initialAgentCount, infectionDuration]);

  const runSimulationStep = useCallback(() => {
    if (!runningRef.current || !isMounted) return;

    setGrid((prevGrid) => {
      const nextGrid = caRuleStepFn(prevGrid, numRows, numCols);

      setAgents((prevAgents) => {
        const currentPopulation = processDeathAndReproduction({
          agents: prevAgents,
          deathRate,
          populationTarget,
          nextAgentIdRef: nextAgentId,
          numRows,
          numCols,
        });

        const newlyInfected = processInfection({
          agents: currentPopulation,
          neighborRadius: infectionContagiousRange,
        });
        const processedAgents = updateAgentStates({
          agents: currentPopulation,
          newlyInfected: newlyInfected,
          infectionDuration: infectionDuration,
        });

        const movedAgents = moveAgents({
          agents: processedAgents,
          grid: nextGrid,
          numRows,
          numCols,
        });

        const currentStep = simulationStepRef.current;
        if ((currentStep + 1) % analysisInterval === 0) {
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
  }, [
    isMounted,
    caRuleStepFn,
    numRows,
    numCols,
    deathRate,
    populationTarget,
    infectionContagiousRange,
    infectionDuration,
    analysisInterval,
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
      for (let i = 0; i < 5; i++) {
        if (initialAgents[i]) {
          initialAgents[i].state = "infected";
          initialAgents[i].color = "red";
          initialAgents[i].infectionTimer = infectionDuration;
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
