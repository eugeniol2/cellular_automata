"use client";

import React, { useState } from "react";

import { useSimulation } from "./hooks/useSimulation";
import { caRuleOptions } from "./utils/caRules";
import { globalAtoms } from "./atoms";
import { useAtom } from "jotai";
import { InfectionFractalChart } from "./components/chart";
import Grid from "./components/grid";
import { Box, Container, SelectChangeEvent, Typography } from "@mui/material";
import { CustomDrawer } from "./components/DashBoardLayout/components/CustomDrawer";
import theme from "./theme/theme";

const POPULATION_SIZE = 150;

export default function Home() {
  const [numRows, setNumRows] = useState(50);
  const [numCols, setNumCols] = useState(80);
  const [agentCount, setAgentCount] = useState(POPULATION_SIZE);
  const [selectedRuleId, setSelectedRuleId] = useState(caRuleOptions[0].id);
  const [deathRate, setDeathRate] = useState(0.05);
  const [viralDeathRate, setViralDeathRate] = useState(0.1);
  const [infectionContagiousRange, setInfectionContagiousRange] = useState(3);
  const [populationTarget, setPopulationTarget] = useState(150);
  const [infectionDuration, setInfectionDuration] = useState(20);
  const [bornImmuneChance, setBornImmuneChance] = useState(0.3);
  const [executionSpeed, setExecutionSpeed] = useState(100);

  const [virusDeathsAtom] = useAtom(globalAtoms.virusDeathsAtom);
  const [naturalDeathsAtom] = useAtom(globalAtoms.naturalDeathsAtom);
  const [reproductionCountAtom] = useAtom(globalAtoms.reproductionCountAtom);

  const [isDrawerOpen, setIsDrawerOpen] = useAtom(globalAtoms.isDrawerOpen);

  const [enableReproduction, setEnableReproduction] = useState(true);
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
  } = useSimulation({
    numRows,
    numCols,
    initialAgentCount: agentCount,
    caRuleStepFn: selectedRule.stepFn,
    deathRate,
    viralDeathRate,
    populationTarget,
    infectionDuration,
    infectionContagiousRange: infectionContagiousRange,
    enableReproduction,
    bornImmuneChance,
    clock: executionSpeed,
  });

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleRuleChange = (event: SelectChangeEvent) => {
    setSelectedRuleId(event.target.value as string);
  };

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    value = clamp(value, 10, 100);
    setNumRows(value);
    e.target.value = value.toString();
  };

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    value = clamp(value, 10, 100);
    setNumCols(value);
    e.target.value = value.toString();
  };
  const handleAgentCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    value = clamp(value, 10, 500);
    setAgentCount(value);
    e.target.value = value.toString();
  };

  const handleDeathRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    value = clamp(value, 0, 100);
    setDeathRate(value / 100);
    e.target.value = value.toString();
  };

  const handleViralDeathRateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = Number(e.target.value);
    value = clamp(value, 0, 100);
    setViralDeathRate(value / 100);
    e.target.value = value.toString();
  };
  const handleExecutionTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = Number(e.target.value);
    value = clamp(value, 1, 1000);
    setExecutionSpeed(value);
    e.target.value = value.toString();
  };

  const handlePopulationTargetChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = Number(e.target.value);
    value = clamp(value, 10, 1000);
    setPopulationTarget(value);
    e.target.value = value.toString();
  };

  const handleInfectionDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = Number(e.target.value);
    value = clamp(value, 1, 1000);
    setInfectionDuration(value);
    e.target.value = value.toString();
  };

  const handleImmuneBornChanceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = Number(e.target.value);
    value = clamp(value, 0, 100);
    setBornImmuneChance(value / 100);
    e.target.value = value.toString();
  };

  const handleInfectionRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = Number(e.target.value);
    value = clamp(value, 1, 10);
    setInfectionContagiousRange(value);
    e.target.value = value.toString();
  };

  const suscetiveisCount = agents.filter(
    (a) => a.state === "suscetivel"
  ).length;
  const infectedsCount = agents.filter((a) => a.state === "infected").length;

  const recuperadosCount = agents.filter(
    (a) => a.state === "recuperado"
  ).length;

  return (
    <Container
      component="main"
      maxWidth="xl"
      sx={{
        py: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *:not(:last-child)": { mb: 8 },
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Simulação de Epidemia com Autómatos Celulares e AG
        </Typography>
      </Box>
      <Typography variant="h5" gutterBottom>
        Evolução da Dimensão Fractal
      </Typography>
      <InfectionFractalChart data={dimensionHistory} stepInterval={5} />
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2">Mortes por virus:</Typography>
            <Typography variant="h4" color="error.main">
              {virusDeathsAtom}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">Mortes naturais:</Typography>
            <Typography variant="h4" color={theme.palette.warning.main}>
              {naturalDeathsAtom}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">Reproduções</Typography>
            <Typography variant="h4">{reproductionCountAtom}</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2">Suscetíveis:</Typography>
            <Typography variant="h6">{suscetiveisCount}</Typography>
          </Box>
          <Box>
            <Typography variant="body2">Infectados:</Typography>
            <Typography variant="h6" color="error.main">
              {infectedsCount}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">Recuperados:</Typography>
            <Typography variant="h6" color="success.main">
              {recuperadosCount}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">Passo da Simulação:</Typography>
            <Typography variant="h6">{simulationStep}</Typography>
          </Box>
          <Box>
            <Typography variant="body2">Fitness Média:</Typography>
            <Typography variant="h6">
              {avgFitnessHistory.length > 0
                ? avgFitnessHistory[avgFitnessHistory.length - 1].toFixed(1)
                : "N/A"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">Dimensão Fractal:</Typography>
            <Typography variant="h6">
              {dimensionHistory.length > 0
                ? dimensionHistory[dimensionHistory.length - 1].toFixed(3)
                : "N/A"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Grid grid={grid} numRows={numRows} numCols={numCols} agents={agents} />
      </Box>
      <CustomDrawer
        drawerToggleFunction={handleDrawerToggle}
        isOpen={isDrawerOpen}
        drawerWidth={600}
        executionSpeed={executionSpeed}
        handleExecutionTimeChange={handleExecutionTimeChange}
        selectedRuleId={selectedRuleId}
        handleRuleChange={handleRuleChange}
        agentCount={agentCount}
        handleAgentCountChange={handleAgentCountChange}
        populationTarget={populationTarget}
        handlePopulationTargetChange={handlePopulationTargetChange}
        numRows={numRows}
        handleRowsChange={handleRowsChange}
        numCols={numCols}
        handleColsChange={handleColsChange}
        infectionContagiousRange={infectionContagiousRange}
        handleInfectionRangeChange={handleInfectionRangeChange}
        infectionDuration={infectionDuration}
        handleInfectionDurationChange={handleInfectionDurationChange}
        deathRate={deathRate}
        handleDeathRateChange={handleDeathRateChange}
        viralDeathRate={viralDeathRate}
        handleViralDeathRateChange={handleViralDeathRateChange}
        bornImmuneChance={bornImmuneChance}
        handleImmuneBornChanceChange={handleImmuneBornChanceChange}
        running={running}
        start={start}
        stop={stop}
        reset={reset}
        enableReproduction={enableReproduction}
        setEnableReproduction={setEnableReproduction}
      />
    </Container>
  );
}
