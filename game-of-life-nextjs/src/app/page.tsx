"use client";

import React from "react";

import Grid from "@/components/grid";
import { useSimulation } from "./hooks/useSimulation";
import { caRuleOptions } from "./utils/caRules";

export default function Home() {
  const [numRows, setNumRows] = React.useState(30);
  const [numCols, setNumCols] = React.useState(50);
  const [agentsEnabled, setAgentsEnabled] = React.useState(true);
  const [agentCount, setAgentCount] = React.useState(50);
  const [selectedRuleId, setSelectedRuleId] = React.useState(
    caRuleOptions[0].id
  );
  const selectedRule =
    caRuleOptions.find((r) => r.id === selectedRuleId) || caRuleOptions[0];

  const {
    grid,
    agents,
    running,
    isRaining,
    start,
    stop,
    reset,
    toggleCell,
    simulationStep,
    generation,
  } = useSimulation(
    numRows,
    numCols,
    agentsEnabled ? agentCount : 0,
    selectedRule.stepFn
  );

  const GA_INTERVAL = 100;
  const stepsToNextGA = GA_INTERVAL - (simulationStep % GA_INTERVAL);

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumRows(Math.max(5, Math.min(100, Number(e.target.value))));
  };
  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumCols(Math.max(5, Math.min(100, Number(e.target.value))));
  };
  const handleAgentCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentCount(Math.max(0, Math.min(500, Number(e.target.value))));
  };
  const handleAgentsEnabledChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAgentsEnabled(e.target.checked);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-gray-950 text-white">
      <h1 className="text-6xl font-bold mb-10">{selectedRule.name}</h1>
      <div className="mb-8 flex space-x-6">
        {/* Rule selection dropdown */}
        <div className="flex items-center space-x-2">
          <label htmlFor="ca-rule" className="text-lg">
            Rule:
          </label>
          <select
            id="ca-rule"
            value={selectedRuleId}
            onChange={(e) => setSelectedRuleId(e.target.value)}
            disabled={running}
            className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
            {caRuleOptions.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="rows" className="text-lg">
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
            className="w-20 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="cols" className="text-lg">
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
            className="w-20 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="agents-enabled"
            type="checkbox"
            checked={agentsEnabled}
            onChange={handleAgentsEnabledChange}
            disabled={running}
            className="accent-blue-500 w-6 h-6"
          />
          <label htmlFor="agents-enabled" className="text-lg">
            Enable Agents
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="agent-count" className="text-lg">
            Agent Count:
          </label>
          <input
            id="agent-count"
            type="number"
            min={0}
            max={500}
            value={agentCount}
            onChange={handleAgentCountChange}
            disabled={running || !agentsEnabled}
            className="w-24 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <button
          onClick={running ? stop : start}
          className={`px-6 py-3 rounded font-semibold transition-colors duration-200 text-lg ${
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
          className="px-6 py-3 rounded font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          Reset / Randomize
        </button>
      </div>
      <div className="mb-4 text-xl text-gray-200">
        Agents alive: {agents.length} | Steps: {simulationStep} | Generation:{" "}
        {generation} | GA Interval: {GA_INTERVAL} | Next reproduction in:{" "}
        {stepsToNextGA} steps
      </div>
      <Grid
        grid={grid}
        toggleCell={toggleCell}
        numRows={numRows}
        numCols={numCols}
        isRaining={isRaining}
        agents={agentsEnabled ? agents : []}
      />
      <p className="mt-10 text-lg text-gray-300">
        Click on cells to toggle their state (alive/dead) when the simulation is
        stopped.
      </p>
    </main>
  );
}
