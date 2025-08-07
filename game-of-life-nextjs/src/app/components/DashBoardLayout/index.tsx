"use client";

import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DescriptionIcon from "@mui/icons-material/Description";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

import { globalAtoms } from "@/app/atoms";
import { useAtom } from "jotai";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isDrawerOpen, setIsDrawerOpen] = useAtom(globalAtoms.isDrawerOpen);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          background: `radial-gradient(circle at center, ${theme.palette.background.default} 0%, #000013 100%)`,
        }}
      >
        <AppBar position="fixed">
          {!isDrawerOpen && !isMobile && (
            <Box
              sx={{
                position: "fixed",
                top: 80,
                left: 16,
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: "rgba(10,10,42,0.8)",
                borderRadius: "50%",
                boxShadow: 3,
              }}
            >
              <IconButton
                onClick={handleDrawerToggle}
                color="secondary"
                size="large"
                sx={{
                  boxShadow: "0 4px 15px rgba(0, 194, 194, 0.3)",
                }}
              >
                <KeyboardDoubleArrowRightIcon fontSize="large" />
              </IconButton>
            </Box>
          )}
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, fontWeight: 700 }}
            >
              Eugênio Araújo
            </Typography>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
              <IconButton
                size="large"
                color="inherit"
                href="https://github.com/your-username"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                href="https://www.linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </IconButton>
              <Button
                color="inherit"
                startIcon={<DescriptionIcon />}
                component="a"
                href="/path/to/your/documentation.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Artigo do projeto
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: "100px",
            marginTop: "64px",
          }}
        >
          <Container maxWidth="xl">{children}</Container>
        </Box>
      </Box>
    </>
  );
}
