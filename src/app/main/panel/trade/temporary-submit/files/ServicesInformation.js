import { base_url } from "src/app/constant";
import UploadIcon from "@mui/icons-material/Upload";
import * as React from "react";
import axios from "axios";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import RouteIcon from "@mui/icons-material/Route";
import ApartmentIcon from "@mui/icons-material/Apartment";
import TourIcon from "@mui/icons-material/Tour";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import ExtensionIcon from "@mui/icons-material/Extension";
import { Box, Typography } from "@mui/material";
import { Alert, Card, Divider, Grid, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FlightIcon from "@mui/icons-material/Flight";
import TrainIcon from "@mui/icons-material/Train";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import KeyboardCapslockIcon from "@mui/icons-material/KeyboardCapslock";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import Fade from "@mui/material/Fade";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { styled, lighten, darken } from "@mui/system";
import {
  convertJalalitoMiladiDate,
  convertMiladiToJalaliDate,
} from "../../trade-managment/files/oprations/functions";
import { convertPersianToEnglishNumbers } from "../../trade-managment/files/oprations/functions";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";

//for validation schema
const schemaPath = yup.object().shape({
  origin: yup.string().required("باید یک مبدا وارد کنید"),
  destination: yup.string().required("باید یک مقصد وارد کنید"),
  colleague: yup.string().required("باید یک شرکت وارد کنید"),
  class: yup.string().required("باید یک کلاس وارد کنید"),
  flightNumber: yup.string().required("باید یک شماره پرواز وارد کنید"),
  datePath: yup
    .date()
    .typeError("فرمت تاریخ اشتباه است")
    .required("باید یک تاریخ وارد کنید"),
});

const schemaHotel = yup.object().shape({
  hotelName: yup.string().required("باید یک هتل وارد کنید"),
  hotelInDate: yup
    .date()
    .typeError("فرمت تاریخ اشتباه است")
    .required("باید یک تاریخ وارد کنید"),
  hotelOutDate: yup
    .date()
    .typeError("فرمت تاریخ اشتباه است")
    .required("باید یک تاریخ وارد کنید"),
});

const schemaTour = yup.object().shape({
  tourName: yup.string().required("باید یک تور وارد کنید"),
});

const schemaVisa = yup.object().shape({
  visaCountry: yup.string().required("باید یک کشور وارد کنید"),
  visaName: yup.string().required("باید یک ویزا وارد کنید"),
  visaStart: yup
    .date()
    .typeError("فرمت تاریخ اشتباه است")
    .required("باید یک تاریخ وارد کنید"),
  visaExpire: yup
    .date()
    .typeError("فرمت تاریخ اشتباه است")
    .required("باید یک تاریخ وارد کنید"),
});

const schemaInsurance = yup.object().shape({
  insuranceName: yup.string().required("باید یک بیمه وارد کنید"),
  insuranceStart: yup
    .date()
    .typeError("فرمت تاریخ اشتباه است")
    .required("باید یک تاریخ وارد کنید"),
  insuranceExpire: yup
    .date()
    .typeError("فرمت تاریخ اشتباه است")
    .required("باید یک تاریخ وارد کنید"),
});

const schemaServices = yup.object().shape({
  serviceName: yup.string().required("باید یک خدمت وارد کنید"),
});

const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};

