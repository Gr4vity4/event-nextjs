"use client";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import React from "react";
import { logoutUser } from "@/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Events Management
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
}
