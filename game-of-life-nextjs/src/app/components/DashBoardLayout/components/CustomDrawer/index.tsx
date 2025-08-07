import React from "react";

import {
  Box,
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
} from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { caRuleOptions } from "@/app/utils/caRules";
import { Control, Controller, FormState } from "react-hook-form";
import { SimulationFormValues } from "@/app/page";

interface CustomDrawerProps {
  drawerToggleFunction: () => void;
  isOpen: boolean;
  drawerWidth: string | number;
  running: boolean;
  control: Control<SimulationFormValues, SimulationFormValues>;
  formState: FormState<SimulationFormValues>;
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  drawerToggleFunction,
  isOpen,
  drawerWidth,
  running,
  control,
  formState: { errors },
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

      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        sx={{ p: 2, my: "64px", color: "white" }}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Controller
            name="executionTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tempo entre passos em ms (Clock) "
                type="number"
                disabled={running}
                error={!!errors.executionTime}
                helperText={errors.executionTime?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">ms</InputAdornment>
                    ),
                  },
                }}
                fullWidth
                size="small"
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
            )}
          />

          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: "white" }}>CA Rule</InputLabel>
            <Controller
              name="caRule"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    disabled={running}
                    label="CA Rule (Representa os obstaculos entre um indivíduo e outro)"
                    sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  >
                    {caRuleOptions.map((rule) => (
                      <MenuItem key={rule.id} value={rule.id}>
                        {rule.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.caRule && (
                    <Typography variant="caption" color="error">
                      {errors.caRule.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </FormControl>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Controller
            name="initialPop"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="População inicial"
                type="number"
                fullWidth
                disabled={running}
                error={!!errors.initialPop}
                helperText={errors.initialPop?.message}
                size="small"
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
            )}
          />
          <Controller
            name="popTarget"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="População alvo (Reproduz até x)"
                type="number"
                fullWidth
                disabled={running}
                error={!!errors.popTarget}
                helperText={errors.popTarget?.message}
                size="small"
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
            )}
          />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Controller
            name="contagionRange"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                label="Distância da contaminação (em células)"
                type="number"
                fullWidth
                disabled={running}
                error={!!errors.popTarget}
                helperText={errors.popTarget?.message}
                size="small"
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
            )}
          />

          <Controller
            name="infectionDuration"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Duração da infeção (em passos)"
                type="number"
                fullWidth
                disabled={running}
                error={!!errors.popTarget}
                helperText={errors.popTarget?.message}
                size="small"
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
            )}
          />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Controller
            name="naturalDeathRate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ritmo de morte natural (%)"
                type="number"
                disabled={running}
                error={!!errors.popTarget}
                helperText={errors.popTarget?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
                fullWidth
                size="small"
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
            )}
          />

          <Controller
            name="virusDeathRate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Letalidade do vírus (%)"
                type="number"
                disabled={running}
                error={!!errors.virusDeathRate}
                helperText={errors.virusDeathRate?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
                fullWidth
                size="small"
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
            )}
          />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
          <Controller
            name="bornImmuneChance"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Chance de nascer imune (%)"
                type="number"
                disabled={running}
                error={!!errors.virusDeathRate}
                helperText={errors.virusDeathRate?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
                fullWidth
                size="small"
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
            )}
          />
          <Controller
            name="enableReproduction"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    disabled={running}
                    color="secondary"
                  />
                }
                label="Habilitar reprodução"
                sx={{ mt: 2, color: "white" }}
              />
            )}
          />
        </Box>
      </Box>
    </Drawer>
  );
};
