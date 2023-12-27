import * as React from "react";
import { useEffect } from "react";
import {
  Alert,
  Card,
  IconButton,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import calculateAgeCategory from "src/app/custom-components/agegroupe";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import PrintDisabledIcon from "@mui/icons-material/PrintDisabled";
import SmsIcon from "@mui/icons-material/Sms";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import axios from "axios";
import { base_url } from "src/app/constant";
import CircularIndeterminate from "src/app/custom-components/CircularProgress";
import { useNavigate } from "react-router-dom";
import {
  formatInputWithCommas,
  formatInputWithOutCommas,
} from "../../trade-managment/files/oprations/functions";
import { showMessage } from "app/store/fuse/messageSlice";
import { useDispatch } from "react-redux";

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

const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};

const ShowStatus = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProgressLoading, setShowProgressLoading] = React.useState(false);
  // initial json
  const [persons, setPersons] = React.useState([]);
  const [sells, setSells] = React.useState();
  useEffect(() => {
    setPersons(props.personsJSON);
    setSells([]);
    setSells(props.personsJSON.data);
  }, [props.updateSells]);

  //for ptint
  const [print, setPrint] = React.useState("noMoney");
  const [notices, setNotices] = React.useState("send");
  const handlePrint = (event, newPrint) => {
    if (newPrint !== null) {
      setPrint(newPrint);
    }
  };
  const handleNotices = (event, newNotices) => {
    if (newNotices !== null) {
      setNotices(newNotices);
    }
  };
  const handleSubmitNext = async () => {
    setShowProgressLoading(true);
    const jsonData = {
      access_token: getAccessToken(),
      data: persons["data"],
      income_id: persons["income_id"],
      internal: persons["internal"],
      passengers: persons["passengers"],
      pledgers: persons["pledgers"],
      print: print === "nonPrint" ? 3 : print === "noMoney" ? 1 : 2,
      notices: notices === "send" ? true : false,
      sum_sell_price: persons["sum_sell_price"],
      sum_buy_price: persons["sum_buy_price"],
    };
    console.log({
      access_token: getAccessToken(),
      data: persons["data"],
      income_id: persons["income_id"],
      internal: persons["internal"],
      passengers: persons["passengers"],
      pledgers: persons["pledgers"],
      print: print === "nonPrint" ? 3 : print === "noMoney" ? 1 : 2,
      notices: notices === "send" ? true : false,
      sum_sell_price: persons["sum_sell_price"],
      sum_buy_price: persons["sum_buy_price"],
    });
    axios
      .post(base_url + "/v2/trade/store", jsonData)
      .then((response) => {
        console.log("Item Created", response.data);
        // Handle the response from the web service
        if (!response.data.status) {
          dispatch(
            showMessage({
              message: response.data.message.Data
                ? response.data.message.Data.Message
                : response.data.message, //text or html
              autoHideDuration: 6000, //ms
              anchorOrigin: {
                vertical: "top", //top bottom
                horizontal: "center", //left center right
              },
              variant: "error", //success error info warning null
            })
          );
          setShowProgressLoading(false);
        } else {
          setShowProgressLoading(false);
          navigate("/trade/list");
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Error sending JSON data:", error);
      });
  };
  const handleSubmitBack = () => {
    props.handleBack();
  };
  return (
    <>
      {showProgressLoading && <CircularIndeterminate />}
      <Card sx={{ margin: "10px", padding: "15px" }}>
        <Typography>
          هم اکنون ممکن است اطلاعات داخل این صفحه یطور کامل در دسترس نباشد
        </Typography>
        <Grid container marginBottom={2} marginTop={2} spacing={2}>
          <Grid item xl={2} md={4} xs={4}>
            <Typography>نوع مسیر:</Typography>
            {/* <Typography>داخلی</Typography> */}
          </Grid>
          <Grid item xl={2} md={4} xs={4}>
            <Typography>نوع درآمد:</Typography>
            {/* <Typography>بلیط ریلی داخلی</Typography> */}
          </Grid>
          <Grid item xl={2} md={4} xs={4}>
            <Typography>کل مبلغ فروش:</Typography>
            {/* <Typography>40 ریال</Typography> */}
          </Grid>
          <Grid item xl={2} md={4} xs={4}>
            <Typography>کل مبلغ خرید:</Typography>
            <Typography>{persons.sum_sell_price}</Typography>
          </Grid>
          <Grid item xl={2} md={4} xs={4}>
            <Typography>سود و زیان:</Typography>
            {/* <Typography>40 ریال</Typography> */}
          </Grid>
          <Grid item xl={2} md={4} xs={4}>
            <Typography>متعهدین:</Typography>
          </Grid>
        </Grid>
        {/* items */}
        <Grid container marginBottom={2} marginTop={2}>
          {sells &&
            sells.map((item) => {
              let sample = "";
              return (
                <>
                  <Card
                    variant="outlined"
                    sx={{
                      width: "100%",
                      padding: "15px",
                      marginBottom: "10px",
                    }}
                  >
                    <Box marginBottom={2} width={"100%"}>
                      {item.action === "route" && (
                        <Typography variant="h5">
                          بلیط {item.route.origin.title_fa}
                        </Typography>
                      )}
                      {item.action === "hotel" && (
                        <Typography variant="h5">
                          هتل {item.hotel.hotel.title}
                        </Typography>
                      )}
                      {item.action === "tour" && (
                        <Typography variant="h5">
                          تور {item.tour.tour.title}
                        </Typography>
                      )}
                      {item.action === "visa" && (
                        <Typography variant="h5">
                          ویزا {item.visa.visa.title}
                        </Typography>
                      )}
                      {item.action === "insurance" && (
                        <Typography variant="h5">
                          بیمه {item.insurance.insurance.title}
                        </Typography>
                      )}
                      {item.action === "service" && (
                        <Typography variant="h5">
                          خدمت {item.service.service.title}
                        </Typography>
                      )}
                    </Box>
                    {item.action === "route" && (
                      <Box
                        width={"100%"}
                        display={"flex"}
                        gap={2}
                        justifyContent={"space-evenly"}
                        marginBottom={"10px"}
                      >
                        <Box display={"flex"} gap={1}>
                          <Typography>شماره پرواز:</Typography>{" "}
                          <Typography>{item.route.flight_number}</Typography>
                        </Box>
                        <Box display={"flex"} gap={1}>
                          <Typography>شرکت:</Typography>{" "}
                          <Typography>{item.route.company.title_fa}</Typography>
                        </Box>
                        <Box display={"flex"} gap={1}>
                          <Typography>کلاس:</Typography>
                          {item.route.class.title_en}
                          <Typography></Typography>
                        </Box>
                        <Box display={"flex"} gap={1}>
                          <Typography>بار مجاز:</Typography>{" "}
                          <Typography>{item.route.allowed_cargo}</Typography>
                        </Box>
                        <Box display={"flex"} gap={1}>
                          <Typography>تاریخ:</Typography>{" "}
                          <Typography>{item.route.date_time_path}</Typography>
                        </Box>
                      </Box>
                    )}
                    {item.action === "hotel" && (
                      <Box
                        width={"100%"}
                        display={"flex"}
                        gap={2}
                        marginBottom={"10px"}
                      >
                        <Box display={"flex"} gap={1}>
                          <Typography>تاریخ:</Typography>{" "}
                          <Typography>
                            {item.hotel.hotel_in_date}{" "}
                            {item.hotel.hotel_in_time} تا{" "}
                            {item.hotel.hotel_out_date}{" "}
                            {item.hotel.hotel_out_time}{" "}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    <Grid container marginBottom={"10px"}>
                      <Grid item xl={6} xs={12} md={6}>
                        <Box
                          width={"100%"}
                          display={"flex"}
                          flexDirection={"column"}
                        >
                          <Typography>
                            {item.passenger
                              ? item.passenger.sex
                                ? "آقای "
                                : "خانم "
                              : ""}
                            {item.passenger
                              ? item.passenger.name_fa +
                                " " +
                                item.passenger.lastname_fa
                              : "موجود نیست"}
                            {item.passenger
                              ? " " +
                                (calculateAgeCategory(
                                  item.passenger.birthday
                                ) === "INF"
                                  ? "(نوزاد)"
                                  : calculateAgeCategory(
                                      item.passenger.birthday
                                    ) === "CHI"
                                  ? "(کودک)"
                                  : "(بزرگسال)")
                              : ""}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xl={6} xs={12} md={6}>
                        <Box
                          width={"100%"}
                          display={"flex"}
                          gap={2}
                          justifyContent={"space-between"}
                        >
                          <Box display={"flex"} gap={1}>
                            <Typography>خرید:</Typography>{" "}
                            <Typography>
                              {" "}
                              {item.buy
                                ? formatInputWithCommas(
                                    formatInputWithOutCommas(
                                      item.buy.toString()
                                    )
                                  )
                                : 0}{" "}
                              ریال
                            </Typography>
                          </Box>
                          <Box display={"flex"} gap={1}>
                            <Typography>فروش:</Typography>{" "}
                            <Typography>
                              {" "}
                              {formatInputWithCommas(
                                formatInputWithOutCommas(item.sell.toString())
                              )}{" "}
                              ریال
                            </Typography>
                          </Box>
                          <Box display={"flex"} gap={1}>
                            <Typography>سود:</Typography>{" "}
                            <Typography>
                              {" "}
                              {formatInputWithCommas(
                                (
                                  formatInputWithOutCommas(
                                    item.sell.toString()
                                  ) -
                                  formatInputWithOutCommas(item.buy.toString())
                                ).toString()
                              )}{" "}
                              ریال
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container marginBottom={"10px"}>
                      <Grid item xl={2.4} xs={12} md={6}>
                        <Box display={"flex"} gap={1}>
                          <Typography>کد ملی:</Typography>{" "}
                          <Typography>
                            {item.passenger
                              ? item.passenger.national_code
                              : "موجود نیست"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xl={2.4} xs={12} md={6}>
                        {" "}
                        <Box display={"flex"} gap={1}>
                          <Typography>تاریخ تولد:</Typography>{" "}
                          <Typography>
                            {item.passenger
                              ? item.passenger.birthday
                              : "موجود نیست"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xl={2.4} xs={12} md={6}>
                        <Box display={"flex"} gap={1}>
                          <Typography>شماره گذرنامه:</Typography>{" "}
                          <Typography>
                            {" "}
                            {item.passenger
                              ? item.passenger.pass_code
                              : "موجود نیست"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xl={2.4} xs={12} md={6}>
                        <Box display={"flex"} gap={1}>
                          <Typography>انقضا:</Typography>{" "}
                          <Typography>
                            {" "}
                            {item.passenger
                              ? item.passenger.pass_ex
                              : "موجود نیست"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xl={2.4} xs={12} md={6}>
                        <Box display={"flex"} gap={1}>
                          <Typography>موبایل:</Typography>{" "}
                          <Typography>
                            {" "}
                            {item.passenger
                              ? item.passenger.phone_number
                              : "موجود نیست"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </>
              );
            })}
        </Grid>
        {/* end items */}
      </Card>
      <Box display={"flex"} gap={"5px"} justifyContent={"space-between"}>
        <Box display={"flex"} gap={"5px"}>
          <Paper
            elevation={0}
            sx={{
              width: "180px",
              display: "flex",
              justifyContent: "center",
              border: (theme) => `1px solid ${theme.palette.divider}`,
              flexWrap: "wrap",
            }}
          >
            <StyledToggleButtonGroup
              size="small"
              value={print}
              exclusive
              onChange={handlePrint}
              aria-label="text alignment"
            >
              <ToggleButton value="nonPrint" aria-label="left aligned">
                <Tooltip title="بدون چاپ">
                  <PrintDisabledIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="noMoney" aria-label="centered">
                <Tooltip title="چاپ بدون قیمت">
                  <MoneyOffIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="withMoney" aria-label="right aligned">
                <Tooltip title="چاپ با قیمت">
                  <PriceCheckIcon />
                </Tooltip>
              </ToggleButton>
            </StyledToggleButtonGroup>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              width: "180px",
              display: "flex",
              justifyContent: "center",
              border: (theme) => `1px solid ${theme.palette.divider}`,
              flexWrap: "wrap",
            }}
          >
            <StyledToggleButtonGroup
              size="small"
              value={notices}
              exclusive
              onChange={handleNotices}
              aria-label="text alignment"
            >
              <ToggleButton value="send" aria-label="left aligned">
                <Tooltip title="ارسال پیامک">
                  <SmsIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="noSend" aria-label="centered">
                <Tooltip title="عدم ارسال پیامک">
                  <SpeakerNotesOffIcon />
                </Tooltip>
              </ToggleButton>
            </StyledToggleButtonGroup>
          </Paper>
        </Box>
      <Box display={"flex"} gap={"5px"}>
        <Button onClick={handleSubmitBack} size="large" variant="contained">
          قبلی
        </Button>
        <Button
          sx={{ display: "hidden" }}
          color="secondary"
          onClick={handleSubmitNext}
          size="large"
          variant="contained"
        >
          ثبت نهایی
        </Button>
      </Box>
        
      </Box>
    </>
  );
};

export default ShowStatus;
