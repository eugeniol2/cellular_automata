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
import { Control, Controller } from "react-hook-form";
import { SimulationFormValues } from "@/app/page";

interface CustomDrawerProps {
  drawerToggleFunction: () => void;
  isOpen: boolean;
  drawerWidth: string | number;

  running: boolean;

  control: Control<SimulationFormValues, SimulationFormValues>;
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  drawerToggleFunction,
  isOpen,
  drawerWidth,
  running,
  control,
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
        justifyContent="space-between"
        gap="16px"
        sx={{ p: 2, my: "32px", color: "white" }}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Controller
            name="executionTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Execution time (ms)"
                type="number"
                disabled={running}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">ms</InputAdornment>
                  ),
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
                <Select
                  {...field}
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
                label="Initial Population"
                type="number"
                fullWidth
                disabled={running}
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
                label="Population Target"
                type="number"
                fullWidth
                disabled={running}
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
                label="Contagion Distance"
                type="number"
                fullWidth
                disabled={running}
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
                label="Infection Duration"
                type="number"
                fullWidth
                disabled={running}
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
                label="Natural Death Rate (%)"
                type="number"
                disabled={running}
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
                label="Virus Lethality (%)"
                type="number"
                disabled={running}
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
                label="Born Immune Chance (%)"
                type="number"
                disabled={running}
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
                    name="enableReproductionCheckBox"
                    disabled={running}
                    color="primary"
                  />
                }
                label="Enable Reproduction"
                sx={{ mt: 2, color: "white" }}
              />
            )}
          />
        </Box>
      </Box>
    </Drawer>
  );
};
