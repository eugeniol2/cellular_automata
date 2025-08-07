import "@mui/material/styles";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    border: {
      mainBorder: string;
    };
  }

  interface PaletteOptions {
    border?: {
      mainBorder: string;
    };
  }

  interface TypeBackground {
    backgroundGradient: string;
    customBackground: string;
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
    border: {
      mainBorder: "rgba(74, 30, 106, 0.3)",
    },
    common: {
      white: "#fff",
      black: "#000",
    },
    primary: {
      main: "#4A1E6A", // Nebula Purple
      light: "#6A3D8A",
      dark: "#2A0F4A",
    },
    secondary: {
      main: "#00C2C2", // Galaxy Teal
      light: "#40D2D2",
      dark: "#009292",
    },
    background: {
      default: "#0A0A2A", // Cosmic Black
      paper: "#121240", // Deep Space
      backgroundGradient: "linear-gradient(to bottom, #0A0A2A, #121240)",
      customBackground: "rgba(10, 10, 42, 0.8)",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#E0E0E0", // Comet Silver
    },
    success: {
      main: "#4CAF50", // Nova Cyan
    },
    warning: {
      main: "#FFD166", // Star Gold
    },
    error: {
      main: "#D62828", // Mars Red
    },
    info: {
      main: "#1A5F9E", // Stellar Blue
    },
  },
  typography: {
    fontFamily: ["Roboto", '"Space Grotesk"', "sans-serif"].join(","),
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      background: "linear-gradient(90deg, #00C2C2, #4A1E6A)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#FFFFFF",
    },
    body1: {
      fontSize: "1.1rem",
      color: "#E0E0E0",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          textTransform: "none",
          padding: "10px 24px",
          fontWeight: 600,
          boxShadow: "0 4px 15px rgba(0, 194, 194, 0.3)",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #4A1E6A, #1A5F9E)",
          "&:hover": {
            background: "linear-gradient(135deg, #5A2E7A, #2A6FAE)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(145deg, #121240, #0A0A2A)",
          borderRadius: "16px",
          border: "1px solid rgba(74, 30, 106, 0.5)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            borderColor: "rgba(0, 194, 194, 0.7)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(10, 10, 42, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(74, 30, 106, 0.3)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            background: "linear-gradient(135deg, #2A6FAE, #5A2E7A)",
            transform: "scale(1.03)",
            transition: "transform 0.3s ease",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "0px",
          "&:last-child": {
            paddingBottom: "0px",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#00C2C2",
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#00C2C2",
          },
        },
      },
    },
  },
});

export default theme;
