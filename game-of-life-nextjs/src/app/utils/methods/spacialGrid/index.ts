import { Agent } from "@/app/agents/agent";

export class AgentSpatialGrid {
  private grid: Map<string, Agent[]>;
  private cellSize: number;

  constructor(cellSize: number) {
    this.grid = new Map();
    this.cellSize = Math.max(1, cellSize);
  }

  private getKey(row: number, col: number): string {
    return `${Math.floor(row / this.cellSize)},${Math.floor(
      col / this.cellSize
    )}`;
  }

  public add(agent: Agent): void {
    const key = this.getKey(agent.row, agent.col);
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(agent);
  }

  public getNearby(agent: Agent, radius: number): Agent[] {
    const nearbyAgents: Agent[] = [];
    const startRow = Math.floor((agent.row - radius) / this.cellSize);
    const endRow = Math.floor((agent.row + radius) / this.cellSize);
    const startCol = Math.floor((agent.col - radius) / this.cellSize);
    const endCol = Math.floor((agent.col + radius) / this.cellSize);

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const key = `${r},${c}`;
        if (this.grid.has(key)) {
          nearbyAgents.push(...this.grid.get(key)!);
        }
      }
    }
    return nearbyAgents;
  }
}
