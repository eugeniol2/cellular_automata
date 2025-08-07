"use client";

import React, { useState } from "react";

import { useSimulation, UseSimulationProps } from "./hooks/useSimulation";
import {
  briansBrainStep,
  dayAndNightStep,
  highLifeStep,
  seedsStep,
  serviettesStep,
} from "./utils/caRules";
import { globalAtoms } from "./atoms";
import { useAtom } from "jotai";
import { PlayArrow, Stop, Replay } from "@mui/icons-material";

import { InfectionFractalChart } from "./components/chart";
import Grid from "./components/grid";
import { Box, Button, Container, Typography } from "@mui/material";
import { CustomDrawer } from "./components/DashBoardLayout/components/CustomDrawer";
import theme from "./theme/theme";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { simulationFormSchema } from "./schema/simulationFormSchema";

const caRules = {
  highlife: { stepFn: highLifeStep },
  dayandnight: { stepFn: dayAndNightStep },
  seeds: { stepFn: seedsStep },
  serviettes: { stepFn: serviettesStep },
  briansbrain: { stepFn: briansBrainStep },
} as const;

export type CaRuleType = keyof typeof caRules;

export interface SimulationFormValues {
  executionTime: number;
  caRule: CaRuleType;
  initialPop: number;
  popTarget: number;
  contagionRange: number;
  infectionDuration: number;
  naturalDeathRate: number;
  virusDeathRate: number;
  bornImmuneChance: number;
  enableReproduction: boolean;
}

export default function Home() {
  const [virusDeathsAtom] = useAtom(globalAtoms.virusDeathsAtom);
  const [naturalDeathsAtom] = useAtom(globalAtoms.naturalDeathsAtom);
  const [reproductionCountAtom] = useAtom(globalAtoms.reproductionCountAtom);

  const [isDrawerOpen, setIsDrawerOpen] = useAtom(globalAtoms.isDrawerOpen);

  const DEFAULT_FORM_VALUES: SimulationFormValues = {
    executionTime: 200,
    caRule: "highlife",
    initialPop: 200,
    popTarget: 200,
    contagionRange: 3,
    infectionDuration: 25,
    naturalDeathRate: 0.1,
    virusDeathRate: 10,
    bornImmuneChance: 20,
    enableReproduction: true,
  };

  const DEFAULT_SIMULATION_PARAMS: UseSimulationProps = {
    numRows: 50,
    numCols: 80,
    initialAgentCount: 200,
    caRuleStepFn: caRules.highlife.stepFn,
    deathRate: 0.1 / 100,
    viralDeathRate: 10 / 100,
    bornImmuneChance: 20 / 100,
    populationTarget: 200,
    infectionDuration: 25,
    infectionContagiousRange: 3,
    enableReproduction: true,
    clock: 200,
    analysisInterval: 1,
  };

  const [simulationParams, setSimulationParams] = useState<UseSimulationProps>({
    numRows: 50,
    numCols: 80,
    initialAgentCount: 200,
    caRuleStepFn: caRules.highlife.stepFn,
    deathRate: 0.1 / 100,
    viralDeathRate: 10 / 100,
    bornImmuneChance: 20 / 100,
    populationTarget: 200,
    infectionDuration: 25,
    infectionContagiousRange: 3,
    enableReproduction: true,
    clock: 200,
    analysisInterval: 1,
  });

  const { control, handleSubmit, formState, reset } =
    useForm<SimulationFormValues>({
      resolver: yupResolver(simulationFormSchema),
      defaultValues: {
        executionTime: simulationParams.clock,
        caRule: "highlife" as CaRuleType,
        initialPop: simulationParams.initialAgentCount,
        popTarget: simulationParams.populationTarget,
        contagionRange: simulationParams.infectionContagiousRange,
        infectionDuration: simulationParams.infectionDuration,
        naturalDeathRate: simulationParams.deathRate * 100,
        virusDeathRate: simulationParams.viralDeathRate * 100,
        bornImmuneChance: simulationParams.bornImmuneChance * 100,
        enableReproduction: simulationParams.enableReproduction,
      },
      mode: "onChange",
    });

  const {
    grid,
    agents,
    running,
    start,
    stop,
    resetSimulation,
    simulationStep,
    avgFitnessHistory,
    dimensionHistory,
  } = useSimulation({
    ...simulationParams,
  });

  const onSubmit = (data: SimulationFormValues) => {
    console.log(data);
    if (running) {
      stop();
    }

    setSimulationParams((prev) => ({
      ...prev,
      initialAgentCount: data.initialPop,
      caRuleStepFn: caRules[data.caRule].stepFn,
      deathRate: data.naturalDeathRate / 100,
      viralDeathRate: data.virusDeathRate / 100,
      bornImmuneChance: data.bornImmuneChance / 100,
      populationTarget: data.popTarget,
      infectionDuration: data.infectionDuration,
      infectionContagiousRange: data.contagionRange,
      enableReproduction: data.enableReproduction,
      clock: data.executionTime,
    }));

    resetSimulation();
    start();
  };

  const resetToDefaults = () => {
    if (running) stop();

    setSimulationParams(DEFAULT_SIMULATION_PARAMS);
    reset({
      ...DEFAULT_FORM_VALUES,
      contagionRange: 3,
    });
    resetSimulation();
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
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
            gridTemplateColumns: "repeat(4, 1fr)",
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
          <Box>
            <Typography variant="body2" color={theme.palette.secondary.light}>
              Dimensão Fractal:
            </Typography>
            <Typography variant="h4" color={theme.palette.secondary.light}>
              {dimensionHistory.length > 0
                ? dimensionHistory[dimensionHistory.length - 1].toFixed(3)
                : "N/A"}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
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
            <Typography variant="body2">
              Fitness Média (Resistência):
            </Typography>
            <Typography variant="h6">
              {avgFitnessHistory.length > 0
                ? avgFitnessHistory[avgFitnessHistory.length - 1].toFixed(1)
                : "N/A"}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color={running ? "error" : "secondary"}
          startIcon={running ? <Stop /> : <PlayArrow />}
          onClick={running ? stop : handleSubmit(onSubmit)}
          fullWidth
        >
          {running ? "Stop" : "Start"}
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Replay />}
          onClick={resetSimulation}
          disabled={running}
          fullWidth
        >
          Reset
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Grid
          grid={grid}
          numRows={simulationParams.numRows}
          numCols={simulationParams.numCols}
          agents={agents}
        />
      </Box>
      <CustomDrawer
        control={control}
        drawerToggleFunction={handleDrawerToggle}
        isOpen={isDrawerOpen}
        drawerWidth={600}
        running={running}
        formState={formState}
        resetToDefaults={resetToDefaults}
      />
    </Container>
  );
}
