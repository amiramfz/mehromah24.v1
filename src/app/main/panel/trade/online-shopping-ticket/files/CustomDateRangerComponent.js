import { Box, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { DatePicker, PickersDay } from "@mui/x-date-pickers";
import JalaliMoment from "jalali-moment";
import IconButton from "@mui/material/IconButton";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { makeStyles } from "@mui/styles";
import { fi } from "date-fns/locale";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import InputAdornment from "@mui/material/InputAdornment";

const options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};
const useStyles = makeStyles((theme) => ({
  hideNavButtons: {
    '& button[data-arrow="previous"]': {
      display: "none",
    },
    '& button[data-arrow="next"]': {
      display: "none",
    },
  },
}));
export const CustomDateRangerComponent = (props) => {
  const [openCustomDateRanger, setOpenCustomDateRanger] = useState(false);
  const [selectedRangeStart, setSelectedRangeStart] = useState("");
  
  const [selectedRangeEnd, setSelectedRangeEnd] = useState("");
  //!
  useEffect(() => {
    setSelectedRangeStart(
      props.rangeValues.length !== 0
        ? props.rangeValues[0].toLocaleDateString("fa-IR", options)
        : ""
    );
    setSelectedRangeEnd(
      props.rangeValues.length === 2
        ? props.rangeValues[1].toLocaleDateString("fa-IR", options)
        : ""
    )
  }, [props.rangeValues]);
  //!
  const selectDates = props.rangeValues;
  const setSelectDates = props.setRangeValues;

  const [keyUpdateMonth, setKeyUpdateMonth] = useState(false);

  const [currentJalaliMonthEnd, setCurrentJalaliMonthEnd] = useState(
    JalaliMoment().add(1, "jMonth").startOf("jMonth").toDate()
  );
  const [currentJalaliMonthStart, setCurrentJalaliMonthStart] = useState(
    JalaliMoment().startOf("jMonth").toDate()
  );
  const incrementMonth = () => {
    setCurrentJalaliMonthEnd((prevMonthEnd) =>
      JalaliMoment(prevMonthEnd).add(1, "jMonth").startOf("jMonth").toDate()
    );
    setCurrentJalaliMonthStart((prevMonthEnd) =>
      JalaliMoment(prevMonthEnd).add(1, "jMonth").startOf("jMonth").toDate()
    );
    setKeyUpdateMonth(!keyUpdateMonth);
  };
  const decrementMonth = () => {
    setCurrentJalaliMonthEnd((prevMonthEnd) =>
      JalaliMoment(prevMonthEnd)
        .subtract(1, "jMonth")
        .startOf("jMonth")
        .toDate()
    );
    setCurrentJalaliMonthStart((prevMonthStart) =>
      JalaliMoment(prevMonthStart)
        .subtract(1, "jMonth")
        .startOf("jMonth")
        .toDate()
    );
    setKeyUpdateMonth(!keyUpdateMonth);
  };

  const handleSelectDatesChange = (newSelectDate) => {
    if (openCustomDateRanger == "origin") {
      setSelectDates([newSelectDate]); // Set the state with the new selected date
    } else if (openCustomDateRanger == "destination") {
      const startDate = selectDates[0];
      if (startDate < newSelectDate) {
        // Change the comparison to <
        setSelectDates([startDate, newSelectDate]); // Set the state with the selected date range
      } else {
        setSelectDates([newSelectDate, startDate]); // Set the state with the selected date range (reversed order)
      }
    }
  };

  function shouldDisableDate(day) {
    if (
      day.toLocaleDateString("fa-IR", options) <
      new Date().toLocaleDateString("fa-IR", options)
    ) {
      return true; // Disable all dates before today
    }
    if (
      openCustomDateRanger == "destination" &&
      Array.isArray(selectDates) &&
      selectDates.length == 1
    ) {
      if (day < selectDates[0]) return true;
    }
  }
  const classes = useStyles();

  const customDateRangeRef = useRef(null);

  // for disable distination date
  const [disableDestinationDate, setDisableDestinationDate] = useState(true);

  function convertDate(date) {
    function addZiro(date) {
      if (date.length == 1) return "0" + date;
      else return date;
    }
    const tempDate = date.split("/");
    return tempDate[2] + addZiro(tempDate[0]) + addZiro(tempDate[1]);
  }

  function getStyleSelectedDate(props) {
    if (
      openCustomDateRanger == "origin" &&
      Array.isArray(selectDates) &&
      selectDates.length == 1
    ) {
      setSelectedRangeStart(
        selectDates[0].toLocaleDateString("fa-IR", options)
      );
      setSelectedRangeEnd("");
      setDisableDestinationDate(true);
    } else if (
      openCustomDateRanger == "destination" &&
      Array.isArray(selectDates) &&
      selectDates.length == 2
    ) {
      setDisableDestinationDate(false);
      setSelectedRangeEnd(selectDates[1].toLocaleDateString("fa-IR", options));
    }

    if (Array.isArray(selectDates) && selectDates.length == 1) {
      if (selectDates[0] < props.day && selectDates[1] > props.day)
        return { backgroundColor: "#f3bc5380", borderRadius: "0" };
      if (
        selectDates[0].toLocaleDateString("en-US") ===
        props.day.toLocaleDateString("en-US")
      )
        return { backgroundColor: "#f3bc53", borderRadius: "50% 50% 50% 50%" };
    } else if (Array.isArray(selectDates) && selectDates.length == 2) {
      if (selectDates[0] < props.day && selectDates[1] > props.day)
        return { backgroundColor: "#f3bc5380", borderRadius: "0" };
      if (
        selectDates[0].toLocaleDateString("en-US") ===
        props.day.toLocaleDateString("en-US")
      )
        return { backgroundColor: "#f3bc53", borderRadius: "0 50% 50% 0" };
      else if (
        selectDates[1].toLocaleDateString("en-US") ===
        props.day.toLocaleDateString("en-US")
      )
        return { backgroundColor: "#f3bc53", borderRadius: "50% 0 0 50%" };
    }
  }

  function serverDay(props) {
    const priceOfDay = { 20231209: 0, 20231201: 0, 20231205: 0 };
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const currentDay = convertDate(
      props.day.toLocaleDateString("en-US", options)
    );
    // if (startDate == props.day.toLocaleDateString("en-US"))

    return (
      <Box position={"relative"}>
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          style={getStyleSelectedDate(props)}
        />
        <Box
          position={"absolute"}
          zIndex={9999}
          bottom={0}
          left={0}
          right={0}
          fontSize={"xx-small"}
          textAlign={"center"}
          color={"blueviolet"}
          sx={{ textShadow: "0 0 block" }}
        >
          {priceOfDay[currentDay] ? priceOfDay[currentDay] : undefined}
        </Box>
      </Box>
    );
  }
  // بررسی کلیک در صورتی که پنجره باز است
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        customDateRangeRef.current &&
        !customDateRangeRef.current.contains(event.target)
      ) {
        // بستن پنجره اگر کلیک خارج از المان رخ داده باشد
        setOpenCustomDateRanger(false);
      }
    }
    if (openCustomDateRanger) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    // Clean-up
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openCustomDateRanger]);

  // Render the custom date range component
  return (
    <>
      <div ref={customDateRangeRef}>
        <Box>
          <Box display={"flex"}>
            <TextField
              onFocus={(e) => {
                setOpenCustomDateRanger(e.target.name);
              }}
              dir="ltr"
              className={"text-field-first-date-ranger"}
              value={selectedRangeStart}
              name="origin"
              sx={{ width: "100%", border: "none" }}
              label={"تاریخ رفت"}
            />
            <TextField
              onFocus={(e) => {
                setOpenCustomDateRanger(e.target.name);
              }}
              className={"text-field-end-date-ranger"}
              value={selectedRangeEnd}
              name="destination"
              dir="ltr"
              sx={{
                backgroundColor: disableDestinationDate ? "#e0e0e0" : "none",
                width: "100%",
              }}
              label={"تاریخ بازگشت"}
              disabled={selectDates.length == 0 ? true : false}
              // onClick={() => {
              //   setDisableDestinationDate(false);
              // }}
              InputProps={{
                endAdornment: !disableDestinationDate && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setSelectedRangeEnd("");
                        setDisableDestinationDate(true);
                        setSelectDates([selectDates[0]]);
                      }}
                    >
                      <EventBusyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {openCustomDateRanger && (
            <div
              style={{
                position: "absolute",
                background: "#fafbfd",
                boxShadow:
                  "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
                borderRadius: "16px",
                transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                transformOrigin: "top center",
                zIndex: "9999",
              }}
            >
              {/* <IconButton size="small">
                <HighlightOffIcon />
              </IconButton> */}
              <Box
                padding={"15px 30px 0 30px"}
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <IconButton
                  onClick={() => {
                    decrementMonth();
                  }}
                  disabled={
                    currentJalaliMonthStart.toLocaleDateString("fa-IR") ===
                    JalaliMoment()
                      .startOf("jMonth")
                      .toDate()
                      .toLocaleDateString("fa-IR")
                  }
                  size="large"
                >
                  <ArrowCircleRightIcon />{" "}
                </IconButton>

                <IconButton
                  onClick={() => {
                    incrementMonth();
                  }}
                  size="large"
                >
                  <ArrowCircleLeftIcon />
                </IconButton>
              </Box>

              <Grid className="custom-date-range" container>
                <Grid
                  className="date-range-start"
                  item
                  lg={6}
                  xl={6}
                  md={6}
                  sm={12}
                  xs={12}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                    <DateCalendar
                      key={keyUpdateMonth}
                      minDate={currentJalaliMonthStart}
                      views={["day"]}
                      onChange={(value) => {
                        handleSelectDatesChange(value);
                      }}
                      slots={{ day: serverDay }}
                      shouldDisableDate={shouldDisableDate} // Pass the shouldDisableDate function
                      className={classes.hideNavButtons}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid
                  className="date-range-end"
                  item
                  lg={6}
                  xl={6}
                  md={6}
                  sm={12}
                  xs={12}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                    <DateCalendar
                      key={keyUpdateMonth}
                      minDate={currentJalaliMonthEnd}
                      views={["day"]}
                      disableHighlightToday={true}
                      shouldDisableDate={shouldDisableDate} // Pass the shouldDisableDate function
                      onChange={(value) => {
                        handleSelectDatesChange(value);
                      }}
                      slots={{ day: serverDay }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </div>
          )}
        </Box>
      </div>
    </>
  );
};
