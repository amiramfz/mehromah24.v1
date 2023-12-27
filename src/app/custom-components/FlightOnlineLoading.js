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
      <Box
        width={"620px"}
        height={"450px"}
      >
        <Box
          sx={{
            backgroundImage: "url(assets/images/banner/banner1.jpg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "600px",
            height: "400px",
            borderRadius: "12px",
            border: "1px solid #ccc",
            boxShadow: "0 0 4px rgba(0, 0, 0, 0.1)",
            marginBottom: "5px",
          }}
        ></Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "600px",
            height: "40px",
            borderRadius: "12px",
            border: "1px solid #ccc",
            boxShadow: "0 0 4px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
          }}>
          <CircularProgress size={20} sx={{ marginRight: "10px" }} /> ما در حال جستجو در بیش از 5000 سرویس هستیم...
        </Box>
      </Box>
    </Box>
  );
}
