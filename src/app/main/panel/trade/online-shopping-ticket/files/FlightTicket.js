import { Box, borderRadius } from "@mui/system";
import React, { useState } from "react";
import Card from "@mui/material/Card";
import { Grid, Typography } from "@mui/material";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import Button from "@mui/material/Button";
import { useCollapse } from "react-collapsed";
import Chip from "@mui/material/Chip";
import ThreeSixtyRoundedIcon from "@mui/icons-material/ThreeSixtyRounded";
import { convertToPersianDate } from "../../trade-managment/files/oprations/functions";
import { formatInputWithCommas } from "../../../customers/Customer-department/files/functions";
import { host_url } from "src/app/constant";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import { data } from "autoprefixer";
import { position } from "stylis";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export const FlightTicket = ({
  item,
  handleClickSubmitTicket,
  handleClickShowDetail,
}) => {
  const [collapsedAction, setCollapsedAction] = useState("");
  const { getCollapseProps, getToggleProps, isExpanded, setExpanded } =
    useCollapse();
  return (
    <Card
      sx={{
        marginBottom: "16px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Add a light shadow
      }}
    >
      <Box>
        <Grid container>
          <Grid
            item
            xs={0}
            sm={0}
            md={0.25}
            lg={0.25}
            xl={0.25}
            sx={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            className="bg-gray-400-i"
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                writingMode: "vertical-lr",
                textOrientation: "mixed",
                gap: "5px",
              }}
            >
              <Typography
                sx={{ fontSize: "10px", color: "white", fontStyle: "bold" }}
              >
                {item.FlightType === "Charter" ? "چارتری" : "سیستمی"}{" "}
              </Typography>
              <Typography
                sx={{ fontSize: "10px", color: "white", fontStyle: "bold" }}
              >
                {item.Service}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
            <Box
              width={"100%"}
              height={"100%"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              padding={"10px"}
              gap={1}
            >
              <Box
                maxWidth={"80px"}
                maxHeight={"80px"}
                // borderRadius="50%"
                // overflow="hidden"
              >
                <img
                  src={host_url + "/media/airlines/" + item.Airline.logo}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              {/* <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={1}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "10px" }}>
                  شماره پرواز
                </Typography>
                <Typography sx={{ fontSize: "10px" }}>
                  {item.FlightNumber}
                </Typography>
              </Box> */}
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box
              width={"100%"}
              height={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              padding={"10px"}
            >
              <Box
                width={"100%"}
                display={"flex"}
                gap={1}
                alignItems={"end"}
                justifyContent={"center"}
              >
                <Box display={"flex"} flexDirection={"column"} gap={1}>
                  <Box display={"flex"} gap={1} justifyContent={"center"}>
                    <Typography sx={{ fontSize: "16px" }}>
                      {item.Origin.Iata.title_fa}
                    </Typography>
                    <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
                      {item.DepartureDateTime
                        ? item.DepartureDateTime.split(" ")[1].split(":")[0] +
                          ":" +
                          item.DepartureDateTime.split(" ")[1].split(":")[1]
                        : ""}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: "8px" }}>
                    {item.DepartureDateTime
                      ? convertToPersianDate(item.DepartureDateTime)
                      : ""}
                  </Typography>
                </Box>
                <img width={"170px"} src="./custom_assets/flight-route.png" />
                <Box display={"flex"} flexDirection={"column"} gap={1}>
                  <Box display={"flex"} gap={1} justifyContent={"center"}>
                    <Typography sx={{ fontSize: "16px" }}>
                      {item.Destination.Iata.title_fa}
                    </Typography>
                    <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
                      {item.ArrivalDateTime
                        ? item.ArrivalDateTime.split(" ")[1].split(":")[0] +
                          ":" +
                          item.ArrivalDateTime.split(" ")[1].split(":")[1]
                        : ""}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: "8px" }}>
                    {item.ArrivalDateTime
                      ? convertToPersianDate(item.ArrivalDateTime)
                      : ""}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={3.5} lg={3.5} xl={3.5}>
            <Box
              width={"100%"}
              height={"100%"}
              display={"flex"}
              flexDirection={"column"}
              gap={1}
              justifyContent={"center"}
              alignItems={"center"}
              padding={"10px"}

              sx={{ borderLeft: "2px dashed #cccccc47" }}
            >
              {item.Classes.map((classItem) => (
                <>
                  <Box width={"100%"} display={"flex"} flexDirection={"column"}>
                    <Box width={"100%"} display={"flex"} gap={1}>
                      <Button
                        onClick={() => {
                          data = Object.assign({}, item); // Creates a shallow copy of 'item'
                          data["type"] = "aircraft";
                          data["Classes"] = classItem;
                          data["Classes"]["Passengers"] = {
                            Adult: 1,
                            Child: 0,
                            Infant: 0,
                          };
                          handleClickSubmitTicket(data);
                        }}
                        sx={{
                          width: "100%",
                          padding: "10px",
                        }}
                        variant="contained"
                        disabled={
                          !classItem.FlightStatus ||
                          item.Remarks.PhoneRequirement ||
                          item.Remarks.RoundtripRequirement ||
                          item.Remarks.OneWayRequirement ||
                          item.Remarks.TourRequirement
                        }
                      >
                        <Box
                          display={"flex"}
                          flexDirection={"column"}
                          justifyContent={"center"}
                          width={"100%"}
                        >
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            padding={"0 10px"}
                            fontSize={"12px"}
                            width={"100%"}
                          >
                            <Grid>
                              {formatInputWithCommas(
                                classItem.Financial.Adult.Payable.toString()
                              )}{" "}
                              |{" " + classItem.CabinType.title.fa}
                            </Grid>
                            <Grid>
                              {" " + classItem.AvailableSeat}
                              <AirlineSeatReclineExtraIcon fontSize="10px" />
                            </Grid>
                          </Box>
                          <Typography
                            sx={{
                              textAlign: "left",
                              padding: "0 10px",
                              fontSize: "10px",
                            }}
                          >
                            {classItem.Supplier && classItem.Supplier.title_fa}
                            {""}
                            {classItem.Supplier &&
                            classItem.SystemSupplier &&
                            classItem.Supplier.id !==
                              classItem.SystemSupplier.id
                              ? " | " + classItem.SystemSupplier.title_fa
                              : ""}
                          </Typography>
                        </Box>
                      </Button>

                      <IconButton color="default" aria-label="add an alarm">
                        <InfoIcon
                          onClick={() => handleClickShowDetail(classItem)}
                        />
                      </IconButton>
                    </Box>
                    <Typography sx={{ fontSize: "10px", color: "red" }}>
                      {!classItem.FlightStatus && "امکان خرید پرواز وجود ندارد"}
                      {item.Remarks.PhoneRequirement && "رزرو تنها از طریق تماس تلفنی"}
                      {item.Remarks.RoundtripRequirement && "رزرو تنها با پرواز برگشت"}
                      {item.Remarks.OneWayRequirement && "رزرو بدون پرواز برگشت"}
                      {item.Remarks.TourRequirement && "رزرو تنها از طریق تور"}
                    </Typography>
                  </Box>
                </>
              ))}
            </Box>
          </Grid>
          <Grid
            item
            xs={0}
            sm={0}
            md={0.25}
            lg={0.25}
            xl={0.25}
            className="bg-gray-400-i"
          ></Grid>
          <Grid
            item
            xs={0}
            sm={0}
            md={0.25}
            lg={0.25}
            xl={0.25}
            className="bg-gray-400-i"
          ></Grid>
          <Grid item xs={12} sm={12} md={11.5} lg={11.5} xl={11.5}>
            <Box display={"flex"}>
              <Box
                padding={"8px 48px"}
                display={"flex"}
                gap={1}
                className={"bg-gray-400-i"}
                borderRadius={"0 50px 0 0"}
              >
                <Chip
                  {...getToggleProps({ onClick: () => setCollapsedAction(1) })}
                  label={
                    isExpanded && collapsedAction === 1
                      ? "بستن"
                      : "قوانین استرداد"
                  }
                  icon={<ThreeSixtyRoundedIcon fontSize="small" />}
                  size="small"
                  className="bg-gray-200-i"
                />
                <Chip
                  label={"شماره پرواز " + item.FlightNumber}
                  size="small"
                  className="bg-gray-200-i"
                />
              </Box>
            </Box>
            <Box
              padding={"12px 24px"}
              className={"bg-gray-400-i"}
              {...getCollapseProps()}
            >
              {collapsedAction === 1 && <RefundInformationBox />}
            </Box>
          </Grid>
          <Grid
            item
            xs={0}
            sm={0}
            md={0.25}
            lg={0.25}
            xl={0.25}
            className="bg-gray-400-i"
          ></Grid>
        </Grid>
      </Box>
    </Card>
  );
};

