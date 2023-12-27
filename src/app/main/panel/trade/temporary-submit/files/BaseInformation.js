import { base_url } from "src/app/constant";
import * as React from "react";
import { Alert, Card, IconButton, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from "@mui/material/Checkbox";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import NumberToPersianWordMin from "number_to_persian_word";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import calculateAgeCategory from "src/app/custom-components/agegroupe";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import {
  formatInputWithCommas,
  formatInputWithOutCommas,
} from "../../trade-managment/files/oprations/functions";
import { action } from "mobx";

let lastTitle = "";
const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};
const BaseInformation = (props) => {
  const [allowedNext, setAllowedNext] = useState(false);
  const dispatch = useDispatch();
  // initial json
  const [persons, setPersons] = useState([]);
  // const persons = props.personsJSON;
  const [countPromisers, setCountPromisers] = useState(0);
  const [sumSellPrice, SetSumSellPrice] = React.useState(0);
  const [sumBuyPrice, SetSumBuyPrice] = React.useState(0);
  const [sumPromisersPrice, SetPromisersPrice] = React.useState(0);
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
  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };
  //validated snackbar
  const [openSnackBarValidated, setOpenSnackBarValidated] =
    React.useState(false);

  const handleClickSnackBarValidated = () => {
    setOpenSnackBarValidated(!openSnackBarValidated);
    dispatch(
      showMessage({
        message: "تمامی فیلد های ضروری به درستی پر شوند", //text or html
        autoHideDuration: 6000, //ms
        anchorOrigin: {
          vertical: "top", //top bottom
          horizontal: "center", //left center right
        },
        variant: "error", //success error info warning null
      })
    );
  };

  // const persons = props.personsJSON;
  const [sells, setSells] = React.useState([]);
  React.useEffect(() => {
    console.log(props.personsJSON.services);
    setPersons(props.personsJSON);
    setSells([]);
    if (props.personsJSON.onlines) {
      props.personsJSON.onlines.forEach((online) => {
        for (
          let i = 0;
          i <
          parseInt(online.Classes.Passengers.Infant) +
            parseInt(online.Classes.Passengers.Child) +
            parseInt(online.Classes.Passengers.Adult);
          i++
        ) {
          setSells((preSells) => [
            ...preSells,
            {
              action: "online",
              id: uuidv4(),
              passenger: "",
              online: online,
              sell: 0,
              buy: 0,
              validated: false,
              has_credit: true,
              provider: "",
              deadline: "",
              serial: "",
              pay_deadline: false,
            },
          ]);
        }
      });
    }
    if (props.personsJSON.routes) {
      props.personsJSON.routes.forEach((route) => {
        if (route.repeat_route === "multiple") {
          props.personsJSON.passengers.forEach((person) => {
            setSells((preSells) => [
              ...preSells,
              {
                action: "route",
                id: uuidv4(),
                passenger: person,
                route: route,
                sell: 0,
                buy: 0,
                validated: false,
                has_credit: true,
                provider: "",
                deadline: "",
                serial: "",
                // pay_deadline: false,
              },
            ]);
          });
        } else if (route.repeat_route === "single") {
          setSells((preSells) => [
            ...preSells,
            {
              action: "route",
              id: uuidv4(),
              // passenger: route.persons,
              route: route,
              sell: 0,
              buy: 0,
              validated: false,
              has_credit: true,
              provider: "",
              deadline: "",
              serial: "",
              // pay_deadline: false,
            },
          ]);
        }
      });
    }
    if (props.personsJSON.hotels) {
      props.personsJSON.hotels.forEach((hotel) => {
        setSells((preSells) => [
          ...preSells,
          {
            action: "hotel",
            id: uuidv4(),
            passenger: "",
            // passenger: hotel.persons,
            hotel: hotel,
            sell: 0,
            buy: 0,
            validated: false,
            has_credit: true,
            provider: "",
            deadline: "",
            serial: "",
            // pay_deadline: false,
          },
        ]);
      });
    }
    if (props.personsJSON.tours) {
      props.personsJSON.tours.forEach((tour) => {
        setSells((preSells) => [
          ...preSells,
          {
            action: "tour",
            id: uuidv4(),
            // passenger: tour.persons,
            passenger: "",
            tour: tour,
            sell: 0,
            buy: 0,
            validated: false,
            has_credit: true,
            provider: "",
            deadline: "",
            serial: "",
            // pay_deadline: false,
          },
        ]);
      });
    }
    if (props.personsJSON.visas) {
      props.personsJSON.visas.forEach((visa) => {
        setSells((preSells) => [
          ...preSells,
          {
            action: "visa",
            id: uuidv4(),
            // passenger: visa.persons,
            passenger: "",
            visa: visa,
            sell: 0,
            buy: 0,
            validated: false,
            has_credit: true,
            provider: "",
            deadline: "",
            serial: "",
            // pay_deadline: false,
          },
        ]);
      });
    }
    if (props.personsJSON.insurances) {
      props.personsJSON.insurances.forEach((insurance) => {
        setSells((preSells) => [
          ...preSells,
          {
            action: "insurance",
            id: uuidv4(),
            // passenger: insurance.persons,
            passenger: "",
            insurance: insurance,
            sell: 0,
            buy: 0,
            validated: false,
            has_credit: true,
            provider: "",
            deadline: "",
            serial: "",
            // pay_deadline: false,
          },
        ]);
      });
    }
    if (props.personsJSON.services) {
      props.personsJSON.services.forEach((service) => {
        setSells((preSells) => [
          ...preSells,
          {
            action: "service",
            id: uuidv4(),
            // passenger: service.persons,
            passenger: "",
            service: service,
            sell: 0,
            buy: 0,
            validated: false,
            has_credit: true,
            provider: "",
            deadline: "",
            serial: "",
            // pay_deadline: false,
          },
        ]);
      });
    }
  }, [props.update]);

  useEffect(() => {
    console.log(sells);
  }, [sells]);

  async function handleChangeSells(id, action, value) {
    const item = sells.find((item) => item.id === id);
    item[action] = await value;
    let sum = 0;
    if (action === "sell") {
      sells.forEach((item) => {
        sum += parseInt(formatInputWithOutCommas(item.sell.toString()))
          ? parseInt(formatInputWithOutCommas(item.sell.toString()))
          : 0;
      });
      SetSumSellPrice(sum);
    } else if (action === "buy") {
      sells.forEach((item) => {
        sum += parseInt(formatInputWithOutCommas(item.buy.toString()))
          ? parseInt(formatInputWithOutCommas(item.buy.toString()))
          : 0;
      });
      SetSumBuyPrice(sum);
    }
  }

  //for promisers
  const [promisers, setPromisers] = useState([]);
  const handleAddPromiser = () => {
    if (countPromisers >= 0 && countPromisers < 3) {
      setPromisers((prevPromisers) => [
        ...prevPromisers,
        {
          id: uuidv4(),
          validated: false,
          data: "",
          price: "",
        },
      ]);
      setCountPromisers(countPromisers + 1);
    }
  };
  const handleDeletePromis = (id) => {
    if (countPromisers > 0 && countPromisers <= 3) {
      setPromisers((prevPromisers) =>
        prevPromisers.filter((person) => person.id !== id)
      );
      setCountPromisers(countPromisers - 1);
    }
  };
  async function handleChangePromissers(id, action, value) {
    const item = promisers.find((item) => item.id === id);
    item[action] = await value;
    let sum = 0;
    if (action === "price") {
      promisers.forEach((item) => {
        sum += parseInt(formatInputWithOutCommas(item.price.toString()))
          ? parseInt(formatInputWithOutCommas(item.price).toString())
          : 0;
      });
      SetPromisersPrice(sum);
    }
  }

  //  submit/back
  const handleSubmitNext = async () => {
    if (sumSellPrice === 0 && props.action !== "opration") {
      handleClickSnackBar("مبلغ فروش نمیتواند صفر باشد");
    } else if (
      parseInt(sumSellPrice) - parseInt(sumPromisersPrice) !== 0 &&
      countPromisers !== 0
    ) {
      handleClickSnackBar("لطفا مبلغ تعهد را با مبلغ فروش یکسان وارد نمایید");
    } else {
      let isValid = true; // Initialize isValid to true
      for (const sell of sells) {
        if (!sell.validated) {
          isValid = false;
          break; // No need to continue checking
        }
      }
      for (const sell of sells) {
        if (sell.credit_value) {
          if (sell.buy && sell.buy !== 0) {
            if (
              !(
                formatInputWithOutCommas(sell.buy.toString()) -
                  formatInputWithOutCommas(sell.credit_value.toString()) <
                0
              )
            ) {
              isValid = false;
              break; // No need to continue checking
            }
          }
        }
      }
      for (const promis of promisers) {
        if (promis.credit_value) {
          if (promis.price && promis.price !== 0) {
            if (countPromisers !== 0) {
              if (
                !(
                  formatInputWithOutCommas(promis.price.toString()) -
                    formatInputWithOutCommas(promis.credit_value.toString()) <=
                  0
                )
              ) {
                isValid = false;
                break; // No need to continue checking
              }
            }
          }
        }
      }
      for (const sell of sells) {
        if (sell.credit_value) {
          if (sell.credit_value <= 0) {
            isValid = false;
            break; // No need to continue checking
          }
        }
      }
      for (const promis of promisers) {
        if (promis.credit_value) {
          if (countPromisers !== 0) {
            if (promis.credit_value <= 0) {
              isValid = false;
              break; // No need to continue checking
            }
          }
        }
      }

      if (isValid) {
        persons["data"] = sells;
        persons["pledgers"] = promisers;
        persons["sum_sell_price"] = sumSellPrice;
        persons["sum_buy_price"] = sumBuyPrice;
        await props.handleSetPersonsJSON(persons);
        await props.setUpdateSells(!props.updateSells);
        props.setUpdateSells(!props.updateSells);
        if (props.action === "opration") {
          props.handleAddedItem(persons);
        } else {
          props.handleNext();
        }
      } else {
        if (allowedNext) {
          persons["data"] = sells;
          persons["pledgers"] = promisers;
          persons["sum_sell_price"] = sumSellPrice;
          persons["sum_buy_price"] = sumBuyPrice;
          await props.handleSetPersonsJSON(persons);
          await props.setUpdateSells(!props.updateSells);
          props.setUpdateSells(!props.updateSells);
          if (props.action === "opration") {
            props.handleAddedItem(persons);
          } else {
            props.handleNext();
          }
        } else {
          handleClickSnackBarValidated();
        }
      }
    }
  };

  const handleSubmitBack = () => {
    setSells([]);
    props.handleBack();
  };
  return (
    <>
      <Card sx={{ margin: "10px", padding: "15px" }}>
        <Typography variant="h6" color={"red"} sx={{ marginBottom: "25px" }}>
          توجه: با بازگشت به مرحله قبل تمامی فیلد های وارد شده در این صفحه حذف
          میشوند.
        </Typography>
        <Parent
          sells={sells}
          handleChangeSells={handleChangeSells}
          persons={persons}
          openSnackBarValidated={openSnackBarValidated}
          action={props.action}
        />

        <Grid container marginBottom={2} marginTop={2}>
          <Grid item xl={4} md={12} xs={12}>
            <Box display={"flex"} alignItems={"start"} flexDirection={"column"}>
              <Typography>
                جمع کل خرید: {formatInputWithCommas(sumBuyPrice.toString())}{" "}
              </Typography>
              <Typography sx={{ fontSize: "10px" }}>
                معادل {NumberToPersianWordMin.convert(sumBuyPrice)} ریال
              </Typography>
            </Box>
          </Grid>
          <Grid item xl={4} md={12} xs={12}>
            <Box display={"flex"} alignItems={"start"} flexDirection={"column"}>
              <Typography>
                جمع کل فروش: {formatInputWithCommas(sumSellPrice.toString())}{" "}
              </Typography>
              <Typography sx={{ fontSize: "10px" }}>
                معادل {NumberToPersianWordMin.convert(sumSellPrice)} ریال
              </Typography>
            </Box>
          </Grid>
          <Grid item xl={4} md={12} xs={12} justifyContent={"space-between"}>
            <Box display={"flex"} alignItems={"start"} flexDirection={"column"}>
              <Typography
                sx={{
                  color:
                    parseInt(sumSellPrice) - parseInt(sumBuyPrice) > 0
                      ? "green"
                      : "red",
                }}
              >
                سود/زیان:{" "}
                {formatInputWithCommas(
                  (parseInt(sumSellPrice) - parseInt(sumBuyPrice)).toString()
                )}{" "}
              </Typography>
              <Typography
                sx={{
                  color:
                    parseInt(sumSellPrice) - parseInt(sumBuyPrice) > 0
                      ? "green"
                      : "red",
                  fontSize: "10px",
                }}
              >
                معادل{" "}
                {NumberToPersianWordMin.convert(
                  parseInt(sumSellPrice) - parseInt(sumBuyPrice)
                )}{" "}
                ریال
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {promisers.map((promis, index) => (
            <Promiser
              key={promis.id}
              id={promis.id}
              onDelete={handleDeletePromis}
              handleChange={handleChangePromissers}
              // counter={index + 1}
              // openSnackBar={openSnackBar}
            />
          ))}
        </Grid>
        <Box
          width={"100%"}
          marginTop={5}
          display={"flex"}
          justifyContent={props.action === "opration" ? "end" : "space-between"}
        >
          {props.action !== "opration" && (
            <Box display={"flex"} gap={5} alignItems={"center"}>
              <Button
                onClick={() => {
                  handleAddPromiser();
                }}
                size="large"
                variant="outlined"
              >
                {"افزودن متعهد"}
              </Button>
              {parseInt(sumSellPrice) - parseInt(sumPromisersPrice) > 0 && (
                <Typography sx={{ fontSize: "12px", color: "red" }}>
                  میزان تعهد باقی مانده:{" "}
                  {formatInputWithCommas(
                    (
                      parseInt(sumSellPrice) - parseInt(sumPromisersPrice)
                    ).toString()
                  ) +
                    " معادل" +
                    " " +
                    NumberToPersianWordMin.convert(
                      parseInt(sumSellPrice) - parseInt(sumPromisersPrice)
                    ) +
                    " ریال"}
                </Typography>
              )}
              {parseInt(sumSellPrice) - parseInt(sumPromisersPrice) < 0 && (
                <Typography sx={{ fontSize: "12px", color: "red" }}>
                  جمع تعهد بیشتر از جمع فروش
                </Typography>
              )}

              {parseInt(sumSellPrice) - parseInt(sumPromisersPrice) === 0 && (
                <Typography sx={{ fontSize: "12px", color: "green" }}>
                  میزان تعهد باقی مانده: 0
                </Typography>
              )}
            </Box>
          )}
          <Box display={"flex"} gap={"5px"}>
            <Button onClick={handleSubmitBack} size="large" variant="contained">
              قبلی
            </Button>
            <Button
              onClick={handleSubmitNext}
              size="large"
              variant="contained"
              color="secondary"
            >
              {props.action === "opration" && "ثبت"}
              {props.action != "opration" && "بعدی"}
            </Button>
          </Box>
        </Box>
      </Card>
      <Checkbox
        checked={allowedNext}
        icon={<RequestQuoteOutlinedIcon />}
        checkedIcon={<RequestQuoteIcon />}
        onChange={(e) => setAllowedNext(e.target.checked)}
      />
    </>
  );
};

