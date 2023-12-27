import React from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState, useEffect, useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import "primereact/resources/themes/soho-light/theme.css";
import "primereact/resources/primereact.min.css";
import {
  ButtonGroup,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Paginator } from "primereact/paginator";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
  TimeField,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import DescriptionIcon from "@mui/icons-material/Description";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import { base_url } from "src/app/constant";
import { Box } from "@mui/system";
import CircularIndeterminate from "src/app/custom-components/CircularProgress";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import { host_url } from "../../../../../constant";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import { Link as RouterLink } from "react-router-dom";

import {
  formatInputWithCommas,
  convertPersianToEnglishNumbers,
} from "../../../trade/trade-managment/files/oprations/functions";
import Chip from "@mui/material/Chip";
import WifiTetheringIcon from "@mui/icons-material/WifiTethering";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};
const options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};
export const PayCashComponent = () => {
  const langDirection = useSelector(selectCurrentLanguage);
  //dialog
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  //end dialog
  // for colleague's name
  const [colleagues, setColleagues] = useState([]);
  const [openColleagues, setOpenColleagues] = useState(false);
  const [colleaguesLoading, setColleaguesLoading] = useState(false);
  function getCplleagues() {
    setColleaguesLoading(true);
    axios
      .post(base_url + "/v2/trade/refrence/type", {
        goal: "1100",
        lang: langDirection,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setColleagues(response.data.results);
        setColleaguesLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openColleagues) {
      getCplleagues();
    }
  }, [openColleagues]);
  //for get operators
  const [opennOperators, setOpenOperators] = React.useState(false);
  const [operatorsLoading, setOperatorsLoading] = React.useState(false);
  const [operators, setOperators] = React.useState([]);
  function getOperators() {
    setOperatorsLoading(true);
    axios
      .post(base_url + "/v2/trade/refrence/type", {
        goal: "1300",
        lang: langDirection,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setOperators(response.data.results);
        setOperatorsLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (opennOperators) {
      getOperators();
    }
  }, [opennOperators]);
  //end for get operators
  const [showProgressLoading, setShowProgressLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalBuy, setTotalBuy] = useState("");
  const [totalSale, setTotalSale] = useState("");
  const [totalProfit, setTotalProfit] = useState("");
  const [totalDebit, setTotalDebit] = useState("");
  const [totalCredit, setTotalCredit] = useState("");
  const [totalPassengers, settotalPassengers] = useState("");

  const dt = useRef(null);
  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(50);
  //for advanced search
  const [r, setR] = useState("");
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [itemTime, setItemTime] = useState(null);
  const [op, setOp] = useState({ text: "", id: "" });
  const [status, setStatus] = useState("");
  const [flightNo, setFlightNo] = useState("");
  const [dt_departure, setDt_departure] = useState("");
  const [pledger, setPledger] = useState({ text: "", id: "" });
  const [company, setCompany] = useState({ text: "", id: "" });

  function handleAdvancedSearch() {
    getData();
    handleCloseDialog();
  }
  function handleRefreshed(r = "") {
    setOpenDialog(false);
    setFrom(new Date());
    setTo(new Date());
    setItemTime(null);
    setOp({ text: "", id: "" });
    setStatus("");
    setFlightNo("");
    setDt_departure("");
    setPledger({ text: "", id: "" });
    setCompany({ text: "", id: "" });
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/references/debit/list", {
        lang: langDirection,
        access_token: getAccessToken(),
        json: JSON.stringify({
          draw: currentPage,
          length: rows,
          search: {
            value: "",
            regex: false,
          },
          start: first,
          advanced: {
            r: r,
            from: "",
            to: "",
            op: "",
            status: "",
            flightno: "",
            dt_departure: "",
            pledger: "",
          },
        }),
      })
      .then((response) => {
        // Handle the successful response
        setData(response.data);
        setTotalBuy(response.data.total.Buy);
        setTotalSale(response.data.total.Sale);
        setTotalProfit(response.data.total.Profit);
        setTotalDebit(response.data.total.Debit);
        setTotalCredit(response.data.total.Credit);
        settotalPassengers(response.data.total.Passenger);
        console.log(response.data);
        setTotalRecords(response.data.recordsTotal);
        setShowProgressLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  //end for advanced search
  //for promiser's name
  const [openPromisers, setOpenPromisers] = useState(false);
  const [promisers, setPromisers] = useState([]);
  const [promisersLoading, setPromisersLoading] = useState(false);
  function getPromisers() {
    setPromisersLoading(true);
    axios
      .post(base_url + "/v2/trade/refrence/type", {
        goal: "8200,1300",
        lang: langDirection,
        separator: true,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setPromisers(response.data.results);
        setPromisersLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openPromisers) {
      getPromisers();
    }
  }, [openPromisers]);
  //end for promiser's name

  function getData() {
    console.log({
      lang: langDirection,
      access_token: getAccessToken(),
      json: JSON.stringify({
        draw: currentPage,
        length: rows,
        search: {
          value: "",
          regex: false,
        },
        start: first,
        advanced: {
          r: "",
          from: from
            ? convertPersianToEnglishNumbers(
                from.toLocaleDateString("fa-IR", options)
              )
            : null,
          to: to
            ? convertPersianToEnglishNumbers(
                to.toLocaleDateString("fa-IR", options)
              )
            : null,
          op: op.id,
          status: status.id ? status.id : "",
          flightno: flightNo,
          company: company.id,
          dt_departure: itemTime
            ? convertPersianToEnglishNumbers(
                itemTime.toLocaleString("fa-IR", options)
              )
            : "",
          pledger: pledger.id,
        },
      }),
    });
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/references/debit/list", {
        lang: langDirection,
        access_token: getAccessToken(),
        json: JSON.stringify({
          draw: currentPage,
          length: rows,
          search: {
            value: "",
            regex: false,
          },
          start: first,
          advanced: {
            r: "",
            from: null,
            to: null,
            op: op.id,
            status: status.id ? status.id : "",
            flightno: flightNo,
            company: company.id,
            dt_departure: itemTime
              ? convertPersianToEnglishNumbers(
                  itemTime.toLocaleString("fa-IR", options)
                )
              : "",
            pledger: pledger.id,
          },
        }),
      })
      .then((response) => {
        // Handle the successful response
        setData(response.data);
        setTotalBuy(response.data.total.Buy);
        setTotalSale(response.data.total.Sale);
        setTotalProfit(response.data.total.Profit);
        setTotalDebit(response.data.total.Debit);
        setTotalCredit(response.data.total.Credit);
        settotalPassengers(response.data.total.Passenger);
        console.log(response.data);
        setTotalRecords(response.data.recordsTotal);
        setShowProgressLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }

  function getDataPaginate(first, rows) {
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/references/debit/list", {
        access_token: getAccessToken(),
        lang: langDirection,
        json: JSON.stringify({
          draw: currentPage,
          length: rows,
          search: {
            value: "",
            regex: false,
          },
          start: first,
          advanced: {
            r: "",
            from: from
              ? convertPersianToEnglishNumbers(
                  from.toLocaleDateString("fa-IR", options)
                )
              : null,
            to: to
              ? convertPersianToEnglishNumbers(
                  to.toLocaleDateString("fa-IR", options)
                )
              : null,
            op: "",
            status: "",
            flightno: "",
            dt_departure: "",
            pledger: "",
          },
        }),
      })
      .then((response) => {
        // Handle the successful response
        setData(response.data);
        setTotalBuy(response.data.total.Buy);
        setTotalSale(response.data.total.Sale);
        setTotalProfit(response.data.total.Profit);
        setTotalDebit(response.data.total.Debit);
        setTotalCredit(response.data.total.Credit);
        settotalPassengers(response.data.total.Passenger);
        console.log(response.data);
        setTotalRecords(response.data.recordsTotal);
        setShowProgressLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    getData();
  }, []);

  const onPageChange = async (event) => {
    setCurrentPage(event.page + 1);
    setFirst(event.first);
    setRows(event.rows);
    getDataPaginate(event.first, event.rows);
  };

  const header = (
    <div className="flex align-items-center justify-content-end gap-2">
      <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
        <Box display={"flex"}>
          <IconButton aria-label="search" onClick={handleClickOpenDialog}>
            <TroubleshootIcon />
          </IconButton>
          <IconButton aria-label="update" onClick={getData}>
            <FindReplaceIcon />
          </IconButton>
          <TextField
            value={r}
            onChange={(e) => setR(e.target.value)}
            onKeyDown={(e) => {
              if (event.key === "Enter") handleRefreshed(r);
            }}
            dir="ltr"
            id="outlined-basic"
            label="شماره رفرنس"
            variant="standard"
            size="small"
          />
          <IconButton
            aria-label="refrence-search"
            onClick={() => handleRefreshed(r)}
          >
            <DoneAllIcon />
          </IconButton>
        </Box>
        <Box>
          <IconButton aria-label="search" onClick={() => exportCSV(false)}>
            <DescriptionIcon />
          </IconButton>
        </Box>
      </Box>
    </div>
  );

  return (
    <>
      {/* start advanced search */}

      <div style={{ with: "100%" }}>
        <BootstrapDialog
          onClose={handleCloseDialog}
          aria-labelledby="customized-dialog-title"
          open={openDialog}
          // fullWidth={"lg"}
          maxWidth={"lg"}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            جستجوی پیشرفته
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <Grid columns={12} spacing={2} container>
              <Grid item xl={3} xs={12} md={6}>
                <LocalizationProvider
                  sx={{ width: "100%" }}
                  dateAdapter={AdapterDateFnsJalali}
                >
                  <DatePicker
                    sx={{ width: "100%" }}
                    views={["year", "month", "day"]}
                    label="از تاریخ"
                    value={from}
                    onChange={(value) => {
                      setFrom(value);
                    }}
                    // maxDate={endDate} // Set the maximum date to the selected end date
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xl={3} xs={12} md={6}>
                <LocalizationProvider
                  sx={{ width: "100%" }}
                  dateAdapter={AdapterDateFnsJalali}
                >
                  <DatePicker
                    sx={{ width: "100%" }}
                    views={["year", "month", "day"]}
                    label="تا تاریخ"
                    value={to}
                    onChange={(value) => {
                      setTo(value);
                    }}
                    // maxDate={endDate} // Set the maximum date to the selected end date
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xl={3} xs={12} md={6}>
                <Autocomplete
                  value={op}
                  open={opennOperators}
                  onOpen={() => {
                    setOpenOperators(true);
                  }}
                  onClose={() => {
                    setOpenOperators(false);
                  }}
                  onChange={(e, value) => {
                    if (value) {
                      console.log(value);
                      setOp(value);
                    } else {
                      setOp({ text: "", id: "" });
                    }
                  }}
                  sx={{ width: "100%" }}
                  id="combo-box-demo"
                  getOptionLabel={(option) => option.text}
                  options={operators.map((option) => option)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="همه اپراتورها"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {operatorsLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={3} xs={12} md={6}>
                <Autocomplete
                  value={company}
                  open={openColleagues}
                  onOpen={() => {
                    setOpenColleagues(true);
                  }}
                  onClose={() => {
                    setOpenColleagues(false);
                  }}
                  onChange={(e, value) => {
                    if (value) {
                      setCompany(value);
                    } else {
                      setCompany({ text: "", id: "" });
                    }
                  }}
                  getOptionLabel={(option) => option.text}
                  options={colleagues.map((option) => option)}
                  isOptionEqualToValue={(option, value) =>
                    option === value || value === ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="شرکت"
                      required
                      Autocomplete="off"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {colleaguesLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={3} xs={12} md={6}>
                <TextField
                  value={flightNo}
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="شماره پرواز"
                  dir="ltr"
                  variant="outlined"
                  onChange={(e) => setFlightNo(e.target.value)}
                />
              </Grid>
              <Grid item xl={3} xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    views={["year", "month", "day"]}
                    value={itemTime}
                    required
                    label="زمان پرواز/حرکت/ورود"
                    color="primary"
                    onChange={(value) => {
                      if (value) {
                        setItemTime(value);
                      } else {
                        setItemTime(null);
                      }
                    }}
                    slotProps={{
                      textField: {
                        variant: "outlined",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xl={3} xs={12} md={6}>
                <Autocomplete
                  value={pledger}
                  sx={{ width: "100%" }}
                  open={openPromisers}
                  onOpen={() => {
                    setOpenPromisers(true);
                  }}
                  onClose={() => {
                    setOpenPromisers(false);
                  }}
                  id="combo-box-demo"
                  getOptionLabel={(option) => option.text}
                  onChange={(e, value) => {
                    if (value) {
                      console.log(value);
                      setPledger(value);
                    } else {
                      setPledger({ text: "", id: "" });
                    }
                  }}
                  options={promisers.map((option) => option)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="همه تعهدکنندگان"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {promisersLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xl={3} xs={12} md={6}>
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  gap={1}
                >
                  <Autocomplete
                    sx={{ width: "100%" }}
                    id="combo-box-demo"
                    value={status}
                    options={allStatus}
                    onChange={(e, value) => {
                      if (value) {
                        setStatus(value);
                      } else {
                        setStatus("");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="همه وضعیت ها" />
                    )}
                  />
                  <IconButton
                    aria-label="search"
                    onClick={handleAdvancedSearch}
                  >
                    <SearchIcon />
                  </IconButton>
                  <IconButton aria-label="refresh" onClick={handleRefreshed}>
                    <RefreshIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </BootstrapDialog>
      </div>

      {/* end  advanced search */}
      {/* {showProgressLoading && <ProgressLoading />} */}
      {showProgressLoading && <CircularIndeterminate />}
      {!showProgressLoading && (
        <div style={{ width: "100%", border: "1px solid #dfe7ef" }}>
          <DataTable
            ref={dt}
            header={header}
            showGridlines={false}
            value={data.data}
            sortMode="multiple"
            emptyMessage="موردی یافت نشد"
            tableStyle={{ minWidth: "100%" }}
            size={"large"}
            rowHover={true}
            stripedRows={true}
          >
            <Column
              header="#"
              body={(rowData, { rowIndex }) => <span>{rowIndex + 1}</span>}
              style={{ textAlign: "center", fontSize: "14px" }}
            />
            <Column
              header="رفرنس"
              body={(rowData) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {rowData.RouteType === "online" && (
                    <Chip
                      size="small"
                      icon={<WifiTetheringIcon color="white" />}
                      label="آنلاین"
                      sx={{ backgroundColor: "#0284c7", color: "white" }}
                    />
                  )}

                  <RouterLink
                    style={{ borderRadius: "50%" }}
                    to={
                      "/trade/opration/" +
                      (parseInt(rowData.FactorId) + 10000).toString()
                    }
                    target="_blank"
                  >
                    <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                      {rowData.SerialId}
                      <br />
                    </span>
                  </RouterLink>
                </div>
              )}
              style={{ textAlign: "right", fontSize: "14px" }}
            />
            <Column
              header="تاریخ"
              body={(rowData) => (
                <div>
                  <Tooltip
                    arrow
                    title={rowData.DateTime.Placeholder}
                    placement="bottom"
                  >
                    <span>
                      {rowData.DateTime.Title}
                      <br />
                    </span>
                  </Tooltip>
                </div>
              )}
              style={{ textAlign: "right", fontSize: "14px" }}
            />
            <Column
              header="متعهد"
              body={(rowData) =>
                rowData.Pledger.map((item) =>
                  item.Type === "operator" ? (
                    <Tooltip
                      arrow
                      title={formatInputWithCommas(item.Amount.toString())}
                      placement="bottom"
                    >
                      <span style={{ fontSize: "12px" }}>
                        {item.Title}
                        <br />
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      arrow
                      title={formatInputWithCommas(item.Amount.toString())}
                      placement="bottom"
                    >
                      <Link
                        style={{ fontSize: "12px" }}
                        href={
                          "https://savosh.com/colleague/ledgeraccounts/" +
                          parseInt(parseInt(item.Id) + parseInt(8200))
                        }
                        target="_blank"
                        underline="hover"
                      >
                        {item.Title}
                        <br />
                      </Link>
                    </Tooltip>
                  )
                )
              }
              style={{ textAlign: "right", fontSize: "14px" }}
            />
            <Column
              header="اپراتور"
              body={(rowData) => (
                <div>
                  <Tooltip arrow title={rowData.Operator.Id} placement="bottom">
                    <span style={{ fontSize: "12px" }}>
                      {rowData.Operator.Title}
                      <br />
                    </span>
                  </Tooltip>
                </div>
              )}
              style={{ textAlign: "right", fontSize: "14px" }}
            />

            <Column
              header="سرپرست"
              body={(rowData) => (
                <div>
                  <Tooltip
                    arrow
                    title={
                      rowData.Leader.TitleEn + " - " + rowData.Leader.Mobile
                    }
                    placement="bottom"
                  >
                    <Link
                      style={{ fontSize: "14px" }}
                      href={
                        "https://savosh.com/customers/details/" +
                        rowData.Leader.Id
                      }
                      target="_blank"
                      underline="hover"
                    >
                      {rowData.Leader.TitleFa
                        ? rowData.Leader.TitleFa + " "
                        : rowData.Leader.TitleEn + " "}
                    </Link>
                  </Tooltip>
                  <span style={{ fontSize: "12px" }}>
                    {"(" + rowData.Financial.SumPassenger + ")"}
                  </span>
                </div>
              )}
              footer={totalPassengers.toString() + " نفر"}
              style={{ textAlign: "right", fontSize: "14px" }}
            />

            <Column
              field="RouteTitle"
              header="جزئیات"
              body={(rowData) => (
                <div>
                  <span style={{ fontSize: "12px" }}>{rowData.RouteTitle}</span>
                </div>
              )}
              style={{ textAlign: "right", fontSize: "14px" }}
            />
            <Column
              header="خرید"
              body={(rowData) => (
                <div>
                  <span>
                    {formatInputWithCommas(rowData.Financial.SumBuy.toString())}
                    <br />
                  </span>
                  <span
                    style={{
                      color: "red",
                      display:
                        rowData.Financial.SumPenaltyBuy !== 0 ? "" : "none",
                    }}
                  >
                    {"ج: " +
                      formatInputWithCommas(
                        rowData.Financial.SumPenaltyBuy.toString()
                      )}
                    <br />
                  </span>
                  <span
                    style={{
                      color: "green",
                      display:
                        rowData.Financial.SumReturnBuy !== 0 ? "" : "none",
                    }}
                  >
                    {"ب: " +
                      formatInputWithCommas(
                        rowData.Financial.SumReturnBuy.toString()
                      )}
                    <br />
                  </span>
                </div>
              )}
              footer={formatInputWithCommas(totalBuy.toString())}
              style={{ fontSize: "14px" }}
            />
            <Column
              header="فروش"
              body={(rowData) => (
                <div>
                  <span>
                    {formatInputWithCommas(
                      rowData.Financial.SumSale.toString()
                    )}
                    <br />
                  </span>
                  <span
                    style={{
                      color: "green",
                      display:
                        rowData.Financial.SumPenaltySale !== 0 ? "" : "none",
                    }}
                  >
                    {"ج: " +
                      formatInputWithCommas(
                        rowData.Financial.SumPenaltySale.toString()
                      )}
                    <br />
                  </span>
                  <span
                    style={{
                      color: "red",
                      display:
                        rowData.Financial.SumReturnSale !== 0 ? "" : "none",
                    }}
                  >
                    {"ب: " +
                      formatInputWithCommas(
                        rowData.Financial.SumReturnSale.toString()
                      )}
                    <br />
                  </span>
                </div>
              )}
              footer={formatInputWithCommas(totalSale.toString())}
              style={{ fontSize: "14px", opacity: "0.3" }}
            />
            <Column
              header="سود/زیان"
              body={(rowData) => (
                <div>
                  <span
                    style={{
                      color: "green",
                      display: rowData.Financial.Profit > 0 ? "" : "none",
                    }}
                  >
                    {formatInputWithCommas(rowData.Financial.Profit.toString())}
                    <br />
                  </span>
                  <span
                    style={{
                      color: "red",
                      display: rowData.Financial.Profit <= 0 ? "" : "none",
                    }}
                  >
                    {formatInputWithCommas(rowData.Financial.Profit.toString())}
                    <br />
                  </span>
                  <Tooltip
                    arrow
                    title="کارمزدهای پرداختی این رفرنس"
                    placement="bottom"
                  >
                    <span
                      style={{
                        color: "red",
                        display: rowData.Financial.SumWage !== 0 ? "" : "none",
                        fontSize: "12px",
                      }}
                    >
                      {"کسر کارمزد:" +
                        formatInputWithCommas(
                          rowData.Financial.SumWage.toString()
                        )}
                      <br />
                    </span>
                  </Tooltip>
                </div>
              )}
              footer={formatInputWithCommas(totalProfit.toString())}
              style={{ fontSize: "14px", opacity: "0.3" }}
            />
            <Column
              header="پرداختی ها"
              body={(rowData) => (
                <div>
                  <span>
                    {formatInputWithCommas(
                      rowData.Financial.SumPayment.toString()
                    )}
                    <br />
                  </span>
                  {rowData.Financial.BalancePaid.toString() !== "0" && (
                    <Tooltip arrow title="مانده پرداختی" placement="bottom">
                      <span style={{ fontSize: "12px" }}>
                        {"م: " +
                          formatInputWithCommas(
                            rowData.Financial.BalancePaid.toString()
                          )}
                        <br />
                      </span>
                    </Tooltip>
                  )}
                </div>
              )}
              footer={formatInputWithCommas(totalDebit.toString())}
              style={{ fontSize: "14px" }}
            />
            <Column
              header="دریافتی ها"
              body={(rowData) => (
                <div>
                  <span>
                    {formatInputWithCommas(
                      rowData.Financial.SumReceive.toString()
                    )}
                    <br />
                  </span>
                  {rowData.Financial.BalanceReceived.toString() !== "0" && (
                    <Tooltip arrow title="مانده دریافتی" placement="bottom">
                      <span style={{ fontSize: "12px" }}>
                        {"م: " +
                          formatInputWithCommas(
                            rowData.Financial.BalanceReceived.toString()
                          )}
                        <br />
                      </span>
                    </Tooltip>
                  )}
                </div>
              )}
              footer={formatInputWithCommas(totalCredit.toString())}
              style={{ fontSize: "14px", opacity: "0.3" }}
            />
            <Column
              header="وضعیت"
              body={(rowData) => (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Tooltip arrow title="صندوق" placement="bottom">
                    <span
                      style={{
                        color: "blue",
                        display: rowData.Status === 1 ? "" : "none",
                      }}
                    >
                      {"CASH"}
                      <br />
                    </span>
                  </Tooltip>
                  <Tooltip arrow title="غیر فعال" placement="bottom">
                    <span
                      style={{
                        color: "red",
                        display: rowData.Status === 2 ? "" : "none",
                      }}
                    >
                      {"DISABLE"}
                      <br />
                    </span>
                  </Tooltip>
                  <Tooltip arrow title="پایان یافته" placement="bottom">
                    <span
                      style={{
                        color: "green",
                        display: rowData.Status === 3 ? "" : "none",
                      }}
                    >
                      {"FINISHED"}
                      <br />
                    </span>
                  </Tooltip>
                  <Tooltip arrow title="استرداد شده" placement="bottom">
                    <span
                      style={{
                        color: "orange",
                        display: rowData.Status === 4 ? "" : "none",
                      }}
                    >
                      {"REFUND"}
                      <br />
                    </span>
                  </Tooltip>
                  <Tooltip arrow title="حذف شده" placement="bottom">
                    <span
                      style={{
                        color: "red",
                        display: rowData.Status === 5 ? "" : "none",
                      }}
                    >
                      {"DELETED"}
                      <br />
                    </span>
                  </Tooltip>
                </div>
              )}
              style={{ textAlign: "right", fontSize: "12px" }}
            />
            <Column
              header="عملیات"
              body={(rowData) => (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <RouterLink
                      style={{ borderRadius: "50%" }}
                      to={
                        "/trade/opration/" +
                        (parseInt(rowData.FactorId) + 10000).toString()
                      }
                      target="_blank"
                    >
                      <IconButton aria-label="search">
                        <AutoFixHighIcon style={{ color: "#334155" }} />
                      </IconButton>
                    </RouterLink>
                  </div>
                </div>
              )}
              style={{ fontSize: "12px", textWrap: "nowrap" }}
            />
          </DataTable>
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            rowsPerPageOptions={[50,100,500]}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
};

const allStatus = [
  { label: "همه وضعیت ها", id: 0 },
  { label: "صندوق", id: 1 },
  { label: "غیر فعال", id: 2 },
  { label: "پایان عملیات", id: 3 },
  { label: "استرداد", id: 4 },
];
