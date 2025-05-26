import { Agent } from "@/app/agents/agent";
import React from "react";

interface GridProps {
  grid: number[][];
  agents: Agent[];
  toggleCell: (row: number, col: number) => void;
  numRows: number;
  numCols: number;
  isRaining: boolean; // Keep isRaining prop
  cellSize?: number;
}

// Define colors for clarity
const COLOR_DEAD = "rgb(17 24 39)"; // gray-900
const COLOR_ALIVE_NORMAL = "rgb(34 197 94)"; // green-500
const COLOR_ALIVE_RAINING = "rgb(59 130 246)"; // blue-500

const Grid: React.FC<GridProps> = ({
  grid,
  agents,
  toggleCell,
  numRows,
  numCols,
  isRaining, // Destructure isRaining prop
  cellSize = 15, // Revert to default or previous working size
}) => {
  return (
    <div
      className="inline-grid border border-gray-700 relative"
      style={{
        gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${numRows}, ${cellSize}px)`,
        width: `${numCols * cellSize}px`,
        height: `${numRows * cellSize}px`,
      }}
    >
      {/* Render CA background cells */}
      {grid.map((rows, i) =>
        rows.map((cellState, k) => {
          // Determine background color based on cell state and rain status
          let backgroundColor = COLOR_DEAD;
          if (cellState === 1) {
            backgroundColor = isRaining
              ? COLOR_ALIVE_RAINING
              : COLOR_ALIVE_NORMAL;
          }

          return (
            <div
              key={`cell-${i}-${k}`}
              onClick={() => toggleCell(i, k)}
              className={`border border-gray-800`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: backgroundColor, // Apply calculated color
              }}
            />
          );
        })
      )}

      {/* Render Agents on top as separate elements */}
      {agents.map((agent) => (
        <div
          key={`agent-${agent.id}`}
          className="absolute rounded-full shadow-md transition-colors duration-100"
          style={{
            width: `${cellSize * 0.8}px`,
            height: `${cellSize * 0.8}px`,
            top: `${agent.row * cellSize + cellSize * 0.1}px`,
            left: `${agent.col * cellSize + cellSize * 0.1}px`,
            backgroundColor: agent.color, // Agent color (green or blue)
            zIndex: 10,
          }}
          title={`Agent ${agent.id}`}
        />
      ))}
    </div>
  );
};

export default Grid;
