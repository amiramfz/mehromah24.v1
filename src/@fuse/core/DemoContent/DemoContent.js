import { Box } from "@mui/system";
import { memo } from "react";

function DemoContent() {
  return (
    <Box
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <img
        src="./logo-new.png"
        alt="beach"
        style={{
          width: "300px",
        }}
        className="rounded-6"
      />
    </Box>
    // <div
    //   style={{
    //     width: "100%",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    // <img
    //   src="./logo-new.png"
    //   alt="beach"
    //   style={{
    //     maxWidth: "640px",
    //     width: "100%",
    //   }}
    //   className="rounded-6"
    // />
    // </div>
  );
}

export default memo(DemoContent);