export default BaseInformation;

const ChildItem = ({
  item,
  handleChangeSells,
  persons,
  openSnackBarValidated,
  counter,
  selectedProvider, // Receive the selected provider prop
  selectedCreditValue,
  selectedBuy,
  selectedSale,
  action,
}) => {
  const langDirection = useSelector(selectCurrentLanguage);
  var title = "";
  if (
    item.action === "route" &&
    item.route.origin.title_fa + " به " + item.route.destination.title_fa !==
      lastTitle
  ) {
    title =
      item.route.origin.title_fa + " به " + item.route.destination.title_fa;
    lastTitle = title;
  }
  //initial values
  const [providerCredit, setProviderCridit] = useState("");
  const [optionalCredit, setOptionalCridit] = useState(
    item.action === "online" ? true : false
  );
  const [buyValue, setBuyValue] = useState("");
  const [sellValue, setSellValue] = useState("");
  const [validCreditProvider, setValidCreditProvider] = useState(
    item.action === "online" ? true : false
  );
  const [isOther, setIsOther] = useState(false);
  const [providerRequired, setProviderRequired] = useState(true);

  //for validate
  const id = item.id;
  const schema = yup.object().shape({
    provider: providerRequired
      ? yup.string().required("باید یک تامین کننده وارد کنید")
      : yup.string().nullable(),
    passengerName:
      item.action === "route" && item.route.repeat_route !== "single"
        ? yup.string().nullable()
        : yup.string().required("باید یک نام وارد کنید"),
    buyPrice: isOther
      ? yup.string().nullable()
      : providerRequired
      ? yup.string().required("باید یک خرید وارد کنید")
      : yup.string().nullable(),
  });
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  const handleValidityChange = () => {
    handleChangeSells(id, "validated", isValid);
  };
  useEffect(() => {
    handleValidityChange();
  }, [isValid]);
  useEffect(() => {
    if (openSnackBarValidated) trigger();
  }, [openSnackBarValidated]);

  //for currency
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //for provider's name
  const [openProviders, setOpenProviders] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providerssLoading, setprovidersLoading] = useState(false);
  function getProviders() {
    setprovidersLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: langDirection,
        table: "colleague",
        action: "provider",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setProviders(response.data.data.titles);
        setprovidersLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openProviders) {
      getProviders();
    }
  }, [openProviders]);

  useEffect(() => {
    setBuyValue("");
    setSellValue("");
    handleChangeSells(id, "sell", "");
    handleChangeSells(id, "buy", "");
  }, [validCreditProvider, isOther]);

  //for checkbox
  const [payDeadLine, setPayDeadLine] = useState(false);

  const [defaultProvider, setDefaultProvider] = useState(
    item.action === "online" ? item.online.Classes.Supplier : null
  );
  useEffect(() => {
    counter === 1 ? setProviderRequired(true) : setProviderRequired(false);
    if (item.action === "online") {
      setValue("provider", item.online.Classes.Supplier.title_fa);
      handleChangeSells(id, "provider", item.online.Classes.Supplier);
    }
  }, []);
  useEffect(() => {
    if (selectedProvider !== null) {
      setBuyValue(formatInputWithCommas(selectedBuy));
      setSellValue(formatInputWithCommas(selectedSale));
      handleChangeSells(id, "buy", selectedBuy);
      handleChangeSells(id, "sell", selectedSale);
      setValue("buyPrice", selectedBuy);
      trigger("buyPrice");
      setIsOther(false);
      // Set the provider value if selectedProvider is not null
      setValue("provider", selectedProvider.title_fa);
      setDefaultProvider(selectedProvider);
      handleChangeSells(id, "provider", selectedProvider);
      if (selectedProvider.id !== 1) {
        if (selectedCreditValue === "") {
          setValidCreditProvider(true);
          setOptionalCridit(true);
          setProviderCridit("");
          handleChangeSells(id, "credit_value", "");
        } else {
          setValidCreditProvider(false);
          setOptionalCridit(false);
          if (selectedCreditValue > 0) {
            setValidCreditProvider(true);
          } else {
            setValidCreditProvider(false);
          }
          setProviderCridit(selectedCreditValue);
          handleChangeSells(id, "credit_value", selectedCreditValue);
        }
      } else {
        setValidCreditProvider(true);
        setIsOther(true);
        setProviderRequired(false);
        handleChangeSells(id, "credit_value", "");
      }
    }
  }, [selectedProvider]);
  return (
    <>
      <Box marginTop={1}>
        <Typography variant="p" fontWeight={"600"}>
          {item.action === "route" && title}
          {item.action === "hotel" && "هتل " + item.hotel.hotel.title}
          {item.action === "tour" && "تور " + item.tour.tour.title}
          {item.action === "visa" && "ویزا " + item.visa.visa.title}
          {item.action === "insurance" &&
            "بیمه " + item.insurance.insurance.title}
          {item.action === "service" && "خدمت " + item.service.service.title}
          {item.action === "online" && "پرواز آنلاین"}
        </Typography>
        <Grid
          marginTop={
            item.action === "route" && item.route.repeat_route === "single"
              ? 1
              : 0
          }
          // marginTop={2}
          container
          spacing={1}
        >
          <Grid item xl={12} md={12} xs={12} container spacing={1}>
            <Grid item xl={3} md={3} xs={12}>
              {item.action === "route" &&
                (item.route.repeat_route === "single" ? (
                  <Controller
                    name="passengerName"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        sx={{ width: "100%" }}
                        onChange={(e, value) => {
                          if (value) {
                            handleChangeSells(id, "passenger", value);
                            setValue(
                              "passengerName",
                              value.name_fa + value.lastname_fa
                            );
                            trigger("passengerName");
                          } else {
                            handleChangeSells(id, "passenger", "");
                            // setEmptyOrigin("");
                            // handleChangePath(id, "origin", "");
                            setValue("passengerName", "");
                            trigger("passengerName");
                          }
                        }}
                        getOptionLabel={(option) =>
                          option.name_fa
                            ? (option.sex ? "آقای " : "خانم ") +
                              option.name_fa +
                              " " +
                              option.lastname_fa +
                              " " +
                              (calculateAgeCategory(option.birthday) === "INF"
                                ? "(نوزاد)"
                                : calculateAgeCategory(option.birthday) ===
                                  "CHI"
                                ? "کودک"
                                : "(بزرگسال)")
                            : option.name_en + " " + option.lastname_en
                        }
                        options={persons.passengers.map((option) => option)}
                        isOptionEqualToValue={(option, value) =>
                          option === value || value === ""
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...field}
                            label="مسافر"
                            error={!!errors.passengerName}
                            helperText={errors?.passengerName?.message}
                            required
                            Autocomplete="off"
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                        )}
                      />
                    )}
                  />
                ) : (
                  <Box
                    width={"100%"}
                    height={"100%"}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Typography>
                      {item.passenger
                        ? item.passenger.sex
                          ? "آقای "
                          : "خانم "
                        : ""}
                      {item.passenger
                        ? item.passenger.name_fa
                          ? item.passenger.name_fa +
                            " " +
                            item.passenger.lastname_fa
                          : item.passenger.name_en +
                            " " +
                            item.passenger.lastname_en
                        : "موجود نیست"}
                      {" " +
                        (calculateAgeCategory(item.passenger.birthday) === "INF"
                          ? "(نوزاد)"
                          : calculateAgeCategory(item.passenger.birthday) ===
                            "CHI"
                          ? "(کودک)"
                          : "(بزرگسال)")}
                    </Typography>
                  </Box>
                ))}
              {item.action !== "route" && (
                <Controller
                  name="passengerName"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      sx={{ width: "100%" }}
                      onChange={(e, value) => {
                        if (value) {
                          handleChangeSells(id, "passenger", value);
                          setValue(
                            "passengerName",
                            value.name_fa + value.lastname_fa
                          );
                          trigger("passengerName");
                          if (item.action === "online") {
                            if (
                              calculateAgeCategory(value.birthday) === "INF"
                            ) {
                              setBuyValue(
                                formatInputWithCommas(
                                  item.online.Classes.Financial.Infant.Payable
                                )
                              );
                              setValue(
                                "buyPrice",
                                item.online.Classes.Financial.Infant.Payable
                              );
                              handleChangeSells(
                                id,
                                "buy",
                                item.online.Classes.Financial.Infant.Payable
                              );
                            } else if (
                              calculateAgeCategory(value.birthday) === "CHI"
                            ) {
                              setBuyValue(
                                formatInputWithCommas(
                                  item.online.Classes.Financial.Child.Payable
                                )
                              );
                              setValue(
                                "buyPrice",
                                item.online.Classes.Financial.Child.Payable
                              );
                              handleChangeSells(
                                id,
                                "buy",
                                item.online.Classes.Financial.Child.Payable
                              );
                            } else {
                              setBuyValue(
                                formatInputWithCommas(
                                  item.online.Classes.Financial.Adult.Payable
                                )
                              );
                              setValue(
                                "buyPrice",
                                item.online.Classes.Financial.Adult.Payable
                              );
                              handleChangeSells(
                                id,
                                "buy",
                                item.online.Classes.Financial.Adult.Payable
                              );
                            }
                          }
                        } else {
                          handleChangeSells(id, "passenger", "");
                          // setEmptyOrigin("");
                          // handleChangePath(id, "origin", "");
                          setValue("passengerName", "");
                          trigger("passengerName");
                        }
                      }}
                      getOptionLabel={(option) =>
                        (option.sex ? "آقای " : "خانم ") +
                        option.name_fa +
                        " " +
                        option.lastname_fa +
                        " " +
                        (calculateAgeCategory(option.birthday) === "INF"
                          ? "(نوزاد)"
                          : calculateAgeCategory(option.birthday) === "CHI"
                          ? "کودک"
                          : "(بزرگسال)")
                      }
                      options={persons.passengers.map((option) => option)}
                      isOptionEqualToValue={(option, value) =>
                        option === value || value === ""
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="مسافر"
                          error={!!errors.passengerName}
                          helperText={errors?.passengerName?.message}
                          required
                          Autocomplete="off"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      )}
                    />
                  )}
                />
              )}
            </Grid>
            <Grid item xl={1} xs={12} md={1}>
              <TextField
                sx={{ width: "100%" }}
                label="شماره"
                variant="outlined"
                color="primary"
                onChange={(e) =>
                  handleChangeSells(id, "serial", e.target.value)
                }
              />
            </Grid>
            <Grid item xl={2} md={2} xs={12}>
              <Box width={"100%"} display={"flex"} flexDirection={"column"}>
                <Controller
                  name="provider"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={defaultProvider}
                      open={openProviders}
                      disableClearable
                      disabled={item.action === "online"}
                      onOpen={() => {
                        setOpenProviders(true);
                      }}
                      onClose={() => {
                        setOpenProviders(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          handleChangeSells(id, "provider", value);
                          setValue("provider", value.title_fa);
                          trigger("provider");
                          setDefaultProvider(value);
                          if (value.id !== 1) {
                            setIsOther(false);
                            setProviderRequired(true);
                            //get credit from API
                            axios
                              .post(base_url + "/v2/colleagues/billing", {
                                lang: langDirection,
                                id: value.id,
                                access_token: getAccessToken(),
                              })
                              .then((response) => {
                                // Handle the successful response
                                if (response.data.CreditBalance === false) {
                                  setValidCreditProvider(true);
                                  setOptionalCridit(true);
                                  setProviderCridit("");
                                  handleChangeSells(id, "credit_value", "");
                                } else {
                                  setValidCreditProvider(false);
                                  setOptionalCridit(false);
                                  if (response.data.CreditBalance > 0) {
                                    setValidCreditProvider(true);
                                  } else {
                                    setValidCreditProvider(false);
                                  }
                                  setProviderCridit(
                                    response.data.CreditBalance
                                  );
                                  handleChangeSells(
                                    id,
                                    "credit_value",
                                    response.data.CreditBalance
                                  );
                                }
                              })
                              .catch((error) => {
                                // Handle any errors
                                console.error("Error creating item:", error);
                              });
                            //end get credit from API
                          } else {
                            setValidCreditProvider(true);
                            setIsOther(true);
                            setProviderRequired(false);
                            handleChangeSells(id, "credit_value", "");
                          }
                        }
                        // else {
                        //   // handleChangeSells(id, "provider", "");
                        //   // handleChangeSells(id, "credit_value", "");
                        //   setProviderCridit("");
                        //   setProviderRequired(false);
                        //   setValue("provider", "");
                        //   trigger("provider");
                        // }
                      }}
                      getOptionLabel={(option) => option.title_fa}
                      options={providers.map((option) => option)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="تامین کننده"
                          required
                          error={!!errors.provider}
                          helperText={errors?.provider?.message}
                          Autocomplete="off"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {providerssLoading ? (
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
                {!isOther &&
                  providerCredit &&
                  validCreditProvider &&
                  !optionalCredit && (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "green",
                      }}
                    >
                      اعتبار:{" "}
                      {" " + formatInputWithCommas(providerCredit.toString())}
                      {" " + "ریال"}
                    </Typography>
                  )}
                {providerCredit && !validCreditProvider && !optionalCredit && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "red",
                    }}
                  >
                    عدم اعتبار
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xl={4} md={4} xs={12} container spacing={1}>
              <Grid item xl={6} md={6} xs={6}>
                <Controller
                  name="buyPrice"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled={
                        !validCreditProvider ||
                        isOther ||
                        item.action === "online"
                      }
                      value={buyValue}
                      sx={{ width: "100%" }}
                      label="خرید"
                      dir="ltr"
                      variant="outlined"
                      color="primary"
                      error={!!errors.buyPrice}
                      helperText={errors?.buyPrice?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        handleChangeSells(
                          id,
                          "buy",
                          formatInputWithOutCommas(e.target.value.toString())
                        );
                        setBuyValue(formatInputWithCommas(e.target.value));
                      }}
                    />
                  )}
                />

                {!isOther &&
                  !optionalCredit &&
                  formatInputWithOutCommas(buyValue.toString()) >
                    providerCredit && (
                    <Typography sx={{ fontSize: "14px" }} color={"red"}>
                      عدم رعایت سقف تامین
                    </Typography>
                  )}
                {providerCredit >=
                  formatInputWithOutCommas(buyValue.toString()) &&
                  buyValue && (
                    <Typography sx={{ fontSize: "12px" }} color={"green"}>
                      {NumberToPersianWordMin.convert(
                        formatInputWithOutCommas(buyValue.toString())
                      )}{" "}
                      {" ریال"}
                    </Typography>
                  )}
                {optionalCredit && buyValue && (
                  <Typography sx={{ fontSize: "12px" }} color={"green"}>
                    {NumberToPersianWordMin.convert(
                      formatInputWithOutCommas(buyValue.toString())
                    )}{" "}
                    {" ریال"}
                  </Typography>
                )}
              </Grid>
              <Grid item xl={6} md={6} xs={6}>
                <Box display={"flex"}>
                  <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                    <DatePicker
                      sx={{ width: "100%" }}
                      required
                      disabled={!validCreditProvider || isOther || !payDeadLine}
                      label="مهلت پرداخت"
                      color="primary"
                      onChange={(value) => {
                        // field.onChange(value);
                        const formattedDate = value
                          ? value.toLocaleDateString("fa-IR")
                          : null;
                        handleChangeSells(id, "deadline", formattedDate);
                      }}
                      slotProps={{
                        textField: {
                          variant: "outlined",
                        },
                      }}
                    />
                  </LocalizationProvider>
                  <Checkbox
                    disabled={!validCreditProvider || isOther}
                    checked={payDeadLine}
                    icon={<RequestQuoteOutlinedIcon />}
                    checkedIcon={<RequestQuoteIcon />}
                    onChange={(e) => setPayDeadLine(e.target.checked)}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid item xl={2} md={2} xs={12}>
              <Box display={"flex"}>
                <Box width={"100%"}>
                  <TextField
                    value={sellValue}
                    sx={{ width: "100%" }}
                    disabled={!validCreditProvider}
                    label="فروش"
                    dir="ltr"
                    variant="outlined"
                    color="primary"
                    onChange={(e) => {
                      setSellValue(formatInputWithCommas(e.target.value));
                      handleChangeSells(
                        id,
                        "sell",
                        formatInputWithOutCommas(e.target.value.toString())
                      );
                    }}
                  />
                  {sellValue && (
                    <Typography sx={{ fontSize: "12px" }} color={"green"}>
                      {NumberToPersianWordMin.convert(
                        formatInputWithOutCommas(sellValue.toString())
                      )}{" "}
                      {" ریال"}
                    </Typography>
                  )}
                </Box>

                <IconButton onClick={handleClickOpen} color="primary">
                  <CurrencyExchangeIcon />
                </IconButton>
              </Box>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>تغییر ارز</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  مقدار ارزی فقط حالت نمایشی دارد و در هیچ عملیات مالی تاثیرگذار
                  نخواهد بود
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="مقدار ارزی"
                  type="email"
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="قیمت ارز "
                  type="email"
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="تست"
                  type="email"
                  fullWidth
                  variant="outlined"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>انصراف</Button>
                <Button onClick={handleClose}>ثبت</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

