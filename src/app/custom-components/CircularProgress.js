import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate() {
  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        zIndex: 999999999999,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backdropFilter: "blur(2px)", // Adjust the blur value as needed
        backgroundColor: "rgba(255, 255, 255, 0.7)",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
