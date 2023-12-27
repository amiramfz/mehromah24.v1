import { styled } from "@mui/material/styles";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { PaysReceivesManagementComponent } from "./files/PaysReceivesManagementComponent";

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

const PaysReceivesManagement = () => {
  const { t } = useTranslation("payCash");
  const user = useSelector(selectUser);

  
  return (
    <Root
      header={
        <div className="p-24">
          <h4>مدیریت دریافت و پرداخت</h4>
        </div>
      }
      content={
        <div style={{ width: "100%" }} className="p-24">
          
          <Box
            width={"100%"}
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <PaysReceivesManagementComponent user={user} />
          </Box>
        </div>
      }
      scroll="content"
    />
  );
};

export default PaysReceivesManagement;
