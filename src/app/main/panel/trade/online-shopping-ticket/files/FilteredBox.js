// import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Checkbox from "@mui/material/Checkbox";
import { pink } from "@mui/material/colors";
import { Box } from "@mui/system";
import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import { useEffect } from "react";
import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { host_url } from "src/app/constant";
import { useState } from "react";

const minDistance = 10;

export const FilteredBox = (props) => {
  const flightAction = props.flightAction === 0 ? "Went" : "Return";
  const items = props.items;
  const [originalItems, setOriginalItems] = React.useState(
    JSON.parse(JSON.stringify(items))
  );

  return (
    <div>
      <SortPanel items={props.items} setItems={props.setItems} />
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>ساعت حرکت</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TimePanel
            setItems={props.setItems}
            originalItems={originalItems}
            setOriginalItems={setOriginalItems}
            flightAction={flightAction}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>شرکت های هواپیمایی</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AirlinesPanel
            setItems={props.setItems}
            originalItems={originalItems}
            setOriginalItems={setOriginalItems}
            flightAction={flightAction}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>نوع بلیط</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TypeFlightPanel
            setItems={props.setItems}
            originalItems={originalItems}
            setOriginalItems={setOriginalItems}
            flightAction={flightAction}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>کلاس پروازی</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CabinsPanel
            setItems={props.setItems}
            originalItems={originalItems}
            setOriginalItems={setOriginalItems}
            flightAction={flightAction}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>موارد دیگر</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <FormGroup>
              <FormControlLabel
                required
                control={<Checkbox />}
                label="نمایش بلیط های تکراری"
              />
              <FormControlLabel
                required
                control={<Checkbox />}
                label="نمایش بلیط های موجود"
              />
            </FormGroup>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const TimePanel = (props) => {
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(24);
  const [timeRange, setTimeRange] = useState([minValue, maxValue]);
  useEffect(() => {
    // Extract the time component from DepartureDateTime strings and convert to integers
    const departureTimes = props.originalItems[props.flightAction].map(
      (flight) => {
        const timeComponents =
          flight.DepartureDateTime.split(" ")[1].split(":");
        return (
          parseInt(timeComponents[0], 10) + parseInt(timeComponents[1], 10) / 60
        );
      }
    );
    // Find the minimum and maximum departure times within the range of 0 to 24
    const minDepartureTime = Math.min(
      ...departureTimes.filter((time) => time >= 0 && time <= 24)
    );
    const maxDepartureTime = Math.max(
      ...departureTimes.filter((time) => time >= 0 && time <= 24)
    );
    if (props.originalItems[props.flightAction].length === 0) {
      setMinValue(0);
      setMaxValue(24);
      setTimeRange([0, 24]);
    } else {
      setMinValue(minDepartureTime);
      setMaxValue(maxDepartureTime);
      setTimeRange([minDepartureTime, maxDepartureTime]);
    }
  }, [props.originalItems]);

  const handleSliderChange = (event, newValue) => {
    setTimeRange(newValue);
    // Extract the time component from DepartureDateTime strings and convert to integers
    const departureTimes = props.originalItems[props.flightAction].map(
      (flight) => {
        const timeComponents =
          flight.DepartureDateTime.split(" ")[1].split(":");
        return (
          parseInt(timeComponents[0], 10) + parseInt(timeComponents[1], 10) / 60
        );
      }
    );

    // Filter flights based on the timeRange
    const filtered = props.originalItems[props.flightAction].filter(
      (flight, index) => {
        const departureTime = departureTimes[index];
        return departureTime >= timeRange[0] && departureTime <= timeRange[1];
      }
    );

    props.flightAction === "Went"
      ? props.setItems({ ...props.originalItems, Went: filtered })
      : props.setItems({ ...props.originalItems, Return: filtered });
  };

  const formatTime = (hour) => {
    const formattedHour = Math.floor(hour);
    const minutes = (hour - formattedHour) * 60;
    const formattedMinutes = Math.round(minutes).toString().padStart(2, "0");
    return `${formattedHour}:${formattedMinutes}`;
  };

  return (
    <div style={{ direction: "rtl" }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={"32px"}
      >
        <Typography gutterBottom>{"از" + formatTime(timeRange[0])}</Typography>
        <Typography gutterBottom>{"تا" + formatTime(timeRange[1])}</Typography>
      </Box>
      <Slider
        value={timeRange}
        onChange={handleSliderChange}
        min={minValue}
        max={maxValue} // Adjusted to allow for half-hour steps
        step={0.5} // 30 minutes step
        valueLabelDisplay="auto"
        valueLabelFormat={(value, index) => formatTime(value)}
      />
    </div>
  );
};

const CabinsPanel = (props) => {
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [options, setOptions] = React.useState([]);
  useEffect(() => {
    let tempArr = [];
    props.originalItems[props.flightAction].forEach((element) => {
      element.Classes.forEach((item) => {
        if (!tempArr.includes(item.CabinType.title.fa)) {
          console.log(item.CabinType.title.fa);
          tempArr.push(item.CabinType.title.fa);
        }
      });
    });
    setOptions(tempArr);
  }, []);
  const handleToggle = (event, newSelection) => {
    setSelectedOption(newSelection);
    if (newSelection.length > 0) {
      let tempFiltered = props.originalItems[props.flightAction].filter(
        (item) => newSelection.includes(item.Classes[0].CabinType.title.fa)
      );
      props.flightAction === "Went"
        ? props.setItems({ ...props.originalItems, Went: tempFiltered })
        : props.setItems({ ...props.originalItems, Return: tempFiltered });
    } else {
      props.setItems(props.originalItems);
    }
  };
  return (
    <Grid sx={{ width: "100%" }} container spacing={2}>
      {options.map((option) => (
        <Grid item xs={6} key={option}>
          <ToggleButtonGroup
            sx={{ width: "100%" }}
            value={selectedOption}
            onChange={handleToggle}
          >
            <ToggleButton sx={{ width: "100%" }} value={option}>
              {option}
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      ))}
    </Grid>
  );
};
const TypeFlightPanel = (props) => {
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [options, setOptions] = React.useState([]);
  useEffect(() => {
    let tempArr = [];
    props.originalItems[props.flightAction].forEach((element) => {
      if (!tempArr.includes(element.FlightType)) {
        console.log(element.FlightType);
        tempArr.push(element.FlightType);
      }
    });
    setOptions(tempArr);
  }, []);
  const handleToggle = (event, newSelection) => {
    setSelectedOption(newSelection);
    if (newSelection.length > 0) {
      let tempFiltered = props.originalItems[props.flightAction].filter(
        (item) => newSelection.includes(item.FlightType)
      );
      props.flightAction === "Went"
        ? props.setItems({ ...props.originalItems, Went: tempFiltered })
        : props.setItems({ ...props.originalItems, Return: tempFiltered });
      console.log(props.originalItems);
    } else {
      props.setItems(props.originalItems);
    }
  };
  return (
    <Grid sx={{ width: "100%" }} container spacing={2}>
      {options.map((option) => (
        <Grid item xs={6} key={option}>
          <ToggleButtonGroup
            sx={{ width: "100%" }}
            value={selectedOption}
            onChange={handleToggle}
          >
            <ToggleButton sx={{ width: "100%" }} value={option}>
              {option === "Charter" ? "چارتری" : "سیستمی"}
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      ))}
    </Grid>
  );
};

const AirlinesPanel = (props) => {
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [options, setOptions] = React.useState([]);
  useEffect(() => {
    let tempArr = [];
    Object.values(props.originalItems.Airlines).forEach((element) => {
      if (!tempArr.includes(element)) {
        console.log(element.FlightType);
        tempArr.push(element);
      }
    });
    setOptions(tempArr);
  }, []);
  const handleToggle = (event, newSelection) => {
    setSelectedOption(newSelection);
    console.log(newSelection);

    if (newSelection.length > 0) {
      let tempFiltered = props.originalItems[props.flightAction].filter(
        (item) =>
          newSelection.some((selection) => selection.id === item.Airline.id)
      );
      props.flightAction === "Went"
        ? props.setItems({ ...props.originalItems, Went: tempFiltered })
        : props.setItems({ ...props.originalItems, Return: tempFiltered });
      console.log(props.originalItems);
    } else {
      // If no selection, reset to the original items
      props.setItems(props.originalItems);
    }
  };

  return (
    <Grid sx={{ width: "100%" }} container spacing={2}>
      {options.map((option) => (
        <Grid item xs={6} key={option}>
          <ToggleButtonGroup
            sx={{ width: "100%" }}
            value={selectedOption}
            onChange={handleToggle}
          >
            <ToggleButton sx={{ width: "100%" }} value={option}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Box width={"35px"} height={"35px"}>
                  <img
                    src={host_url + "/media/airlines/" + option.logo}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Typography>{option.title_fa}</Typography>
              </Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      ))}
    </Grid>
  );
};

const SortPanel = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleToggle = (event, newSelection) => {
    if (newSelection) {
      setSelectedOption(newSelection);
    }
    console.log(newSelection);
    if (newSelection === "زودترین") {
      const sortedWent = [...props.items.Went].sort(
        (a, b) =>
          new Date(a.DepartureDateTime).getTime() -
          new Date(b.DepartureDateTime).getTime()
      );

      const sortedReturn = [...props.items.Return].sort(
        (a, b) =>
          new Date(a.DepartureDateTime).getTime() -
          new Date(b.DepartureDateTime).getTime()
      );
      props.setItems({
        ...props.items,
        Went: sortedWent,
        Return: sortedReturn,
      });
    } else if (newSelection === "دیرترین") {
      const sortedWent = [...props.items.Went].sort(
        (a, b) =>
          new Date(b.DepartureDateTime).getTime() -
          new Date(a.DepartureDateTime).getTime()
      );
      const sortedReturn = [...props.items.Return].sort(
        (a, b) =>
          new Date(b.DepartureDateTime).getTime() -
          new Date(a.DepartureDateTime).getTime()
      );
      props.setItems({
        ...props.items,
        Went: sortedWent,
        Return: sortedReturn,
      });
    } else if (newSelection === "ارزانترین") {
      const sortedWent = [...props.items.Went].sort(
        (a, b) =>
          new Date(a.Classes[0].Financial.Adult.Payable).getTime() -
          new Date(b.Classes[0].Financial.Adult.Payable).getTime()
      );
      const sortedReturn = [...props.items.Return].sort(
        (a, b) =>
          new Date(a.Classes[0].Financial.Adult.Payable).getTime() -
          new Date(b.Classes[0].Financial.Adult.Payable).getTime()
      );
      props.setItems({
        ...props.items,
        Went: sortedWent,
        Return: sortedReturn,
      });
    } else if (newSelection === "گرانترین") {
      const sortedWent = [...props.items.Went].sort(
        (a, b) =>
          new Date(b.Classes[0].Financial.Adult.Payable).getTime() -
          new Date(a.Classes[0].Financial.Adult.Payable).getTime()
      );
      const sortedReturn = [...props.items.Return].sort(
        (a, b) =>
          new Date(b.Classes[0].Financial.Adult.Payable).getTime() -
          new Date(a.Classes[0].Financial.Adult.Payable).getTime()
      );
      props.setItems({
        ...props.items,
        Went: sortedWent,
        Return: sortedReturn,
      });
    }
  };

  const options = ["زودترین", "دیرترین", "ارزانترین", "گرانترین"];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginBottom: "10px",
      }}
    >
      <Grid sx={{ width: "100%" }} container spacing={2}>
        {options.map((option) => (
          <Grid item xs={6} key={option}>
            <ToggleButtonGroup
              sx={{ width: "100%" }}
              value={selectedOption}
              onChange={handleToggle}
              exclusive
            >
              <ToggleButton sx={{ width: "100%" }} value={option}>
                {option}
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
