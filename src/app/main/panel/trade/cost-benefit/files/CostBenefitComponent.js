import TreeMapChartIncome from "./TreeMapChartIncome";
import { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "src/app/constant";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import CircularIndeterminate from "src/app/custom-components/CircularProgress";
import Linechart from "./Linechart";
import FunnelChart from "./FunnelChart";
import Table from "./Table";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import * as React from 'react';
import { convertPersianToEnglishNumbers } from "../../trade-managment/files/oprations/functions";
import { Button } from "@mui/material";
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';



const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};

const CostBenefitComponent = () => {
  const [changeTime, setChangeTime] = useState(1)
  const langDirection = useSelector(selectCurrentLanguage);
  const [showProgressLoading, setShowProgressLoading] = useState(false);
  const [data, setData] = useState([]);
  const [firstDateData, setFirstDateData] = useState("")
  const [secondDateData, setSecondDateData] = useState("")

  function getData() {
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/trade/cost-benefit", {
        lang: langDirection,
        access_token: getAccessToken(),
        json: JSON.stringify({
          action: "all",
          from: firstDateData,
          to: secondDateData,
        }),
      })
      .then((response) => {
        setData(response.data);
        setShowProgressLoading(false);
      })
      .catch((error) => console.log(error));
  }
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const firstDate = (e) => {
    setFirstDateData(convertPersianToEnglishNumbers(e.toLocaleDateString('fa-IR', options)).replace("/", "-").replace("/", "-"))
    console.log(firstDateData);
  }
  const secondDate = (e) => {
    setSecondDateData(convertPersianToEnglishNumbers(e.toLocaleDateString('fa-IR', options)).replace("/", "-").replace("/", "-"))
    console.log(secondDateData);
  }
  useEffect(() => {
    getData();
  }, [changeTime]);

  useEffect(() => {
    console.log(firstDateData);
    console.log(secondDateData);
  }, [changeTime]);

  return (
    <>
      {/* {"CostBenefitComponent"} */}

      <div style={{ width: "100%" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "4%",
          paddingRight: "3%",
          fontWeight: "600",
        }}>
          از تاریخ
          <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
            <DatePicker slotProps={{
              openPickerIcon: { fontSize: 'large' },
              openPickerButton: { color: 'secondary' },
              textField: {
                variant: 'filled',
                focused: true,
                color: 'secondary',
              },
            }} onChange={firstDate} label="تاریخ شروع" />
          </LocalizationProvider>
          تا تاریخ
          <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
            <DatePicker
              slotProps={{
                openPickerIcon: { fontSize: 'large' },
                openPickerButton: { color: 'secondary' },
                textField: {
                  variant: 'filled',
                  focused: true,
                  color: 'secondary',
                },
              }} onChange={secondDate} label="تاریخ پایان" />
          </LocalizationProvider>
          <Button onClick={() => { changeTime == 1 ? setChangeTime(0) : setChangeTime(1) }}><ContentPasteSearchIcon sx={{ fontSize: "37px" }} color="primary" /></Button>
        </div>
        <div>
          {showProgressLoading && <CircularIndeterminate />}
          {data.length !== 0 && (
            <TreeMapChartIncome free="sitebitte" chartData={data} />
          )}
        </div>
        <br />
        <div style={{ display: "flex" }}>
          {data.length !== 0 && <Linechart free="sitebitte" title="نمودار به تفکیک درآمد" chartData={data.chart.income} />}
          {data.length !== 0 && (<FunnelChart free="sitebitte" title=" نمودار میزان سود و زیان بر اساس درآمد" chartData={data.chart.income} />)}

        </div>
        <br />
        <div style={{ display: "block" }}>
          {data.length !== 0 && (
            <Table free="sitebitte" chartData={data.data.income} chartDataTotal={data.total.income} title="میزان سود و زیان بر اساس درآمد ها" />
          )}
        </div>
        <br />
        <br />
        <div style={{ display: "flex" }}>
          {data.length !== 0 && (
            <Linechart free="sitebitte" title=" نمودار به تفکیک اپراتور" chartData={data.chart.operator} />
          )}
          {data.length !== 0 && (
            <FunnelChart free="sitebitte" title=" نمودار میزان سود و زیان بر اساس اپراتور" chartData={data.chart.operator} />
          )}
        </div>
        <br />
        <div style={{ display: "block" }}>
          {data.length !== 0 && (
            <Table free="sitebitte" chartData={data.data.operator} chartDataTotal={data.total.operator} title="  میزان سود و زیان بر اساس اپراتور ها" />
          )}
        </div>
      </div>

    </>
  );
};

export default CostBenefitComponent;
