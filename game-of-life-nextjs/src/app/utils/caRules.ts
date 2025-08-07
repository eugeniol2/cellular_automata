export type Grid = number[][];

export function highLifeStep(
  prevGrid: Grid,
  numRows: number,
  numCols: number
): Grid {
  if (!prevGrid || prevGrid.length === 0) return [];
  const nextGrid = Array(numRows)
    .fill(0)
    .map((_, i) =>
      Array(numCols)
        .fill(0)
        .map((__, j) => {
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
          const isAlive = prevGrid[i]?.[j] === 1;
          if (!isAlive && (liveNeighbors === 3 || liveNeighbors === 6)) {
            return 1;
          } else if (isAlive && (liveNeighbors === 2 || liveNeighbors === 3)) {
            return 1;
          } else {
            return 0;
          }
        })
    );
  return nextGrid;
}

export function dayAndNightStep(
  prevGrid: Grid,
  numRows: number,
  numCols: number
): Grid {
  if (!prevGrid || prevGrid.length === 0) return [];
  const nextGrid = Array(numRows)
    .fill(0)
    .map((_, i) =>
      Array(numCols)
        .fill(0)
        .map((__, j) => {
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
          const isAlive = prevGrid[i]?.[j] === 1;
          if (
            !isAlive &&
            (liveNeighbors === 3 ||
              liveNeighbors === 6 ||
              liveNeighbors === 7 ||
              liveNeighbors === 8)
          ) {
            return 1;
          } else if (
            isAlive &&
            (liveNeighbors === 3 ||
              liveNeighbors === 4 ||
              liveNeighbors === 6 ||
              liveNeighbors === 7 ||
              liveNeighbors === 8)
          ) {
            return 1;
          } else {
            return 0;
          }
        })
    );
  return nextGrid;
}

export function seedsStep(
  prevGrid: Grid,
  numRows: number,
  numCols: number
): Grid {
  if (!prevGrid || prevGrid.length === 0) return [];
  const nextGrid = Array(numRows)
    .fill(0)
    .map((_, i) =>
      Array(numCols)
        .fill(0)
        .map((__, j) => {
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
            liveNeighbors += prevGrid[wrappedI]?.[wrappedJ] === 1 ? 1 : 0;
          });
          const isAlive = prevGrid[i]?.[j] === 1;
          if (!isAlive && liveNeighbors === 2) {
            return 1;
          } else {
            return 0;
          }
        })
    );
  return nextGrid;
}

export function serviettesStep(
  prevGrid: Grid,
  numRows: number,
  numCols: number
): Grid {
  if (!prevGrid || prevGrid.length === 0) return [];
  const nextGrid = Array(numRows)
    .fill(0)
    .map((_, i) =>
      Array(numCols)
        .fill(0)
        .map((__, j) => {
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
            liveNeighbors += prevGrid[wrappedI]?.[wrappedJ] === 1 ? 1 : 0;
          });
          const isAlive = prevGrid[i]?.[j] === 1;
          if (
            !isAlive &&
            (liveNeighbors === 2 || liveNeighbors === 3 || liveNeighbors === 4)
          ) {
            return 1;
          } else {
            return 0;
          }
        })
    );
  return nextGrid;
}

export function briansBrainStep(
  prevGrid: Grid,
  numRows: number,
  numCols: number
): Grid {
  if (!prevGrid || prevGrid.length === 0) return [];
  const nextGrid = Array(numRows)
    .fill(0)
    .map((_, i) =>
      Array(numCols)
        .fill(0)
        .map((__, j) => {
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
            liveNeighbors += prevGrid[wrappedI]?.[wrappedJ] === 1 ? 1 : 0;
          });
          const state = prevGrid[i]?.[j] || 0;
          if (state === 0 && liveNeighbors === 2) {
            return 1;
          } else if (state === 1) {
            return 2;
          } else if (state === 2) {
            return 0;
          } else {
            return 0;
          }
        })
    );
  return nextGrid;
}

export const caRuleOptions = [
  {
    name: "HighLife (B36/S23)",
    stepFn: highLifeStep,
    id: "highlife",
  },
  {
    name: "Day & Night (B3678/S34678)",
    stepFn: dayAndNightStep,
    id: "dayandnight",
  },
  {
    name: "Seeds (B2/S)",
    stepFn: seedsStep,
    id: "seeds",
  },
  {
    name: "Serviettes / Rule 22 (B234/S)",
    stepFn: serviettesStep,
    id: "serviettes",
  },
  {
    name: "Brian's Brain (B2/S/3 states)",
    stepFn: briansBrainStep,
    id: "briansbrain",
  },
];
