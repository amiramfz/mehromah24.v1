import { memo } from "react";
import Box from "@mui/material/Box";
import ProgressLoading from "../../../app/custom-components/ProgressLoading";

function FuseSplashScreen() {
  return (
    <div id="fuse-splash-screen" style={{ background: "rgba(255, 246, 229, 0.7)" }}>
      <ProgressLoading />
      <Box
        id="spinner"
        sx={{
          "& > div": {
            backgroundColor: "palette.secondary.main",
          },
        }}
      >
      </Box>
    </div>
  );
}

export default memo(FuseSplashScreen);
