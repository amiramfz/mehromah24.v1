import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const ScrollCalendarComponent = (props) => {
  const [activeItem, setActiveItem] = useState("Button 1");
  const menuRef = useRef(null);
  const handleItemClick = (item) => {
    setActiveItem(item);
  };
  const scrollLeft = () => {
    if (menuRef.current) {
      menuRef.current.scrollLeft -= 100; // Adjust the scroll distance as needed
    }
  };
  const scrollRight = () => {
    if (menuRef.current) {
      menuRef.current.scrollLeft += 100; // Adjust the scroll distance as needed
    }
  };

  const [days, setDays] = useState([]);

  //get dates
  useEffect(() => {
    // Get the current date
    let currentDate = new Date();

    // Create an array to store dates
    let dateArray = [];

    // Add the current date to the array
    dateArray.push(currentDate.toLocaleDateString("fa-IR", options));

    // Loop to add the next 30 days to the array
    for (let i = 1; i <= 30; i++) {
      // Increment the current date by one day
      currentDate.setDate(currentDate.getDate() + 1);

      // Add the new date to the array
      dateArray.push(
        // new Date(currentDate).toLocaleDateString("fa-IR", options)
        currentDate.toLocaleDateString("fa-IR", options)
      );
    }
    setDays(dateArray);
    // Log the array of dates
    console.log(dateArray);
  }, []);

  useEffect(() => {
    setActiveItem(props.rangeValues[0].toLocaleDateString("fa-IR", options));
  }, [props.rangeValues]);
  return (
    <div className="horizontal-menu-container">
      <button className="scroll-button left" onClick={scrollRight}>
        <ArrowForwardIosIcon />
      </button>
      <div className="horizontal-menu" ref={menuRef}>
        {days &&
          days.map((item) => (
            <Box
              className={
                activeItem === item ? "day-container active" : "day-container"
              }
              onClick={() => {
                props.handleClickDay(item);
                handleItemClick(item)
              }}
            >
              <Typography
                sx={{
                  fontSize: "15px",
                  textAlign: "center",
                  textShadow: "0 0 3px #bdbdbd;"
                }}
              >
                {/* {convertToPersianDate(item).split("ساعت")[0]} */}
                {item.substr(5, 5)}
              </Typography>
            </Box>
          ))}
      </div>
      <button className="scroll-button right" onClick={scrollLeft}>
        <ArrowBackIosIcon />
      </button>
    </div>
  );
};

const options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};
