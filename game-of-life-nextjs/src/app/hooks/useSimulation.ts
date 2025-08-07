import { useState, useCallback, useRef, useEffect } from "react";
import { createRandomGrid, createEmptyGrid } from "../utils/functions";
import { Agent, createAgent } from "../agents/agent";
import { Grid as CA_Grid } from "../utils/caRules";
import { calculateBoxCountingDimension } from "../utils/analysis";
import { agentsAtom, globalAtoms } from "@/app/atoms";
import {
  moveAgents,
  processDeathAndReproduction,
  processInfection,
  updateAgentStates,
} from "../utils/methods";
import { useAtom } from "jotai";

export type CARuleStepFn = (
  prevGrid: CA_Grid,
  numRows: number,
  numCols: number
) => CA_Grid;

type UseSimulationProps = {
  numRows: number;
  numCols: number;
  initialAgentCount: number;
  caRuleStepFn: (
    prevGrid: CA_Grid,
    numRows: number,
    numCols: number
  ) => CA_Grid;
  deathRate: number;
  viralDeathRate: number;
  analysisInterval?: number;
  populationTarget: number;
  infectionDuration: number;
  infectionContagiousRange: number;
  enableReproduction: boolean;
  bornImmuneChance: number;
  clock: number;
};

export const useSimulation = ({
  numRows,
  numCols,
  initialAgentCount,
  caRuleStepFn,
  deathRate,
  analysisInterval = 2,
  populationTarget,
  infectionDuration,
  infectionContagiousRange,
  viralDeathRate,
  enableReproduction,
  bornImmuneChance,
  clock,
}: UseSimulationProps) => {
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

  const nextAgentId = useRef(initialAgentCount);
  const [generation, setGeneration] = useState(1);

  const [avgFitnessHistory, setAvgFitnessHistory] = useState<number[]>([]);
  const [dimensionHistory, setDimensionHistory] = useState<number[]>([]);

  const [agents, setAgents] = useAtom(agentsAtom);
  const [, setVirusDeathCounterAtom] = useAtom(globalAtoms.virusDeathsAtom);
  const [, setNaturalDeathsAtom] = useAtom(globalAtoms.naturalDeathsAtom);
  const [, setReproductionCountAtom] = useAtom(
    globalAtoms.reproductionCountAtom
  );

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
  }, [numRows, numCols, initialAgentCount, infectionDuration, setAgents]);

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
          viralDeathRate,
          simulationStep: simulationStepRef.current,
          analysisInterval,
          enableReproduction,
          setVirusDeathCount: setVirusDeathCounterAtom,
          setNaturalDeathCount: setNaturalDeathsAtom,
          setReproductionCount: setReproductionCountAtom,
          bornImmuneChance,
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

        setAgents(movedAgents);
        return movedAgents;
      });

      return nextGrid;
    });

    setSimulationStep((prev) => prev + 1);
    setTimeout(runSimulationStep, clock);
  }, [
    isMounted,
    clock,
    caRuleStepFn,
    numRows,
    numCols,
    setAgents,
    deathRate,
    populationTarget,
    viralDeathRate,
    analysisInterval,
    enableReproduction,
    setVirusDeathCounterAtom,
    setNaturalDeathsAtom,
    setReproductionCountAtom,
    bornImmuneChance,
    infectionContagiousRange,
    infectionDuration,
  ]);

  const start = () => {
    if (!isMounted) return;
    setRunning(true);
    runningRef.current = true;
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
    setGeneration(1);
    setVirusDeathCounterAtom(0);
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
    setNaturalDeathsAtom(0);
    setReproductionCountAtom(0);
    setVirusDeathCounterAtom(0);
  };

  return {
    grid,
    running,
    simulationStep,
    dimensionHistory,
    agents,
    generation,
    avgFitnessHistory,
    start,
    stop,
    resetSimulation: reset,
  };
};
