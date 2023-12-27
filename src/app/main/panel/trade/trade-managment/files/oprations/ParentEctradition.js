import React from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import Checkbox from "@mui/material/Checkbox";
import { formatInputWithCommas, formatInputWithOutCommas } from "./functions";

// end add new item
//start Extradition
const Extradition = (props) => {
  //initial values
  const [isCheckedCopy, setIsCheckedCopy] = useState(false);
  const [buyPrice, setBuyPrice] = useState(props.item.data.buy);
  const [sellPrice, setSellPrice] = useState(props.item.data.sell);
  const [passengerName, setPassengerName] = useState(
    props.item.data.person.name_fa + " " + props.item.data.person.lastname_fa
  );
  const [detail, setDeatil] = useState("");
  const [counter, setCounter] = useState(props.item.counter);

  const [buyPenaltyPercent, setBuyPenaltyPercent] = useState(
    isCheckedCopy ? props.copyPenaltyBuyPercent : ""
  );
  const [buyPenaltyPrice, setBuyPenaltyPrice] = useState("");
  const [sellPenaltyPercent, setSellPenaltyPercent] = useState(
    isCheckedCopy ? props.copyPenaltySellPercent : ""
  );
  const [sellPenaltyPrice, setSellPenaltyPrice] = useState("");
  const [extraditionDate, setExtraditionDate] = useState(
    isCheckedCopy ? props.copyExtraditionDate : null
  );
  const [inputDescription, setInputDescription] = useState(
    isCheckedCopy ? props.copyReason : ""
  );

  //handle copy
  useEffect(() => {
    if (isCheckedCopy) {
      // Update local state when the copyPenaltyBuyPercent prop changes
      setBuyPenaltyPercent(props.copyPenaltyBuyPercent);
      setBuyPenaltyPrice(
        formatInputWithCommas(
          Math.round((props.copyPenaltyBuyPercent / 100) * buyPrice).toString()
        )
      );
      props.handleChange(
        props.item.id,
        "penalty_buy_percent",
        props.copyPenaltyBuyPercent
      );
      props.handleChange(
        props.item.id,
        "penalty_buy_price",
        (props.copyPenaltyBuyPercent / 100) * buyPrice
      );
    }
  }, [props.copyPenaltyBuyPercent]);
  useEffect(() => {
    if (isCheckedCopy) {
      setSellPenaltyPercent(props.copyPenaltySellPercent);
      setSellPenaltyPrice(
        formatInputWithCommas(
          Math.round(
            (props.copyPenaltySellPercent / 100) * sellPrice
          ).toString()
        )
      );
      props.handleChange(
        props.item.id,
        "penalty_sell_percent",
        props.copyPenaltySellPercent
      );
      props.handleChange(
        props.item.id,
        "penalty_sell_price",
        (props.copyPenaltySellPercent / 100) * sellPrice
      );
    }
  }, [props.copyPenaltySellPercent]);
  useEffect(() => {
    if (isCheckedCopy) {
      setInputDescription(props.copyReason);
      props.handleChange(props.item.id, "reason", props.copyReason);
    }
  }, [props.copyReason]);
  useEffect(() => {
    if (isCheckedCopy) {
      setExtraditionDate(props.copyExtraditionDate);
      props.handleChange(
        props.item.id,
        "extradition_date",
        props.copyExtraditionDate.toLocaleDateString("fa-IR")
      );
    }
  }, [props.copyExtraditionDate]);
  return (
    <>
      <Box border={1} padding={1} marginTop={2} marginBottom={2}>
        <Box marginBottom={2}>
          <Grid container>
            <Grid item xl={0.5} md={0.5} xs={12}>
              <Box
                paddingTop={1}
                paddingBottom={1}
                justifyContent={"center"}
                alignItems={"center"}
                display="flex"
                flexDirection="row"
                width={"100%"}
                height={"100%"}
                gap={2}
                bgcolor={"#fee2e2"}
              >
                <Typography sx={{ fontSize: "12px" }}>#</Typography>
                <Typography sx={{ fontSize: "12px" }}>{counter}</Typography>
              </Box>
            </Grid>
            <Grid item xl={2.5} md={2.5} xs={12}>
              <Box
                paddingTop={1}
                paddingBottom={1}
                justifyContent={"center"}
                alignItems={"center"}
                display="flex"
                flexDirection="row"
                width={"100%"}
                height={"100%"}
                gap={2}
                bgcolor={"#fef2f2"}
              >
                <Typography sx={{ fontSize: "12px" }}>خرید</Typography>
                <Typography sx={{ fontSize: "12px" }}>{buyPrice}</Typography>
              </Box>
            </Grid>
            <Grid item xl={3} md={3} xs={12}>
              <Box
                paddingTop={1}
                paddingBottom={1}
                justifyContent={"center"}
                alignItems={"center"}
                display="flex"
                flexDirection="row"
                width={"100%"}
                height={"100%"}
                gap={2}
                bgcolor={"#fee2e2"}
              >
                <Typography sx={{ fontSize: "12px" }}>فروش</Typography>
                <Typography sx={{ fontSize: "12px" }}>{sellPrice}</Typography>
              </Box>
            </Grid>
            <Grid item xl={2} md={2} xs={12}>
              <Box
                paddingTop={1}
                paddingBottom={1}
                justifyContent={"center"}
                alignItems={"center"}
                display="flex"
                flexDirection="row"
                width={"100%"}
                height={"100%"}
                gap={2}
                bgcolor={"#fef2f2"}
              >
                <Typography sx={{ fontSize: "12px" }}>مسافر</Typography>
                <Typography sx={{ fontSize: "12px" }}>
                  {passengerName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xl={3} md={3} xs={12}>
              <Box
                paddingTop={1}
                paddingBottom={1}
                justifyContent={"center"}
                alignItems={"center"}
                display="flex"
                flexDirection="row"
                width={"100%"}
                height={"100%"}
                gap={2}
                bgcolor={"#fee2e2"}
              >
                <Typography sx={{ fontSize: "12px" }}>جزئیات:</Typography>
                <Typography sx={{ fontSize: "12px" }}>
                  باید اضافه شود به api
                </Typography>
              </Box>
            </Grid>
            <Grid item xl={1} md={1} xs={12}>
              <Box
                paddingTop={1}
                paddingBottom={1}
                justifyContent={"center"}
                alignItems={"center"}
                display="flex"
                flexDirection="row"
                width={"100%"}
                height={"100%"}
                gap={2}
                bgcolor={"#fef2f2"}
              >
                <Typography sx={{ fontSize: "12px" }}>حذف</Typography>
                <Typography sx={{ fontSize: "12px" }}></Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={1}>
            <Grid item xl={3} md={3} xs={12} container spacing={1}>
              <Grid item xl={4} md={6} xs={12}>
                <TextField
                  disabled={!buyPrice}
                  value={buyPenaltyPercent}
                  sx={{ width: "100%" }}
                  label="درصد جریمه خرید"
                  inputMode="numeric"
                  type="number"
                  onChange={(e) => {
                    if (isCheckedCopy) {
                      props.setCopyPenaltyBuyPercent(e.target.value);
                    }
                    if (
                      e.target.value &&
                      buyPrice &&
                      parseInt(e.target.value) >= 0 &&
                      parseInt(e.target.value) <= 100
                    ) {
                      setBuyPenaltyPercent(e.target.value);
                      setBuyPenaltyPrice(
                        formatInputWithCommas(
                          Math.round(
                            (parseInt(e.target.value) / 100) *
                            parseInt(buyPrice)
                          ).toString()
                        )
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_percent",
                        e.target.value
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_price",
                        (parseInt(formatInputWithOutCommas(e.target.value)) /
                          100) *
                        parseInt(
                          formatInputWithOutCommas(buyPrice.toString())
                        )
                      );
                    } else {
                      setBuyPenaltyPercent("");
                      setBuyPenaltyPrice("");
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_percent",
                        ""
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_price",
                        ""
                      );
                    }
                  }}
                />
              </Grid>
              <Grid item xl={8} md={6} xs={12}>
                <TextField
                  disabled={!buyPrice}
                  value={buyPenaltyPrice}
                  sx={{ width: "100%" }}
                  label="مبلغ جریمه خرید"
                  onChange={(e) => {
                    if (
                      e.target.value &&
                      buyPrice &&
                      parseInt(e.target.value) >= 0 &&
                      parseInt(e.target.value) <= parseInt(buyPrice)
                    ) {
                      setBuyPenaltyPrice(formatInputWithCommas(e.target.value));
                      setBuyPenaltyPercent(
                        parseInt(
                          (parseInt(formatInputWithOutCommas(e.target.value)) /
                            parseInt(
                              formatInputWithOutCommas(buyPrice.toString())
                            )) *
                          100
                        )
                      );

                      props.handleChange(
                        props.item.id,
                        "penalty_buy_percent",
                        parseInt(
                          (parseInt(formatInputWithOutCommas(e.target.value)) /
                            parseInt(
                              formatInputWithOutCommas(buyPrice.toString())
                            )) *
                          100
                        )
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_price",
                        formatInputWithOutCommas(e.target.value)
                      );
                    } else {
                      setBuyPenaltyPercent("");
                      setBuyPenaltyPrice("");
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_percent",
                        ""
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_price",
                        ""
                      );
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xl={3} md={3} xs={12} container spacing={1}>
              <Grid item xl={4} md={6} xs={12}>
                <TextField
                  disabled={!sellPrice}
                  value={sellPenaltyPercent}
                  sx={{ width: "100%" }}
                  label="درصد جریمه فروش"
                  onChange={(e) => {
                    if (isCheckedCopy) {
                      props.setCopyPenaltySellPercent(e.target.value);
                    }
                    if (
                      e.target.value &&
                      sellPrice &&
                      parseInt(e.target.value) >= 0 &&
                      parseInt(e.target.value) <= 100
                    ) {
                      setSellPenaltyPercent(e.target.value);
                      setSellPenaltyPrice(
                        formatInputWithCommas(
                          Math.round(
                            (parseInt(e.target.value) / 100) *
                            parseInt(sellPrice)
                          ).toString()
                        )
                      );

                      props.handleChange(
                        props.item.id,
                        "penalty_sell_percent",
                        e.target.value
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_sell_price",
                        (parseInt(formatInputWithOutCommas(e.target.value)) /
                          100) *
                        parseInt(
                          formatInputWithOutCommas(sellPrice.toString())
                        )
                      );
                    } else {
                      setSellPenaltyPercent("");
                      setSellPenaltyPrice("");
                      props.handleChange(
                        props.item.id,
                        "penalty_sell_percent",
                        ""
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_sell_price",
                        ""
                      );
                    }
                  }}
                />
              </Grid>
              <Grid item xl={8} md={6} xs={12}>
                <TextField
                  disabled={!sellPrice}
                  value={sellPenaltyPrice}
                  sx={{ width: "100%" }}
                  label="مبلغ جریمه فروش"
                  onChange={(e) => {
                    if (
                      e.target.value &&
                      sellPrice &&
                      parseInt(e.target.value) >= 0 &&
                      parseInt(e.target.value) <= parseInt(sellPrice)
                    ) {
                      setSellPenaltyPrice(
                        formatInputWithCommas(e.target.value)
                      );
                      setSellPenaltyPercent(
                        parseInt(
                          (parseInt(formatInputWithOutCommas(e.target.value)) /
                            parseInt(
                              formatInputWithOutCommas(sellPrice.toString())
                            )) *
                          100
                        )
                      );

                      props.handleChange(
                        props.item.id,
                        "penalty_sell_percent",
                        parseInt(
                          (parseInt(formatInputWithOutCommas(e.target.value)) /
                            parseInt(
                              formatInputWithOutCommas(sellPrice.toString())
                            )) *
                          100
                        )
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_sell_price",
                        formatInputWithOutCommas(e.target.value)
                      );
                    } else {
                      setSellPenaltyPercent("");
                      setSellPenaltyPrice("");
                      props.handleChange(
                        props.item.id,
                        "penalty_sell_percent",
                        ""
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_sell_price",
                        ""
                      );
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xl={2} md={2} xs={12} container>
              <LocalizationProvider
                sx={{ width: "100%" }}
                s
                dateAdapter={AdapterDateFnsJalali}
              >
                <DatePicker
                  value={extraditionDate}
                  sx={{ width: "100%" }}
                  disablePast
                  views={["year", "month", "day"]}
                  label="تاریخ استرداد"
                  onChange={(value) => {
                    if (isCheckedCopy) {
                      props.setCopyExtraditionDate(value);
                    }
                    const formattedDate = value
                      ? value.toLocaleDateString("fa-IR")
                      : null;
                    setExtraditionDate(extraditionDate);
                    props.handleChange(
                      props.item.id,
                      "extradition_date",
                      formattedDate
                    );
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xl={3} md={3} xs={12} container>
              {" "}
              <TextField
                value={inputDescription}
                onChange={(e) => {
                  if (isCheckedCopy) {
                    props.setCopyReason(e.target.value);
                  }
                  setInputDescription(e.target.value);
                  props.handleChange(props.item.id, "reason", e.target.value);
                }}
                sx={{ width: "100%" }}
                label="علت استرداد"
              />
            </Grid>
            <Grid item xl={1} md={1} xs={12} container>
              {" "}
              حذف
              <Checkbox
                checked={isCheckedCopy}
                onChange={(e) => {
                  setIsCheckedCopy(e.target.checked);
                  props.handleChange(
                    props.item.id,
                    "is_Checked_copy",
                    e.target.checked
                  );
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export const ParentEctradition = (props) => {
  const [copyPenaltyBuyPercent, setCopyPenaltyBuyPercent] = useState("");
  const [copyPenaltySellPercent, setCopyPenaltySellPercent] = useState("");
  const [copyReason, setCopyReason] = useState("");
  const [copyExtraditionDate, setCopyExtraditionDate] = useState(null);

  return (
    <>
      {props.items.map((item) => (
        <Extradition
          copyPenaltyBuyPercent={copyPenaltyBuyPercent}
          setCopyPenaltyBuyPercent={setCopyPenaltyBuyPercent}
          copyPenaltySellPercent={copyPenaltySellPercent}
          setCopyPenaltySellPercent={setCopyPenaltySellPercent}
          copyReason={copyReason}
          setCopyReason={setCopyReason}
          copyExtraditionDate={copyExtraditionDate}
          setCopyExtraditionDate={setCopyExtraditionDate}
          handleChange={props.handleChange}
          item={item}
        />
      ))}
    </>
  );
};
