import { styled } from "@mui/material/styles";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Box, Typography } from "@mui/material";
import CustomStepper from "./files/CustomStepper";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';

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

const TemporarySubmit = () => {
  const { t } = useTranslation('temporarySubmit');
  const user = useSelector(selectUser);

  return (
    <Root
      header={
        <div className="p-24">
          <h4>{t('HEADER')}</h4>
        </div>
      }
      content={
        <div style={{ width: "100%" }} className="p-24">
          <h2>{user.data.access.all}</h2>
          <h4>ثبت شناور</h4>
          <br />
          <Box
            width={"100%"}
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <CustomStepper />
          </Box>
        </div>
      }
      scroll="content"
    />
  );
};

export default TemporarySubmit;
