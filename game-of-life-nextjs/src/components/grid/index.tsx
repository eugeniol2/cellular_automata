import React from "react";

interface GridProps {
  grid: number[][];
  toggleCell: (row: number, col: number) => void;
  numRows: number;
  numCols: number;
  isRaining: boolean;
}

const COLOR_ALIVE_NORMAL = "rgb(34 197 94)";
const COLOR_ALIVE_RAINING = "rgb(59 130 246)";

const Grid: React.FC<GridProps> = ({
  grid,
  toggleCell,
  numRows,
  numCols,
  isRaining,
}) => {
  const cellSize = 20;

  return (
    <div
      className="inline-grid border border-gray-700"
      style={{
        gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${numRows}, ${cellSize}px)`,
      }}
    >
      {grid.map((rows, i) =>
        rows.map((colState, k) => (
          <div
            key={`${i}-${k}`}
            onClick={() => toggleCell(i, k)}
            className={`w-[${cellSize}px] h-[${cellSize}px] border border-gray-800 cursor-pointer`}
            style={{
              backgroundColor: colState
                ? isRaining
                  ? COLOR_ALIVE_RAINING
                  : COLOR_ALIVE_NORMAL
                : "rgb(17, 24, 39)",
            }}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
