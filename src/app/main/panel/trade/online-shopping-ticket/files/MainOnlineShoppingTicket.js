import {
  Badge,
  Button,
  Grid,
  Typography,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { Box, ThemeProvider, border, borders } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import LoopIcon from "@mui/icons-material/Loop";
import IconButton from "@mui/material/IconButton";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, PickersDay } from "@mui/x-date-pickers";
import { CustomDateRangerComponent } from "./CustomDateRangerComponent";
import { ScrollCalendarComponent } from "./ScrollCalendarComponent";
import { FlightTicket } from "./FlightTicket";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import { base_url } from "src/app/constant";
import CircularProgress from "@mui/material/CircularProgress";
import { styled, lighten, darken } from "@mui/system";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import {
  convertPersianToEnglishNumbers,
  convertToPersianDate,
  formatInputWithCommas,
  formatDateWithDash,
  convertJalalitoMiladiDate,
} from "../../trade-managment/files/oprations/functions";
import FlightOnlineLoading from "src/app/custom-components/FlightOnlineLoading";
import { FilteredBox } from "./FilteredBox";
import Fab from "@mui/material/Fab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import { ShoppingCart } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import ChildFriendlyOutlinedIcon from "@mui/icons-material/ChildFriendlyOutlined";
import ChildCareOutlinedIcon from "@mui/icons-material/ChildCareOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import isEqual from "lodash/isEqual";
import { showMessage } from "app/store/fuse/messageSlice";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import { ServicesChargeComponent } from "./ServicesChargeComponent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};
const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === "light"
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));
const GroupItems = styled("ul")({
  padding: 0,
});
const options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export const MainOnlineShoppingTicket = () => {
  const langDirection = useSelector(selectCurrentLanguage);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProgressLoading, setShowProgressLoading] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  // for origin/destination airports
  const [airports, setAirPorts] = useState([]);
  const [openOrigin, setOpenOrigin] = useState(false);
  const [airportsLoading, setAirportsLoading] = useState(false);
  function getAirports() {
    setAirportsLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: langDirection,
        table: "airport",
        route: 1,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item Created:", response.data);
        setAirPorts(response.data.data.titles);
        setAirportsLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  const [openDestination, setOpenDestination] = useState(false);
  useState(false);
  useEffect(() => {
    if (openOrigin || openDestination) {
      getAirports();
    }
  }, [openOrigin, openDestination]);
  const exchangeValues = () => {
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(selectedOrigin);
  };
  //for dateRanger
  const [rangeValues, setRangeValues] = useState([]);

  const [items, setItems] = useState({
    Airlines: [],
    Return: [],
    Went: [],
  });

  const [isEmpty, setIsEmpty] = useState(false);
  //for validate
  const schema = yup.object().shape({
    origin: yup.string().required("باید یک نام مبدا وارد کنید"),
    destination: yup.string().required("باید یک نام مقصد وارد کنید"),
  });
  const defaultValues = {
    origin: "",
    destination: "",
  };
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  function setURL(data) {
    // Get the current URL
    var currentUrl = window.location.href.split("?")[0];

    // Add a text parameter
    var updatedUrl =
      currentUrl +
      "?origin=" +
      (encodeURIComponent(data.origin) ? encodeURIComponent(data.origin) : "") +
      "&destination=" +
      (encodeURIComponent(data.destination)
        ? encodeURIComponent(data.destination)
        : "") +
      "&departure_date=" +
      (encodeURIComponent(data.departure_date)
        ? encodeURIComponent(data.departure_date.toString().replace(/\//g, "-"))
        : "") +
      "&returning_date=" +
      (encodeURIComponent(data.returning_date)
        ? encodeURIComponent(data.returning_date.toString().replace(/\//g, "-"))
        : "");

    // Update the window location
    window.history.pushState({ path: updatedUrl }, "", updatedUrl);
  }

  function handleClickSubmitSearch(data = false) {
    if (isValid || data) {
      const jsonData = {
        lang: langDirection,
        origin: selectedOrigin.iata,
        destination: selectedDestination.iata,
        type: "RadioRouteOneWay",
        departure_date: !data
          ? convertPersianToEnglishNumbers(
              rangeValues[0].toLocaleDateString("fa-IR", options)
            )
          : convertPersianToEnglishNumbers(data),
        returning_date: rangeValues[1]
          ? convertPersianToEnglishNumbers(
              rangeValues[1].toLocaleDateString("fa-IR", options)
            )
          : false,
        access_token: getAccessToken(),
      };
      console.log({
        lang: langDirection,
        origin: selectedOrigin.iata,
        destination: selectedDestination.iata,
        type: "RadioRouteOneWay",
        departure_date: convertPersianToEnglishNumbers(
          rangeValues[0].toLocaleDateString("fa-IR", options)
        ),
        returning_date: rangeValues[1]
          ? convertPersianToEnglishNumbers(
              rangeValues[1].toLocaleDateString("fa-IR", options)
            )
          : false,
        access_token: getAccessToken(),
      });
      setShowProgressLoading(true);
      axios
        .post(base_url + "/v2/online/flight/list/date", jsonData)
        .then((response) => {
          // Handle the response from the web service
          console.log("Item Created", response.data.data);
          setItems(response.data.data);
          if (
            response.data.data.Went.length === 0 &&
            response.data.data.Return.length === 0
          ) {
            setIsEmpty(true);
          } else {
            setIsEmpty(false);
          }
          setShowProgressLoading(false);
          setURL(jsonData);
        })
        .catch((error) => {
          // Handle any errors that occurred during the request
          console.error("Error sending JSON data:", error);
        });
    } else {
      trigger();
    }
  }

  //handle added ticket
  const [addedTickets, setAddedTickets] = useState([]);

  // TODO remove section
  function handleClickSubmitTicket(item) {
    //! این بخش حذف شود
    if (addedTickets.length !== 0) {
      dispatch(
        showMessage({
          message: "در حال حاضر در هر رفرنس یک خرید امکان پذیر است", //text or html
          autoHideDuration: 6000, //ms
          anchorOrigin: {
            vertical: "top", //top bottom
            horizontal: "center", //left center right
          },
          variant: "error", //success error info warning null
        })
      );
    } else {
      setAddedTickets((prevItems) => [...prevItems, item]);
    }
    //!
    //! این بخش از کامنت خارج شود
    // // Check if the item already exists in the array
    // const isItemAlreadyAdded = addedTickets.some((existingItem) =>
    //   isEqual(existingItem, item)
    // );
    // // If the item doesn't exist, add it to the array
    // if (!isItemAlreadyAdded) {
    //   setAddedTickets((prevItems) => [...prevItems, item]);
    // } else {
    //   dispatch(
    //     showMessage({
    //       message: "این آیتم قبلا به سبد خرید شما اضافه شده است", //text or html
    //       autoHideDuration: 6000, //ms
    //       anchorOrigin: {
    //         vertical: "top", //top bottom
    //         horizontal: "center", //left center right
    //       },
    //       variant: "error", //success error info warning null
    //     })
    //   );
    // }
    //!
  }

  //handle show detail

  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const handleClickOpenDetailDialog = () => {
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };
  const [detailSelected, setDetailSelected] = useState("");
  function handleClickShowDetail(data) {
    console.log(data);
    setDetailSelected(data);
    setOpenDetailDialog(true);
  }
  //for bascket dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleClickCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleClickConfirmAndNextStep = () => {
    const id = uuidv4();
    console.log(id);
    // dispatch(
    //   addReserve({
    //     id: id,
    //     data: JSON.stringify(addedTickets),
    //     system_id: false,
    //   })
    // );
    if (localStorage.getItem("reserves")) {
      let reserves = JSON.parse(localStorage.getItem("reserves"));
      reserves.push({
        id: id,
        data: JSON.stringify(addedTickets),
        system_id: false,
        messages: JSON.stringify([]),
      });
      localStorage.setItem("reserves", JSON.stringify(reserves));
    } else {
      localStorage.setItem(
        "reserves",
        JSON.stringify([
          {
            id: id,
            data: JSON.stringify(addedTickets),
            system_id: false,
            messages: JSON.stringify([]),
          },
        ])
      );
    }
    navigate("/trade/online-ticket/submit/" + id);
  };
  function handleDeleteBasketItem(index) {
    const newArray = [...addedTickets];
    newArray.splice(index, 1);
    setAddedTickets(newArray);
  }
  useEffect(() => {
    if (addedTickets.length === 0) {
      setOpenDialog(false);
    }
  }, [addedTickets.length]);

  //send axios with url
  useEffect(() => {
    console.log(
      "Hi barby",
      new URLSearchParams(window.location.search).get("origin")
    );
    if (
      new URLSearchParams(window.location.search).get("origin") &&
      new URLSearchParams(window.location.search).get("destination")
    ) {
      const jsonData = {
        lang: langDirection,
        origin: new URLSearchParams(window.location.search).get("origin"),
        destination: new URLSearchParams(window.location.search).get(
          "destination"
        ),
        type: "RadioRouteOneWay",
        departure_date: new URLSearchParams(window.location.search)
          .get("departure_date")
          .toString()
          .replace(/-/g, "/"),
        returning_date:
          new URLSearchParams(window.location.search)
            .get("returning_date")
            .toString() !== "false"
            ? new URLSearchParams(window.location.search)
                .get("returning_date")
                .toString()
                .replace(/-/g, "/")
            : false,
        access_token: getAccessToken(),
      };
      console.log({
        lang: langDirection,
        origin: new URLSearchParams(window.location.search).get("origin"),
        destination: new URLSearchParams(window.location.search).get(
          "destination"
        ),
        type: "RadioRouteOneWay",
        departure_date: new URLSearchParams(window.location.search).get(
          "departure_date"
        ),
        returning_date: new URLSearchParams(window.location.search).get(
          "returning_date"
        ),
        access_token: getAccessToken(),
      });
      setShowProgressLoading(true);
      axios
        .post(base_url + "/v2/online/flight/list/date", jsonData)
        .then((response) => {
          // Handle the response from the web service
          console.log("Item Created", response.data);
          setItems(response.data.data);
          if (
            response.data.data.Went.length === 0 &&
            response.data.data.Return.length === 0
          ) {
            setIsEmpty(true);
          } else {
            setIsEmpty(false);
          }
          setShowProgressLoading(false);
          setURL(jsonData);
          setSelectedOrigin(response.data.search.origin);
          setSelectedDestination(response.data.search.destination);
          setValue("origin", response.data.search.origin.title_fa);
          setValue("destination", response.data.search.origin.title_fa);
          response.data.search.returning_date
            ? setRangeValues([
                convertJalalitoMiladiDate(response.data.search.departure_date),
                convertJalalitoMiladiDate(response.data.search.returning_date),
              ])
            : setRangeValues([
                convertJalalitoMiladiDate(response.data.search.departure_date),
              ]);
        })
        .catch((error) => {
          // Handle any errors that occurred during the request
          console.error("Error sending JSON data:", error);
        });
    }
  }, []);

  // for focus on the destination
  useEffect(() => {
    // Check if an item is selected in the origin Autocomplete
    if (selectedOrigin) {
      // Focus on the destination Autocomplete
      document.getElementById("destination-autocomplete").focus();
    }
  }, [selectedOrigin]);

  // for handle scrolling calendar
  function handleClickDayScrollCalendar(data) {
    console.log(data);
    handleClickSubmitSearch(data);
  }

  useEffect(() => {
    console.log(rangeValues);
  }, [rangeValues]);

  const [tabValue, setTabValue] = useState(0);
  const handleChangeTabs = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      {showProgressLoading && <FlightOnlineLoading />}

      <Box display="flex" width="100%" flexDirection="column">
        {/* seach box && items */}
        <Box width={"100%"} display={"flex"} flexDirection={"column"} gap={5}>
          <Box
            style={{
              backgroundImage: `url('assets/images/patterns/online-pattern.png')`,
              backgroundColor: "#fafaf9",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: "100%",
              padding: "50px 25px",
              borderRadius: "12px", // Adjust the border radius as needed
              overflow: "hidden", // Hide overflowing content
            }}
          >
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent={"center"}
            >
              <Grid item lg={5} md={5} xs={12}>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Controller
                    name="origin"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        disableClearable
                        className="origin"
                        value={selectedOrigin ? selectedOrigin : null}
                        onChange={(e, value) => {
                          if (value) {
                            console.log(value.title_fa);
                            setSelectedOrigin(value);
                            setValue("origin", value.title_fa);
                            trigger("origin");
                            setOpenDestination(true);
                          }
                        }}
                        open={openOrigin}
                        onOpen={() => {
                          setOpenOrigin(true);
                        }}
                        onClose={() => {
                          setOpenOrigin(false);
                        }}
                        groupBy={(option) => option.group_by}
                        getOptionLabel={(option) =>
                          `${option.title_fa} - ${option.iata}`
                        }
                        options={airports.map((option) => option)}
                        sx={{
                          width: "100%",
                          backgroundColor: "rgba(255, 255, 255, 0.6)",
                          // borderRadius: 8,
                          // "&:hover": {
                          //   backgroundColor: "rgba(255, 255, 255, 1)",
                          // },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...field}
                            label="شهر یا فرودگاه مبدأ"
                            sx={{
                              border: "none", // Remove the border
                            }}
                            error={!!errors.origin}
                            helperText={errors?.origin?.message}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <FlightTakeoffIcon sx={{ color: "#c2c2c2" }} />
                              ),
                              endAdornment: (
                                <React.Fragment>
                                  {airportsLoading ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                        renderGroup={(params) => (
                          <li key={params.key}>
                            <GroupHeader>{params.group}</GroupHeader>
                            <GroupItems>{params.children}</GroupItems>
                          </li>
                        )}
                        renderOption={(props, option) => (
                          <li {...props}>
                            <Box
                              width={"100%"}
                              display={"flex"}
                              flexDirection={"column"}
                              gap={1}
                            >
                              <Box
                                width={"100%"}
                                display={"flex"}
                                justifyContent={"space-between"}
                              >
                                <Typography sx={{ fontSize: "12px" }}>
                                  {option.title_fa}
                                </Typography>
                                <Typography sx={{ fontSize: "12px" }}>
                                  {"(" + option.iata + ")"}
                                </Typography>
                              </Box>
                              <Divider component="li" />
                            </Box>
                          </li>
                        )}
                      />
                    )}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      zIndex: "2",
                      backgroundColor: "white",
                      "&:hover": {
                        backgroundColor: "#bdbdbd", // Change the background color on hover
                      },
                      border: "1px solid #c2c2c2",
                    }}
                    onClick={exchangeValues}
                  >
                    <LoopIcon />
                  </IconButton>
                  <Controller
                    name="destination"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        className="destination"
                        id="destination-autocomplete"
                        disableClearable
                        value={selectedDestination ? selectedDestination : null}
                        onChange={(e, value) => {
                          if (value) {
                            setSelectedDestination(value);
                            setValue("destination", value.title_fa);
                            trigger("destination");
                          }
                        }}
                        open={openDestination}
                        onOpen={() => {
                          setOpenDestination(true);
                        }}
                        onClose={() => {
                          setOpenDestination(false);
                        }}
                        groupBy={(option) => option.group_by}
                        getOptionLabel={(option) =>
                          `${option.title_fa} - ${option.iata}`
                        }
                        options={airports.map((option) => option)}
                        sx={{
                          width: "100%",
                          backgroundColor: "rgba(255, 255, 255, 0.6)",
                          // borderRadius: 8,
                          // "&:hover": {
                          //   backgroundColor: "rgba(255, 255, 255, 1)",
                          // },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...field}
                            label="شهر یا فرودگاه مقصد"
                            sx={{
                              border: "none", // Remove the border
                            }}
                            error={!!errors.destination}
                            helperText={errors?.destination?.message}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  <FlightLandIcon sx={{ color: "#c2c2c2" }} />
                                  {airportsLoading ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props}>
                            <Box
                              width={"100%"}
                              display={"flex"}
                              flexDirection={"column"}
                              gap={1}
                            >
                              <Box
                                width={"100%"}
                                display={"flex"}
                                justifyContent={"space-between"}
                              >
                                <Typography sx={{ fontSize: "12px" }}>
                                  {option.title_fa}
                                </Typography>
                                <Typography sx={{ fontSize: "12px" }}>
                                  {"(" + option.iata + ")"}
                                </Typography>
                              </Box>
                              <Divider component="li" />
                            </Box>
                          </li>
                        )}
                        renderGroup={(params) => (
                          <li key={params.key}>
                            <GroupHeader>{params.group}</GroupHeader>
                            <GroupItems>{params.children}</GroupItems>
                          </li>
                        )}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item lg={3} md={5} xs={12}>
                <CustomDateRangerComponent
                  rangeValues={rangeValues}
                  setRangeValues={setRangeValues}
                />
              </Grid>
              <Grid item lg={2} md={2} xs={12}>
                <Button
                  sx={{
                    width: "100%",
                    borderRadius: "4px",
                    minHeight: "53px",
                    border: "1px solid #acacac",
                    "&:hover": {
                      backgroundColor: "#bdbdbd", // Change the background color on hover
                    },
                  }}
                  variant="contained"
                  startIcon={<TravelExploreIcon />}
                  onClick={() => handleClickSubmitSearch()}
                >
                  بزن بــــریم!
                </Button>
              </Grid>
            </Grid>
          </Box>

          {(items.Went.length !== 0 ||
            items.Return.length !== 0 ||
            isEmpty) && (
            <Box
              style={{
                // backgroundImage: `url('./custom_assets/bg-online-shopping.svg')`,
                // backgroundColor: "#fafaf9",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100%",
                padding: "10px",
                borderRadius: "12px", // Adjust the border radius as needed
                overflow: "hidden", // Hide overflowing content
              }}
            >
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                  <Box
                    width={"100%"}
                    padding={"12px"}
                    className={"bg-gray-75-i"}
                    sx={{ borderRadius: "16px" }}
                  >
                    <Box
                      width={"100%"}
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      padding={"12px"}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        فیلتر ها
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {items.Went.length + items.Return.length} نتیجه
                      </Typography>
                    </Box>

                    <FilteredBox
                      key={tabValue}
                      flightAction={tabValue}
                      items={items}
                      setItems={setItems}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
                  {/* scroll calendar */}
                  {rangeValues.length !== 0 && (
                    <Box
                      width={"100%"}
                      display="flex"
                      justifyContent="center"
                      marginBottom={"20px"}
                    >
                      <ScrollCalendarComponent
                        rangeValues={rangeValues}
                        handleClickDay={handleClickDayScrollCalendar}
                      />
                    </Box>
                  )}
                  {/* end scroll calendar */}
                  {/* start tabs */}
                  <Box
                    sx={{
                      width: "100%",
                      bgcolor: "background.paper",
                      marginBottom: "20px",
                    }}
                  >
                    <Tabs
                      value={tabValue}
                      onChange={handleChangeTabs}
                      variant="fullWidth"
                      centered
                    >
                      <Tab
                        width="50%"
                        icon={<FlightTakeoffIcon />}
                        iconPosition="start"
                        sx={{ fontSize: "20px", textShadow: "0 0 3px" }}
                        label={"پرواز های رفت (" + items.Went.length + ")"}
                      />
                      <Tab
                        disabled={items.Return.length === 0}
                        width="50%"
                        icon={<FlightLandIcon />}
                        iconPosition="end"
                        sx={{ fontSize: "20px", textShadow: "0 0 3px" }}
                        label={"پرواز های برگشت (" + items.Return.length + ")"}
                      />
                    </Tabs>
                  </Box>
                  {/* end tabs */}
                  {isEmpty && (
                    <Box
                      display={"flex"}
                      width={"100%"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      flexDirection={"column"}
                    >
                      <Typography variant="h6">
                        متاسفیم! خیلی گشتیم نبود. نگرد نیست!
                      </Typography>
                      <br></br>
                      <img
                        width={"200px"}
                        src="assets/images/icons/not-avalaible-flight.png"
                      />
                    </Box>
                  )}
                  {tabValue === 0 &&
                    items.Went.map((item) => (
                      <FlightTicket
                        handleClickSubmitTicket={handleClickSubmitTicket}
                        item={item}
                        handleClickShowDetail={handleClickShowDetail}
                      />
                    ))}
                  {tabValue === 1 &&
                    items.Return.map((item) => (
                      <FlightTicket
                        handleClickSubmitTicket={handleClickSubmitTicket}
                        item={item}
                        handleClickShowDetail={handleClickShowDetail}
                      />
                    ))}
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        {/* end search box && items */}
        {/*  dialog */}
        <div style={{ with: "100%" }}>
          <BootstrapDialog
            onClose={handleClickCloseDialog}
            open={openDialog}
            fullWidth={true}
            maxWidth={"xl"}
          >
            <DialogTitle sx={{ m: 0, p: 2 }}>فرآیند خرید بلیط</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClickCloseDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers>
              {addedTickets.map((item, index) => (
                <BascketItem
                  item={item}
                  index={index}
                  length={addedTickets.length}
                  handleDeleteBasketItem={handleDeleteBasketItem}
                />
              ))}
            </DialogContent>
            <DialogActions>
              <Box>
                <Box>
                  <Button
                    // sx={{ width: "100px" }}
                    color="secondary"
                    onClick={handleClickConfirmAndNextStep}
                    variant="contained"
                  >
                    <span>تایید و ادامه فرآیند خرید</span>
                  </Button>
                </Box>
              </Box>
            </DialogActions>
          </BootstrapDialog>
        </div>
        {/* end  dialog */}
        {/* floating button */}
        <Box position={"fixed"} bottom={"50px"} right={"50px"}>
          <Badge badgeContent={addedTickets.length} color="secondary">
            <Fab
              onClick={handleClickOpenDialog}
              color="primary"
              disabled={addedTickets.length === 0}
            >
              <ShoppingCart />
            </Fab>
          </Badge>
        </Box>
        {/* end button */}
        {/* start detail dialog */}
        <Dialog
          open={openDetailDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDetailDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>جزئیات پرواز</DialogTitle>
          <DialogContent>
            <Box>
              <Box display={"flex"} gap={1}>
                <PersonOutlineOutlinedIcon />
                <Typography>
                  قیمت بزرگسال:{" "}
                  {detailSelected &&
                    formatInputWithCommas(
                      detailSelected.Financial.Adult.Payable.toString()
                    ) + " ریال"}
                </Typography>
              </Box>
              <Box display={"flex"} gap={1}>
                <ChildCareOutlinedIcon />
                <Typography>
                  قیمت کودک:{" "}
                  {detailSelected &&
                    formatInputWithCommas(
                      detailSelected.Financial.Child.Payable
                    ) + " ریال"}
                </Typography>
              </Box>
              <Box display={"flex"} gap={1}>
                <ChildFriendlyOutlinedIcon />
                <Typography>
                  قیمت نوزاد:{" "}
                  {detailSelected &&
                    formatInputWithCommas(
                      detailSelected.Financial.Infant.Payable
                    ) + " ریال"}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailDialog}>مشاهده شد</Button>
          </DialogActions>
        </Dialog>
        {/* end detail dialog */}
        {/* for service charge */}
        <ServicesChargeComponent />
        {/* end for service charge */}
      </Box>
    </>
  );
};

const BascketItem = ({ item, index, length, handleDeleteBasketItem }) => {
  const [adultCount, setAdultCount] = useState(item.Classes.Passengers.Adult);
  const [childCount, setChildCount] = useState(item.Classes.Passengers.Child);
  const [infantCount, setInfantCount] = useState(
    item.Classes.Passengers.Infant
  );
  return (
    <>
      <Grid container spacing={2}>
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
          lg={10}
          xl={10}
          display={"flex"}
          justifyContent={"start"}
          alignItems={"center"}
        >
          <IconButton onClick={() => handleDeleteBasketItem(index)}>
            <DeleteIcon />
          </IconButton>
          <Typography>
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
              +item.FlightNumber.toString()}
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
          lg={2}
          xl={2}
          display={"flex"}
          justifyContent={"end"}
          alignItems={"center"}
          gap={2}
        >
          <TextField
            autoComplete="off"
            value={adultCount}
            onChange={(e) => {
              setAdultCount(e.target.value);
              item["Classes"]["Passengers"]["Adult"] = e.target.value;
            }}
            sx={{ width: "70px" }}
            type="number"
            min={0}
            dir="ltr"
            // label="بزرگسال"
            InputProps={{
              inputProps: {
                max: item.Classes.AvailableSeat,
                min: 0,
              },
              endAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineOutlinedIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
          <TextField
            autoComplete="off"
            value={childCount}
            onChange={(e) => {
              setChildCount(e.target.value);
              item["Classes"]["Passengers"]["Child"] = e.target.value;
            }}
            sx={{ width: "70px" }}
            type="number"
            min={0}
            dir="ltr"
            // label="کودک"
            InputProps={{
              inputProps: {
                max: item.Classes.AvailableSeat,
                min: 0,
              },
              endAdornment: (
                <InputAdornment position="start">
                  <ChildCareOutlinedIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
          <TextField
            autoComplete="off"
            sx={{ width: "70px" }}
            value={infantCount}
            onChange={(e) => {
              setInfantCount(e.target.value);
              item["Classes"]["Passengers"]["Infant"] = e.target.value;
            }}
            type="number"
            min={0}
            dir="ltr"
            // label="نوزاد"
            InputProps={{
              inputProps: {
                max: item.Classes.AvailableSeat,
                min: 0,
              },
              endAdornment: (
                <InputAdornment position="start">
                  <ChildFriendlyOutlinedIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </Grid>
      </Grid>
      {index + 1 !== length && (
        <Divider sx={{ marginTop: "15px" }} variant="middle" />
      )}
    </>
  );
};
