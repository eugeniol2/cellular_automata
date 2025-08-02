"use client";

import React from "react";
import Grid from "@/components/grid";
import { useSimulation } from "./hooks/useSimulation";
import { caRuleOptions } from "./utils/caRules";

const POPULATION_SIZE = 150;

export default function Home() {
  const [numRows, setNumRows] = React.useState(50);
  const [numCols, setNumCols] = React.useState(80);
  const [agentCount, setAgentCount] = React.useState(POPULATION_SIZE);
  const [selectedRuleId, setSelectedRuleId] = React.useState(
    caRuleOptions[0].id
  );
  const [deathRate, setDeathRate] = React.useState(0.001);
  const [analysisInterval, setAnalysisInterval] = React.useState(10);
  const [populationTarget, setPopulationTarget] = React.useState(150);
  const [infectionDuration, setInfectionDuration] = React.useState(20);
  const selectedRule =
    caRuleOptions.find((r) => r.id === selectedRuleId) || caRuleOptions[0];

  const {
    grid,
    agents,
    running,
    start,
    stop,
    reset,
    simulationStep,
    avgFitnessHistory,
    dimensionHistory,
  } = useSimulation(
    numRows,
    numCols,
    agentCount,
    selectedRule.stepFn,
    deathRate,
    analysisInterval,
    populationTarget,
    infectionDuration
  );

  // Handlers for input changes
  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumRows(Math.max(10, Math.min(100, Number(e.target.value))));
  };
  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumCols(Math.max(10, Math.min(100, Number(e.target.value))));
  };
  const handleAgentCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentCount(Number(e.target.value) || 0);
  };
  const handleDeathRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeathRate(Math.max(0, Math.min(1, Number(e.target.value))));
  };
  const handleAnalysisIntervalChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAnalysisInterval(Math.max(1, Math.min(100, Number(e.target.value))));
  };
  const handlePopulationTargetChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPopulationTarget(Math.max(10, Math.min(500, Number(e.target.value))));
  };
  const handleInfectionDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInfectionDuration(Number(e.target.value) || 0);
  };

  // Count agent states
  const suscetiveisCount = agents.filter(
    (a) => a.state === "suscetivel"
  ).length;
  const infectedsCount = agents.filter((a) => a.state === "infected").length;
  const recuperadosCount = agents.filter(
    (a) => a.state === "recuperado"
  ).length;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-gray-950 text-white font-mono">
      <h1 className="text-5xl font-bold mb-8">
        Simulação de Epidemia com Autómatos Celulares e AG
      </h1>

      {/* Control Panel Container */}
      <div className="w-full max-w-6xl bg-gray-900 p-6 rounded-lg border border-gray-700 mb-6">
        {/* First Row of Controls */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col">
            <label htmlFor="death-rate" className="text-sm mb-1">
              Taxa de Morte
            </label>
            <input
              id="death-rate"
              type="number"
              step="0.001"
              min="0"
              max="1"
              value={deathRate}
              onChange={handleDeathRateChange}
              disabled={running}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="analysis-interval" className="text-sm mb-1">
              Intervalo de Análise
            </label>
            <input
              id="analysis-interval"
              type="number"
              min="1"
              value={analysisInterval}
              onChange={handleAnalysisIntervalChange}
              disabled={running}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="population-target" className="text-sm mb-1">
              Alvo Populacional
            </label>
            <input
              id="population-target"
              type="number"
              min="10"
              value={populationTarget}
              onChange={handlePopulationTargetChange}
              disabled={running}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="infection-duration" className="text-sm mb-1">
              Duração da Infecção
            </label>
            <input
              id="infection-duration"
              type="number"
              min="1"
              value={infectionDuration}
              onChange={handleInfectionDurationChange}
              disabled={running}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Second Row of Controls */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col">
            <label htmlFor="ca-rule" className="text-sm mb-1">
              Regra do AC
            </label>
            <select
              id="ca-rule"
              value={selectedRuleId}
              onChange={(e) => setSelectedRuleId(e.target.value)}
              disabled={running}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500"
            >
              {caRuleOptions.map((rule) => (
                <option key={rule.id} value={rule.id}>
                  {rule.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="rows" className="text-sm mb-1">
              Linhas
            </label>
            <input
              id="rows"
              type="number"
              min={10}
              max={100}
              value={numRows}
              onChange={handleRowsChange}
              disabled={running}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="cols" className="text-sm mb-1">
              Colunas
            </label>
            <input
              id="cols"
              type="number"
              min={10}
              max={100}
              value={numCols}
              onChange={handleColsChange}
              disabled={running}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="agent-count" className="text-sm mb-1">
              População
            </label>
            <input
              id="agent-count"
              type="number"
              min={10}
              max={500}
              value={agentCount}
              onChange={handleAgentCountChange}
              disabled={running}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={running ? stop : start}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-lg ${
              running
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {running ? "Parar" : "Iniciar"}
          </button>
          <button
            onClick={reset}
            disabled={running}
            className="px-6 py-3 rounded-lg font-semibold bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="w-full max-w-6xl bg-gray-900 p-4 rounded-lg border border-gray-700 mb-6 grid grid-cols-3 gap-4 text-lg">
        <div>
          Suscetíveis:
          <span className="text-white ml-2">{suscetiveisCount}</span>
        </div>
        <div>
          Infectados:
          <span className="text-red-500 ml-2">{infectedsCount}</span>
        </div>
        <div>
          Recuperados (Imunes):
          <span className="text-green-500 ml-2">{recuperadosCount}</span>
        </div>
        <div>
          Passo da Simulação:
          <span className="text-cyan-400 ml-2">{simulationStep}</span>
        </div>

        <div>
          Fitness Média (última):
          <span className="text-yellow-500 ml-2">
            {avgFitnessHistory.length > 0
              ? avgFitnessHistory[avgFitnessHistory.length - 1].toFixed(1)
              : "N/A"}
          </span>
        </div>
        <div>
          Dimensão Fractal (última):
          <span className="text-yellow-500 ml-2">
            {dimensionHistory.length > 0
              ? dimensionHistory[dimensionHistory.length - 1].toFixed(3)
              : "N/A"}
          </span>
        </div>
      </div>

      <Grid grid={grid} numRows={numRows} numCols={numCols} agents={agents} />
      <p className="mt-6 text-gray-400">
        Clique nas células da grelha para as ativar/desativar (apenas quando a
        simulação está parada).
      </p>
    </main>
  );
}
