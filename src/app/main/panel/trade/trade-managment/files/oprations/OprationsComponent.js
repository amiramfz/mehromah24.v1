import React, { useEffect, useState } from "react";
import { CashDeskComponent } from "./CashDeskComponent";
import axios from "axios";
import CircularIndeterminate from "src/app/custom-components/CircularProgress";
import { Box, Button, Card, Grid, Tab, Tabs, Typography } from "@mui/material";
import { TrackingComponent } from "./TrackingComponent";
import { PassengersComponent } from "./PassengersComponent";
import { ActionsComponent } from "./ActionsComponent";
import { ShowStatusComponent } from "./ShowStatusComponent";
import { ServicesComponent } from "./ServicesComponent";
import { base_url } from "src/app/constant";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";

import {
  convertToPersianDate,
  formatInputWithCommas,
  getAccessUser,
} from "./functions";
import { useParams } from "react-router-dom";
const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};
export const OprationsComponent = (props) => {
  const langDirection = useSelector(selectCurrentLanguage);
  const navigate = useNavigate();
  let { id } = useParams();
  id = id - 10000;
  const [showProgressLoading, setShowProgressLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [addedPersons, setAddedPersons] = useState([]);
  const [newRefrence, setNewRefrence] = useState("");
  //for handle reference not found
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const handleClickOpenErrorDialog = () => {
    setOpenErrorDialog(true);
  };
  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
  };
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errorMessageCode, setErrorMessageCode] = React.useState("");
  //for handle actions component axious
  const [selectedActionsComponent, setSelectedActionsComponent] =
    useState(false);
  function getRefrenceEdit(id) {
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/trade/operation", {
        lang: langDirection,
        id: parseInt(id) + 10000,
        goal: "autocomplete",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        if (response.data.status) {
          setNewRefrence(response.data);
          setStatus(response.data.status);
          setShowProgressLoading(false);
        }
      })
      .catch((error) => {
        // Handle any errors
        if (error.request.status === 404) {
          console.log(error.response.data);
          setErrorMessage(error.response.data.message);
          setErrorMessageCode(error.response.data.code);
          handleClickOpenErrorDialog();
        } else {
          console.error("Error creating item:", error);
        }
      });
  }
  useEffect(() => {
    getRefrenceEdit(id);
    // getRefrenceEdit1();
  }, []);
  const [value, setValue] = React.useState(2);
  const handleChange = (event, newValue) => {
    if (newValue === 4) {
      setSelectedActionsComponent(!selectedActionsComponent);
    }
    setValue(newValue);
  };

  return (
    <>
      <Card sx={{ width: "100%", margin: "10px", padding: "15px" }}>
        {showProgressLoading && <CircularIndeterminate />}
        <Box display={"flex"} justifyContent={"center"} marginBottom={5}>
          <Tabs
            value={value}
            variant="scrollable"
            onChange={handleChange}
            aria-label="icon label tabs example"
          >
            <Tab label="مسافرین" />
            <Tab label="هتل/بلیط/خدمات" />
            <Tab label="صندوق" />
            <Tab label="صورت وضعیت" />
            <Tab label="عملیات ها" />
            <Tab label="پیگیری" />
          </Tabs>
        </Box>
        <Box>
          <Box display={value == 0 ? "" : "none"}>
            {newRefrence && (
              <PassengersComponent
                status={status}
                setAddedPersons={setAddedPersons}
                refrence={newRefrence}
                user={props.user}
                getRefrenceEdit={getRefrenceEdit}
              />
            )}
          </Box>
          <Box display={value == 1 ? "" : "none"}>
            {newRefrence && (
              <ServicesComponent
                status={status}
                refrence={newRefrence}
                user={props.user}
                getRefrenceEdit={getRefrenceEdit}
                addedPersons={addedPersons}
              />
            )}
          </Box>
          {/* start cash desk */}
          <Box display={value == 2 ? "" : "none"}>
            {newRefrence && (
              <CashDeskComponent
                status={status}
                refrence={newRefrence}
                getRefrenceEdit={getRefrenceEdit}
                user={props.user}
              />
            )}
          </Box>
          {/* end cash desk */}
          <Box display={value == 3 ? "" : "none"}>
            {newRefrence && (
              <ShowStatusComponent user={props.user} refrence={newRefrence} />
            )}
          </Box>
          <Box display={value == 4 ? "" : "none"}>
            {newRefrence && (
              <ActionsComponent
                status={status}
                selectedActionsComponent={selectedActionsComponent}
                setShowProgressLoading={setShowProgressLoading}
                user={props.user}
                refrence={newRefrence}
              />
            )}
          </Box>
          <Box display={value == 5 ? "" : "none"}>
            {newRefrence && (
              <TrackingComponent
                status={status}
                setStatus={setStatus}
                refrence={newRefrence}
                user={props.user}
                getRefrenceEdit={getRefrenceEdit}
              />
            )}
          </Box>
        </Box>
        {newRefrence && (
          <Box marginTop={2}>
            <Grid container spacing={1} columns={10}>
              <Grid item xl={2} xs={10} md={5}>
                <Box display={"flex"} gap="5px">
                  <Typography sx={{ fontSize: "12px" }}>
                    اپراتور ثبت کننده:
                  </Typography>
                  <Typography sx={{ fontSize: "12px" }}>
                    {newRefrence.operator.personnel_id +
                      " - " +
                      newRefrence.operator.first_name +
                      " " +
                      newRefrence.operator.last_name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xl={2} xs={10} md={5}>
                <Box display={"flex"} gap="5px">
                  <Typography sx={{ fontSize: "12px" }}>زمان:</Typography>
                  <Typography sx={{ fontSize: "12px" }}>
                    {convertToPersianDate(newRefrence.created)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xl={2} xs={10} md={5}>
                <Box display={"flex"} gap="5px">
                  <Typography sx={{ fontSize: "12px" }}>جمع خرید:</Typography>
                  <Typography sx={{ fontSize: "12px" }}>
                    {formatInputWithCommas(
                      newRefrence.sum_buy_price - newRefrence.sum_buy_return
                    ) + " ریال"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xl={2} xs={10} md={5}>
                <Box display={"flex"} gap="5px">
                  <Typography sx={{ fontSize: "12px" }}>جمع فروش:</Typography>
                  <Typography sx={{ fontSize: "12px" }}>
                    {formatInputWithCommas(
                      newRefrence.sum_sell_price - newRefrence.sum_sell_return
                    ) + " ریال"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xl={2} xs={10} md={5}>
                <Box display={"flex"} gap="5px">
                  <Typography sx={{ fontSize: "12px" }}>سود/زیان:</Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color:
                        parseInt(newRefrence.sum_sell_price) -
                          parseInt(newRefrence.sum_buy_price) >
                        0
                          ? "green"
                          : "red",
                    }}
                  >
                    {formatInputWithCommas(
                      parseInt(
                        newRefrence.sum_sell_price - newRefrence.sum_sell_return
                      ) -
                        parseInt(
                          newRefrence.sum_buy_price - newRefrence.sum_buy_return
                        )
                    ) + " ریال ("}
                    {formatInputWithCommas(
                      Math.round(
                        ((parseInt(
                          newRefrence.sum_sell_price -
                            newRefrence.sum_sell_return
                        ) -
                          parseInt(
                            newRefrence.sum_buy_price -
                              newRefrence.sum_buy_return
                          )) /
                          parseInt(
                            newRefrence.sum_buy_price -
                              newRefrence.sum_buy_return
                          )) *
                          100
                      )
                    ) + "%)"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>
      {/* error dialog */}
      <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
        <DialogTitle>
          {"عدم دسترسی به رفرنس مورد نظر" + " | " + errorMessageCode}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              navigate("/trade/list");
            }}
            autoFocus
          >
            <Typography >
            انتقال به صفحه مدیریت رفرنس

            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
      {/* end error dialog */}
    </>
  );
};