const RefundInformationBox = () => {
  return (
    <>
      <Grid container>
        <Grid
          item
          xs={6}
          sm={6}
          md={3}
          lg={3}
          xl={3}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          padding={"5px"}
        >
          <Typography
            sx={{ fontWeight: "bold" }}
            textAlign={"center"}
            color={"red"}
          >
            30%
          </Typography>
          <Typography textAlign={"center"} color={"white"} fontSize={"10px"}>
            از زمان صدور بلیط تا 12:00 ظهر 3 روز قبل از پرواز
          </Typography>
        </Grid>

        <Grid
          item
          xs={6}
          sm={6}
          md={3}
          lg={3}
          xl={3}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          padding={"5px"}
        >
          <Typography
            sx={{ fontWeight: "bold" }}
            textAlign={"center"}
            color={"red"}
          >
            40%
          </Typography>
          <Typography textAlign={"center"} color={"white"} fontSize={"10px"}>
            از 12:00 ظهر 3 روز قبل از پرواز تا 12:00 ظهر 1 روز قبل از پرواز
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          sm={6}
          md={3}
          lg={3}
          xl={3}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          padding={"5px"}
        >
          <Typography
            sx={{ fontWeight: "bold" }}
            textAlign={"center"}
            color={"red"}
          >
            60%
          </Typography>
          <Typography textAlign={"center"} color={"white"} fontSize={"10px"}>
            از 12:00 ظهر 1 روز قبل از پرواز تا 2 ساعت قبل از پرواز
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          sm={6}
          md={3}
          lg={3}
          xl={3}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          padding={"5px"}
        >
          <Typography
            sx={{ fontWeight: "bold" }}
            textAlign={"center"}
            color={"red"}
          >
            70%
          </Typography>
          <Typography textAlign={"center"} color={"white"} fontSize={"10px"}>
            از 2 ساعت قبل از پرواز به بعد
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

const FlightInformationBox = () => {
  return (
    <>
      <Typography>FlightInformationBox</Typography>
    </>
  );
};
