import * as React from "react";
import PassengerInformation from "../../temporary-submit/files/PassengerInformation";
import ServicesInformation from "../../temporary-submit/files/ServicesInformation";
import BaseInformation from "../../temporary-submit/files/BaseInformation";
import ShowStatus from "../../temporary-submit/files/ShowStaus";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useState } from "react";
import { Divider, Grid } from "@mui/material";
import {
  convertToPersianDate,
  formatInputWithCommas,
} from "../../trade-managment/files/oprations/functions";
import { useParams } from "react-router-dom";
import { Send } from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import { base_url } from "src/app/constant";
const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};
const steps = [
  "اطلاعات مسافرین",
  "مسیر/هتل/خدمات",
  "اطلاعات پایه مالی",
  "صورت وضعیت",
];
import CircularProgress from "@mui/material/CircularProgress";
import { ServicesChargeComponent } from "./ServicesChargeComponent";

export const OnlineSubmitStepper = () => {
  const langDirection = useSelector(selectCurrentLanguage);
  //for loading send reservation
  const [isLoadingReservation, setIsLoadingReservation] = useState(false);
  // const reservesTestRedux = useSelector((state) => {
  //   console.log("state", state);
  //   return state.panel.reservation.data;
  // });
  // useEffect(() => {
  //   console.log("redux", reservesTestRedux);
  // }, [reserves1]);
  let { id } = useParams();
  const [data, setData] = useState([]);
  const [messages, setMessages] = useState([]);
  function sendData(data) {
    setIsLoadingReservation(true);
    const jsonData = {
      lang: langDirection,
      access_token: getAccessToken(),
      data: data,
    };
    console.log({
      lang: langDirection,
      access_token: getAccessToken(),
      data: data,
    });
    axios
      .post(base_url + "/v2/online/flight/lock", jsonData)
      .then((response) => {
        // Handle the response from the web service
        console.log("Item Created", response.data);
        setMessages(response.data);
        let reserves = JSON.parse(localStorage.getItem("reserves"));
        reserves.forEach((element) => {
          if (element.id === id) {
            console.log("reserves", element);
            element["system_id"] = response.data.lock_id;
            element["messages"] = JSON.stringify(response.data);
            console.log("test", JSON.parse(element["data"]));
            let parsedData = JSON.parse(element["data"]);
            parsedData.forEach((item) => {
              item["Lock"] = response.data;
            });
            element["data"] = JSON.stringify(parsedData);
          }
        });
        localStorage.setItem("reserves", JSON.stringify(reserves));
        setData((preItems) => {
          return preItems.map((item) => {
            return { ...item, Lock: response.data };
          });
        });
        setIsLoadingReservation(false);
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Error sending JSON data:", error);
      });
  }
  useEffect(() => {
    console.log("data:", data);
  }, [data]);
  const [defaultPassengerCount, setDefaultPassengerCount] = useState(1);
  useEffect(() => {
    const item = JSON.parse(localStorage.getItem("reserves")).find(
      (item) => item.id === id
    );
    console.log(JSON.parse(localStorage.getItem("reserves")));
    console.log(item);
    setData(JSON.parse(item.data));
    setMessages(JSON.parse(item.messages));
    if (!item.system_id) {
      sendData(JSON.parse(item.data));
    }
    let count = 1;
    JSON.parse(item.data).forEach((online) => {
      count =
        parseInt(online.Classes.Passengers.Infant) +
          parseInt(online.Classes.Passengers.Child) +
          parseInt(online.Classes.Passengers.Adult) >
        count
          ? parseInt(online.Classes.Passengers.Infant) +
            parseInt(online.Classes.Passengers.Child) +
            parseInt(online.Classes.Passengers.Adult)
          : count;
    });
    setDefaultPassengerCount(count);
  }, [id]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  //variable for store json in each part
  const [personsJSON, setPersonsJSON] = React.useState({});
  const [update, setUpdate] = React.useState(false);
  const [updateSells, setUpdateSells] = React.useState(false);
  function handleSetPersonsJSON(value) {
    setPersonsJSON(value);
  }
  const isStepOptional = (step) => {
    return step === -1;
  };
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      <Box sx={{ width: "100%" }} display={"flex"} flexDirection={"column"}>
        <Box>
          {isLoadingReservation && <CircularProgress />}
          {data &&
            data.map((item, index) => (
              <>
                <BasketItem
                  item={item}
                  index={index}
                  length={data.length}
                  message={
                    messages.length !== 0 &&
                    messages.data[index].Message &&
                    messages.data[index].Message
                  }
                />
                {/* <Typography>
                  {messages.length !== 0 &&
                    messages.data[index].Message &&
                    messages.data[index].Message}
                </Typography> */}
              </>
            ))}
        </Box>

        <Box>
          <Stepper
            sx={{ marginTop: 5, marginBottom: 5 }}
            activeStep={activeStep}
          >
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
              <Box display={activeStep == 0 ? "" : "none"}>
                <PassengerInformation
                  handleNext={handleNext}
                  handleBack={handleBack}
                  personsJSON={personsJSON}
                  handleSetPersonsJSON={handleSetPersonsJSON}
                  action={"online"}
                  online={data}
                  count={defaultPassengerCount}
                />
              </Box>
              <Box display={activeStep == 1 ? "" : "none"}>
                <ServicesInformation
                  handleNext={handleNext}
                  handleBack={handleBack}
                  personsJSON={personsJSON}
                  handleSetPersonsJSON={handleSetPersonsJSON}
                  update={update}
                  setUpdate={setUpdate}
                  action={"online"}
                  online={data}
                />
              </Box>
              <Box display={activeStep == 2 ? "" : "none"}>
                <BaseInformation
                  handleNext={handleNext}
                  handleBack={handleBack}
                  personsJSON={personsJSON}
                  handleSetPersonsJSON={handleSetPersonsJSON}
                  setUpdateSells={setUpdateSells}
                  updateSells={updateSells}
                  update={update}
                  setUpdate={setUpdate}
                  action={"online"}
                  online={data}
                />
              </Box>
              <Box display={activeStep == 3 ? "" : "none"}>
                <ShowStatus
                  handleNext={handleNext}
                  handleBack={handleBack}
                  personsJSON={personsJSON}
                  handleSetPersonsJSON={handleSetPersonsJSON}
                  updateSells={updateSells}
                  action={"online"}
                  online={data}
                />
              </Box>
            </React.Fragment>
          )}
        </Box>
      </Box>
    </>
  );
};
const BasketItem = ({ item, index, length, message }) => {
  const [adultCount, setAdultCount] = useState(item.Classes.Passengers.Adult);
  const [childCount, setChildCount] = useState(item.Classes.Passengers.Child);
  const [infantCount, setInfantCount] = useState(
    item.Classes.Passengers.Infant
  );
  return (
    <>
      <Box
        border={"1px solid gray"}
        marginBottom={"10px"}
        padding={"15px"}
        borderRadius={"8px"}
        boxShadow={"0 0 10px rgba(0, 0, 0, 0.1)"}
        backgroundColor={"#f8f8f8"}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold", color: "#333" }}
            >
              {" پرواز " +
                item.Origin.Iata.title_fa +
                " به " +
                item.Destination.Iata.title_fa +
                " | " +
                formatInputWithCommas(
                  item.Classes.Financial.Adult.Payable.toString()
                ) +
                " ریال " +
                " | " +
                convertToPersianDate(item.DepartureDateTime) +
                " | " +
                item.FlightNumber.toString() +
                " | " +
                item.Service +
                " | " +
                (item.FlightType === "Charter" ? "چارتری" : "سیستمی")}
            </Typography>
            <Typography sx={{ color: "red" }}>
              {message ? message : ""}
            </Typography>
          </Grid>
        </Grid>
        {/* for service charge */}
        <ServicesChargeComponent />
        {/* end for service charge */}
      </Box>

      {/* {index + 1 !== length && (
        <Divider sx={{ marginTop: "15px" }} variant="middle" />
      )} */}
    </>
  );
};
