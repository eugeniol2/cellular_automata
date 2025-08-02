import { Agent } from "@/app/agents/agent";
import React from "react";

interface GridProps {
  grid: number[][];
  agents: Agent[];
  toggleCell: (row: number, col: number) => void;
  numRows: number;
  numCols: number;
  cellSize?: number;
}

const COLOR_DEAD = "rgb(17 24 39)";
const COLOR_ALIVE = "rgb(55 65 81)";

const Grid: React.FC<GridProps> = ({
  grid,
  agents,
  toggleCell,
  numRows,
  numCols,
  cellSize = 12,
}) => {
  return (
    <div
      className="inline-grid border border-gray-700 relative shadow-2xl"
      style={{
        gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${numRows}, ${cellSize}px)`,
      }}
    >
      {grid.map((rows, i) =>
        rows.map((cellState, k) => (
          <div
            key={`cell-${i}-${k}`}
            onClick={() => toggleCell(i, k)}
            className="border-t border-l border-gray-800"
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              backgroundColor: cellState === 1 ? COLOR_ALIVE : COLOR_DEAD,
            }}
          />
        ))
      )}

      {agents.map((agent) => (
        <div
          key={`agent-${agent.id}`}
          className="absolute rounded-full transition-colors duration-200"
          style={{
            width: `${cellSize * 0.8}px`,
            height: `${cellSize * 0.8}px`,
            top: `${agent.row * cellSize + cellSize * 0.1}px`,
            left: `${agent.col * cellSize + cellSize * 0.1}px`,
            backgroundColor: agent.color,
            border: "1px solid rgba(0,0,0,0.5)",
            zIndex: 10,
          }}
          title={`Agente ${agent.id} (${agent.state})`}
        />
      ))}
    </div>
  );
};

export default Grid;
