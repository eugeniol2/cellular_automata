import { Agent } from "../agents/agent";

/**
 * @param grid
 * @param agents
 * @returns
 */
export function calculateBoxCountingDimension(
  grid: number[][],
  agents: Agent[]
): number {
  if (grid.length === 0) return 0;
  const numRows = grid.length;
  const numCols = grid[0].length;

  const infectedGrid = Array(numRows)
    .fill(0)
    .map(() => Array(numCols).fill(0));
  agents.forEach((agent) => {
    if (agent.state === "infetado") {
      infectedGrid[agent.row][agent.col] = 1;
    }
  });

  const boxSizes = [2, 4, 8, 16, 32];
  const points = [];

  for (const size of boxSizes) {
    if (size > numRows || size > numCols) continue;
    let boxCount = 0;
    for (let r = 0; r < numRows; r += size) {
      for (let c = 0; c < numCols; c += size) {
        let foundInBox = false;
        for (let i = r; i < r + size && i < numRows; i++) {
          for (let j = c; j < c + size && j < numCols; j++) {
            if (infectedGrid[i][j] === 1) {
              foundInBox = true;
              break;
            }
          }
          if (foundInBox) break;
        }
        if (foundInBox) {
          boxCount++;
        }
      }
    }
    if (boxCount > 0) {
      points.push({
        logSize: Math.log(1 / size),
        logCount: Math.log(boxCount),
      });
    }
  }

  if (points.length < 2) return 0;

  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.logSize, 0);
  const sumY = points.reduce((sum, p) => sum + p.logCount, 0);
  const sumXY = points.reduce((sum, p) => sum + p.logSize * p.logCount, 0);
  const sumX2 = points.reduce((sum, p) => sum + p.logSize * p.logSize, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  return slope;
}
