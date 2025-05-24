"use client";

import React from "react";
import { useGameOfLife } from "./hooks/useGameOfLife";
import Grid from "@/components/grid";

export default function Home() {
  const [numRows, setNumRows] = React.useState(30);
  const [numCols, setNumCols] = React.useState(50);
  const { grid, running, start, stop, reset, toggleCell } = useGameOfLife(
    numRows,
    numCols
  );

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumRows(Math.max(5, Math.min(100, Number(e.target.value))));
  };
  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumCols(Math.max(5, Math.min(100, Number(e.target.value))));
  };

  React.useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numRows, numCols]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-8">Conway&apos;s Game of Life</h1>
      <div className="mb-6 flex space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="rows" className="text-sm">
            Rows:
          </label>
          <input
            id="rows"
            type="number"
            min={5}
            max={100}
            value={numRows}
            onChange={handleRowsChange}
            disabled={running}
            className="w-16 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="cols" className="text-sm">
            Cols:
          </label>
          <input
            id="cols"
            type="number"
            min={5}
            max={100}
            value={numCols}
            onChange={handleColsChange}
            disabled={running}
            className="w-16 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={running ? stop : start}
          className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ${
            running
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          onClick={reset}
          disabled={running}
          className="px-4 py-2 rounded font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset / Randomize
        </button>
      </div>
      <Grid
        grid={grid}
        toggleCell={toggleCell}
        numRows={numRows}
        numCols={numCols}
      />
      <p className="mt-8 text-sm text-gray-400">
        Click on cells to toggle their state (alive/dead) when the simulation is
        stopped.
      </p>
    </main>
  );
}
