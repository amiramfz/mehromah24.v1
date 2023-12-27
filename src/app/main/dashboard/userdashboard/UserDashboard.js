import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const UserDashboard = () => {
  return (
    <>
      <Box
        sx={{ width: "100%" }}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={1}
      >
        <Box>
          <img
            src="./logo-new.png"
            alt="beach"
            style={{
              width: "200px",
            }}
            className="rounded-6"
          />
        </Box>
        <Box>
          <Typography variant="h4">سامانه جامع مدیریت فروش ساوش</Typography>
        </Box>
      </Box>
    </>
  );
};

export default UserDashboard;