const Parent = ({
  sells,
  handleChangeSells,
  persons,
  openSnackBarValidated,
  action,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedCreditValue, setSelectedCreditValue] = useState("");
  const [selectedBuy, setSelectedBuy] = useState("");
  const [selectedSale, setSelectedSale] = useState("");

  const handleCopyButtonClick = () => {
    setCopied((prevCopied) => {
      if (!prevCopied) {
        // Set the selected provider from the first item
        setSelectedProvider(sells[0]?.provider || null);
        setSelectedCreditValue(sells[0]?.credit_value || "");
        setSelectedBuy(sells[0]?.buy || "");
        setSelectedSale(sells[0]?.sell || "");
      } else {
        // Reset values
        setSelectedProvider(null);
        setSelectedCreditValue("");
        setSelectedBuy("");
        setSelectedSale("");
      }

      // Toggle the copied state
      return !prevCopied;
    });
  };

  return (
    <>
      <Box display={"flex"} gap={1} alignItems={"center"}>
        <Typography variant="h6">
          اعمال آیتم اول بر همه آیتم های لیست
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={handleCopyButtonClick}
        >
          {copied ? "حذف تکرار" : "اعمال تکرار"}
        </Button>
      </Box>
      {sells.map((item, index) => (
        <ChildItem
          key={index}
          item={item}
          handleChangeSells={handleChangeSells}
          persons={persons}
          openSnackBarValidated={openSnackBarValidated}
          counter={index + 1}
          selectedProvider={selectedProvider} // Pass selected provider down to ChildItem
          selectedCreditValue={selectedCreditValue}
          selectedBuy={selectedBuy}
          selectedSale={selectedSale}
          action={action}
        />
      ))}
    </>
  );
};

