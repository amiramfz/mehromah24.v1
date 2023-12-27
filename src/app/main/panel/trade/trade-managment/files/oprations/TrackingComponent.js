import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import Divider from "@mui/material/Divider";
import { base_url, host_url } from "src/app/constant";
import { getAccessUser } from "./functions";
import CircularIndeterminate from "src/app/custom-components/CircularProgress";
import axios from "axios";

const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};
export const TrackingComponent = (props) => {
  const uniqueProviderDataIds = []; // Array to store unique provider.id values
  const [showProgressLoading, setShowProgressLoading] = React.useState(false);
  const [description, setDescription] = useState(props.refrence.description);
  const [selectedStatus, setSelectedStatus] = useState(props.status);
  const [showStatus, setShowStatus] = useState(props.refrence.print);
  function sendData() {
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/trade/edit", {
        action: "details",
        description: description,
        status: selectedStatus.id,
        print: showStatus.id,
        serial_id: props.refrence.serial_id,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setShowProgressLoading(false);
        props.getRefrenceEdit(props.refrence.serial_id);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  return (
    <>
      {showProgressLoading && <CircularIndeterminate />}

      {/* description */}
      <div>
        <Grid spacing={1} container>
          <Grid item xl={5} xs={12} md={5}>
            <TextField
              disabled={!(props.status.id === 1)}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              sx={{ width: "100%" }}
              Autocomplete="off"
              label="توضیحات"
              variant="outlined"
              color="primary"
            />
          </Grid>
          <Grid item xl={3} xs={12} md={3}>
            <Autocomplete
              disabled={!(props.status.id === 1)}
              value={showStatus}
              onChange={(e, value) => {
                if (value) {
                  setShowStatus(value);
                }
              }}
              getOptionLabel={(option) => option.title.fa}
              options={showStatuses.map((option) => option)}
              isOptionEqualToValue={(option, value) =>
                option === value || value === ""
              }
              renderInput={(params) => (
                <TextField {...params} label="وضعیت نمایش" Autocomplete="off" />
              )}
            />
          </Grid>
          <Grid item xl={3} xs={12} md={3}>
            <Autocomplete
              value={selectedStatus}
              onChange={(e, value) => {
                if (value) {
                  setSelectedStatus(value);
                }
              }}
              disabled={
                !getAccessUser("trade", "managment", props.user.data.access)
              }
              getOptionLabel={(option) => option.title}
              options={status.map((option) => option)}
              isOptionEqualToValue={(option, value) =>
                option === value || value === ""
              }
              renderInput={(params) => (
                <TextField {...params} label="وضعیت" Autocomplete="off" />
              )}
            />
          </Grid>
          <Grid item xl={1} xs={12} md={1}>
            <Box
              display={"flex"}
              flexDirection={"row"}
              gap={1}
              height={"100%"}
              alignItems={"center"}
            >
              <IconButton onClick={() => sendData()} variant="solid">
                <CheckCircleIcon />
              </IconButton>
              {getAccessUser("accounting", "logs", props.user.data.access) && (
                <IconButton variant="solid">
                  <InsertCommentIcon />
                </IconButton>
              )}
            </Box>
          </Grid>
        </Grid>{" "}
      </div>
      {/* end description */}
      {/* cards */}
      <div>
        <Grid columns={10} marginTop={5} spacing={2} container>
          <Grid item xl={2} xs={12} md={2}>
            <BoxSx
              type={"قرارداد"}
              description={"قرارداد فی مابین آژانس و مسافر"}
              color={"#78716c"}
              url={"trade/print/contract/" + (props.refrence.serial_id + 10000)}
            />
          </Grid>
          <Grid item xl={2} xs={12} md={2}>
            <BoxSx
              type={"ریز رفرنس"}
              description={"صورت ریز رفرنس بهمراه اطلاعات فروش"}
              color={"#ef4444"}
              url={
                "trade/print/statement/" + (props.refrence.serial_id + 10000)
              }
            />
          </Grid>
          {props.refrence.pledgers.map((item) =>
            item.type !== "operator" && item.id == "colleague-161" ? (
              <Grid item xl={2} xs={12} md={2}>
                <BoxSx
                  type={"تعهدنامه"}
                  description={"صدور تعهدنامه ویژه " + item.text}
                  color={"#f59e0b"}
                  url={
                    "trade/print/commitment/contract/" +
                    item.item_id +
                    "/" +
                    (props.refrence.serial_id + 10000)
                  }
                />
              </Grid>
            ) : (
              ""
            )
          )}

          {props.refrence.data
            .filter((item) => {
              if (
                item.provider &&
                item.provider.id !== 1 &&
                !uniqueProviderDataIds.includes(item.provider.id)
              ) {
                uniqueProviderDataIds.push(item.provider.id);
                return true; // Include this item in the rendering
              }
              return false; // Exclude this item from rendering
            })
            .map((item) => (
              <Grid item xl={2} xs={12} md={2} key={item.provider.id}>
                <BoxSx
                  type={"درخواست هتل/بلیط"}
                  description={item.provider.title_fa}
                  color={"#94a3b8"}
                  url={
                    "trade/print/request/" +
                    item.provider.id +
                    "/" +
                    (props.refrence.serial_id + 10000)
                  }
                />
              </Grid>
            ))}
          <Grid item xl={2} xs={12} md={2}>
            <BoxSx
              type={"رسید صندوق"}
              description={"رسید کلیه پرداختی های مسافر"}
              color={"#06b6d4"}
              url={
                "credit-debit/print/payment-receipt/" +
                (props.refrence.serial_id + 10000)
              }
            />
          </Grid>
        </Grid>{" "}
      </div>
      {/* end cards */}
    </>
  );
};

export function BoxSx({ type, description, color, url }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "200px",
        borderRadius: "15px",
        backgroundColor: color,
        // color: color === "#e2e8f0" ? "black" : "white",
        color: "white",
        "&:hover": {
          opacity: [0.9, 0.8, 0.7],
        },
      }}
      display="flex"
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      padding="15px"
    >
      <Typography>{type}</Typography>
      <Divider sx={{ width: "100%", margin: "10px 0" }} />
      <Typography>{description}</Typography>
      <Divider sx={{ width: "100%", margin: "10px 0" }} />
      <Button sx={{ backgroundColor: "#1c1917" }} variant="contained">
        <a
          style={{ textDecoration: "none" }}
          href={host_url + "/" + url}
          target="_blank"
        >
          صدور
        </a>
      </Button>
    </Box>
  );
}

const showStatuses = [
  {
    id: 1,
    title: {
      fa: "مشاهده بدون قیمت",
      en: "",
    },
  },
  {
    id: 2,
    title: {
      fa: "مشاهده با قیمت",
      en: "",
    },
  },
  {
    id: 3,
    title: {
      fa: "عدم مشاهده بلیط و واچر",
      en: "",
    },
  },
];

const status = [
  {
    id: 1,
    title: "صندوق",
  },
  {
    id: 2,
    title: "غیرفعال",
  },
  {
    id: 3,
    title: "پایان یافته",
  },
  {
    id: 4,
    title: "استردادی",
  },
  {
    id: 5,
    title: "حذف",
  },
];
