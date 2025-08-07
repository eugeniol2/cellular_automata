import React from "react";

import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { ChevronLeft, PlayArrow, Stop, Replay } from "@mui/icons-material";
import { caRuleOptions } from "@/app/utils/caRules";

interface CustomDrawerProps {
  drawerToggleFunction: () => void;
  isOpen: boolean;
  drawerWidth: string | number;
  executionSpeed: number;
  handleExecutionTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedRuleId: string;
  handleRuleChange: (event: SelectChangeEvent) => void;
  agentCount: number;
  handleAgentCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  populationTarget: number;
  handlePopulationTargetChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  numRows: number;
  handleRowsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  numCols: number;
  handleColsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  infectionContagiousRange: number;
  handleInfectionRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  infectionDuration: number;
  handleInfectionDurationChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  deathRate: number;
  handleDeathRateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viralDeathRate: number;
  handleViralDeathRateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bornImmuneChance: number;
  handleImmuneBornChanceChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  running: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  enableReproduction: boolean;
  setEnableReproduction: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  drawerToggleFunction,
  isOpen,
  drawerWidth,
  executionSpeed,
  handleExecutionTimeChange,
  selectedRuleId,
  handleRuleChange,
  agentCount,
  handleAgentCountChange,
  populationTarget,
  handlePopulationTargetChange,
  numRows,
  handleRowsChange,
  numCols,
  handleColsChange,
  infectionContagiousRange,
  handleInfectionRangeChange,
  infectionDuration,
  handleInfectionDurationChange,
  deathRate,
  handleDeathRateChange,
  viralDeathRate,
  handleViralDeathRateChange,
  bornImmuneChance,
  handleImmuneBornChanceChange,
  running,
  start,
  stop,
  reset,
  enableReproduction,
  setEnableReproduction,
}) => {
  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={drawerToggleFunction}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          background: "linear-gradient(to bottom, #0A0A2A, #121240)",
          borderRight: "1px solid #333",
        },
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" color="white">
          Simulation Parameters
        </Typography>
        <IconButton onClick={drawerToggleFunction} color="inherit">
          <ChevronLeft />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, color: "white" }}>
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Execution Settings
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Execution time (ms)"
            type="number"
            value={executionSpeed}
            onChange={handleExecutionTimeChange}
            disabled={running}
            InputProps={{
              endAdornment: <InputAdornment position="end">ms</InputAdornment>,
            }}
            fullWidth
            size="small"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />

          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: "white" }}>CA Rule</InputLabel>
            <Select
              value={selectedRuleId}
              onChange={handleRuleChange}
              disabled={running}
              label="CA Rule"
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              {caRuleOptions.map((rule) => (
                <MenuItem key={rule.id} value={rule.id}>
                  {rule.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Population Settings
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Initial Population"
            type="number"
            value={agentCount}
            onChange={handleAgentCountChange}
            disabled={running}
            inputProps={{ min: 10, max: 500 }}
            fullWidth
            size="small"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />

          <TextField
            label="Population Target"
            type="number"
            value={populationTarget}
            onChange={handlePopulationTargetChange}
            disabled={running}
            inputProps={{ min: 10 }}
            fullWidth
            size="small"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Grid Settings
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Rows"
            type="number"
            value={numRows}
            onChange={handleRowsChange}
            disabled={running}
            inputProps={{ min: 10, max: 100 }}
            fullWidth
            size="small"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />

          <TextField
            label="Columns"
            type="number"
            value={numCols}
            onChange={handleColsChange}
            disabled={running}
            inputProps={{ min: 10, max: 100 }}
            fullWidth
            size="small"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Infection Settings
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Contagion Distance"
            type="number"
            value={infectionContagiousRange}
            onChange={handleInfectionRangeChange}
            disabled={running}
            inputProps={{ min: 1, max: 10 }}
            fullWidth
            size="small"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />

          <TextField
            label="Infection Duration"
            type="number"
            value={infectionDuration}
            onChange={handleInfectionDurationChange}
            disabled={running}
            inputProps={{ min: 1 }}
            fullWidth
            size="small"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Mortality Settings
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Natural Death Rate (%)"
            type="number"
            value={deathRate * 100}
            onChange={handleDeathRateChange}
            disabled={running}
            inputProps={{ min: 0, max: 100, step: 0.01 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            fullWidth
            size="small"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />

          <TextField
            label="Virus Lethality (%)"
            type="number"
            value={Math.round(viralDeathRate * 100)}
            onChange={handleViralDeathRateChange}
            disabled={running}
            inputProps={{ min: 0, max: 100 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            fullWidth
            size="small"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Immunity Settings
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
          <TextField
            label="Born Immune Chance (%)"
            type="number"
            value={Math.round(bornImmuneChance * 100)}
            onChange={handleImmuneBornChanceChange}
            disabled={running}
            inputProps={{ min: 0, max: 100 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            fullWidth
            size="small"
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          />
        </Box>

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color={running ? "error" : "success"}
            startIcon={running ? <Stop /> : <PlayArrow />}
            onClick={running ? stop : start}
            fullWidth
          >
            {running ? "Stop" : "Start"}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Replay />}
            onClick={reset}
            disabled={running}
            fullWidth
          >
            Reset
          </Button>
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={enableReproduction}
              onChange={(e) => setEnableReproduction(e.target.checked)}
              disabled={running}
              color="primary"
            />
          }
          label="Enable Reproduction"
          sx={{ mt: 2, color: "white" }}
        />
      </Box>
    </Drawer>
  );
};