const Promiser = ({ id, onDelete, handleChange }) => {
  const langDirection = useSelector(selectCurrentLanguage);
  //initial value
  const [promiss, setPromiss] = useState("");
  const [promiserCredit, setPromiserCridit] = useState("");
  const [validCreditPromiser, setValidCreditPromiser] = useState(false);

  //for validate
  const schema = yup.object().shape({
    promiser: yup.string().required("باید یک تعهد دهنده وارد کنید"),
  });
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  //for promiser's name
  const [openPromisers, setOpenPromisers] = useState(false);
  const [promisers, setPromisers] = useState([]);
  const [promisersLoading, setPromisersLoading] = useState(false);

  function getPromisers() {
    setPromisersLoading(true);
    axios
      .post(base_url + "/v2/trade/refrence/type", {
        goal: "1300,8200",
        separator: true,
        lang: langDirection,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log(response.data);
        setPromisers(response.data.results);
        setPromisersLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openPromisers) {
      getPromisers();
    }
  }, [openPromisers]);

  useEffect(() => {
    setPromiss("");
  }, [validCreditPromiser]);
  return (
    <>
      <Grid item xl={6} md={6} xs={12}>
        <Box display={"flex"} gap={1}>
          <IconButton
            // sx={{ visibility: counter == 1 ? "hidden" : "" }}
            onClick={() => onDelete(id)}
          >
            <DeleteIcon />
          </IconButton>
          <Box width={"100%"} display={"flex"} flexDirection={"column"}>
            <Controller
              name="promiser"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  sx={{ width: "100%" }}
                  open={openPromisers}
                  onOpen={() => {
                    setOpenPromisers(true);
                  }}
                  onClose={() => {
                    setOpenPromisers(false);
                  }}
                  onChange={(e, value) => {
                    if (value) {
                      //get credit from API
                      axios
                        .post(base_url + "/v2/colleagues/billing", {
                          lang: langDirection,
                          id: value.id,
                          access_token: getAccessToken(),
                        })
                        .then((response) => {
                          // Handle the successful response
                          if (response.data.CreditBalance === false) {
                            setValidCreditPromiser(true);
                            setPromiserCridit("");
                            handleChange(id, "credit_value", "");
                          } else {
                            if (response.data.CreditBalance > 0) {
                              setValidCreditPromiser(true);
                            } else {
                              setValidCreditPromiser(false);
                            }
                            setPromiserCridit(response.data.CreditBalance);
                            handleChange(
                              id,
                              "credit_value",
                              response.data.CreditBalance
                            );
                          }
                        })
                        .catch((error) => {
                          // Handle any errors
                          console.error("Error creating item:", error);
                        });
                      //end get credit from API
                      // handleChangeSells(id, "provider", value.title_fa);
                      // handleChangeSells(id, "provider_id", value.id);
                      handleChange(id, "data", value);
                      setValue("promiser", value.text);
                      trigger("promiser");
                      // const creditValue = credit.credit_value;
                      // handleChangeSells(id, "credit_value", creditValue);
                      // setProviderCridit(creditValue);
                    } else {
                      setPromiserCridit("");
                      setValidCreditPromiser(false);
                      handleChange(id, "data", "");
                      setValue("promiser", "");
                      trigger("promiser");
                      // handleChangeSells(id, "provider", "");
                      // handleChangeSells(id, "provider_id", "");
                      // handleChangeSells(id, "credit_value", "");
                      // setProviderCridit("");
                    }
                  }}
                  getOptionLabel={(option) => option.text}
                  options={promisers.map((option) => option)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...field}
                      label="تعهد دهنده"
                      required
                      Autocomplete="off"
                      error={!!errors.promiser}
                      helperText={errors?.promiser?.message}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {promisersLoading ? (
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
            {promiserCredit && validCreditPromiser && (
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "green",
                }}
              >
                مانده اعتبار:{" "}
                {" " + formatInputWithCommas(promiserCredit.toString())}
                {" " + "ریال"}
              </Typography>
            )}
            {promiserCredit && !validCreditPromiser && (
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "red",
                }}
              >
                عدم اعتبار
              </Typography>
            )}
          </Box>
          <Box width={"100%"} display={"flex"} flexDirection={"column"}>
            <TextField
              disabled={!validCreditPromiser}
              value={promiss}
              sx={{ width: "100%" }}
              label="مبلغ تعهد"
              dir="ltr"
              variant="outlined"
              color="primary"
              onChange={(e) => {
                handleChange(
                  id,
                  "price",
                  formatInputWithOutCommas(e.target.value)
                );
                setPromiss(formatInputWithCommas(e.target.value));
              }}
            />
            {promiserCredit &&
              formatInputWithOutCommas(promiss.toString()) > promiserCredit && (
                <Typography sx={{ fontSize: "14px" }} color={"red"}>
                  عدم رعایت سقف تعهد
                </Typography>
              )}
            {promiserCredit >= formatInputWithOutCommas(promiss.toString()) &&
              promiss && (
                <Typography sx={{ fontSize: "12px" }} color={"green"}>
                  {NumberToPersianWordMin.convert(
                    formatInputWithOutCommas(promiss.toString())
                  )}{" "}
                  {" ریال"}
                </Typography>
              )}
          </Box>
        </Box>
      </Grid>
    </>
  );
};
