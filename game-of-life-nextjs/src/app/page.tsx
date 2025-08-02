"use client";

import React from "react";
import Grid from "@/components/grid";
import { useSimulation } from "./hooks/useSimulation";
import { caRuleOptions } from "./utils/caRules";

const POPULATION_SIZE = 150;
const GA_INTERVAL = 100;

export default function Home() {
  const [numRows, setNumRows] = React.useState(50);
  const [numCols, setNumCols] = React.useState(80);
  const [agentCount, setAgentCount] = React.useState(POPULATION_SIZE);
  const [selectedRuleId, setSelectedRuleId] = React.useState(
    caRuleOptions[0].id
  );
  const selectedRule =
    caRuleOptions.find((r) => r.id === selectedRuleId) || caRuleOptions[0];

  const {
    grid,
    agents,
    running,
    start,
    stop,
    reset,
    toggleCell,
    simulationStep,
    generation,
    extinctionCount,
    avgFitnessHistory,
    dimensionHistory,
  } = useSimulation(numRows, numCols, agentCount, selectedRule.stepFn);

  const stepsToNextGA = GA_INTERVAL - (simulationStep % GA_INTERVAL);

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumRows(Math.max(10, Math.min(100, Number(e.target.value))));
  };
  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumCols(Math.max(10, Math.min(100, Number(e.target.value))));
  };
  const handleAgentCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentCount(Math.max(10, Math.min(500, Number(e.target.value))));
  };

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

      {/* --- PAINEL DE CONTROLO --- */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="ca-rule">Regra do AC:</label>
          <select
            id="ca-rule"
            value={selectedRuleId}
            onChange={(e) => setSelectedRuleId(e.target.value)}
            disabled={running}
            className="px-2 py-1 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {caRuleOptions.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.name}
              </option>
            ))}
          </select>
        </div>

        {/* CORREÇÃO APLICADA AQUI */}
        <div className="flex items-center space-x-2">
          <label htmlFor="rows">Linhas:</label>
          <input
            id="rows"
            type="number"
            min={10}
            max={100}
            value={numRows}
            onChange={handleRowsChange}
            disabled={running}
            className="w-20 px-2 py-1 rounded bg-gray-800 border border-gray-600"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="cols">Colunas:</label>
          <input
            id="cols"
            type="number"
            min={10}
            max={100}
            value={numCols}
            onChange={handleColsChange}
            disabled={running}
            className="w-20 px-2 py-1 rounded bg-gray-800 border border-gray-600"
          />
        </div>
        {/* FIM DA CORREÇÃO */}

        <div className="flex items-center space-x-2">
          <label htmlFor="agent-count">População:</label>
          <input
            id="agent-count"
            type="number"
            min={10}
            max={500}
            value={agentCount}
            onChange={handleAgentCountChange}
            disabled={running}
            className="w-24 px-2 py-1 rounded bg-gray-800 border border-gray-600"
          />
        </div>
        <button
          onClick={running ? stop : start}
          className={`px-5 py-2 rounded font-semibold transition-colors duration-200 text-lg ${
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
          className="px-5 py-2 rounded font-semibold bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
        >
          Reiniciar
        </button>
      </div>

      {/* --- PAINEL DE ESTATÍSTICAS --- */}
      <div className="w-full max-w-6xl bg-gray-900 p-4 rounded-lg border border-gray-700 mb-6 grid grid-cols-3 gap-4 text-lg">
        <div>
          Passo da Simulação:
          <span className="text-cyan-400">{simulationStep}</span>
        </div>
        <div>
          Geração (AG): <span className="text-cyan-400">{generation}</span>
        </div>
        <div>
          Próximo AG em: <span className="text-cyan-400">{stepsToNextGA}</span>
          passos
        </div>
        <div>
          Suscetíveis: <span className="text-white">{suscetiveisCount}</span>
        </div>
        <div>
          infecteds: <span className="text-red-500">{infectedsCount}</span>
        </div>
        <div>
          Recuperados:
          <span className="text-green-500">{recuperadosCount}</span>
        </div>
        <div>
          Extinções Totais:
          <span className="text-yellow-500">{extinctionCount}</span>
        </div>
        <div>
          Fitness Média (última):
          <span className="text-yellow-500">
            {avgFitnessHistory.length > 0
              ? avgFitnessHistory[avgFitnessHistory.length - 1].toFixed(1)
              : "N/A"}
          </span>
        </div>
        <div>
          Dimensão Fractal (última):
          <span className="text-yellow-500">
            {dimensionHistory.length > 0
              ? dimensionHistory[dimensionHistory.length - 1].toFixed(3)
              : "N/A"}
          </span>
        </div>
      </div>

      {/* --- GRELHA DE SIMULAÇÃO --- */}
      <Grid
        grid={grid}
        toggleCell={toggleCell}
        numRows={numRows}
        numCols={numCols}
        agents={agents}
      />
      <p className="mt-6 text-gray-400">
        Clique nas células da grelha para as ativar/desativar (apenas quando a
        simulação está parada).
      </p>
    </main>
  );
}
