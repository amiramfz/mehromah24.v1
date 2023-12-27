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
  Typography,
  styled,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import calculateAgeCategory from "src/app/custom-components/agegroupe";
import Divider from "@mui/material/Divider";
import { formatInputWithCommas, formatInputWithOutCommas } from "./functions";

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

export const ShowStatusComponent = (props) => {
  const [reference, setReference] = React.useState(props.refrence);
  // initial json

  //for ptint
  const [print, setPrint] = React.useState("nonPrint");
  const handlePrint = (event, newPrint) => {
    if (print !== null) {
      setPrint(newPrint);
    }
  };

  return (
    <>
      <Card sx={{ margin: "10px", padding: "15px" }}>
        <Typography>
          در این مرحله اطلاعات این صفحه ممکن است صحیح نباشد
        </Typography>
        <Grid container>
          {/* header */}
          <Grid
            item
            xl={2}
            md={3}
            xs={12}
            container
            marginBottom={2}
            marginTop={2}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              width={"100%"}
              gap={"10px"}
            >
              <Box
                display={"flex"}
                justifyContent={"center"}
                width={"100%"}
                gap={1}
              >
                <img style={{ maxWidth: "180px" }} src="./logo-new.png" />
              </Box>
              <Box
                display={"flex"}
                gap={1}
                justifyContent={"space-between"}
                margin={"0 15px"}
              >
                <Typography>نوع مسیر:</Typography>
                <Typography>
                  {reference.internal ? "داخلی" : "خارجی"}
                </Typography>
              </Box>
              <Box
                marginTop={1}
                marginBottom={1}
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
              >
                <Divider style={{ width: "90%" }} />
              </Box>
              <Box
                display={"flex"}
                gap={1}
                justifyContent={"space-between"}
                margin={"0 15px"}
              >
                {/* TODO add income title to api */}

                <Typography>نوع درآمد:</Typography>
                <Typography></Typography>
              </Box>
              <Box
                marginTop={1}
                marginBottom={1}
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
              >
                <Divider style={{ width: "90%" }} />
              </Box>
              <Box
                display={"flex"}
                gap={1}
                justifyContent={"space-between"}
                margin={"0 15px"}
              >
                <Typography>کل مبلغ فروش:</Typography>
                <Typography>
                  {formatInputWithCommas(reference.sum_buy_price)}
                </Typography>
              </Box>
              <Box
                marginTop={1}
                marginBottom={1}
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
              >
                <Divider style={{ width: "90%" }} />
              </Box>
              <Box
                display={"flex"}
                gap={1}
                justifyContent={"space-between"}
                margin={"0 15px"}
              >
                <Typography>کل مبلغ خرید:</Typography>
                <Typography>
                  {formatInputWithCommas(reference.sum_sell_price)}
                </Typography>
              </Box>
              <Box
                marginTop={1}
                marginBottom={1}
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
              >
                <Divider style={{ width: "90%" }} />
              </Box>
              <Box
                display={"flex"}
                gap={1}
                justifyContent={"space-between"}
                margin={"0 15px"}
              >
                <Typography>سود و زیان:</Typography>
                <Typography
                  sx={{
                    color:
                      parseInt(reference.sum_sell_price) -
                        parseInt(reference.sum_buy_price) >
                      0
                        ? "green"
                        : "red",
                  }}
                >
                  {formatInputWithCommas(
                    parseInt(reference.sum_sell_price) -
                      parseInt(reference.sum_buy_price)
                  )}
                </Typography>
              </Box>
              <Box
                marginTop={1}
                marginBottom={1}
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
              >
                <Divider style={{ width: "90%" }} />
              </Box>
              <Box
                display={"flex"}
                gap={1}
                justifyContent={"space-between"}
                margin={"0 15px"}
                flexDirection={"column"}
              >
                <Typography>
                  متعهدین:
                  <br />
                </Typography>
                {reference.pledgers.map((item, index) => {
                  return (
                    <Typography color={"primary.main"} key={index}>
                      {index + 1 + ". " + item.text}
                    </Typography>
                  );
                })}
              </Box>
            </Box>
          </Grid>
          {/* items */}
          <Grid
            item
            xl={10}
            md={9}
            xs={12}
            container
            marginBottom={2}
            marginTop={2}
          >
            {reference &&
              reference.data.map((item) => {
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
                        <Typography variant="h6">{item.title.fa}</Typography>
                        {/* {item.action === "route" && (
                          <Typography variant="h6">{item.title.fa}</Typography>
                        )}
                        {item.action === "hotel" && (
                          <Typography variant="h6">
                            هتل {item.hotel.hotel_name}
                          </Typography>
                        )}
                        {item.action === "tour" && (
                          <Typography variant="h4">
                            تور {item.tour.name}
                          </Typography>
                        )}
                        {item.action === "visa" && (
                          <Typography variant="h6">
                            ویزا {item.visa.name}
                          </Typography>
                        )}
                        {item.action === "insurance" && (
                          <Typography variant="h6">
                            بیمه {item.insurance.name}
                          </Typography>
                        )}
                        {item.action === "service" && (
                          <Typography variant="h6">
                            خدمت {item.service.name}
                          </Typography>
                        )} */}
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
                            <Typography fontSize={"14px"}>
                              شماره پرواز:
                            </Typography>{" "}
                            <Typography fontSize={"14px"}>
                              {item.route.flight_number && item.route.flight_number}
                            </Typography>
                          </Box>
                          <Box display={"flex"} gap={1}>
                            <Typography fontSize={"14px"}>شرکت:</Typography>{" "}
                            <Typography fontSize={"14px"}>
                              {item.route.company &&
                                item.route.company.title_fa}
                            </Typography>
                          </Box>
                          <Box display={"flex"} gap={1}>
                            <Typography fontSize={"14px"}>کلاس:</Typography>

                            <Typography fontSize={"14px"}>
                              {" "}
                              {item.route.class && item.route.class.title_en}
                            </Typography>
                          </Box>
                          <Box display={"flex"} gap={1}>
                            <Typography fontSize={"14px"}>بار مجاز:</Typography>{" "}
                            <Typography fontSize={"14px"}>
                              {item.route.allowed_cargo && item.route.allowed_cargo}
                            </Typography>
                          </Box>
                          <Box display={"flex"} gap={1}>
                            <Typography fontSize={"14px"}>تاریخ:</Typography>{" "}
                            <Typography fontSize={"14px"}>
                              {item.route.date_time_path && item.route.date_time_path}
                            </Typography>
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
                            <Typography fontSize={"14px"}>تاریخ:</Typography>{" "}
                            <Typography fontSize={"14px"}>
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
                            <Typography fontSize={"14px"}>
                              {item.passenger.sex ? "آقای " : "خانم "}
                              {item.passenger
                                ? item.passenger.name_fa +
                                  " " +
                                  item.passenger.lastname_fa
                                : "موجود نیست"}
                              {" " +
                                (calculateAgeCategory(
                                  item.passenger.birthday
                                ) === "INF"
                                  ? "(نوزاد)"
                                  : calculateAgeCategory(
                                      item.passenger.birthday
                                    ) === "CHI"
                                  ? "(کودک)"
                                  : "(بزرگسال)")}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item container xl={6} xs={12} md={6}>
                          <Grid item xl={4} xs={12} md={4}>
                            <Box display={"flex"} gap={1}>
                              <Typography fontSize={"14px"}>خرید:</Typography>{" "}
                              <Typography fontSize={"14px"}>
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
                          </Grid>
                          <Grid item xl={4} xs={12} md={4}>
                            <Box display={"flex"} gap={1}>
                              <Typography fontSize={"14px"}>فروش:</Typography>{" "}
                              <Typography fontSize={"14px"}>
                                {" "}
                                {formatInputWithCommas(
                                  formatInputWithOutCommas(item.sell.toString())
                                )}{" "}
                                ریال
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xl={4} xs={12} md={4}>
                            <Box display={"flex"} gap={1}>
                              <Typography fontSize={"14px"}>سود:</Typography>{" "}
                              <Typography
                                sx={{
                                  color:
                                    item.sell - item.buy > 0 ? "green" : "red",
                                }}
                                fontSize={"14px"}
                              >
                                {" "}
                                {formatInputWithCommas(
                                  (
                                    formatInputWithOutCommas(
                                      item.sell.toString()
                                    ) -
                                    formatInputWithOutCommas(
                                      item.buy.toString()
                                    )
                                  ).toString()
                                )}{" "}
                                ریال
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid container marginBottom={"10px"}>
                        <Grid item xl={2.4} xs={12} md={6}>
                          <Box display={"flex"} gap={1}>
                            <Typography fontSize={"14px"}>کد ملی:</Typography>{" "}
                            <Typography fontSize={"14px"}>
                              {item.passenger
                                ? item.passenger.national_code
                                : "موجود نیست"}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xl={2.4} xs={12} md={6}>
                          {" "}
                          <Box display={"flex"} gap={1}>
                            <Typography fontSize={"14px"}>
                              تاریخ تولد:
                            </Typography>{" "}
                            <Typography fontSize={"14px"}>
                              {item.passenger
                                ? item.passenger.birthday
                                : "موجود نیست"}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xl={2.4} xs={12} md={6}>
                          <Box display={"flex"} gap={1}>
                            <Typography fontSize={"14px"}>
                              شماره گذرنامه:
                            </Typography>{" "}
                            <Typography fontSize={"14px"}>
                              {" "}
                              {item.passenger
                                ? item.passenger.pass_code
                                : "موجود نیست"}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xl={2.4} xs={12} md={6}>
                          <Box display={"flex"} gap={1}>
                            <Typography fontSize={"14px"}>انقضا:</Typography>{" "}
                            <Typography fontSize={"14px"}>
                              {" "}
                              {item.passenger
                                ? item.passenger.pass_ex
                                : "موجود نیست"}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xl={2.4} xs={12} md={6}>
                          <Box display={"flex"} gap={1}>
                            <Typography fontSize={"14px"}>موبایل:</Typography>{" "}
                            <Typography fontSize={"14px"}>
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
        </Grid>
      </Card>

      {/* end items */}
    </>
  );
};

const data = {
  income_id: "1",
  serial_id: 5115,
  data: [
    {
      serial_id: 22445,
      action: "hotel",
      title: {
        fa: "هتل اقامتگاه بومگردی دنج هرمز از 1402/09/26 تا 1402/09/28 | دوتخته | دبل | کلبه- فقط اقامت بدونه صبحانه (2 شب)",
        en: "Hotel Homestay in Hormuz From 1402/09/26 until 1402/09/28 | دوتخته | دبل | کلبه- فقط اقامت بدونه صبحانه (2 nights)",
      },
      passenger: {
        passenger_id: 33566,
        national_code: "3380214272",
        birthday: "1359/10/12",
        name_en: "MOJTABA",
        lastname_en: "DARVISHI",
        name_fa: "مجتبی",
        lastname_fa: "درویشی",
        pass_code: "",
        pass_ex: null,
        phone_number: "09130115470",
        citizenship: {
          id: 118,
          iso: "IR",
          fa_name: "ایران",
          en_name: "Iran",
          fa_nationality: "ایرانی",
          en_nationality: "Iranian",
        },
        sex: true,
        pass_image: false,
        national_image: false,
      },
      hotel: {
        type: null,
        hotel_in_date: "1402/09/26",
        hotel_out_date: "1402/09/28",
        hotel_in_time: "14:00",
        hotel_out_time: "12:00",
        addition_beds: "",
        description: "کلبه- فقط اقامت بدونه صبحانه",
        room_rate: "دبل",
        hotel: {
          id: 1051,
          title: "اقامتگاه بومگردی دنج هرمز",
          title_fa: "Homestay in Hormuz",
          rate: 1,
          country: 118,
          state: 29,
          city: 483,
          logo: null,
          status: 1,
        },
        room_view: {
          title_fa: "",
        },
        room_type: {
          title_fa: "دوتخته",
        },
        roommate: [],
      },
      sell: 43000000,
      buy: 30300000,
      serial: false,
      provider: {
        id: 80,
        title_fa: "آبنوس گشت تهران (پرتو)",
        title_en: "آبنوس گشت تهران (پرتو)",
        first_name: "",
        last_name: "",
        credit_amount: null,
        status: 1,
      },
      deadline: null,
    },
  ],
  pays: {
    receive: [
      {
        id: 15859,
        object: {
          id: "reference-5115",
          text: "رفرنس 15115",
          data: false,
        },
        type_pay: {
          id: "contract",
          text: "قراردادها",
        },
        deadline: null,
        account_party_type: {
          id: 8200,
          text: "همکار",
        },
        account_party: {
          id: "colleague-167",
          text: "هلدینگ انتخاب - شرکت امین برتر  اقتصاد میلاد (اسنوا)",
          data: {
            id: 167,
            office: "هلدینگ انتخاب - شرکت امین برتر  اقتصاد میلاد (اسنوا)",
            category: 7,
            type: 2,
            type_checkout: 1,
            code_accounting: 1,
            relationship: null,
            first_name: "",
            last_name: "",
            position: "",
            phone: 0,
            mobile: 0,
            email: "",
            site: "",
            country: 118,
            state: 4,
            city: 37,
            address: "",
            credit_amount: "10000000000",
            checkout_deadline: 0,
            wage: null,
            description: "",
            logo: null,
            additional:
              '[{"information":{"registered_name":"شرکت بازرگانی امین برتر اقتصاد میلاد","national_id":"10260594712","registration_id":"408714","economic_code":"411386448639","phone":"03133337948","postal_code":"1157914731","country":"IR","state":"تهران","city":"تهران","address":" استان تهران - منطقه،11 شهرستان تهران ، بخش مرکزي ، شهر تهران، محله سه راه امين حضور ، خيابان شهيد دکترعبدالحميددیالمه ، بن بست شهيد سيدعلی موحدي"}}]',
            api_details:
              '{"SEPEHR":{"ID":"","URL":"","USER":"","PASS":"","TRANSACTION":0},"RAVIS":{"ID":"0","URL":"","USER":"","PASS":"","TRANSACTION":0}}',
            status: 1,
            created_at: "2023-08-15T11:45:57.000000Z",
            updated_at: "2023-11-19T07:39:37.000000Z",
          },
        },
        currency_amount: 43000000,
        wage: 0,
        functor_type: "",
        functor_account: false,
        tracking_code: null,
        documents: null,
        description: null,
        financial_lock: null,
        status: {
          id: 1,
          text: "در حال بررسی ",
        },
      },
    ],
    payment: [],
    operation: {
      sum_payment: 0,
      sum_receive: 43000000,
    },
  },
  pledgers: [
    {
      item_id: 5666,
      id: "colleague-167",
      type: "colleague",
      text: "هلدینگ انتخاب - شرکت امین برتر  اقتصاد میلاد (اسنوا)",
      data: {
        id: 5666,
        amount: 43000000,
      },
      price: 43000000,
      credit_value: 10399905873,
    },
  ],
  internal: true,
  passengers: [
    {
      passenger_id: 33566,
      national_code: "3380214272",
      birthday: "1359/10/12",
      name_en: "MOJTABA",
      lastname_en: "DARVISHI",
      name_fa: "مجتبی",
      lastname_fa: "درویشی",
      pass_code: "",
      pass_ex: null,
      phone_number: "09130115470",
      citizenship: {
        id: 118,
        iso: "IR",
        fa_name: "ایران",
        en_name: "Iran",
        fa_nationality: "ایرانی",
        en_nationality: "Iranian",
      },
      sex: true,
      pass_image: false,
      national_image: false,
    },
  ],
  sum_sell_price: 43000000,
  sum_sell_penalty: 0,
  sum_sell_return: 0,
  sum_buy_price: 30300000,
  sum_buy_penalty: 0,
  sum_buy_return: 0,
  print: {
    id: 1,
    title: {
      fa: "مشاهده بدون قیمت",
      en: "view without price",
    },
  },
  description: null,
  financial_description: null,
  status: {
    id: 1,
    title: "صندوق",
  },
  operator: {
    id: 6,
    personnel_id: 1002,
    first_name: "انیسه",
    last_name: "حق شناس",
  },
  leader: {
    id: 33566,
    first_name: "MOJTABA",
    last_name: "DARVISHI",
    mobile: "09130115470",
  },
  slug: "3IQQS",
  created: "2023-12-16 10:51:07",
};
