import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import FusePageSimple from "@fuse/core/FusePageSimple";
// import DemoContent from "@fuse/core/DemoContent";
import UserDashboard from "./userdashboard/UserDashboard";
import { Box } from "@mui/system";
import DashboardComponent from "./files/DashboardComponent";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
  "& .FusePageSimple-toolbar": {},
  "& .FusePageSimple-content": {},
  "& .FusePageSimple-sidebarHeader": {},
  "& .FusePageSimple-sidebarContent": {},
}));

function DashboardPage(props) {
  const { t } = useTranslation("DashboardPage");

  return (
    <Root
      header={<div className="p-24">{/* <h4>{t("TITLE")}</h4> */}</div>}
      content={
        <div style={{ width: "100%" }} className="p-24">
          <h4>داشبرد</h4>
          <br />
          <Box
            width={"100%"}
            height={"100%"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {/* <UserDashboard /> */}
              <DashboardComponent/>
          </Box>
        </div>
      }
      scroll="content"
    />
  );
}

export default DashboardPage;
