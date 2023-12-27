import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Page = (props) => {
  let { id } = useParams();
  useEffect(() => {
    document.title = props.title + (id ? "#" + id : "") || "";
  }, [props.title]);
  return props.children;
};

export default Page;
