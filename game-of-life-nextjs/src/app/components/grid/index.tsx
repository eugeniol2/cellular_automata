import { Agent } from "@/app/agents/agent";
import React from "react";
import { Box, styled } from "@mui/material";
import theme from "@/app/theme/theme";

interface GridProps {
  grid: number[][];
  agents: Agent[];
  numRows: number;
  numCols: number;
  cellSize?: number;
}

const COLOR_DEAD = "rgb(17 24 39)";
const COLOR_ALIVE = "rgb(55 65 81)";

const GridContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  border: "1px solid",
  borderColor: theme.palette.divider,
  position: "relative",
  boxShadow: theme.shadows[24],
  backgroundColor: theme.palette.background.paper,
  width: "fit-content",
  height: "fit-content",
}));

const GridCell = styled(Box)({
  borderTop: "1px solid",
  borderLeft: "1px solid",
  borderColor: "divider",
  border: "none",
  backgroundColor: COLOR_DEAD,
});

const AgentDot = styled(Box)({
  position: "absolute",
  borderRadius: "50%",
  transition: "background-color 200ms ease",
  border: `1px solid ${theme.palette.common.black}`,
  zIndex: 10,
});

const Grid: React.FC<GridProps> = ({
  grid,
  agents,
  numRows,
  numCols,
  cellSize = 10,
}) => {
  return (
    <GridContainer
      sx={{
        gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${numRows}, ${cellSize}px)`,
      }}
    >
      {grid.map((rows, i) =>
        rows.map((cellState, k) => (
          <GridCell
            key={`cell-${i}-${k}`}
            sx={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              backgroundColor: cellState === 1 ? COLOR_ALIVE : COLOR_DEAD,
            }}
          />
        ))
      )}

      {agents.map((agent) => (
        <AgentDot
          key={`agent-${agent.id}`}
          sx={{
            width: `${cellSize * 0.8}px`,
            height: `${cellSize * 0.8}px`,
            top: `${agent.row * cellSize + cellSize * 0.1}px`,
            left: `${agent.col * cellSize + cellSize * 0.1}px`,
            backgroundColor: agent.color,
          }}
          title={`Agente ${agent.id} (${agent.state})`}
        />
      ))}
    </GridContainer>
  );
};

export default Grid;
