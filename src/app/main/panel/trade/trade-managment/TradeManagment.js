import { styled } from "@mui/material/styles";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import TradeManagmentComponent from "./files/TradeManagmentComponent";
import { OprationsComponent } from "./files/oprations/OprationsComponent";

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

const TradeManagment = () => {
  const { t } = useTranslation("tradeManagment");
  const user = useSelector(selectUser);
  return (
    <Root
      header={
        <div className="p-24">
          <h4>{t("HEADER")}</h4>
        </div>
      }
      content={
        <div style={{ width: "100%" }} className="p-24">
          <h4>مدیریت فروش</h4>
          <br />
          <Box
            width={"100%"}
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <TradeManagmentComponent />
          </Box>
        </div>
      }
      scroll="content"
    />
  );
};

export default TradeManagment;
