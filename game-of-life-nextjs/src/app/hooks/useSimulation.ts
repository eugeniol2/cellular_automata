import { useState, useCallback, useRef, useEffect } from "react";
import { createEmptyGrid, createRandomGrid } from "../utils/functions";

export interface Agent {
  id: number;
  row: number;
  col: number;
  state: "normal" | "sheltered";
  color: string;
}

export const useSimulation = (
  numRows: number,
  numCols: number,
  initialAgentCount: number = 50
) => {
  const [grid, setGrid] = useState<number[][]>(() =>
    createEmptyGrid(numRows, numCols)
  );
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;
  const [simulationStep, setSimulationStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const nextAgentId = useRef(initialAgentCount);

  useEffect(() => {
    setGrid(createRandomGrid(numRows, numCols));
    setAgents(() => {
      const initialAgents: Agent[] = [];
      for (let i = 0; i < initialAgentCount; i++) {
        initialAgents.push({
          id: i,
          row: Math.floor(Math.random() * numRows),
          col: Math.floor(Math.random() * numCols),
          state: "normal",
          color: "#22c55e",
        });
      }
      nextAgentId.current = initialAgentCount;
      return initialAgents;
    });
    setIsMounted(true);
  }, [numRows, numCols, initialAgentCount]);

  const runSimulationStep = useCallback(() => {
    if (!runningRef.current || !isMounted) {
      return;
    }
    setSimulationStep((s) => s + 1);
    setGrid((prevGrid) => {
      if (!prevGrid || prevGrid.length === 0) return [];
      let isolatedTwoByTwoBlockCount = 0;
      const nextGrid = Array(numRows)
        .fill(0)
        .map((_, i) =>
          Array(numCols)
            .fill(0)
            .map((__, j) => {
              const isBlock =
                i < numRows - 1 &&
                j < numCols - 1 &&
                prevGrid[i]?.[j] === 1 &&
                prevGrid[i + 1]?.[j] === 1 &&
                prevGrid[i]?.[j + 1] === 1 &&
                prevGrid[i + 1]?.[j + 1] === 1;
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
                  if (prevGrid[wrappedCheckRow]?.[wrappedCheckCol] === 1) {
                    isIsolated = false;
                    break;
                  }
                }
                if (isIsolated) {
                  isolatedTwoByTwoBlockCount++;
                }
              }
              let liveNeighbors = 0;
              const neighborCoords = [
                [-1, -1],
                [-1, 0],
                [-1, 1],
                [0, -1],
                [0, 1],
                [1, -1],
                [1, 0],
                [1, 1],
              ];
              neighborCoords.forEach(([x, y]) => {
                const wrappedI = (i + x + numRows) % numRows;
                const wrappedJ = (j + y + numCols) % numCols;
                liveNeighbors += prevGrid[wrappedI]?.[wrappedJ] || 0;
              });
              if (liveNeighbors < 2 || liveNeighbors > 3) return 0;
              else if (prevGrid[i]?.[j] === 0 && liveNeighbors === 3) return 1;
              else return prevGrid[i]?.[j] || 0;
            })
        );
      const currentRainStatus = isolatedTwoByTwoBlockCount === 3;
      setIsRaining(currentRainStatus);
      return nextGrid;
    });
    setTimeout(runSimulationStep, 100);
  }, [numRows, numCols, isMounted]);

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
        initialAgents.push({
          id: i,
          row: Math.floor(Math.random() * numRows),
          col: Math.floor(Math.random() * numCols),
          state: "normal",
          color: "#22c55e",
        });
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
    agents,
    running,
    isRaining,
    simulationStep,
    start,
    stop,
    reset,
    toggleCell,
    numRows,
    numCols,
  };
};