const tab = "\xa0\xa0\xa0\xa0\xa0";
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const ServicesInformation = (props) => {
  const dispatch = useDispatch();
  // initial json
  const persons = props.personsJSON;
  // for pathes
  const [routes, setRoutes] = useState([]);

  const handleAddRoute = () => {
    setRoutes((prevRoutes) => [
      ...prevRoutes,
      {
        id: uuidv4(),
        validated: true,
        repeat_route: props.action === "opration" ? "single" : "multiple",
        type: "aircraft",
        origin: "",
        destination: "",
        date_time_path: "",
        company: "",
        flight_number: "",
        class: {
          iata: "Y",
          title_en: "Economy/Coach",
          title_fa: "",
          status: 1,
          selected: 2,
        },
        allowed_cargo: "",
        terminal: "",
      },
    ]);
  };

  const handleDeleteRoute = (id) => {
    setRoutes((prevRoutes) => prevRoutes.filter((route) => route.id !== id));
  };

  const handleChangePath = (id, action, value) => {
    routes.forEach((route) => {
      if (route.id === id) {
        route[action] = value;
      }
    });
  };

  //for hotels
  const [hotels, setHotels] = useState([]);

  const handleAddHotel = (action = "add", index = services.length - 1) => {
    if (action === "copy" && index >= 0) {
      setHotels((prevHotels) => {
        const hotelToCopy = prevHotels[index];
        const copiedHotel = { ...hotelToCopy, id: uuidv4() };
        return [...prevHotels, copiedHotel];
      });
    } else {
      setHotels((prevHotels) => [
        ...prevHotels,
        {
          id: uuidv4(),
          validated: true,
          hotel_in_date: "",
          hotel_out_date: "",
          hotel_in_time: "14:00",
          hotel_out_time: "12:00",
          addition_beds: "",
          description: "",
          hotel: "",
          room_rate: "",
          room_view: "",
          room_type: "",
          roommate: [],
        },
      ]);
    }
  };
  const handleDeleteHotel = (id) => {
    setHotels((prevHotels) => prevHotels.filter((hotel) => hotel.id !== id));
  };
  const handleChangeHotel = (id, action, value) => {
    hotels.forEach((hotel) => {
      if (hotel.id === id) {
        hotel[action] = value;
      }
    });
  };

  //for tours
  const [tours, setTours] = useState([]);

  const handleAddTour = () => {
    setTours((prevTours) => [
      ...prevTours,
      {
        id: uuidv4(),
        validated: false,
        description: "",
        tour: "",
      },
    ]);
  };

  const handleDeleteTour = (id) => {
    setTours((prevTours) => prevTours.filter((tour) => tour.id !== id));
  };

  const handleChangeTour = (id, action, value) => {
    tours.forEach((tour) => {
      if (tour.id === id) {
        tour[action] = value;
      }
    });
  };

  //for visas
  const [visas, setVisas] = useState([]);

  const handleAddVisa = () => {
    setVisas((prevVisas) => [
      ...prevVisas,
      {
        id: uuidv4(),
        validated: false,
        description: "",
        country: "",
        visa: "",
        visa_issuing: "",
        visa_ex: "",
        file: "",
      },
    ]);
  };

  const handleDeleteVisa = (id) => {
    setVisas((prevVisas) => prevVisas.filter((visa) => visa.id !== id));
  };

  const handleChangeVisa = (id, action, value) => {
    visas.forEach((visa) => {
      if (visa.id === id) {
        visa[action] = value;
      }
    });
  };
  //for insurance
  const [insurances, setInsurances] = useState([]);

  const handleAddInsurance = () => {
    setInsurances((prevInsurances) => [
      ...prevInsurances,
      {
        id: uuidv4(),
        validated: false,
        description: "",
        insurance: "",
        insurance_issuing: "",
        insurance_ex: "",
        file: "",
      },
    ]);
  };

  const handleDeleteInsurance = (id) => {
    setInsurances((prevInsurances) =>
      prevInsurances.filter((insurance) => insurance.id !== id)
    );
  };

  const handleChangeinsurance = (id, action, value) => {
    insurances.forEach((insurance) => {
      if (insurance.id === id) {
        insurance[action] = value;
      }
    });
  };
  //for services
  const [services, setServices] = useState([]);

  const handleAddService = (action = "add", index = services.length - 1) => {
    if (action === "copy" && index >= 0) {
      setServices((prevServices) => {
        const serviceToCopy = prevServices[index];
        const copiedService = { ...serviceToCopy, id: uuidv4() };
        return [...prevServices, copiedService];
      });
    } else {
      setServices((prevServices) => [
        ...prevServices,
        {
          id: uuidv4(),
          validated: false,
          description: "",
          service: "",
          file: "",
        },
      ]);
    }
  };

  const handleDeleteService = (id) => {
    setServices((prevServices) =>
      prevServices.filter((service) => service.id !== id)
    );
  };

  const handleChangeService = (id, action, value) => {
    services.forEach((service) => {
      if (service.id === id) {
        service[action] = value;
      }
    });
  };

  // for ServicesInformation
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmitNext = async () => {
    console.log(props.action);
    let inValid = false; // Initialize inValid to true

    if (routes.length !== 0) {
      for (const route of routes) {
        if (!route.validated) {
          inValid = {
            type: "route",
            title: "مسیر",
            section: 0,
          };
          break; // No need to continue checking
        }
      }
      for (const route of routes) {
        if (route.origin.id === route.destination.id) {
          inValid = {
            type: "route",
            title: "مسیر",
            section: 0,
          };
          break; // No need to continue checking
        }
      }
    }
    if (hotels.length !== 0) {
      for (const hotel of hotels) {
        if (!hotel.validated) {
          inValid = {
            type: "hotel",
            title: "هتل",
            section: 1,
          };
          break; // No need to continue checking
        }
      }
    }
    if (tours.length !== 0) {
      for (const tour of tours) {
        if (!tour.validated) {
          inValid = {
            type: "tour",
            title: "تور",
            section: 2,
          };
          break; // No need to continue checking
        }
      }
    }
    if (visas.length !== 0) {
      for (const visa of visas) {
        if (!visa.validated) {
          inValid = {
            type: "visa",
            title: "ویزا",
            section: 3,
          };
          break; // No need to continue checking
        }
      }
    }
    if (insurances.length !== 0) {
      for (const insurance of insurances) {
        if (!insurance.validated) {
          inValid = {
            type: "insurances",
            title: "بیمه",
            section: 4,
          };
          break; // No need to continue checking
        }
      }
    }
    if (services.length !== 0) {
      for (const service of services) {
        if (!service.validated) {
          inValid = {
            type: "services",
            title: "خدمات",
            section: 5,
          };
          break; // No need to continue checking
        }
      }
    }

    if (!inValid) {
      persons["routes"] = routes;
      persons["hotels"] = hotels;
      persons["tours"] = tours;
      persons["services"] = services;
      persons["insurances"] = insurances;
      persons["visas"] = visas;
      persons["onlines"] = props.online;
      await props.handleSetPersonsJSON(persons);
      props.setUpdate(!props.update);
      if (
        props.action === "online" ||
        !(
          routes.length === 0 &&
          hotels.length === 0 &&
          tours.length === 0 &&
          insurances.length === 0 &&
          visas.length === 0 &&
          services.length === 0
        )
      ) {
        props.handleNext();
      }
    } else {
      setValue(inValid.section);
      handleClickSnackBar(
        "در قسمت " + inValid.title + "باید تمامی فیلد ها را تکمیل کنید"
      );
    }
  };

  const handleSubmitBack = () => {
    props.handleBack();
  };

  //snackbar
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const handleClickSnackBar = (message) => {
    setOpenSnackBar(!openSnackBar);
    dispatch(
      showMessage({
        message: message, //text or html
        autoHideDuration: 6000, //ms
        anchorOrigin: {
          vertical: "top", //top bottom
          horizontal: "center", //left center right
        },
        variant: "error", //success error info warning null
      })
    );
  };
  // for check show tab

  function checkVisibility(type, incomeId, tabIndex) {
    const data = {
      route: [
        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1,
        1, 1,
      ],
      hotel: [
        1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1,
        1, 1,
      ],
      tour: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0,
        0, 0,
      ],
      visa: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1,
        1, 1,
      ],
      insurance: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,
        1, 1,
      ],
      service: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1,
        1, 1,
      ],
    };
    return data[type][incomeId];
  }

  function getFirstEnabledTabIndex(incomeId) {
    const visibilities = [
      1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 5, 5, 0, 0, 3, 3, 0, 0, 0,
      0,
    ];
    return visibilities[incomeId];
  }

  useEffect(() => {
    const initialTabIndex = getFirstEnabledTabIndex(persons.income_id);
    setValue(initialTabIndex);
  }, [persons]);
  return (
    <>
      <Card sx={{ margin: "10px", padding: "15px" }}>
        <Box display={"flex"} justifyContent={"center"} marginBottom={5}>
          <Tabs
            value={value}
            variant="scrollable"
            onChange={handleChange}
            aria-label="icon label tabs example"
          >
            <Tab
              disabled={!checkVisibility("route", persons.income_id, 0)}
              icon={<RouteIcon />}
              label="مسیرها"
            />
            <Tab
              disabled={!checkVisibility("hotel", persons.income_id, 1)}
              icon={<ApartmentIcon />}
              label="هتل‌ها"
            />
            <Tab
              disabled={true}
              // disabled={!checkVisibility("tour", persons.income_id, 2)}
              icon={<TourIcon />}
              label="تورها"
            />
            <Tab
              disabled={!checkVisibility("visa", persons.income_id, 3)}
              icon={<SubtitlesIcon />}
              label="ویزاها"
            />
            <Tab
              disabled={!checkVisibility("insurance", persons.income_id, 4)}
              icon={<LoyaltyIcon />}
              label="بیمه‌ها"
            />
            <Tab
              disabled={!checkVisibility("service", persons.income_id, 5)}
              icon={<ExtensionIcon />}
              label="خدمات"
            />
          </Tabs>
        </Box>
        <Box>
          {/* PATHES   */}
          <Box display={value == 0 ? "" : "none"}>
            {routes.length === 0 ? (
              <Box
                sx={{ cursor: "pointer" }}
                onClick={handleAddRoute}
                padding={"25px"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={1}
              >
                <Typography>جهت افزودن آیتم کلیک کنید</Typography>
                <img
                  style={{ width: "50px" }}
                  src="./custom_assets/add_item.svg"
                />
              </Box>
            ) : (
              routes.map((route, index) => (
                <Path
                  key={route.id}
                  id={route.id}
                  onDelete={handleDeleteRoute}
                  counter={index + 1}
                  handleChangePath={handleChangePath}
                  openSnackBar={openSnackBar}
                  persons={persons}
                  action={props.action}
                />
              ))
            )}

            <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
            <Box display={"flex"} justifyContent={"space-between"}>
              <Button
                onClick={handleAddRoute}
                size="large"
                variant="outlined"
                startIcon={<AddIcon />}
              >
                {tab + "افزودن"}
              </Button>

              <Box display={"flex"} gap={"5px"}>
                {props.action !== "opration" && (
                  <Button
                    onClick={handleSubmitBack}
                    size="large"
                    variant="contained"
                  >
                    قبلی
                  </Button>
                )}

                <Button
                  onClick={handleSubmitNext}
                  size="large"
                  variant="contained"
                  color="secondary"
                >
                  بعدی
                </Button>
              </Box>
            </Box>
          </Box>
          {/* HOTELS */}
          <Box display={value == 1 ? "" : "none"}>
            {hotels.length === 0 ? (
              <Box
                sx={{ cursor: "pointer" }}
                onClick={handleAddHotel}
                padding={"25px"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={1}
              >
                <Typography>جهت افزودن آیتم کلیک کنید</Typography>
                <img
                  style={{ width: "50px" }}
                  src="./custom_assets/add_item.svg"
                />
              </Box>
            ) : (
              hotels.map((hotel, index) => (
                <Hotel
                  item={hotel}
                  key={hotel.id}
                  id={hotel.id}
                  onDelete={handleDeleteHotel}
                  counter={index + 1}
                  handleChangeHotel={handleChangeHotel}
                  openSnackBar={openSnackBar}
                  persons={persons}
                  handleAddHotel={handleAddHotel}
                />
              ))
            )}
            <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
            <Box display={"flex"} justifyContent={"space-between"}>
              <Button
                onClick={handleAddHotel}
                size="large"
                variant="outlined"
                startIcon={<AddIcon />}
              >
                {tab + "افزودن"}
              </Button>

              <Box display={"flex"} gap={"5px"}>
                {props.action !== "opration" && (
                  <Button
                    onClick={handleSubmitBack}
                    size="large"
                    variant="contained"
                  >
                    قبلی
                  </Button>
                )}

                <Button
                  onClick={handleSubmitNext}
                  size="large"
                  variant="contained"
                  color="secondary"
                >
                  بعدی
                </Button>
              </Box>
            </Box>
          </Box>
          {/* TOUR */}
          <Box display={value == 2 ? "" : "none"}>
            {tours.length === 0 ? (
              <Box
                sx={{ cursor: "pointer" }}
                onClick={handleAddTour}
                padding={"25px"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={1}
              >
                <Typography>جهت افزودن آیتم کلیک کنید</Typography>
                <img
                  style={{ width: "50px" }}
                  src="./custom_assets/add_item.svg"
                />
              </Box>
            ) : (
              tours.map((tour, index) => (
                <Tour
                  key={tour.id}
                  id={tour.id}
                  onDelete={handleDeleteTour}
                  counter={index + 1}
                  handleChange={handleChangeTour}
                  openSnackBar={openSnackBar}
                />
              ))
            )}
            <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
            <Box display={"flex"} justifyContent={"space-between"}>
              <Button
                onClick={handleAddTour}
                size="large"
                variant="outlined"
                startIcon={<AddIcon />}
              >
                {tab + "افزودن"}
              </Button>

              <Box display={"flex"} gap={"5px"}>
                {props.action !== "opration" && (
                  <Button
                    onClick={handleSubmitBack}
                    size="large"
                    variant="contained"
                  >
                    قبلی
                  </Button>
                )}

                <Button
                  onClick={handleSubmitNext}
                  size="large"
                  variant="contained"
                  color="secondary"
                >
                  بعدی
                </Button>
              </Box>
            </Box>
          </Box>
          {/* VISA */}
          <Box display={value == 3 ? "" : "none"}>
            {visas.length === 0 ? (
              <Box
                sx={{ cursor: "pointer" }}
                onClick={handleAddVisa}
                padding={"25px"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={1}
              >
                <Typography>جهت افزودن آیتم کلیک کنید</Typography>
                <img
                  style={{ width: "50px" }}
                  src="./custom_assets/add_item.svg"
                />
              </Box>
            ) : (
              visas.map((visa, index) => (
                <Visa
                  key={visa.id}
                  id={visa.id}
                  onDelete={handleDeleteVisa}
                  counter={index + 1}
                  handleChange={handleChangeVisa}
                  openSnackBar={openSnackBar}
                />
              ))
            )}
            <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
            <Box display={"flex"} justifyContent={"space-between"}>
              <Button
                onClick={handleAddVisa}
                size="large"
                variant="outlined"
                startIcon={<AddIcon />}
              >
                {tab + "افزودن"}
              </Button>

              <Box display={"flex"} gap={"5px"}>
                {props.action !== "opration" && (
                  <Button
                    onClick={handleSubmitBack}
                    size="large"
                    variant="contained"
                  >
                    قبلی
                  </Button>
                )}

                <Button
                  onClick={handleSubmitNext}
                  size="large"
                  variant="contained"
                  color="secondary"
                >
                  بعدی
                </Button>
              </Box>
            </Box>
          </Box>
          {/* INSURANCE */}
          <Box display={value == 4 ? "" : "none"}>
            {insurances.length === 0 ? (
              <Box
                sx={{ cursor: "pointer" }}
                onClick={handleAddInsurance}
                padding={"25px"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={1}
              >
                <Typography>جهت افزودن آیتم کلیک کنید</Typography>
                <img
                  style={{ width: "50px" }}
                  src="./custom_assets/add_item.svg"
                />
              </Box>
            ) : (
              insurances.map((insurance, index) => (
                <Insurance
                  openSnackBar={openSnackBar}
                  key={insurance.id}
                  id={insurance.id}
                  onDelete={handleDeleteInsurance}
                  counter={index + 1}
                  handleChange={handleChangeinsurance}
                />
              ))
            )}
            <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
            <Box display={"flex"} justifyContent={"space-between"}>
              <Button
                onClick={handleAddInsurance}
                size="large"
                variant="outlined"
                startIcon={<AddIcon />}
              >
                {tab + "افزودن"}
              </Button>

              <Box display={"flex"} gap={"5px"}>
                {props.action !== "opration" && (
                  <Button
                    onClick={handleSubmitBack}
                    size="large"
                    variant="contained"
                  >
                    قبلی
                  </Button>
                )}

                <Button
                  onClick={handleSubmitNext}
                  size="large"
                  variant="contained"
                  color="secondary"
                >
                  بعدی
                </Button>
              </Box>
            </Box>
          </Box>
          {/* SERVICES */}
          <Box display={value == 5 ? "" : "none"}>
            {services.length === 0 ? (
              <Box
                sx={{ cursor: "pointer" }}
                onClick={handleAddService}
                padding={"25px"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={1}
              >
                <Typography>جهت افزودن آیتم کلیک کنید</Typography>
                <img
                  style={{ width: "50px" }}
                  src="./custom_assets/add_item.svg"
                />
              </Box>
            ) : (
              services.map((service, index) => (
                <Services
                  item={service}
                  key={service.id}
                  id={service.id}
                  onDelete={handleDeleteService}
                  counter={index + 1}
                  handleChange={handleChangeService}
                  openSnackBar={openSnackBar}
                  handleAddService={handleAddService}
                />
              ))
            )}

            <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
            <Box display={"flex"} justifyContent={"space-between"}>
              <Button
                onClick={() => handleAddService()}
                size="large"
                variant="outlined"
                startIcon={<AddIcon />}
              >
                {tab + "افزودن"}
              </Button>

              <Box display={"flex"} gap={"5px"}>
                {props.action !== "opration" && (
                  <Button
                    onClick={handleSubmitBack}
                    size="large"
                    variant="contained"
                  >
                    قبلی
                  </Button>
                )}

                <Button
                  onClick={handleSubmitNext}
                  size="large"
                  variant="contained"
                  color="secondary"
                >
                  بعدی
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default ServicesInformation;
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
const Path = ({
  id,
  onDelete,
  counter,
  handleChangePath,
  openSnackBar,
  persons,
  action,
}) => {
  const langDirection = useSelector(selectCurrentLanguage);
  const [route, setRoute] = React.useState("aircraft");
  const handleRoutes = (event, newRoute) => {
    if (newRoute !== null) {
      setKeyOrigin(!keyOrigin);
      setKeyDestination(!keyDestination);
      setKeyClass(!keyClass);
      setKeyColligue(!keyColligue);
      handleChangePath(id, "type", newRoute);
      setOriginAirports([]);
      // setEmptyOrigin("");
      setValue("origin", "");
      trigger("origin");
      // setEmptyDestination("");
      setValue("destination", "");
      trigger("destination");
      setColleagues([]);
      // setEmptyColligue("");
      setValue("colleague", "");
      trigger("colleague");
      setRoute(newRoute);
      if (newRoute == "train" || newRoute == "bus") {
        handleChangePath(id, "class", "");
        setValue("class", "optional");
        setEmptyFlight("");
        handleChangePath(id, "flight_number", "");
        setValue("flightNumber", "optional");
        setDissableInput(true);
        trigger();
      } else {
        handleChangePath(id, "class", "");
        setValue("class", "");
        setEmptyFlight("");
        handleChangePath(id, "flight_number", "");
        setValue("flightNumber", "");
        trigger();
        setDissableInput(false);
      }
    }
  };
  const [repeatRoute, setRepeatRoute] = React.useState(
    action === "opration" ? "single" : "multiple"
  );
  const handleRepeatRoute = (event, newRoute) => {
    if (newRoute !== null) {
      setRepeatRoute(newRoute);
      handleChangePath(id, "repeat_route", newRoute);
    }
  };
  //class for dissable
  const [dissableInp, setDissableInput] = useState(false);
  //for set empty autocompelete
  const [keyOrigin, setKeyOrigin] = useState(false);
  const [keyDestination, setKeyDestination] = useState(false);
  const [keyClass, setKeyClass] = useState(false);
  const [keyColligue, setKeyColligue] = useState(false);
  const [emptyFlightValue, setEmptyFlight] = useState("");
  //for validate
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    // defaultValues,
    resolver: yupResolver(schemaPath),
  });
  const { isValid, errors } = formState;
  const handleValidityChange = () => {
    handleChangePath(id, "validated", isValid);
  };
  useEffect(() => {
    handleValidityChange();
  }, [isValid]);
  useEffect(() => {
    if (openSnackBar) trigger();
  }, [openSnackBar]);
  //for airports's name
  const [originAirports, setOriginAirports] = useState([]);
  const [openOriginAirports, setOpenOriginAirports] = useState(false);
  const [originAirportsLoading, setOriginAirportsLoading] = useState(false);
  const [openDestinationAirports, setOpenDestinationAirports] = useState(false);
  // const [destaniationAirportsLoading, setDestaniationAirportsLoading] = useState(false);
  function getOriginAirports() {
    if (route === "aircraft") {
      setOriginAirportsLoading(true);
      axios
        .post(base_url + "/v2/get_titels", {
          lang: langDirection,
          table: "airport",
          route: persons.internal ? "1" : "2",
          access_token: getAccessToken(),
        })
        .then((response) => {
          // Handle the successful response
          setOriginAirports(response.data.data.titles);
          setOriginAirportsLoading(false);
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error creating item:", error);
        });
    } else {
      setOriginAirportsLoading(true);
      axios
        .post(base_url + "/v2/get_titels", {
          lang: langDirection,
          table: "city",
          route: "2",
          access_token: getAccessToken(),
        })
        .then((response) => {
          // Handle the successful response
          setOriginAirports(response.data.data.titles);
          setOriginAirportsLoading(false);
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error creating item:", error);
        });
    }
  }
  useEffect(() => {
    if (openOriginAirports) {
      getOriginAirports();
    }
  }, [openOriginAirports]);
  useEffect(() => {
    if (openDestinationAirports) {
      getOriginAirports();
    }
  }, [openDestinationAirports]);
  // for colleague's name
  const [colleagues, setColleagues] = useState([]);
  const [openColleagues, setOpenColleagues] = useState(false);
  const [colleaguesLoading, setColleaguesLoading] = useState(false);
  function getCplleagues() {
    setColleaguesLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: langDirection,
        table: "colleague",
        action: route,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setColleagues(response.data.data.titles);
        setColleaguesLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openColleagues) {
      getCplleagues();
    }
  }, [openColleagues]);
  // for classe's name
  const [classes, setClasses] = useState([]);
  const [openClasses, setOpenClasses] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  function getClasses() {
    setClassesLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: langDirection,
        table: "aircraft",
        action: "class",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setClasses(response.data.data.titles);
        setClassesLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openClasses) {
      getClasses();
    }
  }, [openClasses]);

  //default class
  const [defaultClass, setDefaultClass] = useState({
    iata: "Y",
    title_en: "Economy/Coach",
    title_fa: "",
    status: 1,
    selected: 2,
  });
  useEffect(() => {
    setValue("class", defaultClass.title_en);
  }, []);

  return (
    <>
      <Fade in={true}>
        <Box marginTop={5}>
          <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
          <Box display={"flex"} alignItems={"center"}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Box
                elevation={0}
                sx={{
                  width: "100px",
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography sx={{ fontSize: "18px" }} variant="h1">
                    {counter}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => onDelete(id)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            <Grid spacing={1} container>
              <Grid item xl={12} xs={12} md={12}>
                <Paper
                  elevation={0}
                  sx={{
                    width: "280px",
                    display: "flex",
                    justifyContent: "center",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    flexWrap: "wrap",
                  }}
                >
                  <StyledToggleButtonGroup
                    size="small"
                    value={repeatRoute}
                    exclusive
                    onChange={handleRepeatRoute}
                    aria-label="text alignment"
                  >
                    <ToggleButton value="single" aria-label="left aligned">
                      <Tooltip title="بلیط برای یک مسافر">
                        <KeyboardCapslockIcon />
                      </Tooltip>
                    </ToggleButton>

                    <ToggleButton
                      // disabled={action === "opration"}
                      value="multiple"
                      aria-label="centered"
                    >
                      <Tooltip title="بلیط برای همه مسافرین">
                        <KeyboardDoubleArrowUpIcon />
                      </Tooltip>
                    </ToggleButton>
                  </StyledToggleButtonGroup>
                  <Divider
                    flexItem
                    orientation="vertical"
                    sx={{ mx: 0.5, my: 1 }}
                  />
                  <StyledToggleButtonGroup
                    size="small"
                    value={route}
                    exclusive
                    onChange={handleRoutes}
                    aria-label="text alignment"
                  >
                    <ToggleButton value="aircraft" aria-label="left aligned">
                      <Tooltip title="بلیط هواپیما">
                        <FlightIcon />
                      </Tooltip>
                    </ToggleButton>

                    <ToggleButton value="train" aria-label="centered">
                      <Tooltip title="بلیط قطار">
                        <TrainIcon />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="bus" aria-label="right aligned">
                      <Tooltip title="بلیط اتوبوس">
                        <DirectionsBusIcon />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton
                      disabled
                      value="sea"
                      aria-label="right aligned"
                    >
                      <Tooltip title="سفر دریایی">
                        <DirectionsBoatIcon />
                      </Tooltip>
                    </ToggleButton>
                  </StyledToggleButtonGroup>
                </Paper>
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="origin"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      key={keyOrigin}
                      // inputValue={emptyOriginValue}
                      open={openOriginAirports}
                      onOpen={() => {
                        setOpenOriginAirports(true);
                      }}
                      onClose={() => {
                        setOpenOriginAirports(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          // setEmptyOrigin(value.title_fa);
                          handleChangePath(id, "origin", value);
                          setValue("origin", value.title_fa);
                          trigger("origin");
                        } else {
                          // setEmptyOrigin("");
                          handleChangePath(id, "origin", "");
                          setValue("origin", "");
                          trigger("origin");
                        }
                      }}
                      groupBy={(option) => option.group_by}
                      getOptionLabel={(option) =>
                        `${option.title_fa} - ${option.iata}`
                      }
                      options={originAirports.map((option) => option)}
                      isOptionEqualToValue={(option, value) =>
                        option === value || value === ""
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="مبدا"
                          required
                          error={!!errors.origin}
                          helperText={errors?.origin?.message}
                          Autocomplete="off"
                          onChange={(e) => {
                            field.onChange(e);
                            // setEmptyOrigin(e.target.value);
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {originAirportsLoading ? (
                                  <CircularProgress color="inherit" size={20} />
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
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="destination"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      key={keyDestination}
                      open={openDestinationAirports}
                      onOpen={() => {
                        setOpenDestinationAirports(true);
                      }}
                      onClose={() => {
                        setOpenDestinationAirports(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          // setEmptyDestination(value.title_fa);
                          handleChangePath(id, "destination", value);
                          setValue("destination", value.title_fa);
                          trigger("destination");
                        } else {
                          // setEmptyDestination("");
                          handleChangePath(id, "destination", "");
                          setValue("destination", "");
                          trigger("destination");
                        }
                      }}
                      groupBy={(option) => option.group_by}
                      getOptionLabel={(option) =>
                        `${option.title_fa} - ${option.iata}`
                      }
                      options={originAirports.map((option) => option)}
                      isOptionEqualToValue={(option, value) =>
                        option === value || value === ""
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="مقصد"
                          required
                          error={!!errors.destination}
                          helperText={errors?.destination?.message}
                          Autocomplete="off"
                          onChange={(e) => {
                            field.onChange(e);
                            // setEmptyDestination(e.target.value);
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {originAirportsLoading ? (
                                  <CircularProgress color="inherit" size={20} />
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
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="datePath"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                      <DateTimePicker
                        {...field}
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                        ampm={false}
                        sx={{ width: "100%" }}
                        required
                        label="زمان حرکت*"
                        color="primary"
                        onChange={(value) => {
                          field.onChange(value);
                          const options = {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            // second: "2-digit",
                          };
                          const formattedDate = value
                            ? value.toLocaleString("fa-IR", options)
                            : null;
                          handleChangePath(
                            id,
                            "date_time_path",
                            convertPersianToEnglishNumbers(formattedDate)
                          );
                        }}
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="colleague"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      key={keyColligue}
                      open={openColleagues}
                      onOpen={() => {
                        setOpenColleagues(true);
                      }}
                      onClose={() => {
                        setOpenColleagues(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          // setEmptyColligue(value.title_fa);
                          handleChangePath(id, "company", value);
                          setValue("colleague", value.title_fa);
                          trigger("colleague");
                        } else {
                          // setEmptyColligue("");
                          handleChangePath(id, "company", "");
                          setValue("colleague", "");
                          trigger("colleague");
                        }
                      }}
                      getOptionLabel={(option) => option.title_fa}
                      options={colleagues.map((option) => option)}
                      isOptionEqualToValue={(option, value) =>
                        option === value || value === ""
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="شرکت"
                          required
                          error={!!errors.colleague}
                          helperText={errors?.colleague?.message}
                          Autocomplete="off"
                          onChange={(e) => {
                            // setEmptyColligue(e.target.value);
                            field.onChange(e);
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {colleaguesLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={1} xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  label="ترمینال"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    handleChangePath(id, "terminal", e.target.value);
                  }}
                />
              </Grid>
              <Grid item xl={1} xs={12} md={6}>
                <Controller
                  name="flightNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled={dissableInp}
                      value={emptyFlightValue}
                      sx={{ width: "100%" }}
                      required
                      dir="ltr"
                      error={!!errors.flightNumber}
                      helperText={errors?.flightNumber?.message}
                      Autocomplete="off"
                      label="شماره پرواز"
                      variant="outlined"
                      color="primary"
                      onChange={(e) => {
                        field.onChange(e);
                        setEmptyFlight(e.target.value);
                        handleChangePath(id, "flight_number", e.target.value);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={1} xs={12} md={6}>
                <Controller
                  name="class"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={defaultClass}
                      key={keyClass}
                      disabled={dissableInp}
                      open={openClasses}
                      onOpen={() => {
                        setOpenClasses(true);
                      }}
                      onClose={() => {
                        setOpenClasses(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          setDefaultClass(value);
                          handleChangePath(id, "class", value);
                          setValue("class", value.title_en);
                          trigger("class");
                        } else {
                          setDefaultClass({
                            iata: "",
                            title_en: "",
                          });
                          handleChangePath(id, "class", "");
                          setValue("class", "");
                          trigger("class");
                        }
                      }}
                      getOptionLabel={(option) => option.iata}
                      options={classes.map((option) => option)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="کلاس"
                          dir="ltr"
                          required
                          error={!!errors.class}
                          helperText={errors?.class?.message}
                          Autocomplete="off"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {classesLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.key}>
                          <Box
                            width={"100%"}
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            {option.iata} - {option.title_en}
                          </Box>
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={1} xs={12} md={6}>
                <TextField
                  disabled={dissableInp}
                  sx={{ width: "100%" }}
                  label="بار مجاز"
                  type="number"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    handleChangePath(id, "allowed_cargo", e.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </>
  );
};

const Hotel = ({
  id,
  onDelete,
  counter,
  handleChangeHotel,
  openSnackBar,
  persons,
  item,
  handleAddHotel,
}) => {
  const langDirection = useSelector(selectCurrentLanguage);

  //start for default cop value
  const [defaultCopyValueHotel, setDefaultCopyValueHotel] = useState(
    item.hotel ? item.hotel : null
  );
  const [defaultCopyValueHotelInTime, setDefaultCopyValueHotelInTime] =
    useState(dayjs(item.hotel_in_time, "HH:mm"));
  const [defaultCopyValueHotelOutTime, setDefaultCopyValueHotelOutTime] =
    useState(dayjs(item.hotel_out_time, "HH:mm"));
  const [defaultCopyValueAdditionBeds, setDefaultCopyValueAdditionBeds] =
    useState(item.addition_beds ? item.addition_beds : "");
  const [defaultCopyValueDescription, setDefaultCopyValueDescription] =
    useState(item.description ? item.description : "");
  const [defaultCopyValueRoomRate, setDefaultCopyValueRoomRate] = useState(
    item.room_rate ? item.room_rate : ""
  );
  const [defaultCopyValueRoomView, setDefaultCopyValueRoomView] = useState(
    item.room_view ? item.room_view : null
  );
  const [defaultCopyValueRoomType, setDefaultCopyValueRoomType] = useState(
    item.room_type ? item.room_type : null
  );
  const [defaultCopyValueRoommate, setDefaultCopyValueRoommate] = useState(
    item.roommate ? item.roommate : null
  );
  //end for default copy value

  //for hotel's name
  const [openHotels, setOpenHotels] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  function getHotels() {
    setHotelsLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: langDirection,
        table: "hotel",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setHotels(response.data.data.titles);
        setHotelsLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openHotels) {
      getHotels();
    }
  }, [openHotels]);
  //for rooms's type
  const [openRoomTypes, setOpenRoomTypes] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypesLoading, setRoomTypesLoading] = useState(false);
  function getRoomTypes() {
    setRoomTypesLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: langDirection,
        table: "hotel_title",
        action: "room_type",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setRoomTypes(response.data.data.titles);
        setRoomTypesLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openRoomTypes) {
      getRoomTypes();
    }
  }, [openRoomTypes]);

  //for rooms's rate
  const [openRoomRates, setOpenRoomRates] = useState(false);
  const [roomRates, setRoomRates] = useState([]);
  const [roomRatesLoading, setRoomRatesLoading] = useState(false);
  function getRoomRates() {
    setRoomRatesLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: langDirection,
        table: "hotel_title",
        action: "room_rate",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setRoomRates(response.data.data.titles);
        setRoomRatesLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openRoomRates) {
      getRoomRates();
    }
  }, [openRoomRates]);
  //for rooms's view
  const [openRoomViews, setOpenRoomViews] = useState(false);
  const [roomViews, setRoomViews] = useState([]);
  const [roomViewsLoading, setRoomViewsLoading] = useState(false);
  function getRoomViews() {
    setRoomViewsLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: langDirection,
        table: "hotel_title",
        action: "room_view",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setRoomViews(response.data.data.titles);
        setRoomViewsLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openRoomViews) {
      getRoomViews();
    }
  }, [openRoomViews]);
  // for date ranger
  const [startDate, setStartDate] = useState(
    item.hotel_in_date ? convertJalalitoMiladiDate(item.hotel_in_date) : null
  );
  const [endDate, setEndDate] = useState(
    item.hotel_out_date ? convertJalalitoMiladiDate(item.hotel_out_date) : null
  );
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  //for validate
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    // defaultValues,
    resolver: yupResolver(schemaHotel),
  });
  const { isValid, errors } = formState;
  const handleValidityChange = () => {
    handleChangeHotel(id, "validated", isValid);
  };
  useEffect(() => {
    handleValidityChange();
  }, [isValid]);
  useEffect(() => {
    if (openSnackBar) trigger();
  }, [openSnackBar]);
  //setvalue for copied items
  useEffect(() => {
    if (counter !== 1) {
      item.hotel ? setValue("hotelName", item.hotel.title) : "";
      item.hotel_in_date
        ? setValue("hotelInDate", convertJalalitoMiladiDate(item.hotel_in_date))
        : null;
      item.hotel_out_date
        ? setValue(
            "hotelOutDate",
            convertJalalitoMiladiDate(item.hotel_in_date)
          )
        : null;
      trigger();
      handleValidityChange();
    }
  }, []);
  return (
    <>
      <Fade in={true}>
        <Box marginTop={5}>
          <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
          <Box display={"flex"} alignItems={"center"}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Box
                elevation={0}
                sx={{
                  width: "100px",
                  display: "flex",
                  justifyContent: "space-evenly",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography sx={{ fontSize: "18px" }} variant="h1">
                    {counter}
                  </Typography>
                  <IconButton
                    onClick={() => handleAddHotel("copy", counter - 1)}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
              <IconButton onClick={() => onDelete(id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid spacing={1} container>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="hotelName"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={defaultCopyValueHotel}
                      open={openHotels}
                      onOpen={() => {
                        setOpenHotels(true);
                      }}
                      onClose={() => {
                        setOpenHotels(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          setDefaultCopyValueHotel(value);
                          setValue("hotelName", value.title);
                          trigger("hotelName");
                          handleChangeHotel(id, "hotel", value);
                        } else {
                          setDefaultCopyValueHotel(null);
                          setValue("hotelName", "");
                          trigger("hotelName");
                          handleChangeHotel(id, "hotel", "");
                        }
                      }}
                      groupBy={(option) => `${option.country}-${option.state}`}
                      getOptionLabel={(option) => option.title}
                      options={hotels.map((option) => option)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="هتل"
                          required
                          error={!!errors.hotelName}
                          helperText={errors?.hotelName?.message}
                          Autocomplete="off"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {hotelsLoading ? (
                                  <CircularProgress color="inherit" size={20} />
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
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                {/* start date */}
                <Controller
                  name="hotelInDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider
                      sx={{ width: "100%" }}
                      dateAdapter={AdapterDateFnsJalali}
                    >
                      <DatePicker
                        {...field}
                        sx={{ width: "100%" }}
                        disablePast
                        views={["year", "month", "day"]}
                        label="ورود"
                        disableClearable
                        value={startDate}
                        onChange={(value) => {
                          field.onChange(value);
                          handleStartDateChange();
                          const options = {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          };
                          const formattedDate = value
                            ? value.toLocaleDateString("fa-IR", options)
                            : null;
                          handleChangeHotel(
                            id,
                            "hotel_in_date",
                            convertPersianToEnglishNumbers(formattedDate)
                          );
                          setStartDate(value);
                        }}
                        maxDate={endDate} // Set the maximum date to the selected end date
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                {/* start time */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeField
                    sx={{ width: "100%" }}
                    ampm={false}
                    dir="ltr"
                    label="ساعت ورود"
                    value={defaultCopyValueHotelInTime}
                    disableClearable
                    onChange={(value) => {
                      handleChangeHotel(
                        id,
                        "hotel_in_time",
                        value.format("HH:mm")
                      );
                      setDefaultCopyValueHotelInTime(
                        dayjs(value.format("HH:mm"), "HH:mm")
                      );
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                {/* end date */}
                <Controller
                  name="hotelOutDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider
                      sx={{ width: "100%" }}
                      dateAdapter={AdapterDateFnsJalali}
                    >
                      <DatePicker
                        {...field}
                        sx={{ width: "100%" }}
                        views={["year", "month", "day"]}
                        label="خروج"
                        disableClearable
                        value={endDate}
                        onChange={(value) => {
                          field.onChange(value);
                          handleEndDateChange();
                          const options = {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          };
                          const formattedDate = value
                            ? value.toLocaleDateString("fa-IR", options)
                            : null;
                          handleChangeHotel(
                            id,
                            "hotel_out_date",
                            convertPersianToEnglishNumbers(formattedDate)
                          );
                          setEndDate(value);
                        }}
                        minDate={startDate} // Set the minimum date to the selected start date
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                {/* end time */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeField
                    sx={{ width: "100%" }}
                    ampm={false}
                    dir="ltr"
                    label="ساعت خروج"
                    disableClearable
                    value={defaultCopyValueHotelOutTime}
                    onChange={(value) => {
                      handleChangeHotel(
                        id,
                        "hotel_out_time",
                        value.format("HH:mm")
                      );
                      setDefaultCopyValueHotelOutTime(
                        dayjs(value.format("HH:mm"), "HH:mm")
                      );
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Autocomplete
                  value={defaultCopyValueRoomType}
                  open={openRoomTypes}
                  onOpen={() => {
                    setOpenRoomTypes(true);
                  }}
                  onClose={() => {
                    setOpenRoomTypes(false);
                  }}
                  onChange={(e, value) => {
                    if (value) {
                      setDefaultCopyValueRoomType(value);
                      handleChangeHotel(id, "room_type", value);
                    } else {
                      setDefaultCopyValueRoomType(null);
                      handleChangeHotel(id, "room_type", "");
                    }
                  }}
                  disableClearable
                  getOptionLabel={(option) => option.title_fa}
                  options={roomTypes.map((option) => option)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="نوع اتاق"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {roomTypesLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Autocomplete
                  value={defaultCopyValueRoomRate}
                  // freeSolo
                  open={openRoomRates}
                  onOpen={() => {
                    setOpenRoomRates(true);
                  }}
                  onClose={() => {
                    setOpenRoomRates(false);
                  }}
                  onChange={(e, value) => {
                    // handleChangeHotel(id, "room_rate", value);
                    if (value) {
                      setDefaultCopyValueRoomRate(value);
                      handleChangeHotel(id, "room_rate", value);
                    } else {
                      setDefaultCopyValueRoomRate("");
                      handleChangeHotel(id, "room_rate", "");
                    }
                  }}
                  getOptionLabel={(option) => option}
                  options={roomRates.map((option) => option.title_fa)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="درجه اتاق"
                      // onChange={(e) => {
                      //   handleChangeHotel(id, "room_rate", e.target.value);
                      // }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {roomRatesLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={1} xs={12} md={6}>
                <TextField
                  value={defaultCopyValueAdditionBeds}
                  sx={{ width: "100%" }}
                  label="تخت اضافی"
                  variant="outlined"
                  dir="ltr"
                  color="primary"
                  type="number"
                  onChange={(e) => {
                    setDefaultCopyValueAdditionBeds(e.target.value);
                    handleChangeHotel(id, "addition_beds", e.target.value);
                  }}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Autocomplete
                  value={defaultCopyValueRoomView}
                  open={openRoomViews}
                  onOpen={() => {
                    setOpenRoomViews(true);
                  }}
                  onClose={() => {
                    setOpenRoomViews(false);
                  }}
                  onChange={(e, value) => {
                    if (value) {
                      setDefaultCopyValueRoomView(value);
                      handleChangeHotel(id, "room_view", value);
                    } else {
                      setDefaultCopyValueRoomView(null);
                      handleChangeHotel(id, "room_view", "");
                    }
                  }}
                  getOptionLabel={(option) => option.title_fa}
                  options={roomViews.map((option) => option)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="نمای اتاق"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {roomViewsLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={4} xs={12} md={6}>
                <Autocomplete
                  value={defaultCopyValueRoommate}
                  multiple
                  limitTags={2}
                  id="multiple-limit-tags"
                  options={persons.passengers}
                  getOptionLabel={(option) =>
                    option.name_fa + " " + option.lastname_fa
                  }
                  onChange={(e, value) => {
                    if (value) {
                      handleChangeHotel(id, "roommate", value);
                      setDefaultCopyValueRoommate(value);
                    } else {
                      handleChangeHotel(id, "roommate", []);
                      setDefaultCopyValueRoommate([]);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ width: "100%" }}
                      label="هم اتاقی"
                      variant="outlined"
                      color="primary"
                    />
                  )}
                />
              </Grid>
              <Grid item xl={3} xs={12} md={12}>
                <TextField
                  value={defaultCopyValueDescription}
                  sx={{ width: "100%" }}
                  label="توضیحات"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    handleChangeHotel(id, "description", e.target.value);
                    setDefaultCopyValueDescription(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </>
  );
};

const Tour = ({ id, onDelete, counter, handleChange, openSnackBar }) => {
  const [descText, setDescText] = useState("");
  //for toures name
  const [openToures, setOpenToures] = useState(false);
  const [toures, setToures] = useState([]);
  const [touresLoading, setTouresLoading] = useState(false);
  const langDirection = useSelector(selectCurrentLanguage);

  function getToures() {
    setTouresLoading(true);
    axios
      .post(base_url + "/v2/get_other_services", {
        lang: langDirection,
        action: "tour",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setToures(response.data.data.titles);
        setTouresLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openToures) {
      getToures();
    }
  }, [openToures]);
  //for validate
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    // defaultValues,
    resolver: yupResolver(schemaTour),
  });
  const { isValid, errors } = formState;
  useEffect(() => {
    if (openSnackBar) trigger();
  }, [openSnackBar]);
  const handleValidityChange = () => {
    handleChange(id, "validated", isValid);
  };
  useEffect(() => {
    handleValidityChange();
  }, [isValid]);
  return (
    <>
      <Fade in={true}>
        <Box marginTop={5}>
          <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
          <Box display={"flex"} alignItems={"center"}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Box
                elevation={0}
                sx={{
                  width: "100px",
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography sx={{ fontSize: "18px" }} variant="h1">
                    {counter}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => onDelete(id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid spacing={1} container>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="tourName"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      open={openToures}
                      onOpen={() => {
                        setOpenToures(true);
                      }}
                      onClose={() => {
                        setOpenToures(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          setDescText(value.description);
                          handleChange(id, "tour", value);
                          setValue("tourName", value.title);
                          trigger("tourName");
                        } else {
                          setDescText("");
                          handleChange(id, "tour", "");
                          setValue("tourName", "");
                          trigger("tourName");
                        }
                      }}
                      getOptionLabel={(option) => option.title}
                      options={toures.map((option) => option)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="تور"
                          required
                          error={!!errors.tourName}
                          helperText={errors?.tourName?.message}
                          Autocomplete="off"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {touresLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={4} xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  label="توضیحات"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    handleChange(id, "description", e.target.value);
                  }}
                />
              </Grid>
              <Grid item xl={6} xs={12} md={6}>
                <Box height={"100%"} display={"flex"} alignItems={"center"}>
                  <Typography sx={{ width: "100%" }} variant="outlined">
                    {descText}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </>
  );
};

const Insurance = ({ id, onDelete, counter, handleChange, openSnackBar }) => {
  const langDirection = useSelector(selectCurrentLanguage);
  const [descText, setDescText] = useState("");
  //for insurances name
  const [openInsurance, setOpenInsurance] = useState(false);
  const [insurances, setInsurances] = useState([]);
  const [insurancesLoading, setInsurancesLoading] = useState(false);
  const [insuranceIssuing, setInsuranceIssuing] = useState(null);
  const [insuranceEx, setInsuranceEx] = useState(null);
  function getInsurances() {
    setInsurancesLoading(true);
    axios
      .post(base_url + "/v2/get_other_services", {
        lang: langDirection,
        action: "insurance",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setInsurances(response.data.data.titles);
        setInsurancesLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openInsurance) {
      getInsurances();
    }
  }, [openInsurance]);
  //for validate
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    // defaultValues,
    resolver: yupResolver(schemaInsurance),
  });
  const { isValid, errors } = formState;
  useEffect(() => {
    if (openSnackBar) trigger();
  }, [openSnackBar]);
  const handleValidityChange = () => {
    handleChange(id, "validated", isValid);
  };
  useEffect(() => {
    handleValidityChange();
  }, [isValid]);

  //uplaod image
  const [image, setImage] = useState("");
  const fileInputRef = React.useRef(null);
  const handleUploadButtonClick = (action) => {
    if (action === "insurance") {
      fileInputRef.current.click();
    }
  };
  const handleImageUpload = async (e, action) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage); // 'image' should match the field name expected by your API
      formData.append("type", action); // 'image' should match the field name expected by your API
      formData.append("access_token", getAccessToken()); // 'image' should match the field name expected by your API
      formData.append("lang", langDirection); // 'image' should match the field name expected by your API
      try {
        const response = await axios.post(
          base_url + "/v2/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Important: Set the content type
            },
          }
        );

        // Handle the response from the API here, e.g., update state or show a success message.
        if (action === "insurance") {
          setImage(base_url + "/App/" + response.data.image_name);
          handleChange(id, "file", isValid);
        }
      } catch (error) {
        // Handle any errors that occur during the upload.
        console.error("Error uploading image:", error);
      }
    }
  };
  return (
    <>
      <Fade in={true}>
        <Box marginTop={5}>
          <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
          <Box display={"flex"} alignItems={"center"}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Box
                elevation={0}
                sx={{
                  width: "100px",
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography sx={{ fontSize: "18px" }} variant="h1">
                    {counter}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => onDelete(id)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            <Grid spacing={1} container>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="insuranceName"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      open={openInsurance}
                      onOpen={() => {
                        setOpenInsurance(true);
                      }}
                      onClose={() => {
                        setOpenInsurance(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          setDescText(value.description);
                          handleChange(id, "insurance", value);
                          setValue("insuranceName", value.title);
                          trigger("insuranceName");
                        } else {
                          setDescText("");
                          handleChange(id, "data", "");
                          setValue("insuranceName", "");
                          trigger("insuranceName");
                        }
                      }}
                      getOptionLabel={(option) => option.title}
                      options={insurances.map((option) => option)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="بیمه"
                          required
                          error={!!errors.insuranceName}
                          helperText={errors?.insuranceName?.message}
                          Autocomplete="off"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {insurancesLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  label="توضیحات"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    handleChange(id, "description", e.target.value);
                  }}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="insuranceStart"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider
                      sx={{ width: "100%" }}
                      dateAdapter={AdapterDateFnsJalali}
                    >
                      <DatePicker
                        {...field}
                        sx={{ width: "100%" }}
                        views={["year", "month", "day"]}
                        label="تاریخ صدور"
                        value={insuranceIssuing}
                        onChange={(value) => {
                          field.onChange(value);
                          setInsuranceIssuing(value);
                          const options = {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          };
                          const formattedDate = value
                            ? value.toLocaleDateString("fa-IR", options)
                            : null;
                          handleChange(
                            id,
                            "insurance_issuing",
                            convertPersianToEnglishNumbers(formattedDate)
                          );
                        }}
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="insuranceExpire"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider
                      sx={{ width: "100%" }}
                      dateAdapter={AdapterDateFnsJalali}
                    >
                      <DatePicker
                        {...field}
                        sx={{ width: "100%" }}
                        views={["year", "month", "day"]}
                        label="تاریخ پایان"
                        value={insuranceEx}
                        onChange={(value) => {
                          field.onChange(value);
                          setInsuranceEx(value);
                          const options = {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          };
                          const formattedDate = value
                            ? value.toLocaleDateString("fa-IR", options)
                            : null;
                          handleChange(id, "insurance_ex", formattedDate);
                        }}
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xl={4} xs={12} md={6}>
                <Box height={"100%"} display={"flex"} alignItems={"center"}>
                  <Box
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <IconButton
                      size="large"
                      onClick={() => handleUploadButtonClick("insurance")}
                    >
                      {image ? <FileDownloadDoneIcon /> : <UploadIcon />}
                    </IconButton>
                    {/* Step 1: Hidden file input element */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageUpload(e, "insurance")}
                    />
                  </Box>
                  {image && (
                    <a
                      href={image}
                      target="_blank"
                      style={{
                        textDecoration: "none",
                        fontSize: "xx-small",
                        padding: "0px 5px",
                      }}
                    >
                      تصویر
                    </a>
                  )}
                  <Typography sx={{ width: "100%" }} variant="outlined">
                    {descText}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </>
  );
};
const Services = ({
  id,
  onDelete,
  counter,
  handleChange,
  openSnackBar,
  item,
  handleAddService,
}) => {
  //start default value for copy
  const [defaultCopyValueDescription, setDefaultCopyValueDescription] =
    useState(item.description ? item.description : "");
  const [defaultCopyValueServicce, setDefaultCopyValueServicce] = useState(
    item.service ? item.service : null
  );
  //end default value

  const langDirection = useSelector(selectCurrentLanguage);
  const [descText, setDescText] = useState(
    item.service ? item.service.description : ""
  );

  //for services name
  const [openServices, setOpenServices] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  function getServices() {
    setServicesLoading(true);
    axios
      .post(base_url + "/v2/get_other_services", {
        lang: langDirection,
        action: "service",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setServices(response.data.data.titles);
        setServicesLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openServices) {
      getServices();
    }
  }, [openServices]);
  //for validate
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    // defaultValues,
    resolver: yupResolver(schemaServices),
  });
  const { isValid, errors } = formState;
  useEffect(() => {
    if (openSnackBar) trigger();
  }, [openSnackBar]);
  const handleValidityChange = () => {
    handleChange(id, "validated", isValid);
  };
  useEffect(() => {
    handleValidityChange();
  }, [isValid]);

  //setvalue for copied items
  useEffect(() => {
    if (counter !== 1) {
      item.service ? setValue("serviceName", item.service.title) : "";
      trigger();
      handleValidityChange();
    }
  }, []);

  //uplaod image
  const [image, setImage] = useState(item.file ? item.file : "");
  const fileInputRef = React.useRef(null);
  const handleUploadButtonClick = (action) => {
    if (action === "service") {
      console.log("clicked!");
      fileInputRef.current.click();
    }
  };
  const handleImageUpload = async (e, action) => {
    console.log("clicked2!");
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage); // 'image' should match the field name expected by your API
      formData.append("type", action); // 'image' should match the field name expected by your API
      formData.append("access_token", getAccessToken()); // 'image' should match the field name expected by your API
      formData.append("lang", langDirection); // 'image' should match the field name expected by your API
      try {
        const response = await axios.post(
          base_url + "/v2/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Important: Set the content type
            },
          }
        );

        // Handle the response from the API here, e.g., update state or show a success message.
        if (action === "service") {
          setImage(base_url + "/App/" + response.data.image_name);
          handleChange(
            id,
            "file",
            base_url + "/App/" + response.data.image_name
          );
        }
      } catch (error) {
        // Handle any errors that occur during the upload.
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <>
      <Fade in={true}>
        <Box marginTop={5}>
          <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
          <Box display={"flex"} alignItems={"center"}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Box
                elevation={0}
                sx={{
                  width: "100px",
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  width={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-evenly"}
                >
                  <Typography sx={{ fontSize: "18px" }} variant="h1">
                    {counter}
                  </Typography>
                  <IconButton
                    onClick={() => handleAddService("copy", counter - 1)}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
              <IconButton onClick={() => onDelete(id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid spacing={1} container>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="serviceName"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={defaultCopyValueServicce}
                      open={openServices}
                      onOpen={() => {
                        setOpenServices(true);
                      }}
                      onClose={() => {
                        setOpenServices(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          setDefaultCopyValueServicce(value);
                          setDescText(value.description);
                          handleChange(id, "service", value);
                          setValue("serviceName", value.title);
                          trigger("serviceName");
                        } else {
                          setDefaultCopyValueServicce(null);
                          setDescText("");
                          handleChange(id, "service", value);
                          setValue("serviceName", "");
                          trigger("serviceName");
                        }
                      }}
                      getOptionLabel={(option) => option.title}
                      options={services.map((option) => option)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="خدمت"
                          required
                          error={!!errors.serviceName}
                          helperText={errors?.serviceName?.message}
                          Autocomplete="off"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {servicesLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <TextField
                  value={defaultCopyValueDescription}
                  sx={{ width: "100%" }}
                  label="توضیحات"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    handleChange(id, "description", e.target.value);
                    setDefaultCopyValueDescription(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xl={6} xs={12} md={6}>
                <Box height={"100%"} display={"flex"} alignItems={"center"}>
                  <Box
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <IconButton
                      size="large"
                      onClick={() => handleUploadButtonClick("service")}
                    >
                      {image ? <FileDownloadDoneIcon /> : <UploadIcon />}
                    </IconButton>
                    {/* Step 1: Hidden file input element */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageUpload(e, "service")}
                    />
                  </Box>
                  {image && (
                    <a
                      href={image}
                      target="_blank"
                      style={{
                        textDecoration: "none",
                        fontSize: "xx-small",
                        padding: "0px 5px",
                      }}
                    >
                      تصویر
                    </a>
                  )}
                  <Typography sx={{ width: "100%" }} variant="outlined">
                    {descText}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </>
  );
};

const Visa = ({ id, onDelete, counter, handleChange, openSnackBar }) => {
  const langDirection = useSelector(selectCurrentLanguage);
  //for citizens visas country
  const [openCitizen, setOpenCitizen] = React.useState(false);
  const [citizenLoading, setCitizenLoading] = React.useState(false);
  const [citizens, setCitizens] = React.useState([]);
  const [visaIssuing, setVisaIssuing] = useState(null);
  const [visaEx, setVisaEx] = useState(null);
  function getCountries() {
    setCitizenLoading(true);
    axios
      .post(base_url + "/v2/get_visa_country", {
        lang: langDirection,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setCitizens(response.data.data.countries);
        setCitizenLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openCitizen) {
      getCountries();
    }
  }, [openCitizen]);

  const [descText, setDescText] = useState("");
  //for visas name
  const [openVisas, setOpenVisas] = useState(false);
  const [visas, setVisas] = useState([]);
  const [visasLoading, setVisasLoading] = useState(false);
  function getVisas() {
    setVisasLoading(true);
    axios
      .post(base_url + "/v2/get_other_services", {
        lang: langDirection,
        action: "visa",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setVisas(response.data.data.titles);
        setVisasLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openVisas) {
      getVisas();
    }
  }, [openVisas]);
  //for validate
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    // defaultValues,
    resolver: yupResolver(schemaVisa),
  });
  const { isValid, errors } = formState;
  useEffect(() => {
    if (openSnackBar) trigger();
  }, [openSnackBar]);
  const handleValidityChange = () => {
    handleChange(id, "validated", isValid);
  };
  useEffect(() => {
    handleValidityChange();
  }, [isValid]);

  //uplaod image
  const [image, setImage] = useState("");
  const fileInputRef = React.useRef(null);
  const handleUploadButtonClick = (action) => {
    if (action === "visa") {
      fileInputRef.current.click();
    }
  };
  const handleImageUpload = async (e, action) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage); // 'image' should match the field name expected by your API
      formData.append("type", action); // 'image' should match the field name expected by your API
      formData.append("access_token", getAccessToken()); // 'image' should match the field name expected by your API
      formData.append("lang", langDirection); // 'image' should match the field name expected by your API
      try {
        const response = await axios.post(
          base_url + "/v2/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Important: Set the content type
            },
          }
        );

        // Handle the response from the API here, e.g., update state or show a success message.
        if (action === "visa") {
          setImage(base_url + "/App/" + response.data.image_name);
          handleChange(id, "file", isValid);
        }
      } catch (error) {
        // Handle any errors that occur during the upload.
        console.error("Error uploading image:", error);
      }
    }
  };
  return (
    <>
      <Fade in={true}>
        <Box marginTop={5}>
          <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
          <Box display={"flex"} alignItems={"center"}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Box
                elevation={0}
                sx={{
                  width: "100px",
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={1}
                >
                  <Typography sx={{ fontSize: "18px" }} variant="h1">
                    {counter}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => onDelete(id)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            <Grid spacing={1} container>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="visaName"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      open={openVisas}
                      onOpen={() => {
                        setOpenVisas(true);
                      }}
                      onClose={() => {
                        setOpenVisas(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          setDescText(value.description);
                          handleChange(id, "visa", value);
                          setValue("visaName", value.title);
                          trigger("visaName");
                        } else {
                          setDescText("");
                          handleChange(id, "visa", "");
                          setValue("visaName", "");
                          trigger("visaName");
                        }
                      }}
                      getOptionLabel={(option) => option.title}
                      options={visas.map((option) => option)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="ویزا"
                          required
                          error={!!errors.visaName}
                          helperText={errors?.visaName?.message}
                          Autocomplete="off"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {visasLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="visaCountry"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      sx={{ width: "100%" }}
                      open={openCitizen}
                      onOpen={() => {
                        setOpenCitizen(true);
                      }}
                      onClose={() => {
                        setOpenCitizen(false);
                      }}
                      getOptionLabel={(option) => option.fa_name}
                      options={citizens}
                      loading={citizenLoading}
                      onChange={async (e, value) => {
                        if (value) {
                          console.log(value);
                          setValue("visaCountry", value.fa_name);
                          trigger("visaCountry");
                          handleChange(id, "country", value);
                        } else {
                          setValue("visaCountry", "");
                          trigger("visaCountry");
                          handleChange(id, "country", "");
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          autoComplete="off"
                          label="کشور"
                          variant="outlined"
                          color="primary"
                          required
                          error={!!errors.visaCountry}
                          helperText={errors?.visaCountry?.message}
                          Autocomplete="off"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {citizenLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.key}>
                          <Box
                            width={"100%"}
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            {option.fa_name}
                            <img
                              src={
                                "./custom_assets/flags/flat/24/" +
                                option.iso +
                                ".png"
                              }
                            />
                          </Box>
                        </li>
                      )}
                      // defaultValue={{
                      //   id: 118,
                      //   iso: "IR",
                      //   fa_name: "ایرانی",
                      //   en_name: "Iranian",
                      // }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <TextField
                  sx={{ width: "100%" }}
                  label="توضیحات"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    handleChange(id, "description", e.target.value);
                  }}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="visaStart"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider
                      sx={{ width: "100%" }}
                      dateAdapter={AdapterDateFnsJalali}
                    >
                      <DatePicker
                        {...field}
                        sx={{ width: "100%" }}
                        views={["year", "month", "day"]}
                        label="تاریخ صدور"
                        value={visaIssuing}
                        onChange={(value) => {
                          field.onChange(value);
                          setVisaIssuing(value);
                          const options = {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          };
                          const formattedDate = value
                            ? value.toLocaleDateString("fa-IR", options)
                            : null;
                          handleChange(
                            id,
                            "visa_issuing",
                            convertPersianToEnglishNumbers(formattedDate)
                          );
                        }}
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Controller
                  name="visaExpire"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider
                      sx={{ width: "100%" }}
                      dateAdapter={AdapterDateFnsJalali}
                    >
                      <DatePicker
                        {...field}
                        sx={{ width: "100%" }}
                        views={["year", "month", "day"]}
                        label="تاریخ پایان"
                        value={visaEx}
                        onChange={(value) => {
                          field.onChange(value);
                          setVisaEx(value);
                          const options = {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          };
                          const formattedDate = value
                            ? value.toLocaleDateString("fa-IR", options)
                            : null;
                          handleChange(
                            id,
                            "visa_ex",
                            convertPersianToEnglishNumbers(formattedDate)
                          );
                        }}
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={12} md={6}>
                <Box height={"100%"} display={"flex"} alignItems={"center"}>
                  <Box
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <IconButton
                      size="large"
                      onClick={() => handleUploadButtonClick("visa")}
                    >
                      {image ? <FileDownloadDoneIcon /> : <UploadIcon />}
                    </IconButton>
                    {/* Step 1: Hidden file input element */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageUpload(e, "visa")}
                    />
                  </Box>
                  {image && (
                    <a
                      href={image}
                      target="_blank"
                      style={{
                        textDecoration: "none",
                        fontSize: "xx-small",
                        padding: "0px 5px",
                      }}
                    >
                      تصویر
                    </a>
                  )}
                  <Typography sx={{ width: "100%" }} variant="outlined">
                    {descText}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </>
  );
};
