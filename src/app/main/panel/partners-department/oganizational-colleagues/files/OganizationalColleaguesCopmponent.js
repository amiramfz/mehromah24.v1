import * as React from 'react';
import { useSelector } from "react-redux";
import axios from "axios";
import { base_url } from "src/app/constant";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Typography from '@mui/material/Typography';
import { InputText } from "primereact/inputtext";
import SearchIcon from '@mui/icons-material/Search';
import CircularIndeterminate from "src/app/custom-components/CircularProgress";
import AllInboxIcon from '@mui/icons-material/AllInbox';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Tooltip from "@mui/material/Tooltip";
import { convertPersianToEnglishNumbers } from '../../../customers/Customer-department/files/functions';
import {
  ButtonGroup,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";


const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};

const OganizationalColleaguesCopmponent = (props) => {
  const dt = useRef(null);
  const [search, setSearch] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const langDirection = useSelector(selectCurrentLanguage);
  const [showProgressLoading, setShowProgressLoading] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const formatInputWithCommas = (input) => {
    if (!input) {
      return input;
    }
    const cleanValue = input.toString().replace(/[^\d]/g, "");
    const formattedValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedValue;
  };

  function getData() {
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/colleagues/list", {
        access_token: getAccessToken(),
        lang: langDirection,
        json: JSON.stringify({
          draw: 1,
          length: 50,
          search: {
            value: search,
            regex: false
          },
          start: 0,
          advanced: {
            from: "",
            to: "",
            op: "",
            status: ""
          },
        }),
      })
      .then((response) => {
        setData(response.data);
        setShowProgressLoading(false);
      })
      .catch((error) => console.log(error));
  }
  const header = (e) => {
    const searchHandler = (e) => {
      setSearch(searchValue);
      console.log(search);
    }
    const onGlobalFilterChange = (e) => {
      setSearchValue(e.target.value)
      console.log(searchValue);
    };

    return <div style={{ position: "relative" }}>
      <button style={{ top: "34%", cursor: "pointer", top: "41%", right: "12.5%", cursor: "pointer", position: "absolute", zIndex: "2", }} onClick={searchHandler}>
        <SearchIcon />
      </button>
      <span className="p-input-icon-left">
        <TextField
          onChange={(e) => setSearchValue(e.target.value)}
          dir="rtl"
          id="outlined-basic"
          label="جست و جو"
          variant="standard"
          size="small"
        />
      </span>
    </div>
  }
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const showNav = () => {
    console.log("alooooooo");
  }
  const dialogDocumentType = (e) => {
    console.log(e.target.value);
  }
  const dialogDiagnosis = (e) => {
    console.log(e.target.value);
  }
  
  const dialogDate = (e) => {
    console.log(convertPersianToEnglishNumbers(e.toLocaleDateString('fa-IR')).replace("/", "-").replace("/", "-"));
  }
  const dialogPrice = (e) => {
    console.log(e.target.value);
  }
  const dialogDebtCeiling = (e) => {
    console.log(e.target.value);
  }


  useEffect(() => {
    getData();
  }, [search]);


  return (
    <>
      {/* {"OganizationalColleaguesCopmponent"} */}
      {showProgressLoading && <CircularIndeterminate />}
      <div style={{ width: "100%" }}>
        <Typography className="text-2xl md:text-3xl font-semibold tracking-tight leading-7">
          جزئیات اطلاعات همکاران الزاما فقط واحد حسابداری و مدیریت امکان افزودن همکار را دارند.
        </Typography>
        <br />
        <br />
        <DataTable sortField="price" sortOrder={-1} header={header} value={data.data} paginator rows={15} rowsPerPageOptions={[15, 50, 100, 500]} tableStyle={{ Width: '100%', fontSize: "1.2rem", textAlign: "center", justifyContent: "center" }} >
          <Column sortable
            header="#"
            body={(rowData, { rowIndex }) => <span>{rowIndex + 1}</span>}
            style={{ width: '3%', textAlign: "center", fontSize: "14px" }}
          />
          <Column sortable field="seial"
            // value={rowData}
            style={{ width: '5%', fontSize: "14px" }}
            header="سریال"
            body={(rowData) => (
              <div>
                <span
                  style={{
                    fontSize: "1.4rem",
                    lineHeight: "26px",
                  }}
                >
                  {rowData.SerialId}
                </span>
              </div>
            )}
          />
          <Column
            style={{ width: '17%', fontSize: "14px", direction: "rtl", textAlign: "right" }}
            header="شرکت / سازمان"
            body={(rowData) => (
              <div onContextMenu={showNav}>
                <span
                  style={{
                    lineHeight: "26px",
                    fontSize: "1.3rem",
                    display: "flex",
                    textAlign: "right",
                    fontWeight: "700",
                  }}
                >
                  {rowData.Title}
                </span>
              </div>
            )}
          />
          <Column
            style={{ width: '12%', fontSize: "14px", justifyContent: "center", direction: "rtl", textAlign: "right" }}
            header="دپارتمان"
            body={(rowData) => (
              <div>
                <span
                  style={{
                    lineHeight: "26px",
                    fontSize: "1.3rem",
                  }}
                >
                  {rowData.Type}
                </span>
              </div>
            )}
          />
          <Column
            style={{ width: '5%', fontSize: "14px", direction: "rtl", textAlign: "right" }}
            header=" ارتباط"
            body={(rowData) => (
              <div>
                <span
                  style={{
                    lineHeight: "26px",
                    fontSize: "1.3rem",
                    color: "#1b68ff",
                    display:
                      rowData.Relationship === null ? "" : "none"
                  }}
                > اصلی
                </span>
                <span
                  style={{
                    lineHeight: "26px",
                    fontSize: "1.3rem",
                    color: "red",
                    display:
                      rowData.Relationship !== null ? "" : "none"
                  }}
                >
                  {rowData.Relationship}
                </span>
              </div>
            )}
          />
          <Column
            style={{ width: '10%', fontSize: "14px", direction: "rtl", textAlign: "right" }}
            header="گروه"
            body={(rowData) => (
              <div>
                <span
                  style={{
                    lineHeight: "26px",
                  }}
                >{rowData.Category}
                </span>
              </div>
            )}
          />
          <Column
            style={{ width: '6%', fontSize: "14px", direction: "rtl", textAlign: "right" }}
            header="وضعیت"
            body={(rowData) => (
              <div>
                <span
                  style={{
                    lineHeight: "26px",
                    color: "green",
                    display:
                      rowData.Status === 1 ? "" : "none",
                  }}
                >فعال

                </span>
                <span
                  style={{
                    lineHeight: "26px",
                    color: "red",
                    display:
                      rowData.Status != 1 ? "" : "none",
                  }}
                >
                  غیر فعال
                </span>
              </div>
            )}
          />
          <Column sortable
            field="Debit"
            style={{ width: '6%', fontSize: "14px" }}
            header="بدهکار"
            body={(rowData) => (
              <div>
                <span>
                  {
                    formatInputWithCommas(
                      rowData.Debit.toString()
                    )}
                </span>
              </div>
            )}
            footer={(rowData) => (
              <div>
                <span>
                  {/* {formatInputWithCommas(
                  (totlal.Profit - totlal.Wage).toString()
                )} */}
                </span>
              </div>
            )}
          />
          <Column sortable
            style={{ width: '6%', fontSize: "14px" }}
            header="بستانکار"
            body={(rowData) => (
              <div>
                <span
                >{
                    formatInputWithCommas(
                      rowData.Credit.toString()
                    )}
                </span>
              </div>
            )}
            footer={(rowData) => (
              <div>

                <span>
                  {

                  }
                </span>
              </div>
            )}
          />
          <Column sortable
            style={{ width: '6%', fontSize: "14px" }}
            header="مانده "
            body={(rowData) => (
              <div>
                <span>
                  {
                    formatInputWithCommas(
                      rowData.Balance.toString())
                  }
                </span>
              </div>
            )}
          // footer={formatInputWithCommas(
          //   totlal.Buy.toString()
          // )}
          />
          <Column
            field="diagnosis"
            style={{ width: '6%', fontSize: "14px", direction: "rtl", textAlign: "right" }}
            header="تشخیص "
            body={(rowData) => (
              <div>
                <span
                  style={{
                    lineHeight: "26px",
                    color: "#17a2b8",
                    display:
                      rowData.Diagnosis == "Neutral" ? "" : "none"
                  }}
                >تسویه
                </span>
                <span
                  style={{
                    lineHeight: "26px",
                    color: "#3ad29f",
                    display:
                      rowData.Diagnosis == "Debtor" ? "" : "none"
                  }}
                >بستانکار
                </span>
                <span
                  style={{
                    lineHeight: "26px",
                    color: "#dc3545",
                    display:
                      rowData.Diagnosis == "Creditor" ? "" : "none"
                  }}
                > بدهکار
                </span>
              </div>
            )}
          // footer={formatInputWithCommas(
          //   totlal.Debit.toString()
          // )}
          />
          <Column
            style={{ width: '6%', fontSize: "14px", textAlign: "center" }}
            header="عملیات"
            body={(rowData) => (
              <div
                style={{
                  lineHeight: "26px",
                  cursor: "pointer",
                }}
              >

                <Button variant="outlined" onClick={handleClickOpen}>
                  < AllInboxIcon />
                </Button>

                <Dialog open={open} sx={{ backgroundColor: "rgb(0 0 0 / 4%)" }} onClose={handleClose}>
                  <DialogTitle >سند افتتاحیه/اختتامیه {rowData.Title}</DialogTitle>
                  <hr />
                  <DialogContent sx={{ backgroundColor: "rgb(0 0 0 / 4%)" }}>
                    <div style={{
                      display: "flex",
                      columnGap: "18px",
                      justifyContent: "space-between",
                    }}>
                      <div>
                        <FormLabel variant="body2" id="demo-radio-buttons-group-label">نوع سند</FormLabel>
                        <RadioGroup onChange={dialogDocumentType}
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                        >
                          <FormControlLabel value="Opening" control={<Radio />} label="افتتاحیه" />
                          <FormControlLabel value="closing" control={<Radio />} label="اختتامیه" />
                        </RadioGroup>
                      </div>
                      <div>
                        <FormLabel variant="body2" id="demo-radio-buttons-group-label" > سال</FormLabel>
                        <br />
                        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                          <DatePicker sx={{ margin: "15px 0 0 0" }} 
                          onChange={dialogDate}
                          views={["year"]} 
                          slotProps={{
                            openPickerIcon: { fontSize: 'large' },
                            openPickerButton: { color: 'secondary' },
                            textField: {
                              variant: 'filled',
                              focused: true,
                              color: 'secondary',
                            },
                          }} label=" سال" />
                        </LocalizationProvider>
                      </div>
                      <div>
                        <FormLabel variant="body2" id="demo-radio-buttons-group-label">مبلغ </FormLabel>
                        <TextField onChange={dialogPrice}
                         sx={{ margin: "15px 0 0 0" }}
                          autoFocus
                          margin="dense"
                          id="name"
                          type="number"
                          fullWidth
                        // variant="standard"
                        />
                      </div>
                      <div>
                        <FormLabel variant="body2" id="demo-radio-buttons-group-label">تشخیص </FormLabel>
                        <RadioGroup onChange={dialogDiagnosis}
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                        >
                          <FormControlLabel value="debtor" control={<Radio />} label="بدهکار" />
                          <FormControlLabel value="creditor" control={<Radio />} label="بستانکار" />
                        </RadioGroup>
                      </div>
                    </div>
                  </DialogContent>
                  <DialogContent>
                    <div>
                      <FormLabel variant="body1" id="demo-radio-buttons-group-label">سقف بدهی </FormLabel>
                      <FormLabel variant="body2" id="demo-radio-buttons-group-label">(سقف ریالی که میتواند در این سیستم متعهد شود.)</FormLabel>
                      <TextField onChange={dialogDebtCeiling}
                        sx={{ margin: "15px 0 0 0" }}
                        autoFocus
                        margin="dense"
                        id="name"
                        type="number"
                        fullWidth
                      // variant="standard"
                      />
                    </div>
                  </DialogContent>

                  <DialogActions>
                    <Button style={{ fontSize: "20px", backgroundColor: "#6c757d", border: "none" }} onClick={handleClose}>بستن !</Button>
                    <Button style={{ fontSize: "20px" }} onClick={handleClose}>اعمال</Button>
                  </DialogActions>
                </Dialog></div>)}
          />
          <Column
            style={{ width: '8%', fontSize: "14px", textAlign: "center" }}
            header="صورت حساب"
            body={(rowData) => (
              <div
                style={{
                  lineHeight: "26px",
                  cursor: "pointer",
                }}
              >
                <Tooltip title="دفتر حساب">
                  <Button variant="outlined" >
                    < ReceiptLongIcon backgroundColor="disabled" />
                  </Button>
                </Tooltip>
              </div>)}
          />
          <Column
            style={{ width: '15%', fontSize: "14px", textAlign: "center" }}
            header="دفتر حساب"
            body={(rowData) => (
              <div
                style={{
                  lineHeight: "26px",
                  cursor: "pointer",
                }}
              ><Tooltip title="صورت حساب">
                  <Button variant="outlined" >
                    < ImportContactsIcon backgroundColor="secondary" />
                  </Button>
                </Tooltip>
              </div>)}
          />
        </DataTable>
      </div>
    </>
  );
};

export default OganizationalColleaguesCopmponen