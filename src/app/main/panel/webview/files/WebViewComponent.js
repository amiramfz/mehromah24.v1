import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { base_url } from "src/app/constant";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import CircularIndeterminate from "src/app/custom-components/CircularProgress";

const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};
export const WebViewComponent = () => {
  const langDirection = useSelector(selectCurrentLanguage);
  const [showProgressLoading, setShowProgressLoading] = React.useState(false);
  let { type, lang, id } = useParams();
  useEffect(() => {
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/trade/operation/general", {
        lang: langDirection,
        id: parseInt(id) + 10000,
        goal: "autocomplete",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        if (response.data.slug) {
          if (type == "tickets")
            setSrc(
              "https://savosh.com/trade/print/final/" +
                lang +
                "/" +
                response.data.slug
            );
          document.title = response.data.leader
            ? (parseInt(id) + 10000).toString()+ " - " +
              response.data.leader.first_name +
              " " +
              response.data.leader.last_name              
            : (parseInt(id) + 10000).toString();

          setShowProgressLoading(false);
        }
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }, [id, type, lang]);
  const [src, setSrc] = React.useState(false);

  return (
    <>
      {showProgressLoading && <CircularIndeterminate />}
      {src && !showProgressLoading && (
        <iframe
          src={src}
          width={1550}
          height={700}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture full"
        ></iframe>
      )}
    </>
  );
};
