import { useState, useCallback, useRef } from "react";
import { createRandomGrid } from "../utils/functions";

export const useGameOfLife = (numRows: number, numCols: number) => {
  const [grid, setGrid] = useState(() => {
    return createRandomGrid(numRows, numCols);
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      const newGrid = g.map((arr) => [...arr]);
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          let neighbors = 0;
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
            const newI = i + x;
            const newJ = j + y;
            const wrappedI = (newI + numRows) % numRows;
            const wrappedJ = (newJ + numCols) % numCols;
            neighbors += g[wrappedI][wrappedJ];
          });
          if (neighbors < 2 || neighbors > 3) {
            newGrid[i][j] = 0;
          } else if (g[i][j] === 0 && neighbors === 3) {
            newGrid[i][j] = 1;
          }
        }
      }
      return newGrid;
    });
    setTimeout(runSimulation, 100);
  }, [numRows, numCols, runningRef]);

  const start = () => {
    setRunning(true);
    runningRef.current = true;
    runSimulation();
  };

  const stop = () => {
    setRunning(false);
    runningRef.current = false;
  };

  const reset = () => {
    setGrid(createRandomGrid(numRows, numCols));
    if (running) {
      stop();
    }
  };

  const toggleCell = (row: number, col: number) => {
    if (running) return;
    setGrid((g) => {
      const newGrid = g.map((arr) => [...arr]);
      newGrid[row][col] = g[row][col] ? 0 : 1;
      return newGrid;
    });
  };

  return { grid, running, start, stop, reset, toggleCell, numRows, numCols };
};
