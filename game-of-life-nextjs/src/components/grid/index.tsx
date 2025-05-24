import React from "react";

interface GridProps {
  grid: number[][];
  toggleCell: (row: number, col: number) => void;
  numRows: number;
  numCols: number;
}

const Grid: React.FC<GridProps> = ({ grid, toggleCell, numRows, numCols }) => {
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
              backgroundColor: colState ? "rgb(34 197 94)" : "rgb(17 24 39)",
            }}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
