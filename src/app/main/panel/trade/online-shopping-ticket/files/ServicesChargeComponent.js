import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { base_url } from "src/app/constant";
import { formatInputWithCommas } from "../../trade-managment/files/oprations/functions";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
import UpdateIcon from "@mui/icons-material/Update";

const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};
export const ServicesChargeComponent = () => {
  const langDirection = useSelector(selectCurrentLanguage);
  const [data, setData] = useState();
  function getData() {
    axios
      .post(base_url + "/v2/online/credit", {
        lang: langDirection,
        action: "all",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item Created:", response.data);
        setData(response.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    getData();
  }, []);
  function updateData() {
    axios
      .post(base_url + "/v2/online/credit/update", {
        lang: langDirection,
        action: "all",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item Created:", response.data);
        setData(response.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }

  return (
    <>
      <Box
        position={"fixed"}
        bottom={0}
        height={"35px"}
        width={"100%"}
        display={"flex"}
        gap={1}
        padding={"5px"}
        backgroundColor={"#ffffff"}
      >
        {!data && (
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Typography sx={{ fontSize: "10px", fontStyle: "bold" }}>
              در حال دریافت اطلاعات ...
            </Typography>
          </Box>
        )}
        {data && (
          <Box
            display={"flex"}
            justifyContent={"center"}
            gap={"5px"}
            alignItems={"center"}
            borderRadius={"5px"}
            border={"none"}
            padding={"0 5px"}
          >
            <UpdateIcon
              onClick={() => {
                updateData();
              }}
              fontSize="small"
            />
            <Typography sx={{ fontSize: "10px" }}>بروزرسانی: </Typography>
            <Typography sx={{ fontSize: "10px" }}>
              {data.last_update}
            </Typography>{" "}
          </Box>
        )}

        {data &&
          Object.values(data.data).map((item) => (
            <Box
              display={"flex"}
              justifyContent={"center"}
              gap={"5px"}
              alignItems={"center"}
              // sx={{ backgroundColor: "#e2e8f0" }}
              sx={{ backgroundColor: item.color }}
              borderRadius={"5px"}
              border={"none"}
              padding={"0 5px"}
            >
              <Typography sx={{ fontSize: "10px" }}>
                {item.service.fa + ": "}
              </Typography>
              <Typography sx={{ fontSize: "10px" }}>
                {item.balance || item.balance === 0
                  ? formatInputWithCommas(item.balance.toString())
                  : "-"}
              </Typography>
              {item.balance || item.balance === 0 ? (
                <Link to={item.link} target="_blank">
                  <OpenInNewIcon fontSize="x-small" />
                </Link>
              ) : (
                ""
              )}
            </Box>
          ))}
      </Box>
    </>
  );
};
