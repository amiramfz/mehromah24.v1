import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import Link from "@mui/material/Link";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode";
import SnippetFolderIcon from "@mui/icons-material/SnippetFolder";
import ChatIcon from "@mui/icons-material/Chat";
import PaymentIcon from "@mui/icons-material/Payment";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import axios from "axios";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
  TimeField,
} from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import NumberToPersianWordMin from "number_to_persian_word";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Checkbox from "@mui/material/Checkbox";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import {
  convertMiladiToJalaliDate,
  formatInputWithCommas,
  formatInputWithOutCommas,
} from "./functions";
import FlightIcon from "@mui/icons-material/Flight";
import TrainIcon from "@mui/icons-material/Train";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Paper from "@mui/material/Paper";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import {
  convertPersianToEnglishNumbers,
  convertJalalitoMiladiDate,
} from "./functions";
import { LoadingButton } from "@mui/lab";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import CustomStepper from "./CustomStepper";
import UploadIcon from "@mui/icons-material/Upload";
import CircularIndeterminate from "src/app/custom-components/CircularProgress";
import calculateAgeCategory from "src/app/custom-components/agegroupe";
import { v4 as uuidv4 } from "uuid";
import { width } from "@mui/system";
import { base_url, host_url } from "src/app/constant";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { showMessage } from "app/store/fuse/messageSlice";
import { CheckBox } from "@mui/icons-material";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import { Link as RouterLink } from "react-router-dom";
import TextareaAutosize from "@mui/base/TextareaAutosize";

// import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';

const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));
const options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};
export const ServicesComponent = (props) => {
  useEffect(() => {
    console.log("dasdfshfakjcfbsadjkfhksdhgtsdcfttjsdac", props.refrence);
  }, [props.refrence]);
  const dispatch = useDispatch();
  function showAlert(message) {
    dispatch(
      showMessage({
        message: message, //text or html
        autoHideDuration: 6000, //ms
        anchorOrigin: {
          vertical: "top", //top bottom
          horizontal: "center", //left center right
        },
        variant: "error", //success error info warning null
      })
    );
  }
  const langDirection = useSelector(selectCurrentLanguage);
  const [serialId, setSerialId] = useState(props.refrence.serial_id);
  const [showProgressLoading, setShowProgressLoading] = React.useState(false);
  const [editedProvider, setEditedProvider] = useState("");
  const [editedItem, setEditedItem] = useState("");
  //for right click menu

  const [contextMenu, setContextMenu] = React.useState({
    isOpen: false,
    anchorEl: null,
    rowData: null,
  });

  const handleContextMenu = (event, rowData) => {
    event.preventDefault();
    setContextMenu({
      isOpen: true,
      anchorEl: event.currentTarget,
      rowData: rowData,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({
      isOpen: false,
      anchorEl: null,
      rowData: null,
    });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  //end for right click menu
  //handle edit all checkbox
  const [editAllChecked, setEditAllChecked] = useState(false);
  //for dialog
  const [itemForEdit, setItemForEdit] = useState(null);
  const [isExtradition, setIsExtradition] = useState(false);
  const [isAddItem, setIsAddItem] = useState(false);
  const [isSendMessage, setIsSendMessage] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [extraditionItems, setExtraditionItems] = useState([]);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function handleMakeReadyeExtraditionItems() {
    setExtraditionItems([]);
    props.refrence.data.forEach((element, index) => {
      setExtraditionItems((preItems) => [
        ...preItems,
        {
          id: uuidv4(),
          item_id: element.serial_id,
          counter: index + 1,
          data: element,
          penalty_buy_percent: "",
          penalty_buy_price: "",
          penalty_sell_percent: "",
          penalty_sell_price: "",
          extradition_date: "",
          reason: "",
          is_Checked_copy: "",
          provider: element.provider.id,
          passenger: element.passenger.passenger_id,
          sell: element.sell,
          buy: element.buy,
          refund_id: element.refund ? element.refund.id : false,
        },
      ]);
    });
  }
  function handleChangeExtraditionItems(id, action, value) {
    extraditionItems.forEach((item) => {
      if (item.id === id) {
        item[action] = value;
      }
    });
  }

  function handleMenu(action, rowData) {
    if (action === "edit") {
      setIsExtradition(false);
      setIsAddItem(false);
      setIsSendMessage(false);
      handleClickOpenDialog();
    } else if (action === "extradition") {
      handleMakeReadyeExtraditionItems();
      setIsExtradition(true);
      setIsAddItem(false);
      setIsSendMessage(false);
      handleClickOpenDialog();
    } else if (action === "add_item") {
      setIsAddItem(true);
      setIsExtradition(false);
      setIsSendMessage(false);
      handleClickOpenDialog();
    } else if (action === "send_message") {
      setIsExtradition(false);
      setIsAddItem(false);
      setIsSendMessage(true);
      handleClickOpenDialog();
    }
    //close menu
    handleCloseContextMenu();
  }
  //end for dialog
  //loading button
  function sendExtrdition(data) {
    console.log({
      access_token: getAccessToken(),
      serial_id: serialId,
      data: data,
    });
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/trade/refund/update", {
        access_token: getAccessToken(),
        serial_id: serialId,
        data: data,
      })
      .then((response) => {
        setClickedSubmit(false);
        // Handle the response from the web service
        if (!response.data.status) {
        } else {
          setShowProgressLoading(false);
          setOpenDialog(false);
          props.getRefrenceEdit(serialId);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Error sending JSON data:", error);
      });
  }
  function sendData(data) {
    data["access_token"] = getAccessToken();
    data["serial_id"] = serialId;
    console.log(data);
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/trade/item/edit", data)
      .then((response) => {
        setClickedSubmit(false);
        console.log(response.data);
        // Handle the response from the web service
        if (!response.data.status) {
        } else {
          setShowProgressLoading(false);
          setOpenDialog(false);
          props.getRefrenceEdit(serialId);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Error sending JSON data:", error);
      });
  }
  function getEditedData(action, data) {
    data["edit_all"] = editAllChecked;
    console.log(data);
    // sendData(data);
    if (action === "route") {
      console.log("data is route");
      if (data.route.type === "aircraft") {
        if (!data.route.origin) {
          showAlert("باید یک مبدا وارد شود");
          setClickedSubmit(false);
        } else if (!data.route.destination) {
          showAlert("باید یک مقصد وارد شود");
          setClickedSubmit(false);
        } else if (
          !data.route.date_time_path ||
          data.route.date_time_path === "Invalid Date"
        ) {
          showAlert("باید زمان حرکت وارد شود");
          setClickedSubmit(false);
        } else if (!data.route.company) {
          showAlert("باید شرکت وارد شود");
          setClickedSubmit(false);
        } else if (!data.route.flight_number) {
          showAlert("باید شماره پرواز وارد شود");
          setClickedSubmit(false);
        } else if (!data.route.class) {
          showAlert("باید کلاس وارد شود");
          setClickedSubmit(false);
        } else {
          sendData(data);
          setClickedSubmit(false);
        }
      } else {
        if (!data.route.origin) {
          showAlert("باید یک مبدا وارد شود");
          setClickedSubmit(false);
        } else if (!data.route.destination) {
          showAlert("باید یک مقصد وارد شود");
          setClickedSubmit(false);
        } else if (
          !data.route.date_time_path ||
          data.route.date_time_path === "Invalid Date"
        ) {
          showAlert("باید زمان حرکت وارد شود");
          setClickedSubmit(false);
        } else if (!data.route.company) {
          showAlert("باید شرکت وارد شود");
          setClickedSubmit(false);
        } else {
          sendData(data);
        }
      }
    } else if (action === "visa") {
      if (!data.visa.visa) {
        showAlert("باید یک ویزا وارد شود");
        setClickedSubmit(false);
      } else if (!data.visa.country) {
        showAlert("باید یک کشور وارد شود");
        setClickedSubmit(false);
      } else if (
        !data.visa.visa_issuing ||
        data.visa.visa_issuing === "Invalid Date"
      ) {
        showAlert("باید تاریخ صدور وارد شود");
        setClickedSubmit(false);
      } else if (!data.visa.visa_ex || data.visa.visa_ex === "Invalid Date") {
        showAlert("باید تاریخ پایان وارد شود");
        setClickedSubmit(false);
      } else {
        sendData(data);
      }
    } else if (action === "insurance") {
      if (!data.insurance.insurance) {
        showAlert("باید یک بیمه وارد شود");
        setClickedSubmit(false);
      } else if (
        !data.insurance.insurance_issuing ||
        data.insurance.insurance_issuing === "Invalid Date"
      ) {
        showAlert("باید تاریخ صدور وارد شود");
        setClickedSubmit(false);
      } else if (
        !data.insurance.insurance_ex ||
        data.insurance.insurance_ex === "Invalid Date"
      ) {
        showAlert("باید تاریخ پایان وارد شود");
        setClickedSubmit(false);
      } else {
        sendData(data);
      }
    } else if (action === "service") {
      if (!data.service.service) {
        showAlert("باید یکی از خدمات وارد شود");
        setClickedSubmit(false);
      } else {
        sendData(data);
      }
    } else if (action === "tour") {
      if (!data.tour.tour) {
        showAlert("باید یک تور وارد شود");
        setClickedSubmit(false);
      } else {
        sendData(data);
      }
    } else if (action === "hotel") {
      if (!data.hotel.hotel) {
        showAlert("باید یک هتل وارد شود");
        setClickedSubmit(false);
      } else if (
        !data.hotel.hotel_in_date ||
        data.hotel.hotel_in_date === "Invalid Date"
      ) {
        showAlert("باید تاریخ ورود وارد شود");
        setClickedSubmit(false);
      } else if (
        !data.hotel.hotel_out_date ||
        data.hotel.hotel_out_date === "Invalid Date"
      ) {
        showAlert("باید تاریخ خروج وارد شود");
        setClickedSubmit(false);
      } else if (
        !data.hotel.hotel_in_time ||
        data.hotel.hotel_in_time === "Invalid Date"
      ) {
        showAlert("باید زمان ورود وارد شود");
        setClickedSubmit(false);
      } else if (
        !data.hotel.hotel_out_time ||
        data.hotel.hotel_out_time === "Invalid Date"
      ) {
        showAlert("باید زمان خروج وارد شود");
        setClickedSubmit(false);
      } else {
        sendData(data);
      }
    } else if (action === "send_message") {
      setShowProgressLoading(true);
      axios
        .post(base_url + "/v2/notif/send", data)
        .then((response) => {
          setClickedSubmit(false);
          console.log(response.data);
          // Handle the response from the web service
          if (!response.data.status) {
            setShowProgressLoading(false);
            setOpenDialog(false);
            showAlert("خطا در ارسال پیام");
          } else {
            setShowProgressLoading(false);
            setOpenDialog(false);
            showAlert("پیام با موفقیت ارسال شد");
          }
        })
        .catch((error) => {
          // Handle any errors that occurred during the request
          console.error("Error sending JSON data:", error);
        });
    }
  }
  const [clickedSubmit, setClickedSubmit] = useState(false);
  const [loadingButton, setLoadingButton] = React.useState(false);
  function handleClickLoadingButton() {
    if (isExtradition) {
      console.log(extraditionItems);
      let isValid = true;
      extraditionItems.forEach((item) => {
        if (item.penalty_buy_price || item.penalty_sell_price) {
          if (!item.extradition_date) {
            showAlert("برای آیتم های استرداد شده وارد کردن تاریخ اجباری است");
            isValid = false;
          }
        }
      });
      if (isValid) {
        sendExtrdition(extraditionItems);
      }
    } else {
      setClickedSubmit(!clickedSubmit);
    }
    //این خط باید از کامنت در بیاید
    // setLoadingButton(true);
  }
  //function for handle added item
  function handleAddedItem(data) {
    const jsonData = {
      access_token: getAccessToken(),
      serial_id: serialId,
      data: data.data,
    };
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/trade/item/add", jsonData)
      .then((response) => {
        setClickedSubmit(false);
        // Handle the response from the web service
        if (!response.data.status) {
          console.log(response.data.message);
        } else {
          setShowProgressLoading(false);
          setOpenDialog(false);
          console.log(serialId);
          props.getRefrenceEdit(serialId);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Error sending JSON data:", error);
      });
  }

  function deleteItem(id, refund_id, action = "item") {
    setOpenDialog(false);
    Swal.fire({
      title: "آیا میخواهید این آیتم حذف شود",
      text: "این عملیات غیرقابل یازگشت است",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "بله ادامه میدهم",
      cancelButtonText: "انصراف",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log({
          serial_id: serialId,
          access_token: getAccessToken(),
          item_id: id,
          refund_id: refund_id,
        });
        // Handle the OK (confirm) action
        if (action === "extradition") {
          setShowProgressLoading(true);
          axios
            .post(base_url + "/v2/trade/refund/delete", {
              serial_id: serialId,
              access_token: getAccessToken(),
              refund_id: id,
            })
            .then((response) => {
              // Handle the response from the web service
              if (!response.data.status) {
                console.log(response.data.message);
              } else {
                setShowProgressLoading(false);
                props.getRefrenceEdit(serialId);
              }
            })
            .catch((error) => {
              // Handle any errors that occurred during the request
              console.error("Error sending JSON data:", error);
            })
            .finally(() => {
              // This block will be executed after the axios request, regardless of success or failure
              //
            });
        } else {
          setShowProgressLoading(true);
          axios
            .post(base_url + "/v2/trade/item/delete", {
              serial_id: serialId,
              access_token: getAccessToken(),
              item_id: id,
            })
            .then((response) => {
              // Handle the response from the web service
              if (!response.data.status) {
                console.log(response.data.message);
              } else {
                setShowProgressLoading(false);
                setOpenDialog(false);
                props.getRefrenceEdit(serialId);
              }
            })
            .catch((error) => {
              // Handle any errors that occurred during the request
              console.error("Error sending JSON data:", error);
            });
        }

        // Swal.fire("آیتم با موفقیت حذف شد");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Handle the Cancel action
        // Swal.fire("Cancelled", "Your action was cancelled", "error");
      }
    });
  }
  return (
    <>
      {showProgressLoading && <CircularIndeterminate />}
      {/*  dialog */}
      <div style={{ with: "100%" }}>
        <BootstrapDialog
          onClose={handleCloseDialog}
          aria-labelledby="customized-dialog-title"
          open={openDialog}
          fullWidth={true}
          maxWidth={isSendMessage ? "md" : "xl"}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {isAddItem ? "افزودن" : "ویرایش"}
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
            {showProgressLoading && <CircularIndeterminate />}

            {/* for add item */}
            {!isSendMessage && !isExtradition && isAddItem && (
              <AddItem
                refrence={props.refrence}
                handleAddedItem={handleAddedItem}
                addedPersons={props.addedPersons}
              />
            )}
            {/* for extradition */}
            {!isSendMessage && isExtradition && !isAddItem && itemForEdit && (
              <ParentExtradition
                langDirection={langDirection}
                items={extraditionItems}
                handleChange={handleChangeExtraditionItems}
                deleteItem={deleteItem}
              />
            )}
            {/* for end message */}
            {isSendMessage && (
              <SendMessage
                itemForEdit={itemForEdit}
                leader={props.refrence.data[0].passenger}
                slug={props.refrence.slug}
                clickedSubmit={clickedSubmit}
                getEditedData={getEditedData}
                serial_id={props.refrence.serial_id}
                setClickedSubmit={setClickedSubmit}
              />
            )}
            {!isSendMessage &&
              !isExtradition &&
              !isAddItem &&
              itemForEdit &&
              itemForEdit.action === "route" && (
                <RouteEdit
                  langDirection={langDirection}
                  itemForEdit={itemForEdit}
                  getEditedData={getEditedData}
                  clickedSubmit={clickedSubmit}
                  passengers={props.refrence.passengers.concat(
                    props.addedPersons
                  )}
                  deleteItem={deleteItem}
                />
              )}
            {/* for hotel */}
            {!isSendMessage &&
              !isExtradition &&
              !isAddItem &&
              itemForEdit &&
              itemForEdit.action === "hotel" && (
                <HotelEditComponent
                  langDirection={langDirection}
                  itemForEdit={itemForEdit}
                  passengers={props.refrence.passengers.concat(
                    props.addedPersons
                  )}
                  clickedSubmit={clickedSubmit}
                  getEditedData={getEditedData}
                  deleteItem={deleteItem}
                />
              )}
            {/* for insurance */}
            {!isSendMessage &&
              !isExtradition &&
              !isAddItem &&
              itemForEdit &&
              itemForEdit.action === "insurance" && (
                <InsuranceEditComponent
                  langDirection={langDirection}
                  itemForEdit={itemForEdit}
                  getEditedData={getEditedData}
                  clickedSubmit={clickedSubmit}
                  passengers={props.refrence.passengers.concat(
                    props.addedPersons
                  )}
                  deleteItem={deleteItem}
                />
              )}
            {/* for visa */}
            {!isSendMessage &&
              !isExtradition &&
              !isAddItem &&
              itemForEdit &&
              itemForEdit.action === "visa" && (
                <VisaEditComponent
                  langDirection={langDirection}
                  itemForEdit={itemForEdit}
                  getEditedData={getEditedData}
                  clickedSubmit={clickedSubmit}
                  passengers={props.refrence.passengers.concat(
                    props.addedPersons
                  )}
                  deleteItem={deleteItem}
                />
              )}
            {/* for tour */}
            {!isSendMessage &&
              !isExtradition &&
              !isAddItem &&
              itemForEdit &&
              itemForEdit.action === "tour" && (
                <TourEditComponent
                  langDirection={langDirection}
                  itemForEdit={itemForEdit}
                  getEditedData={getEditedData}
                  clickedSubmit={clickedSubmit}
                  passengers={props.refrence.passengers.concat(
                    props.addedPersons
                  )}
                  deleteItem={deleteItem}
                />
              )}
            {/* for service */}
            {!isSendMessage &&
              !isExtradition &&
              !isAddItem &&
              itemForEdit &&
              itemForEdit.action === "service" && (
                <ServiceEditComponent
                  langDirection={langDirection}
                  itemForEdit={itemForEdit}
                  getEditedData={getEditedData}
                  clickedSubmit={clickedSubmit}
                  passengers={props.refrence.passengers.concat(
                    props.addedPersons
                  )}
                  deleteItem={deleteItem}
                />
              )}
          </DialogContent>
          {!isAddItem && (
            <DialogActions>
              <Box display="flex" gap={1} alignItems="center">
                {!isExtradition && (
                  <Typography sx={{ fontSize: "10px" }}>
                    اعمال ویرایش روی تمامی آیتم های مشابه
                  </Typography>
                )}
                {!isExtradition && (
                  <Checkbox
                    checked={editAllChecked}
                    onChange={(e) => setEditAllChecked(!editAllChecked)}
                  />
                )}

                <LoadingButton
                  sx={{ width: "100px" }}
                  color="secondary"
                  onClick={handleClickLoadingButton}
                  loading={loadingButton}
                  loadingPosition="end"
                  endIcon={<CheckCircleOutlineIcon />}
                  variant="contained"
                >
                  <span>ارسال</span>
                </LoadingButton>
              </Box>
            </DialogActions>
          )}
        </BootstrapDialog>
      </div>
      {/* end  dialog */}
      {/* start data table for services */}
      <div className="card">
        <DataTable
          //   value={props.refrence.pledgers}
          value={props.refrence.data}
          showGridlines
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            header="#"
            body={(rowData, { rowIndex }) => <span>{rowIndex + 1}</span>}
            style={{ textAlign: "center", fontSize: "14px" }}
          />
          <Column
            body={(rowData) => (
              <div>
                <span>
                  {rowData.passenger.name_fa ? (
                    <Link
                      style={{ fontSize: "12px" }}
                      href={
                        host_url +
                        "/customers/details/" +
                        rowData.passenger.passenger_id
                      }
                      target="_blank"
                      underline="hover"
                    >
                      {rowData.passenger.name_fa +
                        " " +
                        rowData.passenger.lastname_fa}
                    </Link>
                  ) : (
                    <Link
                      style={{ fontSize: "12px" }}
                      href={
                        host_url +
                        "/customers/details/" +
                        rowData.passenger.passenger_id
                      }
                      target="_blank"
                      underline="hover"
                    >
                      {rowData.passenger.name_en +
                        " " +
                        rowData.passenger.lastname_en}
                    </Link>
                  )}
                  <br />
                </span>
              </div>
            )}
            style={{ textAlign: "right", fontSize: "12px" }}
            header="نام و نام خانوادگی"
          ></Column>
          <Column
            field="amount"
            body={(rowData) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <span>
                  {rowData.action === "route" && "بلیط"}
                  {rowData.action === "hotel" && "هتل"}
                  {rowData.action === "insurance" && "بیمه"}
                  {rowData.action === "visa" && "ویزا"}
                  {rowData.action === "tour" && "تور"}
                  {rowData.action === "service" && "خدمات"}
                  <br />
                </span>
                {rowData.refund ? (
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#f87171",
                      padding: "5px",
                      color: "white",
                    }}
                  >
                    <span>استردادی</span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
            style={{ textAlign: "right", fontSize: "12px" }}
            header="خدمات"
          ></Column>

          <Column
            body={(rowData) => (
              <div>
                <span>
                  {/* {rowData.action === "route" &&
                  rowData.route.route_type &&
                  rowData.route.route_type === "flight"
                    ? "پرواز"
                    : rowData.route.route_type === "bus"
                    ? "اتوبوس"
                    : rowData.route.route_type === "train"
                    ? "قطار"
                    : "دریایی"} */}
                  {rowData.action === "route" &&
                    (rowData.route.type === "aircraft"
                      ? "پرواز"
                      : rowData.route.type === "train"
                      ? "قطار"
                      : rowData.route.type === "bus"
                      ? "اتوبوس"
                      : "دریایی")}
                  {/* {rowData.action === "hotel" && rowData.hotel.hotel.title} */}
                  {rowData.action === "insurance" &&
                    rowData.insurance.insurance.title}
                  {rowData.action === "visa" && rowData.visa.visa.title}
                  {rowData.action === "tour" && rowData.tour.tour.title}
                  {rowData.action === "service" &&
                    rowData.service.service.title}
                  <br />
                </span>
              </div>
            )}
            style={{ textAlign: "right", fontSize: "12px" }}
            header="نوع"
          ></Column>
          <Column
            body={(rowData) => (
              <div
                onContextMenu={(e) => {
                  setItemForEdit(rowData);
                  handleContextMenu(e, rowData);
                }}
              >
                <span
                  style={{ userSelect: "none", textDecoration: "underline" }}
                >
                  {rowData.title.fa}
                  <br />
                </span>
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={contextMenu.anchorEl}
                  open={contextMenu.isOpen && contextMenu.rowData === rowData}
                  onClose={handleCloseContextMenu}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem onClick={handleCloseContextMenu}>
                    <ListItemIcon>
                      <DisplaySettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>جزئیات</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenu("extradition");
                    }}
                    disabled={!(props.status.id === 1)}
                  >
                    <ListItemIcon>
                      <KeyboardReturnIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>استرداد</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenu("edit");
                    }}
                    disabled={!(props.status.id === 1)}
                  >
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>ویرایش</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleCloseContextMenu}>
                    <ListItemIcon>
                      <QrCodeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>دسترسی QRcode</ListItemText>
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleCloseContextMenu}>
                    <ListItemIcon>
                      <SnippetFolderIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>مکاتبات مسافر</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenu("send_message");
                    }}
                  >
                    <ListItemIcon>
                      <ChatIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>ارسال پیام</ListItemText>
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleCloseContextMenu}>
                    <ListItemIcon>
                      <PaymentIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>صورت مالی تامین کننده</ListItemText>
                  </MenuItem>
                  <RouterLink
                    style={{ borderRadius: "50%" }}
                    to={
                      "/print/tickets/" +
                      langDirection.id +
                      "/" +
                      props.refrence.slug
                    }
                    target="_blank"
                  >
                    <MenuItem onClick={handleCloseContextMenu}>
                      <ListItemIcon>
                        <AirplaneTicketIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>بلیط</ListItemText>
                    </MenuItem>
                  </RouterLink>
                </Menu>
              </div>
            )}
            style={{ textAlign: "right", fontSize: "12px" }}
            header="جزئیات"
          ></Column>
          <Column
            body={(rowData) => (
              <div>
                <span>
                  {rowData.provider.title_fa}
                  {rowData.provider.last_name
                    ? " - " +
                      rowData.provider.first_name +
                      " " +
                      rowData.provider.last_name
                    : ""}
                  <br />
                </span>
              </div>
            )}
            style={{ textAlign: "right", fontSize: "12px" }}
            header="تامین کننده"
          ></Column>
          <Column
            body={(rowData) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <span>
                  {formatInputWithCommas(
                    formatInputWithOutCommas(rowData.buy.toString())
                  )}
                  <br />
                </span>
                {rowData.refund ? (
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#f87171",
                      padding: "5px",
                      color: "white",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <span>
                      جریمه:{" "}
                      {" " +
                        formatInputWithCommas(
                          parseInt(rowData.refund.buy).toString()
                        )}
                    </span>
                    <br />
                    <span>
                      برگشت:
                      {" " +
                        formatInputWithCommas(
                          (
                            parseInt(rowData.buy) - parseInt(rowData.refund.buy)
                          ).toString()
                        )}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
            style={{ fontSize: "12px" }}
            header="خرید"
          ></Column>
          <Column
            body={(rowData) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <span>
                  {formatInputWithCommas(
                    formatInputWithOutCommas(rowData.sell.toString())
                  )}
                  <br />
                </span>
                {rowData.refund ? (
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#f87171",
                      padding: "5px",
                      color: "white",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <span>
                      جریمه:
                      {" " +
                        formatInputWithCommas(
                          (
                            parseInt(rowData.sell) -
                            parseInt(rowData.refund.sell)
                          ).toString()
                        )}
                    </span>
                    <br />
                    <span>
                      برگشت:{" "}
                      {" " +
                        formatInputWithCommas(
                          parseInt(rowData.refund.sell).toString()
                        )}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
            style={{ fontSize: "12px" }}
            header="فروش"
          ></Column>
        </DataTable>
      </div>
      {/* end data table for services */}
      {/* start add new items button */}
      {props.status.id === 1 && (
        <Box marginTop={2}>
          <Grid container>
            <Grid item xl={2} md={2} xs={6}>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Button
                  onClick={() => handleMenu("add_item")}
                  size="large"
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  {"افزودن"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* end new items button */}
    </>
  );
};

// start edit
// HotelEditComponent
const HotelEditComponent = (props) => {
  //for edit provider
  //for default provider
  const [defaultProviderName, setDefaultProviderName] = useState(
    props.itemForEdit.provider
  );
  //for default name of person
  const [defaultPersonName, setDefaultPersonName] = useState(
    props.itemForEdit.passenger
  );
  //for deadline
  const [defaultDeadLine, setDefaultDeadLine] = useState(
    props.itemForEdit.deadline
      ? convertJalalitoMiladiDate(props.itemForEdit.deadline)
      : null
  );
  const [buyValue, setBuyValue] = useState("");
  const [sellValue, setSellValue] = useState("");

  //initial values
  const [providerCredit, setProviderCridit] = useState("");
  const [optionalCredit, setOptionalCridit] = useState(true);
  const [validCreditProvider, setValidCreditProvider] = useState(true);
  const [isOther, setIsOther] = useState(
    props.itemForEdit.provider.id === 1 ? true : false
  );
  const [providerRequired, setProviderRequired] = useState(true);
  const schema = yup.object().shape({
    provider: providerRequired
      ? yup.string().required("باید یک تامین کننده وارد کنید")
      : yup.string().nullable(),
    buyPrice: isOther
      ? yup.string().nullable()
      : providerRequired
      ? yup.string().required("باید یک خرید وارد کنید")
      : yup.string().nullable(),
  });
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [openProviders, setOpenProviders] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providerssLoading, setprovidersLoading] = useState(false);
  function getProviders() {
    setprovidersLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: props.langDirection,
        access_token: getAccessToken(),
        table: "colleague",
        action: "provider",
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setProviders(response.data.data.titles);
        setprovidersLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openProviders) {
      getProviders();
    }
  }, [openProviders]);

  useEffect(() => {
    setBuyValue("");
    setSellValue("");
  }, [validCreditProvider, isOther]);
  useEffect(() => {
    setBuyValue(formatInputWithCommas(props.itemForEdit.buy));
    setSellValue(formatInputWithCommas(props.itemForEdit.sell));
  }, []);
  //end for edit provider
  //start edit item
  //for default item
  const [defaultHotelName, setDefaultHotelName] = useState(
    props.itemForEdit.hotel.hotel
  );
  const [defaultRoomMate, setDefaultRoomMate] = useState(
    props.itemForEdit.hotel.roommate ? props.itemForEdit.hotel.roommate : []
  );
  const [defaultRoomType, setDefaultRoomType] = useState(
    props.itemForEdit.hotel.room_type ? props.itemForEdit.hotel.room_type : null
  );
  const [defaultRoomRate, setDefaultRoomRate] = useState(
    props.itemForEdit.hotel.room_rate ? props.itemForEdit.hotel.room_rate : ""
  );
  const [extraBeds, setExtraBeds] = useState(
    props.itemForEdit.hotel.addition_beds
  );
  const [defaultRoomView, setDefaultRoomView] = useState(
    props.itemForEdit.hotel.room_view ? props.itemForEdit.hotel.room_view : null
  );

  const [defaultHotelInDate, setDefaultHotelInDate] = useState(
    convertJalalitoMiladiDate(props.itemForEdit.hotel.hotel_in_date)
  );
  const [defaultHotelInTime, setDefaultHotelInTime] = useState(
    props.itemForEdit.hotel.hotel_in_time
  );
  const [defaultHotelOutDate, setDefaultHotelOutDate] = useState(
    convertJalalitoMiladiDate(props.itemForEdit.hotel.hotel_out_date)
  );
  const [defaultHotelOutTime, setDefaultHotelOutTime] = useState(
    props.itemForEdit.hotel.hotel_out_time
  );
  const [inputDescription, setInputDescription] = useState(
    props.itemForEdit.hotel.description
  );
  //for hotel's name
  const [openHotels, setOpenHotels] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  function getHotels() {
    setHotelsLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: props.langDirection,
        access_token: getAccessToken(),
        table: "hotel",
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setHotels(response.data.data.titles);
        setHotelsLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openHotels) {
      getHotels();
    }
  }, [openHotels]);
  //for rooms's type
  const [openRoomTypes, setOpenRoomTypes] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypesLoading, setRoomTypesLoading] = useState(false);
  function getRoomTypes() {
    setRoomTypesLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: props.langDirection,
        access_token: getAccessToken(),
        table: "hotel_title",
        action: "room_type",
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setRoomTypes(response.data.data.titles);
        setRoomTypesLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openRoomTypes) {
      getRoomTypes();
    }
  }, [openRoomTypes]);

  //for rooms's rate
  const [openRoomRates, setOpenRoomRates] = useState(false);
  const [roomRates, setRoomRates] = useState([]);
  const [roomRatesLoading, setRoomRatesLoading] = useState(false);
  function getRoomRates() {
    setRoomRatesLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: props.langDirection,
        access_token: getAccessToken(),
        table: "hotel_title",
        action: "room_rate",
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setRoomRates(response.data.data.titles);
        setRoomRatesLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openRoomRates) {
      getRoomRates();
    }
  }, [openRoomRates]);
  //for rooms's view
  const [openRoomViews, setOpenRoomViews] = useState(false);
  const [roomViews, setRoomViews] = useState([]);
  const [roomViewsLoading, setRoomViewsLoading] = useState(false);
  function getRoomViews() {
    setRoomViewsLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: props.langDirection,
        access_token: getAccessToken(),
        table: "hotel_title",
        action: "room_view",
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setRoomViews(response.data.data.titles);
        setRoomViewsLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openRoomViews) {
      getRoomViews();
    }
  }, [openRoomViews]);
  // for date ranger
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  //handle Clicked submit
  useEffect(() => {
    if (props.clickedSubmit) {
      const data = {
        action: "hotel",
        item_id: props.itemForEdit.serial_id,
        hotel: {
          hotel_in_date: defaultHotelInDate
            ? convertPersianToEnglishNumbers(
                defaultHotelInDate.toLocaleDateString("fa-IR", options)
              )
            : null,
          hotel_out_date: defaultHotelOutDate
            ? convertPersianToEnglishNumbers(
                defaultHotelOutDate.toLocaleDateString("fa-IR", options)
              )
            : null,
          hotel_in_time: defaultHotelInTime,
          hotel_out_time: defaultHotelOutTime,
          addition_beds: extraBeds,
          description: inputDescription,
          hotel: defaultHotelName,
          room_rate: defaultRoomRate,
          room_view: defaultRoomView,
          room_type: defaultRoomType,
          roommate: defaultRoomMate,
        },
        provider: defaultProviderName,
        passenger: defaultPersonName,
        sell: sellValue,
        buy: buyValue,
      };

      props.getEditedData("hotel", data);
    }
  }, [props.clickedSubmit]);
  return (
    <>
      <Box marginTop={5}>
        <Button
          onClick={() => {
            props.deleteItem(
              props.itemForEdit.serial_id,
              props.itemForEdit.refund ? props.itemForEdit.refund.id : false
            );
          }}
          variant="outlined"
          color="error"
        >
          حذف آیتم
        </Button>
        <Typography marginBottom={5} variant="h5">
          ویرایش مالی
        </Typography>
        <Grid item xl={12} md={12} xs={12} container spacing={1}>
          <Grid item xl={3} md={3} xs={12}>
            <Box width={"100%"} display={"flex"}>
              <Autocomplete
                value={defaultPersonName}
                sx={{ width: "100%" }}
                onChange={(e, value) => {
                  if (value) {
                    setDefaultPersonName(value);
                  }
                }}
                getOptionLabel={(option) =>
                  (option.sex ? "آقای " : "خانم ") +
                  option.name_fa +
                  " " +
                  option.lastname_fa +
                  " " +
                  (calculateAgeCategory(option.birthday) === "INF"
                    ? "(نوزاد)"
                    : calculateAgeCategory(option.birthday) === "CHI"
                    ? "کودک"
                    : "(بزرگسال)")
                }
                options={props.passengers.map((option) => option)}
                isOptionEqualToValue={(option, value) =>
                  option === value || value === ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="مسافر"
                    required
                    Autocomplete="off"
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Box width={"100%"} display={"flex"} flexDirection={"column"}>
              <Controller
                name="provider"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    value={defaultProviderName}
                    open={openProviders}
                    onOpen={() => {
                      setOpenProviders(true);
                    }}
                    onClose={() => {
                      setOpenProviders(false);
                    }}
                    onChange={(e, value) => {
                      if (value) {
                        setDefaultProviderName(value);
                        setValue("provider", value.title_fa);
                        trigger("provider");
                        if (value.id !== 1) {
                          setIsOther(false);
                          setProviderRequired(true);
                          //get credit from API
                          axios
                            .post(base_url + "/v2/colleagues/billing", {
                              lang: props.langDirection,
                              access_token: getAccessToken(),
                              id: value.id,
                            })
                            .then((response) => {
                              // Handle the successful response
                              console.log("Item created:", response.data);
                              if (response.data.CreditBalance === false) {
                                setValidCreditProvider(true);
                                setOptionalCridit(true);
                                setProviderCridit("");
                              } else {
                                setValidCreditProvider(false);
                                setOptionalCridit(false);
                                if (response.data.CreditBalance > 0) {
                                  setValidCreditProvider(true);
                                } else {
                                  setValidCreditProvider(false);
                                }
                                setProviderCridit(response.data.CreditBalance);
                              }
                            })
                            .catch((error) => {
                              // Handle any errors
                              console.error("Error creating item:", error);
                            });
                          //end get credit from API
                        } else {
                          setValidCreditProvider(true);
                          setIsOther(true);
                          setProviderRequired(false);
                        }
                      } else {
                        setProviderCridit("");
                        setProviderRequired(false);
                        setValue("provider", "");
                        trigger("provider");
                      }
                    }}
                    getOptionLabel={(option) => option.title_fa}
                    options={providers.map((option) => option)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...field}
                        label="تامین کننده"
                        required
                        error={!!errors.provider}
                        helperText={errors?.provider?.message}
                        Autocomplete="off"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {providerssLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
              {!isOther &&
                providerCredit &&
                validCreditProvider &&
                !optionalCredit && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "green",
                    }}
                  >
                    اعتبار:{" "}
                    {" " + formatInputWithCommas(providerCredit.toString())}
                    {" " + "ریال"}
                  </Typography>
                )}
              {providerCredit && !validCreditProvider && !optionalCredit && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "red",
                  }}
                >
                  عدم اعتبار
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Controller
              name="buyPrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled={!validCreditProvider || isOther}
                  value={buyValue}
                  sx={{ width: "100%" }}
                  label="خرید"
                  dir="ltr"
                  variant="outlined"
                  color="primary"
                  error={!!errors.buyPrice}
                  helperText={errors?.buyPrice?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    setBuyValue(formatInputWithCommas(e.target.value));
                  }}
                />
              )}
            />

            {!isOther &&
              !optionalCredit &&
              formatInputWithOutCommas(buyValue.toString()) >
                providerCredit && (
                <Typography sx={{ fontSize: "14px" }} color={"red"}>
                  عدم رعایت سقف تامین
                </Typography>
              )}
            {providerCredit >= formatInputWithOutCommas(buyValue.toString()) &&
              buyValue && (
                <Typography sx={{ fontSize: "12px" }} color={"green"}>
                  {NumberToPersianWordMin.convert(
                    formatInputWithOutCommas(buyValue.toString())
                  )}{" "}
                  {" ریال"}
                </Typography>
              )}
            {optionalCredit && buyValue && (
              <Typography sx={{ fontSize: "12px" }} color={"green"}>
                {NumberToPersianWordMin.convert(
                  formatInputWithOutCommas(buyValue.toString())
                )}{" "}
                {" ریال"}
              </Typography>
            )}
            <Grid item xl={6} md={6} xs={6}></Grid>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Box display={"flex"}>
              <Box width={"100%"}>
                <TextField
                  autoComplete="off"
                  value={sellValue}
                  sx={{ width: "100%" }}
                  disabled={!validCreditProvider}
                  label="فروش"
                  dir="ltr"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    setSellValue(formatInputWithCommas(e.target.value));
                  }}
                />
                {sellValue && (
                  <Typography sx={{ fontSize: "12px" }} color={"green"}>
                    {NumberToPersianWordMin.convert(
                      formatInputWithOutCommas(sellValue.toString())
                    )}{" "}
                    {" ریال"}
                  </Typography>
                )}
              </Box>

              <IconButton onClick={handleClickOpen} color="primary">
                <CurrencyExchangeIcon />
              </IconButton>
            </Box>
          </Grid>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>تغییر ارز</DialogTitle>
            <DialogContent>
              <DialogContentText>
                مقدار ارزی فقط حالت نمایشی دارد و در هیچ عملیات مالی تاثیرگذار
                نخواهد بود
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="مقدار ارزی"
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="قیمت ارز "
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="تست"
                type="email"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>انصراف</Button>
              <Button onClick={handleClose}>ثبت</Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Divider sx={{ marginBottom: 5, marginTop: 5 }} variant="middle" />
        <Typography marginBottom={5} variant="h5">
          ویرایش جزئیات
        </Typography>{" "}
        <Box display={"flex"} alignItems={"center"}>
          <Grid spacing={1} container>
            <Grid item xl={2} xs={12} md={2}>
              <Autocomplete
                value={defaultHotelName}
                open={openHotels}
                onOpen={() => {
                  setOpenHotels(true);
                }}
                onClose={() => {
                  setOpenHotels(false);
                }}
                onChange={(e, value) => {
                  if (value) {
                    setDefaultHotelName(value);
                  }
                }}
                groupBy={(option) => `${option.country}-${option.state}`}
                getOptionLabel={(option) => option.title}
                options={hotels.map((option) => option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="هتل"
                    required
                    Autocomplete="off"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {hotelsLoading ? (
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
            <Grid item xl={2} xs={12} md={2}>
              {/* start date */}
              <LocalizationProvider
                sx={{ width: "100%" }}
                dateAdapter={AdapterDateFnsJalali}
              >
                <DatePicker
                  sx={{ width: "100%" }}
                  views={["year", "month", "day"]}
                  label="ورود"
                  value={defaultHotelInDate} // Set the initial value to null
                  onChange={(value) => {
                    setDefaultHotelInDate(value);
                  }}
                  maxDate={endDate} // Set the maximum date to the selected end date
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xl={2} xs={12} md={2}>
              {/* start time */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField
                  sx={{ width: "100%" }}
                  ampm={false}
                  dir="ltr"
                  label="ساعت ورود"
                  value={dayjs(defaultHotelInTime, "HH:mm")}
                  onChange={(value) =>
                    setDefaultHotelInTime(value.format("HH:mm"))
                  }
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xl={2} xs={12} md={2}>
              {/* end date */}

              <LocalizationProvider
                sx={{ width: "100%" }}
                dateAdapter={AdapterDateFnsJalali}
              >
                <DatePicker
                  sx={{ width: "100%" }}
                  views={["year", "month", "day"]}
                  label="خروج"
                  value={defaultHotelOutDate}
                  onChange={(value) => {
                    setDefaultHotelOutDate(value);
                  }}
                  minDate={startDate} // Set the minimum date to the selected start date
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xl={2} xs={12} md={2}>
              {/* end time */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField
                  sx={{ width: "100%" }}
                  ampm={false}
                  dir="ltr"
                  label="ساعت خروج"
                  value={dayjs(defaultHotelOutTime, "HH:mm")}
                  onChange={(value) =>
                    setDefaultHotelOutTime(value.format("HH:mm"))
                  }
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xl={2} xs={12} md={2}>
              <Autocomplete
                value={defaultRoomType}
                open={openRoomTypes}
                onOpen={() => {
                  setOpenRoomTypes(true);
                }}
                onClose={() => {
                  setOpenRoomTypes(false);
                }}
                onChange={(e, value) => {
                  setDefaultRoomType(value);
                }}
                disableClearable
                getOptionLabel={(option) => option.title_fa}
                options={roomTypes.map((option) => option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="نوع اتاق"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {roomTypesLoading ? (
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
            <Grid item xl={2} xs={12} md={2}>
              <Autocomplete
                value={defaultRoomRate}
                freeSolo
                open={openRoomRates}
                onOpen={() => {
                  setOpenRoomRates(true);
                }}
                onClose={() => {
                  setOpenRoomRates(false);
                }}
                onChange={(e, value) => {
                  setDefaultRoomRate(value);
                }}
                getOptionLabel={(option) => option}
                options={roomRates.map((option) => option.title_fa)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="درجه اتاق"
                    // onChange={(e) => {
                    //   setRoomRates(e.target.value);
                    // }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {roomRatesLoading ? (
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
            <Grid item xl={1} xs={12} md={2}>
              <TextField
                value={extraBeds}
                sx={{ width: "100%" }}
                label="تخت اضافی"
                variant="outlined"
                dir="ltr"
                color="primary"
                type="number"
                onChange={(e) => {
                  setExtraBeds(e.target.value);
                }}
              />
            </Grid>
            <Grid item xl={2} xs={12} md={2}>
              <Autocomplete
                value={defaultRoomView}
                open={openRoomViews}
                onOpen={() => {
                  setOpenRoomViews(true);
                }}
                onClose={() => {
                  setOpenRoomViews(false);
                }}
                onChange={(e, value) => {
                  setDefaultRoomView(value);
                }}
                disableClearable
                getOptionLabel={(option) => option.title_fa}
                options={roomViews.map((option) => option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="نمای اتاق"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {roomViewsLoading ? (
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
            <Grid item xl={4} xs={12} md={4}>
              <Autocomplete
                value={defaultRoomMate}
                multiple
                limitTags={2}
                options={props.passengers}
                getOptionLabel={(option) =>
                  option.name_fa + " " + option.lastname_fa
                }
                onChange={(e, value) => {
                  console.log("tags:", value);
                  setDefaultRoomMate(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ width: "100%" }}
                    label="هم اتاقی"
                    variant="outlined"
                    color="primary"
                  />
                )}
              />
            </Grid>
            <Grid item xl={3} xs={12} md={2}>
              <TextField
                value={inputDescription}
                sx={{ width: "100%" }}
                label="توضیحات"
                variant="outlined"
                color="primary"
                onChange={(e) => setInputDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
// VisaEditComponent
const VisaEditComponent = (props) => {
  //for edit provider
  //for default provider
  const [defaultProviderName, setDefaultProviderName] = useState(
    props.itemForEdit.provider
  );
  //for default name of person
  const [defaultPersonName, setDefaultPersonName] = useState(
    props.itemForEdit.passenger
  );
  //for deadline
  const [defaultDeadLine, setDefaultDeadLine] = useState(
    props.itemForEdit.deadline
      ? convertJalalitoMiladiDate(props.itemForEdit.deadline)
      : null
  );
  const [buyValue, setBuyValue] = useState("");
  const [sellValue, setSellValue] = useState("");

  //initial values
  const [providerCredit, setProviderCridit] = useState("");
  const [optionalCredit, setOptionalCridit] = useState(true);
  const [validCreditProvider, setValidCreditProvider] = useState(true);
  const [isOther, setIsOther] = useState(
    props.itemForEdit.provider.id === 1 ? true : false
  );
  const [providerRequired, setProviderRequired] = useState(true);
  const schema = yup.object().shape({
    provider: providerRequired
      ? yup.string().required("باید یک تامین کننده وارد کنید")
      : yup.string().nullable(),
    buyPrice: isOther
      ? yup.string().nullable()
      : providerRequired
      ? yup.string().required("باید یک خرید وارد کنید")
      : yup.string().nullable(),
  });
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [openProviders, setOpenProviders] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providerssLoading, setprovidersLoading] = useState(false);
  function getProviders() {
    setprovidersLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: props.langDirection,
        access_token: getAccessToken(),
        table: "colleague",
        action: "provider",
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setProviders(response.data.data.titles);
        setprovidersLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openProviders) {
      getProviders();
    }
  }, [openProviders]);

  useEffect(() => {
    setBuyValue("");
    setSellValue("");
  }, [validCreditProvider, isOther]);
  useEffect(() => {
    setBuyValue(formatInputWithCommas(props.itemForEdit.buy));
    setSellValue(formatInputWithCommas(props.itemForEdit.sell));
  }, []);
  //end for edit provider
  //start edit item
  //for citizens visas country
  const [openCitizen, setOpenCitizen] = React.useState(false);
  const [citizenLoading, setCitizenLoading] = React.useState(false);
  const [citizens, setCitizens] = React.useState([]);
  function getCountries() {
    setCitizenLoading(true);
    axios
      .post(base_url + "/v2/get_visa_country", {
        lang: props.langDirection,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setCitizens(response.data.data.countries);
        setCitizenLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openCitizen) {
      getCountries();
    }
  }, [openCitizen]);

  const [defaultNameValue, setDefaltNameValue] = useState(
    props.itemForEdit.visa.visa
  );

  const [defaultCountryValue, setDefaltCountryValue] = useState(
    props.itemForEdit.visa.country
  );
  const [defaultVisaIssuing, setdDefaultVisaIssuing] = useState(
    props.itemForEdit.visa.visa_issuing
      ? convertJalalitoMiladiDate(props.itemForEdit.visa.visa_issuing)
      : null
  );
  const [defaultVisaEx, setdDefaultVisaEx] = useState(
    props.itemForEdit.visa.visa_ex
      ? convertJalalitoMiladiDate(props.itemForEdit.visa.visa_ex)
      : null
  );
  const [inputDescription, setInputDescription] = useState(
    props.itemForEdit.visa.description
  );

  const [descText, setDescText] = useState(
    props.itemForEdit.visa.visa.description
  );
  //for visas name
  const [openVisas, setOpenVisas] = useState(false);
  const [visas, setVisas] = useState([]);
  const [visasLoading, setVisasLoading] = useState(false);
  function getVisas() {
    setVisasLoading(true);
    axios
      .post(base_url + "/v2/get_other_services", {
        lang: props.langDirection,
        action: "visa",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setVisas(response.data.data.titles);
        setVisasLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }

  useEffect(() => {
    if (openVisas) {
      getVisas();
    }
  }, [openVisas]);

  //uplaod image
  const [image, setImage] = useState(props.itemForEdit.visa.visa_issuing);
  const fileInputRef = React.useRef(null);
  const handleUploadButtonClick = (action) => {
    if (action === "visa") {
      fileInputRef.current.click();
    }
  };
  const handleImageUpload = async (e, action) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage); // 'image' should match the field name expected by your API
      formData.append("type", action); // 'image' should match the field name expected by your API
      formData.append("access_token", getAccessToken()); // 'image' should match the field name expected by your API
      formData.append("lang", langDirection); // 'image' should match the field name expected by your API
      try {
        const response = await axios.post(
          base_url + "/v2/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Important: Set the content type
            },
          }
        );

        // Handle the response from the API here, e.g., update state or show a success message.
        if (action === "visa") {
          setImage(base_url + "/App/" + response.data.image_name);
          handleChange(id, "file", isValid);
        }
      } catch (error) {
        // Handle any errors that occur during the upload.
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    if (props.clickedSubmit) {
      const data = {
        action: "visa",
        item_id: props.itemForEdit.serial_id,
        visa: {
          id: "20e5489d-a3fc-4aeb-a12c-14a6038d84ca",
          description: inputDescription,
          country: defaultCountryValue,
          visa: defaultNameValue,
          visa_issuing: defaultVisaIssuing
            ? convertPersianToEnglishNumbers(
                defaultVisaIssuing.toLocaleDateString("fa-IR", options)
              )
            : null,
          visa_ex: defaultVisaEx
            ? convertPersianToEnglishNumbers(
                defaultVisaEx.toLocaleDateString("fa-IR", options)
              )
            : null,
          file: image,
        },
        provider: defaultProviderName,
        passenger: defaultPersonName,
        sell: sellValue,
        buy: buyValue,
      };
      props.getEditedData("visa", data);
    }
  }, [props.clickedSubmit]);
  return (
    <>
      <Box marginTop={5}>
        <Button
          onClick={() => {
            props.deleteItem(
              props.itemForEdit.serial_id,
              props.itemForEdit.refund ? props.itemForEdit.refund.id : false
            );
          }}
          variant="outlined"
          color="error"
        >
          حذف آیتم
        </Button>
        <Typography marginBottom={5} variant="h5">
          ویرایش مالی
        </Typography>
        <Grid item xl={12} md={12} xs={12} container spacing={1}>
          <Grid item xl={3} md={3} xs={12}>
            <Box width={"100%"} display={"flex"}>
              <Autocomplete
                value={defaultPersonName}
                sx={{ width: "100%" }}
                onChange={(e, value) => {
                  if (value) {
                    setDefaultPersonName(value);
                  }
                }}
                getOptionLabel={(option) =>
                  (option.sex ? "آقای " : "خانم ") +
                  option.name_fa +
                  " " +
                  option.lastname_fa +
                  " " +
                  (calculateAgeCategory(option.birthday) === "INF"
                    ? "(نوزاد)"
                    : calculateAgeCategory(option.birthday) === "CHI"
                    ? "کودک"
                    : "(بزرگسال)")
                }
                options={props.passengers.map((option) => option)}
                isOptionEqualToValue={(option, value) =>
                  option === value || value === ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="مسافر"
                    required
                    Autocomplete="off"
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Box width={"100%"} display={"flex"} flexDirection={"column"}>
              <Controller
                name="provider"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    value={defaultProviderName}
                    open={openProviders}
                    onOpen={() => {
                      setOpenProviders(true);
                    }}
                    onClose={() => {
                      setOpenProviders(false);
                    }}
                    onChange={(e, value) => {
                      if (value) {
                        setDefaultProviderName(value);
                        setValue("provider", value.title_fa);
                        trigger("provider");
                        if (value.id !== 1) {
                          setIsOther(false);
                          setProviderRequired(true);
                          //get credit from API
                          axios
                            .post(base_url + "/v2/colleagues/billing", {
                              lang: props.langDirection,
                              id: value.id,
                              access_token: getAccessToken(),
                            })
                            .then((response) => {
                              // Handle the successful response
                              console.log("Item created:", response.data);
                              if (response.data.CreditBalance === false) {
                                setValidCreditProvider(true);
                                setOptionalCridit(true);
                                setProviderCridit("");
                              } else {
                                setValidCreditProvider(false);
                                setOptionalCridit(false);
                                if (response.data.CreditBalance > 0) {
                                  setValidCreditProvider(true);
                                } else {
                                  setValidCreditProvider(false);
                                }
                                setProviderCridit(response.data.CreditBalance);
                              }
                            })
                            .catch((error) => {
                              // Handle any errors
                              console.error("Error creating item:", error);
                            });
                          //end get credit from API
                        } else {
                          setValidCreditProvider(true);
                          setIsOther(true);
                          setProviderRequired(false);
                        }
                      } else {
                        setProviderCridit("");
                        setProviderRequired(false);
                        setValue("provider", "");
                        trigger("provider");
                      }
                    }}
                    getOptionLabel={(option) => option.title_fa}
                    options={providers.map((option) => option)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...field}
                        label="تامین کننده"
                        required
                        error={!!errors.provider}
                        helperText={errors?.provider?.message}
                        Autocomplete="off"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {providerssLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
              {!isOther &&
                providerCredit &&
                validCreditProvider &&
                !optionalCredit && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "green",
                    }}
                  >
                    اعتبار:{" "}
                    {" " + formatInputWithCommas(providerCredit.toString())}
                    {" " + "ریال"}
                  </Typography>
                )}
              {providerCredit && !validCreditProvider && !optionalCredit && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "red",
                  }}
                >
                  عدم اعتبار
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Controller
              name="buyPrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled={!validCreditProvider || isOther}
                  value={buyValue}
                  sx={{ width: "100%" }}
                  label="خرید"
                  dir="ltr"
                  variant="outlined"
                  color="primary"
                  error={!!errors.buyPrice}
                  helperText={errors?.buyPrice?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    setBuyValue(formatInputWithCommas(e.target.value));
                  }}
                />
              )}
            />

            {!isOther &&
              !optionalCredit &&
              formatInputWithOutCommas(buyValue.toString()) >
                providerCredit && (
                <Typography sx={{ fontSize: "14px" }} color={"red"}>
                  عدم رعایت سقف تامین
                </Typography>
              )}
            {providerCredit >= formatInputWithOutCommas(buyValue.toString()) &&
              buyValue && (
                <Typography sx={{ fontSize: "12px" }} color={"green"}>
                  {NumberToPersianWordMin.convert(
                    formatInputWithOutCommas(buyValue.toString())
                  )}{" "}
                  {" ریال"}
                </Typography>
              )}
            {optionalCredit && buyValue && (
              <Typography sx={{ fontSize: "12px" }} color={"green"}>
                {NumberToPersianWordMin.convert(
                  formatInputWithOutCommas(buyValue.toString())
                )}{" "}
                {" ریال"}
              </Typography>
            )}
            <Grid item xl={6} md={6} xs={6}></Grid>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Box display={"flex"}>
              <Box width={"100%"}>
                <TextField
                  autoComplete="off"
                  value={sellValue}
                  sx={{ width: "100%" }}
                  disabled={!validCreditProvider}
                  label="فروش"
                  dir="ltr"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    setSellValue(formatInputWithCommas(e.target.value));
                  }}
                />
                {sellValue && (
                  <Typography sx={{ fontSize: "12px" }} color={"green"}>
                    {NumberToPersianWordMin.convert(
                      formatInputWithOutCommas(sellValue.toString())
                    )}{" "}
                    {" ریال"}
                  </Typography>
                )}
              </Box>

              <IconButton onClick={handleClickOpen} color="primary">
                <CurrencyExchangeIcon />
              </IconButton>
            </Box>
          </Grid>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>تغییر ارز</DialogTitle>
            <DialogContent>
              <DialogContentText>
                مقدار ارزی فقط حالت نمایشی دارد و در هیچ عملیات مالی تاثیرگذار
                نخواهد بود
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="مقدار ارزی"
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="قیمت ارز "
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="تست"
                type="email"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>انصراف</Button>
              <Button onClick={handleClose}>ثبت</Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Divider sx={{ marginBottom: 5, marginTop: 5 }} variant="middle" />
        <Typography marginBottom={5} variant="h5">
          ویرایش جزئیات
        </Typography>{" "}
        <Box display={"flex"} alignItems={"center"}>
          <Grid spacing={1} container>
            <Grid item xl={2} xs={12} md={6}>
              <Autocomplete
                value={defaultNameValue}
                open={openVisas}
                onOpen={() => {
                  setOpenVisas(true);
                }}
                onClose={() => {
                  setOpenVisas(false);
                }}
                onChange={(e, value) => {
                  if (value) {
                    setDefaltNameValue(value);
                    setDescText(value.description);
                  }
                }}
                getOptionLabel={(option) => option.title}
                options={visas.map((option) => option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="ویزا"
                    required
                    Autocomplete="off"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {visasLoading ? (
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
            <Grid item xl={2} xs={12} md={6}>
              <Autocomplete
                value={defaultCountryValue}
                sx={{ width: "100%" }}
                open={openCitizen}
                onOpen={() => {
                  setOpenCitizen(true);
                }}
                onClose={() => {
                  setOpenCitizen(false);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.title === value.title
                }
                getOptionLabel={(option) => option.fa_name}
                options={citizens}
                loading={citizenLoading}
                onChange={async (e, value) => {
                  if (value) {
                    setDefaltCountryValue(value);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoComplete="off"
                    label="کشور"
                    variant="outlined"
                    color="primary"
                    onChange={(e) => {}}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {citizenLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.key}>
                    <Box
                      width={"100%"}
                      display={"flex"}
                      justifyContent={"space-between"}
                    >
                      {option.fa_name}
                      <img
                        src={
                          "./custom_assets/flags/flat/24/" + option.iso + ".png"
                        }
                      />
                    </Box>
                  </li>
                )}
                // defaultValue={{
                //   id: 118,
                //   iso: "IR",
                //   fa_name: "ایرانی",
                //   en_name: "Iranian",
                // }}
              />
            </Grid>
            <Grid item xl={2} xs={12} md={6}>
              <TextField
                value={inputDescription}
                sx={{ width: "100%" }}
                label="توضیحات"
                variant="outlined"
                color="primary"
                onChange={(e) => {
                  setInputDescription(e.target.value);
                }}
              />
            </Grid>
            <Grid item xl={2} xs={12} md={6}>
              <LocalizationProvider
                sx={{ width: "100%" }}
                dateAdapter={AdapterDateFnsJalali}
              >
                <DatePicker
                  sx={{ width: "100%" }}
                  views={["year", "month", "day"]}
                  label="تاریخ صدور"
                  value={defaultVisaIssuing}
                  onChange={(value) => {
                    setdDefaultVisaIssuing(value);
                    const options = {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    };
                    // const formattedDate = value
                    //   ? value.toLocaleDateString("fa-IR", options)
                    //   : null;
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xl={2} xs={12} md={6}>
              <LocalizationProvider
                sx={{ width: "100%" }}
                dateAdapter={AdapterDateFnsJalali}
              >
                <DatePicker
                  sx={{ width: "100%" }}
                  views={["year", "month", "day"]}
                  label="تاریخ پایان"
                  value={defaultVisaEx}
                  onChange={(value) => {
                    setdDefaultVisaEx(value);
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xl={2} xs={12} md={6}>
              <Box height={"100%"} display={"flex"} alignItems={"center"}>
                <Box
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <IconButton
                    size="large"
                    onClick={() => handleUploadButtonClick("visa")}
                  >
                    {image ? <FileDownloadDoneIcon /> : <UploadIcon />}
                  </IconButton>
                  {/* Step 1: Hidden file input element */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e, "visa")}
                  />
                </Box>
                {image && (
                  <a
                    href={image}
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      fontSize: "xx-small",
                      padding: "0px 5px",
                    }}
                  >
                    تصویر
                  </a>
                )}
                <Typography sx={{ width: "100%" }} variant="outlined">
                  {descText}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

//TourEditComponent
const TourEditComponent = (props) => {
  //for edit provider
  //for default provider
  const [defaultProviderName, setDefaultProviderName] = useState(
    props.itemForEdit.provider
  );
  //for default name of person
  const [defaultPersonName, setDefaultPersonName] = useState(
    props.itemForEdit.passenger
  );
  //for deadline
  const [defaultDeadLine, setDefaultDeadLine] = useState(
    props.itemForEdit.deadline
      ? convertJalalitoMiladiDate(props.itemForEdit.deadline)
      : null
  );
  const [buyValue, setBuyValue] = useState("");
  const [sellValue, setSellValue] = useState("");

  //initial values
  const [providerCredit, setProviderCridit] = useState("");
  const [optionalCredit, setOptionalCridit] = useState(true);
  const [validCreditProvider, setValidCreditProvider] = useState(true);
  const [isOther, setIsOther] = useState(
    props.itemForEdit.provider.id === 1 ? true : false
  );
  const [providerRequired, setProviderRequired] = useState(true);
  const schema = yup.object().shape({
    provider: providerRequired
      ? yup.string().required("باید یک تامین کننده وارد کنید")
      : yup.string().nullable(),
    buyPrice: isOther
      ? yup.string().nullable()
      : providerRequired
      ? yup.string().required("باید یک خرید وارد کنید")
      : yup.string().nullable(),
  });
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [openProviders, setOpenProviders] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providerssLoading, setprovidersLoading] = useState(false);
  function getProviders() {
    setprovidersLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: props.langDirection,
        table: "colleague",
        action: "provider",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setProviders(response.data.data.titles);
        setprovidersLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openProviders) {
      getProviders();
    }
  }, [openProviders]);

  useEffect(() => {
    setBuyValue("");
    setSellValue("");
  }, [validCreditProvider, isOther]);
  useEffect(() => {
    setBuyValue(formatInputWithCommas(props.itemForEdit.buy));
    setSellValue(formatInputWithCommas(props.itemForEdit.sell));
  }, []);
  //end for edit provider
  //start edit item
  const [defaultNameValue, setDefaultNameValue] = useState(
    props.itemForEdit.tour.tour
  );
  const [inputDescription, setInputDescription] = useState(
    props.itemForEdit.tour.description
  );
  const [descText, setDescText] = useState(
    props.itemForEdit.tour.tour.description
  );
  //for toures name
  const [openToures, setOpenToures] = useState(false);
  const [toures, setToures] = useState([]);
  const [touresLoading, setTouresLoading] = useState(false);
  function getToures() {
    setTouresLoading(true);
    axios
      .post(base_url + "/v2/get_other_services", {
        lang: props.langDirection,
        action: "tour",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setToures(response.data.data.titles);
        setTouresLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openToures) {
      getToures();
    }
  }, [openToures]);
  useEffect(() => {
    if (props.clickedSubmit) {
      const data = {
        id: "20e5489d-a3fc-4aeb-a12c-14a6038d84ca",
        description: inputDescription,
        tour: defaultNameValue,
      };
      props.getEditedData("tour", data);
    }
  }, [props.clickedSubmit]);
  return (
    <>
      <Box marginTop={5}>
        <Button
          onClick={() => {
            props.deleteItem(
              props.itemForEdit.serial_id,
              props.itemForEdit.refund ? props.itemForEdit.refund.id : false
            );
          }}
          variant="outlined"
          color="error"
        >
          حذف آیتم
        </Button>
        <Typography marginBottom={5} variant="h5">
          ویرایش مالی
        </Typography>
        <Grid item xl={12} md={12} xs={12} container spacing={1}>
          <Grid item xl={3} md={3} xs={12}>
            <Box width={"100%"} display={"flex"}>
              <Autocomplete
                value={defaultPersonName}
                sx={{ width: "100%" }}
                onChange={(e, value) => {
                  if (value) {
                    setDefaultPersonName(value);
                  }
                }}
                getOptionLabel={(option) =>
                  (option.sex ? "آقای " : "خانم ") +
                  option.name_fa +
                  " " +
                  option.lastname_fa +
                  " " +
                  (calculateAgeCategory(option.birthday) === "INF"
                    ? "(نوزاد)"
                    : calculateAgeCategory(option.birthday) === "CHI"
                    ? "کودک"
                    : "(بزرگسال)")
                }
                options={props.passengers.map((option) => option)}
                isOptionEqualToValue={(option, value) =>
                  option === value || value === ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="مسافر"
                    required
                    Autocomplete="off"
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Box width={"100%"} display={"flex"} flexDirection={"column"}>
              <Controller
                name="provider"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    value={defaultProviderName}
                    open={openProviders}
                    onOpen={() => {
                      setOpenProviders(true);
                    }}
                    onClose={() => {
                      setOpenProviders(false);
                    }}
                    onChange={(e, value) => {
                      if (value) {
                        setDefaultProviderName(value);
                        setValue("provider", value.title_fa);
                        trigger("provider");
                        if (value.id !== 1) {
                          setIsOther(false);
                          setProviderRequired(true);
                          //get credit from API
                          axios
                            .post(base_url + "/v2/colleagues/billing", {
                              lang: props.langDirection,
                              id: value.id,
                              access_token: getAccessToken(),
                            })
                            .then((response) => {
                              // Handle the successful response
                              console.log("Item created:", response.data);
                              if (response.data.CreditBalance === false) {
                                setValidCreditProvider(true);
                                setOptionalCridit(true);
                                setProviderCridit("");
                              } else {
                                setValidCreditProvider(false);
                                setOptionalCridit(false);
                                if (response.data.CreditBalance > 0) {
                                  setValidCreditProvider(true);
                                } else {
                                  setValidCreditProvider(false);
                                }
                                setProviderCridit(response.data.CreditBalance);
                              }
                            })
                            .catch((error) => {
                              // Handle any errors
                              console.error("Error creating item:", error);
                            });
                          //end get credit from API
                        } else {
                          setValidCreditProvider(true);
                          setIsOther(true);
                          setProviderRequired(false);
                        }
                      } else {
                        setProviderCridit("");
                        setProviderRequired(false);
                        setValue("provider", "");
                        trigger("provider");
                      }
                    }}
                    getOptionLabel={(option) => option.title_fa}
                    options={providers.map((option) => option)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...field}
                        label="تامین کننده"
                        required
                        error={!!errors.provider}
                        helperText={errors?.provider?.message}
                        Autocomplete="off"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {providerssLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
              {!isOther &&
                providerCredit &&
                validCreditProvider &&
                !optionalCredit && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "green",
                    }}
                  >
                    اعتبار:{" "}
                    {" " + formatInputWithCommas(providerCredit.toString())}
                    {" " + "ریال"}
                  </Typography>
                )}
              {providerCredit && !validCreditProvider && !optionalCredit && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "red",
                  }}
                >
                  عدم اعتبار
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Controller
              name="buyPrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled={!validCreditProvider || isOther}
                  value={buyValue}
                  sx={{ width: "100%" }}
                  label="خرید"
                  dir="ltr"
                  variant="outlined"
                  color="primary"
                  error={!!errors.buyPrice}
                  helperText={errors?.buyPrice?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    setBuyValue(formatInputWithCommas(e.target.value));
                  }}
                />
              )}
            />

            {!isOther &&
              !optionalCredit &&
              formatInputWithOutCommas(buyValue.toString()) >
                providerCredit && (
                <Typography sx={{ fontSize: "14px" }} color={"red"}>
                  عدم رعایت سقف تامین
                </Typography>
              )}
            {providerCredit >= formatInputWithOutCommas(buyValue.toString()) &&
              buyValue && (
                <Typography sx={{ fontSize: "12px" }} color={"green"}>
                  {NumberToPersianWordMin.convert(
                    formatInputWithOutCommas(buyValue.toString())
                  )}{" "}
                  {" ریال"}
                </Typography>
              )}
            {optionalCredit && buyValue && (
              <Typography sx={{ fontSize: "12px" }} color={"green"}>
                {NumberToPersianWordMin.convert(
                  formatInputWithOutCommas(buyValue.toString())
                )}{" "}
                {" ریال"}
              </Typography>
            )}
            <Grid item xl={6} md={6} xs={6}></Grid>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Box display={"flex"}>
              <Box width={"100%"}>
                <TextField
                  autoComplete="off"
                  value={sellValue}
                  sx={{ width: "100%" }}
                  disabled={!validCreditProvider}
                  label="فروش"
                  dir="ltr"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    setSellValue(formatInputWithCommas(e.target.value));
                  }}
                />
                {sellValue && (
                  <Typography sx={{ fontSize: "12px" }} color={"green"}>
                    {NumberToPersianWordMin.convert(
                      formatInputWithOutCommas(sellValue.toString())
                    )}{" "}
                    {" ریال"}
                  </Typography>
                )}
              </Box>

              <IconButton onClick={handleClickOpen} color="primary">
                <CurrencyExchangeIcon />
              </IconButton>
            </Box>
          </Grid>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>تغییر ارز</DialogTitle>
            <DialogContent>
              <DialogContentText>
                مقدار ارزی فقط حالت نمایشی دارد و در هیچ عملیات مالی تاثیرگذار
                نخواهد بود
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="مقدار ارزی"
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="قیمت ارز "
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="تست"
                type="email"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>انصراف</Button>
              <Button onClick={handleClose}>ثبت</Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Divider sx={{ marginBottom: 5, marginTop: 5 }} variant="middle" />
        <Typography marginBottom={5} variant="h5">
          ویرایش جزئیات
        </Typography>{" "}
        <Box display={"flex"} alignItems={"center"}>
          <Grid spacing={1} container>
            <Grid item xl={2} xs={12} md={2}>
              <Autocomplete
                value={defaultNameValue}
                open={openToures}
                onOpen={() => {
                  setOpenToures(true);
                }}
                onClose={() => {
                  setOpenToures(false);
                }}
                onChange={(e, value) => {
                  if (value) {
                    setDescText(value.description);
                    setDefaultNameValue(value);
                  }
                }}
                getOptionLabel={(option) => option.title}
                options={toures.map((option) => option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="تور"
                    required
                    Autocomplete="off"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {touresLoading ? (
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
            <Grid item xl={4} xs={12} md={4}>
              <TextField
                value={inputDescription}
                sx={{ width: "100%" }}
                label="توضیحات"
                variant="outlined"
                color="primary"
                onChange={(e) => {
                  setInputDescription(e.target.value);
                }}
              />
            </Grid>
            <Grid item xl={6} xs={12} md={6}>
              <Box height={"100%"} display={"flex"} alignItems={"center"}>
                <Typography sx={{ width: "100%" }} variant="outlined">
                  {descText}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
//InsuranceEditComponent
const InsuranceEditComponent = (props) => {
  //for edit provider
  //for default provider
  const [defaultProviderName, setDefaultProviderName] = useState(
    props.itemForEdit.provider
  );
  //for default name of person
  const [defaultPersonName, setDefaultPersonName] = useState(
    props.itemForEdit.passenger
  );
  //for deadline
  const [defaultDeadLine, setDefaultDeadLine] = useState(
    props.itemForEdit.deadline
      ? convertJalalitoMiladiDate(props.itemForEdit.deadline)
      : null
  );
  const [buyValue, setBuyValue] = useState("");
  const [sellValue, setSellValue] = useState("");

  //initial values
  const [providerCredit, setProviderCridit] = useState("");
  const [optionalCredit, setOptionalCridit] = useState(true);
  const [validCreditProvider, setValidCreditProvider] = useState(true);
  const [isOther, setIsOther] = useState(
    props.itemForEdit.provider.id === 1 ? true : false
  );
  const [providerRequired, setProviderRequired] = useState(true);
  const schema = yup.object().shape({
    provider: providerRequired
      ? yup.string().required("باید یک تامین کننده وارد کنید")
      : yup.string().nullable(),
    buyPrice: isOther
      ? yup.string().nullable()
      : providerRequired
      ? yup.string().required("باید یک خرید وارد کنید")
      : yup.string().nullable(),
  });
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [openProviders, setOpenProviders] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providerssLoading, setprovidersLoading] = useState(false);
  function getProviders() {
    setprovidersLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: props.langDirection,
        table: "colleague",
        action: "provider",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setProviders(response.data.data.titles);
        setprovidersLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openProviders) {
      getProviders();
    }
  }, [openProviders]);

  useEffect(() => {
    setBuyValue("");
    setSellValue("");
  }, [validCreditProvider, isOther]);
  useEffect(() => {
    setBuyValue(formatInputWithCommas(props.itemForEdit.buy));
    setSellValue(formatInputWithCommas(props.itemForEdit.sell));
  }, []);
  //end for edit provider
  //start edit item
  const [defaultNameValue, setDefaultNameValue] = useState(
    props.itemForEdit.insurance.insurance
  );
  const [defaultInsuranceIssuing, setdDefaultInsuranceIssuing] = useState(
    props.itemForEdit.insurance.insurance_issuing
      ? convertJalalitoMiladiDate(props.itemForEdit.insurance.insurance_issuing)
      : null
  );
  const [defaultInsuranceEx, setdDefaultInsuranceEx] = useState(
    props.itemForEdit.insurance.insurance_ex
      ? convertJalalitoMiladiDate(props.itemForEdit.insurance.insurance_ex)
      : null
  );
  const [inputDescription, setInputDescription] = useState(
    props.itemForEdit.insurance.description
  );
  const [descText, setDescText] = useState(
    props.itemForEdit.insurance.insurance.description
  );
  //for insurances name
  const [openInsurance, setOpenInsurance] = useState(false);
  const [insurances, setInsurances] = useState([]);
  const [insurancesLoading, setInsurancesLoading] = useState(false);
  function getInsurances() {
    setInsurancesLoading(true);
    axios
      .post(base_url + "/v2/get_other_services", {
        lang: props.langDirection,
        action: "insurance",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setInsurances(response.data.data.titles);
        setInsurancesLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openInsurance) {
      getInsurances();
    }
  }, [openInsurance]);

  //uplaod image
  const [image, setImage] = useState(props.itemForEdit.insurance.file);
  const fileInputRef = React.useRef(null);
  const handleUploadButtonClick = (action) => {
    if (action === "insurance") {
      fileInputRef.current.click();
    }
  };
  const handleImageUpload = async (e, action) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage); // 'image' should match the field name expected by your API
      formData.append("type", action); // 'image' should match the field name expected by your API
      formData.append("access_token", getAccessToken()); // 'image' should match the field name expected by your API
      formData.append("lang", langDirection); // 'image' should match the field name expected by your API
      try {
        const response = await axios.post(
          base_url + "/v2/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Important: Set the content type
            },
          }
        );

        // Handle the response from the API here, e.g., update state or show a success message.
        if (action === "insurance") {
          setImage(base_url + "/App/" + response.data.image_name);
          handleChange(id, "file", isValid);
        }
      } catch (error) {
        // Handle any errors that occur during the upload.
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    if (props.clickedSubmit) {
      const data = {
        action: "insurance",
        item_id: props.itemForEdit.serial_id,
        insurance: {
          description: inputDescription,
          insurance: defaultNameValue,
          insurance_issuing: defaultInsuranceIssuing
            ? convertPersianToEnglishNumbers(
                defaultInsuranceIssuing.toLocaleDateString("fa-IR", options)
              )
            : null,
          insurance_ex: defaultInsuranceEx
            ? convertPersianToEnglishNumbers(
                defaultInsuranceEx.toLocaleDateString("fa-IR", options)
              )
            : null,
          file: image,
        },
        provider: defaultProviderName,
        passenger: defaultPersonName,
        sell: sellValue,
        buy: buyValue,
      };
      props.getEditedData("insurance", data);
    }
  }, [props.clickedSubmit]);
  return (
    <>
      <Button
        onClick={() => {
          props.deleteItem(
            props.itemForEdit.serial_id,
            props.itemForEdit.refund ? props.itemForEdit.refund.id : false
          );
        }}
        variant="outlined"
        color="error"
      >
        حذف آیتم
      </Button>
      <Box marginTop={5}>
        <Typography marginBottom={5} variant="h5">
          ویرایش مالی
        </Typography>
        <Grid item xl={12} md={12} xs={12} container spacing={1}>
          <Grid item xl={3} md={3} xs={12}>
            <Box width={"100%"} display={"flex"}>
              <Autocomplete
                value={defaultPersonName}
                sx={{ width: "100%" }}
                onChange={(e, value) => {
                  if (value) {
                    setDefaultPersonName(value);
                  }
                }}
                getOptionLabel={(option) =>
                  (option.sex ? "آقای " : "خانم ") +
                  option.name_fa +
                  " " +
                  option.lastname_fa +
                  " " +
                  (calculateAgeCategory(option.birthday) === "INF"
                    ? "(نوزاد)"
                    : calculateAgeCategory(option.birthday) === "CHI"
                    ? "کودک"
                    : "(بزرگسال)")
                }
                options={props.passengers.map((option) => option)}
                isOptionEqualToValue={(option, value) =>
                  option === value || value === ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="مسافر"
                    required
                    Autocomplete="off"
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Box width={"100%"} display={"flex"} flexDirection={"column"}>
              <Controller
                name="provider"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    value={defaultProviderName}
                    open={openProviders}
                    onOpen={() => {
                      setOpenProviders(true);
                    }}
                    onClose={() => {
                      setOpenProviders(false);
                    }}
                    onChange={(e, value) => {
                      if (value) {
                        setDefaultProviderName(value);
                        setValue("provider", value.title_fa);
                        trigger("provider");
                        if (value.id !== 1) {
                          setIsOther(false);
                          setProviderRequired(true);
                          //get credit from API
                          axios
                            .post(base_url + "/v2/colleagues/billing", {
                              lang: props.langDirection,
                              id: value.id,
                              access_token: getAccessToken(),
                            })
                            .then((response) => {
                              // Handle the successful response
                              console.log("Item created:", response.data);
                              if (response.data.CreditBalance === false) {
                                setValidCreditProvider(true);
                                setOptionalCridit(true);
                                setProviderCridit("");
                              } else {
                                setValidCreditProvider(false);
                                setOptionalCridit(false);
                                if (response.data.CreditBalance > 0) {
                                  setValidCreditProvider(true);
                                } else {
                                  setValidCreditProvider(false);
                                }
                                setProviderCridit(response.data.CreditBalance);
                              }
                            })
                            .catch((error) => {
                              // Handle any errors
                              console.error("Error creating item:", error);
                            });
                          //end get credit from API
                        } else {
                          setValidCreditProvider(true);
                          setIsOther(true);
                          setProviderRequired(false);
                        }
                      } else {
                        setProviderCridit("");
                        setProviderRequired(false);
                        setValue("provider", "");
                        trigger("provider");
                      }
                    }}
                    getOptionLabel={(option) => option.title_fa}
                    options={providers.map((option) => option)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...field}
                        label="تامین کننده"
                        required
                        error={!!errors.provider}
                        helperText={errors?.provider?.message}
                        Autocomplete="off"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {providerssLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
              {!isOther &&
                providerCredit &&
                validCreditProvider &&
                !optionalCredit && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "green",
                    }}
                  >
                    اعتبار:{" "}
                    {" " + formatInputWithCommas(providerCredit.toString())}
                    {" " + "ریال"}
                  </Typography>
                )}
              {providerCredit && !validCreditProvider && !optionalCredit && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "red",
                  }}
                >
                  عدم اعتبار
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Controller
              name="buyPrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled={!validCreditProvider || isOther}
                  value={buyValue}
                  sx={{ width: "100%" }}
                  label="خرید"
                  dir="ltr"
                  variant="outlined"
                  color="primary"
                  error={!!errors.buyPrice}
                  helperText={errors?.buyPrice?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    setBuyValue(formatInputWithCommas(e.target.value));
                  }}
                />
              )}
            />

            {!isOther &&
              !optionalCredit &&
              formatInputWithOutCommas(buyValue.toString()) >
                providerCredit && (
                <Typography sx={{ fontSize: "14px" }} color={"red"}>
                  عدم رعایت سقف تامین
                </Typography>
              )}
            {providerCredit >= formatInputWithOutCommas(buyValue.toString()) &&
              buyValue && (
                <Typography sx={{ fontSize: "12px" }} color={"green"}>
                  {NumberToPersianWordMin.convert(
                    formatInputWithOutCommas(buyValue.toString())
                  )}{" "}
                  {" ریال"}
                </Typography>
              )}
            {optionalCredit && buyValue && (
              <Typography sx={{ fontSize: "12px" }} color={"green"}>
                {NumberToPersianWordMin.convert(
                  formatInputWithOutCommas(buyValue.toString())
                )}{" "}
                {" ریال"}
              </Typography>
            )}
            <Grid item xl={6} md={6} xs={6}></Grid>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Box display={"flex"}>
              <Box width={"100%"}>
                <TextField
                  autoComplete="off"
                  value={sellValue}
                  sx={{ width: "100%" }}
                  disabled={!validCreditProvider}
                  label="فروش"
                  dir="ltr"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    setSellValue(formatInputWithCommas(e.target.value));
                  }}
                />
                {sellValue && (
                  <Typography sx={{ fontSize: "12px" }} color={"green"}>
                    {NumberToPersianWordMin.convert(
                      formatInputWithOutCommas(sellValue.toString())
                    )}{" "}
                    {" ریال"}
                  </Typography>
                )}
              </Box>

              <IconButton onClick={handleClickOpen} color="primary">
                <CurrencyExchangeIcon />
              </IconButton>
            </Box>
          </Grid>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>تغییر ارز</DialogTitle>
            <DialogContent>
              <DialogContentText>
                مقدار ارزی فقط حالت نمایشی دارد و در هیچ عملیات مالی تاثیرگذار
                نخواهد بود
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="مقدار ارزی"
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="قیمت ارز "
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="تست"
                type="email"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>انصراف</Button>
              <Button onClick={handleClose}>ثبت</Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Divider sx={{ marginBottom: 5, marginTop: 5 }} variant="middle" />
        <Typography marginBottom={5} variant="h5">
          ویرایش جزئیات
        </Typography>{" "}
        <Box display={"flex"} alignItems={"center"}>
          <Grid spacing={1} container>
            <Grid item xl={2} xs={12} md={2}>
              <Autocomplete
                defaultValue={defaultNameValue}
                open={openInsurance}
                onOpen={() => {
                  setOpenInsurance(true);
                }}
                onClose={() => {
                  setOpenInsurance(false);
                }}
                onChange={(e, value) => {
                  if (value) {
                    setDescText(value.description);
                    setDefaultNameValue(value);
                  }
                }}
                getOptionLabel={(option) => option.title}
                options={insurances.map((option) => option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="بیمه"
                    required
                    Autocomplete="off"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {insurancesLoading ? (
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
            <Grid item xl={2} xs={12} md={4}>
              <TextField
                value={inputDescription}
                sx={{ width: "100%" }}
                label="توضیحات"
                variant="outlined"
                color="primary"
                onChange={(e) => {
                  setInputDescription(e.target.value);
                }}
              />
            </Grid>
            <Grid item xl={2} xs={12} md={6}>
              <LocalizationProvider
                sx={{ width: "100%" }}
                dateAdapter={AdapterDateFnsJalali}
              >
                <DatePicker
                  sx={{ width: "100%" }}
                  views={["year", "month", "day"]}
                  label="تاریخ صدور"
                  value={defaultInsuranceIssuing}
                  onChange={(value) => {
                    setdDefaultInsuranceIssuing(value);
                    const options = {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    };
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xl={2} xs={12} md={6}>
              <LocalizationProvider
                sx={{ width: "100%" }}
                dateAdapter={AdapterDateFnsJalali}
              >
                <DatePicker
                  sx={{ width: "100%" }}
                  views={["year", "month", "day"]}
                  label="تاریخ پایان"
                  value={defaultInsuranceEx}
                  onChange={(value) => {
                    setdDefaultInsuranceEx(value);
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xl={4} xs={12} md={6}>
              <Box height={"100%"} display={"flex"} alignItems={"center"}>
                <Box
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <IconButton
                    size="large"
                    onClick={() => handleUploadButtonClick("insurance")}
                  >
                    {image ? <FileDownloadDoneIcon /> : <UploadIcon />}
                  </IconButton>
                  {/* Step 1: Hidden file input element */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e, "insurance")}
                  />
                </Box>
                {image && (
                  <a
                    href={image}
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      fontSize: "xx-small",
                      padding: "0px 5px",
                    }}
                  >
                    تصویر
                  </a>
                )}
                <Typography sx={{ width: "100%" }} variant="outlined">
                  {descText}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
//ServiceEditComponent
const ServiceEditComponent = (props) => {
  //for edit provider
  //for default provider
  const [defaultProviderName, setDefaultProviderName] = useState(
    props.itemForEdit.provider
  );
  //for default name of person
  const [defaultPersonName, setDefaultPersonName] = useState(
    props.itemForEdit.passenger
  );
  //for deadline
  const [defaultDeadLine, setDefaultDeadLine] = useState(
    props.itemForEdit.deadline
      ? convertJalalitoMiladiDate(props.itemForEdit.deadline)
      : null
  );
  const [buyValue, setBuyValue] = useState("");
  const [sellValue, setSellValue] = useState("");

  //initial values
  const [providerCredit, setProviderCridit] = useState("");
  const [optionalCredit, setOptionalCridit] = useState(true);
  const [validCreditProvider, setValidCreditProvider] = useState(true);
  const [isOther, setIsOther] = useState(
    props.itemForEdit.provider.id === 1 ? true : false
  );
  const [providerRequired, setProviderRequired] = useState(true);
  const schema = yup.object().shape({
    provider: providerRequired
      ? yup.string().required("باید یک تامین کننده وارد کنید")
      : yup.string().nullable(),
    buyPrice: isOther
      ? yup.string().nullable()
      : providerRequired
      ? yup.string().required("باید یک خرید وارد کنید")
      : yup.string().nullable(),
  });
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [openProviders, setOpenProviders] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providerssLoading, setprovidersLoading] = useState(false);
  function getProviders() {
    setprovidersLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: props.langDirection,
        table: "colleague",
        action: "provider",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setProviders(response.data.data.titles);
        setprovidersLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openProviders) {
      getProviders();
    }
  }, [openProviders]);

  useEffect(() => {
    setBuyValue("");
    setSellValue("");
  }, [validCreditProvider, isOther]);
  useEffect(() => {
    setBuyValue(formatInputWithCommas(props.itemForEdit.buy));
    setSellValue(formatInputWithCommas(props.itemForEdit.sell));
  }, []);
  //end for edit provider
  //start edit item
  const [defaultNameValue, setDefaultNameValue] = useState(
    props.itemForEdit.service.service
  );
  const [inputDescription, setInputDescription] = useState(
    props.itemForEdit.service.description
  );
  const [descText, setDescText] = useState(
    props.itemForEdit.service.service.description
  );
  //for services name
  const [openServices, setOpenServices] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  function getServices() {
    setServicesLoading(true);
    axios
      .post(base_url + "/v2/get_other_services", {
        lang: props.langDirection,
        action: "service",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setServices(response.data.data.titles);
        setServicesLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openServices) {
      getServices();
    }
  }, [openServices]);

  //uplaod image
  const [image, setImage] = useState(props.itemForEdit.file);
  const fileInputRef = React.useRef(null);
  const handleUploadButtonClick = (action) => {
    if (action === "service") {
      fileInputRef.current.click();
    }
  };
  const handleImageUpload = async (e, action) => {
    console.log(e);
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage); // 'image' should match the field name expected by your API
      formData.append("type", action); // 'image' should match the field name expected by your API
      formData.append("access_token", getAccessToken()); // 'image' should match the field name expected by your API
      formData.append("lang", langDirection); // 'image' should match the field name expected by your API
      try {
        const response = await axios.post(
          base_url + "/v2/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Important: Set the content type
            },
          }
        );

        // Handle the response from the API here, e.g., update state or show a success message.
        if (action === "service") {
          console.log("se");
          setImage(base_url + "/App/" + response.data.image_name);
          console.log("chahar");
        }
      } catch (error) {
        // Handle any errors that occur during the upload.
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    if (props.clickedSubmit) {
      const data = {
        action: "service",
        item_id: props.itemForEdit.serial_id,
        service: {
          description: inputDescription,
          service: defaultNameValue,
          file: image,
        },
        provider: defaultProviderName,
        passenger: defaultPersonName,
        sell: sellValue,
        buy: buyValue,
      };
      props.getEditedData("service", data);
    }
  }, [props.clickedSubmit]);
  return (
    <>
      <Box marginTop={5}>
        <Button
          onClick={() => {
            props.deleteItem(
              props.itemForEdit.serial_id,
              props.itemForEdit.refund ? props.itemForEdit.refund.id : false
            );
          }}
          variant="outlined"
          color="error"
        >
          حذف آیتم
        </Button>
        <Typography marginBottom={5} variant="h5">
          ویرایش مالی
        </Typography>
        <Grid item xl={12} md={12} xs={12} container spacing={1}>
          <Grid item xl={3} md={3} xs={12}>
            <Box width={"100%"} display={"flex"}>
              <Autocomplete
                value={defaultPersonName}
                sx={{ width: "100%" }}
                onChange={(e, value) => {
                  if (value) {
                    setDefaultPersonName(value);
                  }
                }}
                getOptionLabel={(option) =>
                  (option.sex ? "آقای " : "خانم ") +
                  option.name_fa +
                  " " +
                  option.lastname_fa +
                  " " +
                  (calculateAgeCategory(option.birthday) === "INF"
                    ? "(نوزاد)"
                    : calculateAgeCategory(option.birthday) === "CHI"
                    ? "کودک"
                    : "(بزرگسال)")
                }
                options={props.passengers.map((option) => option)}
                isOptionEqualToValue={(option, value) =>
                  option === value || value === ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="مسافر"
                    required
                    Autocomplete="off"
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Box width={"100%"} display={"flex"} flexDirection={"column"}>
              <Controller
                name="provider"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    value={defaultProviderName}
                    open={openProviders}
                    onOpen={() => {
                      setOpenProviders(true);
                    }}
                    onClose={() => {
                      setOpenProviders(false);
                    }}
                    onChange={(e, value) => {
                      if (value) {
                        setDefaultProviderName(value);
                        setValue("provider", value.title_fa);
                        trigger("provider");
                        if (value.id !== 1) {
                          setIsOther(false);
                          setProviderRequired(true);
                          //get credit from API
                          axios
                            .post(base_url + "/v2/colleagues/billing", {
                              lang: props.langDirection,
                              id: value.id,
                              access_token: getAccessToken(),
                            })
                            .then((response) => {
                              // Handle the successful response
                              console.log("Item created:", response.data);
                              if (response.data.CreditBalance === false) {
                                setValidCreditProvider(true);
                                setOptionalCridit(true);
                                setProviderCridit("");
                              } else {
                                setValidCreditProvider(false);
                                setOptionalCridit(false);
                                if (response.data.CreditBalance > 0) {
                                  setValidCreditProvider(true);
                                } else {
                                  setValidCreditProvider(false);
                                }
                                setProviderCridit(response.data.CreditBalance);
                              }
                            })
                            .catch((error) => {
                              // Handle any errors
                              console.error("Error creating item:", error);
                            });
                          //end get credit from API
                        } else {
                          setValidCreditProvider(true);
                          setIsOther(true);
                          setProviderRequired(false);
                        }
                      } else {
                        setProviderCridit("");
                        setProviderRequired(false);
                        setValue("provider", "");
                        trigger("provider");
                      }
                    }}
                    getOptionLabel={(option) => option.title_fa}
                    options={providers.map((option) => option)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...field}
                        label="تامین کننده"
                        required
                        error={!!errors.provider}
                        helperText={errors?.provider?.message}
                        Autocomplete="off"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {providerssLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
              {!isOther &&
                providerCredit &&
                validCreditProvider &&
                !optionalCredit && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "green",
                    }}
                  >
                    اعتبار:{" "}
                    {" " + formatInputWithCommas(providerCredit.toString())}
                    {" " + "ریال"}
                  </Typography>
                )}
              {providerCredit && !validCreditProvider && !optionalCredit && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "red",
                  }}
                >
                  عدم اعتبار
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Controller
              name="buyPrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled={!validCreditProvider || isOther}
                  value={buyValue}
                  sx={{ width: "100%" }}
                  label="خرید"
                  dir="ltr"
                  variant="outlined"
                  color="primary"
                  error={!!errors.buyPrice}
                  helperText={errors?.buyPrice?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    setBuyValue(formatInputWithCommas(e.target.value));
                  }}
                />
              )}
            />

            {!isOther &&
              !optionalCredit &&
              formatInputWithOutCommas(buyValue.toString()) >
                providerCredit && (
                <Typography sx={{ fontSize: "14px" }} color={"red"}>
                  عدم رعایت سقف تامین
                </Typography>
              )}
            {providerCredit >= formatInputWithOutCommas(buyValue.toString()) &&
              buyValue && (
                <Typography sx={{ fontSize: "12px" }} color={"green"}>
                  {NumberToPersianWordMin.convert(
                    formatInputWithOutCommas(buyValue.toString())
                  )}{" "}
                  {" ریال"}
                </Typography>
              )}
            {optionalCredit && buyValue && (
              <Typography sx={{ fontSize: "12px" }} color={"green"}>
                {NumberToPersianWordMin.convert(
                  formatInputWithOutCommas(buyValue.toString())
                )}{" "}
                {" ریال"}
              </Typography>
            )}
            <Grid item xl={6} md={6} xs={6}></Grid>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Box display={"flex"}>
              <Box width={"100%"}>
                <TextField
                  autoComplete="off"
                  value={sellValue}
                  sx={{ width: "100%" }}
                  disabled={!validCreditProvider}
                  label="فروش"
                  dir="ltr"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    setSellValue(formatInputWithCommas(e.target.value));
                  }}
                />
                {sellValue && (
                  <Typography sx={{ fontSize: "12px" }} color={"green"}>
                    {NumberToPersianWordMin.convert(
                      formatInputWithOutCommas(sellValue.toString())
                    )}{" "}
                    {" ریال"}
                  </Typography>
                )}
              </Box>

              <IconButton onClick={handleClickOpen} color="primary">
                <CurrencyExchangeIcon />
              </IconButton>
            </Box>
          </Grid>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>تغییر ارز</DialogTitle>
            <DialogContent>
              <DialogContentText>
                مقدار ارزی فقط حالت نمایشی دارد و در هیچ عملیات مالی تاثیرگذار
                نخواهد بود
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="مقدار ارزی"
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="قیمت ارز "
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="تست"
                type="email"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>انصراف</Button>
              <Button onClick={handleClose}>ثبت</Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Divider sx={{ marginBottom: 5, marginTop: 5 }} variant="middle" />
        <Typography marginBottom={5} variant="h5">
          ویرایش جزئیات
        </Typography>
        <Box display={"flex"} alignItems={"center"}>
          <Grid spacing={1} container>
            <Grid item xl={2} xs={12} md={2}>
              <Autocomplete
                value={defaultNameValue}
                open={openServices}
                onOpen={() => {
                  setOpenServices(true);
                }}
                onClose={() => {
                  setOpenServices(false);
                }}
                onChange={(e, value) => {
                  if (value) {
                    setDescText(value.description);
                    setDefaultNameValue(value);
                  }
                }}
                getOptionLabel={(option) => option.title}
                options={services.map((option) => option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="خدمت"
                    required
                    Autocomplete="off"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {servicesLoading ? (
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
            <Grid item xl={4} xs={12} md={4}>
              <TextField
                value={inputDescription}
                sx={{ width: "100%" }}
                label="توضیحات"
                variant="outlined"
                color="primary"
                onChange={(e) => {
                  setInputDescription(e.target.value);
                }}
              />
            </Grid>
            <Grid item xl={6} xs={12} md={6}>
              <Box height={"100%"} display={"flex"} alignItems={"center"}>
                <Box
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <IconButton
                    size="large"
                    onClick={() => handleUploadButtonClick("service")}
                  >
                    {image ? <FileDownloadDoneIcon /> : <UploadIcon />}
                  </IconButton>
                  {/* Step 1: Hidden file input element */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e, "service")}
                  />
                </Box>
                {image && (
                  <a
                    href={image}
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      fontSize: "xx-small",
                      padding: "0px 5px",
                    }}
                  >
                    تصویر
                  </a>
                )}
                <Typography sx={{ width: "100%" }} variant="outlined">
                  {descText}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
//RouteEdit

const RouteEdit = (props) => {
  //for edit provider
  //for default provider
  const [defaultProviderName, setDefaultProviderName] = useState(
    props.itemForEdit.provider
  );
  //for default name of person
  const [defaultPersonName, setDefaultPersonName] = useState(
    props.itemForEdit.passenger
  );
  //for deadline
  const [defaultDeadLine, setDefaultDeadLine] = useState(
    props.itemForEdit.deadline
      ? convertJalalitoMiladiDate(props.itemForEdit.deadline)
      : null
  );
  const [buyValue, setBuyValue] = useState("");
  const [sellValue, setSellValue] = useState("");

  //initial values
  const [providerCredit, setProviderCridit] = useState("");
  const [optionalCredit, setOptionalCridit] = useState(true);
  const [validCreditProvider, setValidCreditProvider] = useState(true);
  const [isOther, setIsOther] = useState(
    props.itemForEdit.provider.id === 1 ? true : false
  );
  const [providerRequired, setProviderRequired] = useState(true);
  const schema = yup.object().shape({
    provider: providerRequired
      ? yup.string().required("باید یک تامین کننده وارد کنید")
      : yup.string().nullable(),
    buyPrice: isOther
      ? yup.string().nullable()
      : providerRequired
      ? yup.string().required("باید یک خرید وارد کنید")
      : yup.string().nullable(),
  });
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [openProviders, setOpenProviders] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providerssLoading, setprovidersLoading] = useState(false);
  function getProviders() {
    setprovidersLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: props.langDirection,
        table: "colleague",
        action: "provider",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setProviders(response.data.data.titles);
        setprovidersLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openProviders) {
      getProviders();
    }
  }, [openProviders]);

  useEffect(() => {
    setBuyValue("");
    setSellValue("");
  }, [validCreditProvider, isOther]);
  useEffect(() => {
    setBuyValue(formatInputWithCommas(props.itemForEdit.buy));
    setSellValue(formatInputWithCommas(props.itemForEdit.sell));
  }, []);
  //end for edit provider
  //start edit item
  const [route, setRoute] = React.useState(props.itemForEdit.route.type);
  //class for dissable
  const [dissableInp, setDissableInput] = useState(false);
  const [emptyOriginValue, setEmptyOrigin] = useState(
    props.itemForEdit.route.origin
  );

  const [emptyDestinationValue, setEmptyDestination] = useState(
    props.itemForEdit.route.destination
  );
  const [emptyClassValue, setEmptyClass] = useState(
    props.itemForEdit.route.class
  );
  const [emptyFlightValue, setEmptyFlight] = useState(
    props.itemForEdit.route.flight_number
  );
  useEffect(() => {
    if (route !== "aircraft") {
      setDissableInput(true);
    }
  }, []);
  const [emptyColliguetValue, setEmptyColligue] = useState(
    props.itemForEdit.route.company
  );
  const [terminalEmptyValue, setTerminalEmptyValue] = useState(
    props.itemForEdit.route.terminal
  );
  const [cargoEmptyValue, setCargoEmptyValue] = useState(
    props.itemForEdit.route.allowed_cargo
  );
  const [deFaultTime, setDeFaultTime] = useState(
    convertJalalitoMiladiDate(
      props.itemForEdit.route.date_time_path,
      "jYYYY/jM/jD, H:mm:ss"
    )
  );
  const [originAirports, setOriginAirports] = useState([]);
  const [openOriginAirports, setOpenOriginAirports] = useState(false);
  const [originAirportsLoading, setOriginAirportsLoading] = useState(false);
  const [openDestinationAirports, setOpenDestinationAirports] = useState(false);
  function getOriginAirports() {
    if (route === "aircraft") {
      setOriginAirportsLoading(true);
      axios
        .post(base_url + "/v2/get_titels", {
          lang: props.langDirection,
          table: "airport",
          route: "1",
          access_token: getAccessToken(),
          // route: passengers.internal ? "1" : "2",
        })
        .then((response) => {
          // Handle the successful response
          console.log("Item created:", response.data);
          setOriginAirports(response.data.data.titles);
          setOriginAirportsLoading(false);
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error creating item:", error);
        });
    } else {
      setOriginAirportsLoading(true);
      axios
        .post(base_url + "/v2/get_titels", {
          lang: props.langDirection,
          table: "city",
          route: "2",
          access_token: getAccessToken(),
        })
        .then((response) => {
          // Handle the successful response
          console.log("Item created:", response.data);
          setOriginAirports(response.data.data.titles);
          setOriginAirportsLoading(false);
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error creating item:", error);
        });
    }
  }
  useEffect(() => {
    if (openOriginAirports) {
      getOriginAirports();
    }
  }, [openOriginAirports]);
  useEffect(() => {
    if (openDestinationAirports) {
      getOriginAirports();
    }
  }, [openDestinationAirports]);
  // for colleague's name
  const [colleagues, setColleagues] = useState([]);
  const [openColleagues, setOpenColleagues] = useState(false);
  const [colleaguesLoading, setColleaguesLoading] = useState(false);
  function getCplleagues() {
    setColleaguesLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: props.langDirection,
        table: "colleague",
        action: route,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setColleagues(response.data.data.titles);
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
  // for classe's name
  const [classes, setClasses] = useState([]);
  const [openClasses, setOpenClasses] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  function getClasses() {
    setClassesLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: props.langDirection,
        table: "aircraft",
        action: "class",
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setClasses(response.data.data.titles);
        setClassesLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }

  useEffect(() => {
    if (openClasses) {
      getClasses();
    }
  }, [openClasses]);
  //handle Clicked submit
  useEffect(() => {
    if (props.clickedSubmit) {
      const data = {
        action: "route",
        item_id: props.itemForEdit.serial_id,
        route: {
          type: route,
          origin: emptyOriginValue,
          destination: emptyDestinationValue,
          date_time_path: deFaultTime
            ? convertPersianToEnglishNumbers(
                deFaultTime.toLocaleString("fa-IR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  // second: "2-digit",
                })
              )
            : "",
          company: emptyColliguetValue,
          flight_number: emptyFlightValue,
          class: emptyClassValue,
          allowed_cargo: cargoEmptyValue,
          arrival_terminal: terminalEmptyValue,
          departure_terminal: "",
        },
        provider: defaultProviderName,
        passenger: defaultPersonName,
        sell: sellValue,
        buy: buyValue,
      };
      props.getEditedData("route", data);
    }
  }, [props.clickedSubmit]);
  return (
    <>
      <Box marginTop={5}>
        <Button
          onClick={() => {
            props.deleteItem(
              props.itemForEdit.serial_id,
              props.itemForEdit.refund ? props.itemForEdit.refund.id : false
            );
          }}
          variant="outlined"
          color="error"
        >
          حذف آیتم
        </Button>
        <Typography marginBottom={5} variant="h5">
          ویرایش مالی
        </Typography>
        <Grid item xl={12} md={12} xs={12} container spacing={1}>
          <Grid item xl={3} md={3} xs={12}>
            <Box width={"100%"} display={"flex"}>
              <Autocomplete
                value={defaultPersonName}
                sx={{ width: "100%" }}
                onChange={(e, value) => {
                  if (value) {
                    setDefaultPersonName(value);
                  }
                }}
                getOptionLabel={(option) =>
                  (option.sex ? "آقای " : "خانم ") +
                  option.name_fa +
                  " " +
                  option.lastname_fa +
                  " " +
                  (calculateAgeCategory(option.birthday) === "INF"
                    ? "(نوزاد)"
                    : calculateAgeCategory(option.birthday) === "CHI"
                    ? "کودک"
                    : "(بزرگسال)")
                }
                options={props.passengers.map((option) => option)}
                isOptionEqualToValue={(option, value) =>
                  option === value || value === ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="مسافر"
                    required
                    Autocomplete="off"
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Box width={"100%"} display={"flex"} flexDirection={"column"}>
              <Controller
                name="provider"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    value={defaultProviderName}
                    open={openProviders}
                    onOpen={() => {
                      setOpenProviders(true);
                    }}
                    onClose={() => {
                      setOpenProviders(false);
                    }}
                    onChange={(e, value) => {
                      if (value) {
                        setDefaultProviderName(value);
                        setValue("provider", value.title_fa);
                        trigger("provider");
                        if (value.id !== 1) {
                          setIsOther(false);
                          setProviderRequired(true);
                          //get credit from API
                          axios
                            .post(base_url + "/v2/colleagues/billing", {
                              lang: props.langDirection,
                              id: value.id,
                              access_token: getAccessToken(),
                            })
                            .then((response) => {
                              // Handle the successful response
                              console.log("Item created:", response.data);
                              if (response.data.CreditBalance === false) {
                                setValidCreditProvider(true);
                                setOptionalCridit(true);
                                setProviderCridit("");
                              } else {
                                setValidCreditProvider(false);
                                setOptionalCridit(false);
                                if (response.data.CreditBalance > 0) {
                                  setValidCreditProvider(true);
                                } else {
                                  setValidCreditProvider(false);
                                }
                                setProviderCridit(response.data.CreditBalance);
                              }
                            })
                            .catch((error) => {
                              // Handle any errors
                              console.error("Error creating item:", error);
                            });
                          //end get credit from API
                        } else {
                          setValidCreditProvider(true);
                          setIsOther(true);
                          setProviderRequired(false);
                        }
                      } else {
                        setProviderCridit("");
                        setProviderRequired(false);
                        setValue("provider", "");
                        trigger("provider");
                      }
                    }}
                    getOptionLabel={(option) => option.title_fa}
                    options={providers.map((option) => option)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...field}
                        label="تامین کننده"
                        required
                        error={!!errors.provider}
                        helperText={errors?.provider?.message}
                        Autocomplete="off"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {providerssLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
              {!isOther &&
                providerCredit &&
                validCreditProvider &&
                !optionalCredit && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "green",
                    }}
                  >
                    اعتبار:{" "}
                    {" " + formatInputWithCommas(providerCredit.toString())}
                    {" " + "ریال"}
                  </Typography>
                )}
              {providerCredit && !validCreditProvider && !optionalCredit && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "red",
                  }}
                >
                  عدم اعتبار
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Controller
              name="buyPrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled={!validCreditProvider || isOther}
                  value={buyValue}
                  sx={{ width: "100%" }}
                  label="خرید"
                  dir="ltr"
                  variant="outlined"
                  color="primary"
                  error={!!errors.buyPrice}
                  helperText={errors?.buyPrice?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    setBuyValue(formatInputWithCommas(e.target.value));
                  }}
                />
              )}
            />

            {!isOther &&
              !optionalCredit &&
              formatInputWithOutCommas(buyValue.toString()) >
                providerCredit && (
                <Typography sx={{ fontSize: "14px" }} color={"red"}>
                  عدم رعایت سقف تامین
                </Typography>
              )}
            {providerCredit >= formatInputWithOutCommas(buyValue.toString()) &&
              buyValue && (
                <Typography sx={{ fontSize: "12px" }} color={"green"}>
                  {NumberToPersianWordMin.convert(
                    formatInputWithOutCommas(buyValue.toString())
                  )}{" "}
                  {" ریال"}
                </Typography>
              )}
            {optionalCredit && buyValue && (
              <Typography sx={{ fontSize: "12px" }} color={"green"}>
                {NumberToPersianWordMin.convert(
                  formatInputWithOutCommas(buyValue.toString())
                )}{" "}
                {" ریال"}
              </Typography>
            )}
            <Grid item xl={6} md={6} xs={6}></Grid>
          </Grid>
          <Grid item xl={3} md={3} xs={12}>
            <Box display={"flex"}>
              <Box width={"100%"}>
                <TextField
                  autoComplete="off"
                  value={sellValue}
                  sx={{ width: "100%" }}
                  disabled={!validCreditProvider}
                  label="فروش"
                  dir="ltr"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    setSellValue(formatInputWithCommas(e.target.value));
                  }}
                />
                {sellValue && (
                  <Typography sx={{ fontSize: "12px" }} color={"green"}>
                    {NumberToPersianWordMin.convert(
                      formatInputWithOutCommas(sellValue.toString())
                    )}{" "}
                    {" ریال"}
                  </Typography>
                )}
              </Box>

              <IconButton onClick={handleClickOpen} color="primary">
                <CurrencyExchangeIcon />
              </IconButton>
            </Box>
          </Grid>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>تغییر ارز</DialogTitle>
            <DialogContent>
              <DialogContentText>
                مقدار ارزی فقط حالت نمایشی دارد و در هیچ عملیات مالی تاثیرگذار
                نخواهد بود
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="مقدار ارزی"
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="قیمت ارز "
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="تست"
                type="email"
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>انصراف</Button>
              <Button onClick={handleClose}>ثبت</Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Divider sx={{ marginBottom: 5, marginTop: 5 }} variant="middle" />
        <Typography marginBottom={5} variant="h5">
          ویرایش جزئیات
        </Typography>{" "}
        <Box display={"flex"} alignItems={"center"}>
          <Grid spacing={1} container>
            <Grid item xl={2} xs={12} md={3}>
              <Autocomplete
                value={emptyOriginValue}
                open={openOriginAirports}
                onOpen={() => {
                  setOpenOriginAirports(true);
                }}
                onClose={() => {
                  setOpenOriginAirports(false);
                }}
                onChange={(e, value) => {
                  if (value) {
                    console.log(value);
                    setEmptyOrigin(value);
                  }
                }}
                groupBy={(option) => option.group_by}
                getOptionLabel={(option) => option.title_fa}
                options={originAirports.map((option) => option)}
                isOptionEqualToValue={(option, value) =>
                  option === value || value === ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="مبدا"
                    required
                    Autocomplete="off"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {originAirportsLoading ? (
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
            <Grid item xl={2} xs={12} md={3}>
              <Autocomplete
                value={emptyDestinationValue}
                open={openDestinationAirports}
                onOpen={() => {
                  setOpenDestinationAirports(true);
                }}
                onClose={() => {
                  setOpenDestinationAirports(false);
                }}
                onChange={(e, value) => {
                  if (value) {
                    setEmptyDestination(value);
                  }
                }}
                groupBy={(option) => option.group_by}
                getOptionLabel={(option) => option.title_fa}
                options={originAirports.map((option) => option)}
                isOptionEqualToValue={(option, value) =>
                  option === value || value === ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="مقصد"
                    required
                    Autocomplete="off"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {originAirportsLoading ? (
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
            <Grid item xl={2} xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                <DateTimePicker
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  ampm={false}
                  sx={{ width: "100%" }}
                  required
                  label="زمان حرکت*"
                  value={deFaultTime}
                  color="primary"
                  onChange={(value) => {
                    console.log(value);
                    setDeFaultTime(value);
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xl={2} xs={12} md={3}>
              <Autocomplete
                value={emptyColliguetValue}
                open={openColleagues}
                onOpen={() => {
                  setOpenColleagues(true);
                }}
                onClose={() => {
                  setOpenColleagues(false);
                }}
                onChange={(e, value) => {
                  if (value) {
                    setEmptyColligue(value);
                  }
                }}
                getOptionLabel={(option) => option.title_fa}
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
            <Grid item xl={1} xs={12} md={3}>
              <TextField
                value={terminalEmptyValue}
                sx={{ width: "100%" }}
                label="ترمینال"
                variant="outlined"
                color="primary"
                onChange={(e) => {
                  setTerminalEmptyValue(e.target.value);
                  // handleChangePath(id, "terminal", e.target.value);
                }}
              />
            </Grid>
            <Grid item xl={1} xs={12} md={3}>
              <TextField
                disabled={dissableInp}
                value={emptyFlightValue}
                sx={{ width: "100%" }}
                required
                dir="ltr"
                Autocomplete="off"
                label="شماره پرواز"
                variant="outlined"
                color="primary"
                onChange={(e) => {
                  setEmptyFlight(e.target.value);
                  // handleChangePath(id, "flight_number", e.target.value);
                }}
              />
            </Grid>
            <Grid item xl={1} xs={12} md={3}>
              <Autocomplete
                value={
                  emptyClassValue
                    ? emptyClassValue
                    : {
                        iata: "",
                        title_en: "",
                        title_fa: "",
                        status: "",
                        selected: "",
                      }
                }
                disabled={dissableInp}
                open={openClasses}
                onOpen={() => {
                  setOpenClasses(true);
                }}
                onClose={() => {
                  setOpenClasses(false);
                }}
                onChange={(e, value) => {
                  if (value) {
                    setEmptyClass(value);
                  }
                }}
                getOptionLabel={(option) => option.title_en}
                options={classes.map((option) => option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="کلاس"
                    dir="ltr"
                    required
                    Autocomplete="off"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {classesLoading ? (
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
            <Grid item xl={1} xs={12} md={3}>
              <TextField
                value={cargoEmptyValue}
                disabled={dissableInp}
                sx={{ width: "100%" }}
                label="بار مجاز"
                type="number"
                variant="outlined"
                color="primary"
                onChange={(e) => {
                  setCargoEmptyValue(e.target.value);
                  // handleChangePath(id, "allowed_cargo", e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

// start add new item
const AddItem = (props) => {
  return (
    <>
      <CustomStepper
        action={"opration"}
        refrence={props.refrence}
        handleAddedItem={props.handleAddedItem}
        addedPersons={props.addedPersons}
      />
    </>
  );
};
// end add new item

//start Extradition
const Extradition = (props) => {
  useEffect(() => {
    console.log(props.item);
  }, []);
  //initial values
  const [isCheckedCopy, setIsCheckedCopy] = useState(false);
  const [buyPrice, setBuyPrice] = useState(props.item.data.buy);
  const [sellPrice, setSellPrice] = useState(props.item.data.sell);
  const [passengerName, setPassengerName] = useState(
    props.item.data.passenger.name_fa
      ? props.item.data.passenger.name_fa +
          " " +
          props.item.data.passenger.lastname_fa
      : props.item.data.passenger.name_en +
          " " +
          props.item.data.passenger.lastname_en
  );
  const [detail, setDeatil] = useState("");
  const [counter, setCounter] = useState(props.item.counter);

  const [buyPenaltyPercent, setBuyPenaltyPercent] = useState(
    isCheckedCopy ? props.copyPenaltyBuyPercent : ""
  );
  const [buyPenaltyPrice, setBuyPenaltyPrice] = useState(
    props.item.data.refund
      ? formatInputWithCommas(props.item.data.refund.buy.toString())
      : ""
  );
  const [sellPenaltyPercent, setSellPenaltyPercent] = useState(
    isCheckedCopy ? props.copyPenaltySellPercent : ""
  );
  const [sellPenaltyPrice, setSellPenaltyPrice] = useState(
    props.item.data.refund
      ? formatInputWithCommas(
          (
            parseInt(props.item.data.sell) -
            parseInt(props.item.data.refund.sell)
          ).toString()
        )
      : ""
  );
  const [extraditionDate, setExtraditionDate] = useState(
    isCheckedCopy
      ? props.copyExtraditionDate
      : props.item.data.refund
      ? props.item.data.refund.deadline
        ? convertJalalitoMiladiDate(props.item.data.refund.deadline)
        : null
      : null
  );
  const [inputDescription, setInputDescription] = useState(
    isCheckedCopy
      ? props.copyReason
      : props.item.data.refund
      ? props.item.data.refund.details.note
      : ""
  );

  useEffect(() => {
    if (props.item.data.refund) {
      props.handleChange(
        props.item.id,
        "penalty_buy_price",
        props.item.data.refund.buy
      );
      props.handleChange(
        props.item.id,
        "penalty_sell_price",
        props.item.data.refund.sell
      );
      props.handleChange(
        props.item.id,
        "extradition_date",
        props.item.data.refund.deadline
      );
      props.handleChange(
        props.item.id,
        "reason",
        props.item.data.refund.details.note
      );
    }
  }, []);

  //handle copy
  useEffect(() => {
    if (isCheckedCopy) {
      // Update local state when the copyPenaltyBuyPercent prop changes
      setBuyPenaltyPercent(props.copyPenaltyBuyPercent);
      setBuyPenaltyPrice(
        formatInputWithCommas(
          Math.round((props.copyPenaltyBuyPercent / 100) * buyPrice).toString()
        )
      );
      props.handleChange(
        props.item.id,
        "penalty_buy_percent",
        props.copyPenaltyBuyPercent
      );
      props.handleChange(
        props.item.id,
        "penalty_buy_price",
        (props.copyPenaltyBuyPercent / 100) * buyPrice
      );
    }
  }, [props.copyPenaltyBuyPercent]);
  useEffect(() => {
    if (isCheckedCopy) {
      setSellPenaltyPercent(props.copyPenaltySellPercent);
      setSellPenaltyPrice(
        formatInputWithCommas(
          Math.round(
            (props.copyPenaltySellPercent / 100) * sellPrice
          ).toString()
        )
      );
      props.handleChange(
        props.item.id,
        "penalty_sell_percent",
        props.copyPenaltySellPercent
      );
      props.handleChange(
        props.item.id,
        "penalty_sell_price",
        (props.copyPenaltySellPercent / 100) * sellPrice
      );
    }
  }, [props.copyPenaltySellPercent]);
  useEffect(() => {
    if (isCheckedCopy) {
      setInputDescription(props.copyReason);
      props.handleChange(props.item.id, "reason", props.copyReason);
    }
  }, [props.copyReason]);
  useEffect(() => {
    if (isCheckedCopy) {
      setExtraditionDate(props.copyExtraditionDate);
      props.handleChange(
        props.item.id,
        "extradition_date",
        props.copyExtraditionDate.toLocaleDateString("fa-IR")
      );
    }
  }, [props.copyExtraditionDate]);
  return (
    <>
      <Box border={1} padding={1} marginTop={2} marginBottom={2}>
        <Box marginBottom={2}>
          <Grid container>
            <Grid item xl={0.5} md={0.5} xs={12}>
              <Box
                paddingTop={1}
                paddingBottom={1}
                justifyContent={"center"}
                alignItems={"center"}
                display="flex"
                flexDirection="row"
                width={"100%"}
                height={"100%"}
                gap={2}
                bgcolor={"#fee2e2"}
              >
                <Typography sx={{ fontSize: "12px" }}>#</Typography>
                <Typography sx={{ fontSize: "12px" }}>{counter}</Typography>
              </Box>
            </Grid>
            <Grid item xl={2.5} md={2.5} xs={12}>
              <Box
                paddingTop={1}
                paddingBottom={1}
                justifyContent={"center"}
                alignItems={"center"}
                display="flex"
                flexDirection="row"
                width={"100%"}
                height={"100%"}
                gap={2}
                bgcolor={"#fef2f2"}
              >
                <Typography sx={{ fontSize: "12px" }}>خرید</Typography>
                <Typography sx={{ fontSize: "12px" }}>{buyPrice}</Typography>
              </Box>
            </Grid>
            <Grid item xl={3} md={3} xs={12}>
              <Box
                paddingTop={1}
                paddingBottom={1}
                justifyContent={"center"}
                alignItems={"center"}
                display="flex"
                flexDirection="row"
                width={"100%"}
                height={"100%"}
                gap={2}
                bgcolor={"#fee2e2"}
              >
                <Typography sx={{ fontSize: "12px" }}>فروش</Typography>
                <Typography sx={{ fontSize: "12px" }}>{sellPrice}</Typography>
              </Box>
            </Grid>
            <Grid item xl={2} md={2} xs={12}>
              <Box
                paddingTop={1}
                paddingBottom={1}
                justifyContent={"center"}
                alignItems={"center"}
                display="flex"
                flexDirection="row"
                width={"100%"}
                height={"100%"}
                gap={2}
                bgcolor={"#fef2f2"}
              >
                <Typography sx={{ fontSize: "12px" }}>مسافر</Typography>
                <Typography sx={{ fontSize: "12px" }}>
                  {passengerName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xl={3} md={3} xs={12}>
              <Box
                paddingTop={1}
                paddingBottom={1}
                justifyContent={"center"}
                alignItems={"center"}
                display="flex"
                flexDirection="row"
                width={"100%"}
                height={"100%"}
                gap={2}
                bgcolor={"#fee2e2"}
              >
                <Typography sx={{ fontSize: "12px" }}>جزئیات:</Typography>
                <Typography sx={{ fontSize: "12px" }}>
                  باید اضافه شود به api
                </Typography>
              </Box>
            </Grid>
            <Grid item xl={1} md={1} xs={12}>
              <Box
                paddingTop={1}
                paddingBottom={1}
                justifyContent={"center"}
                alignItems={"center"}
                display="flex"
                flexDirection="row"
                width={"100%"}
                height={"100%"}
                gap={2}
                bgcolor={"#fef2f2"}
              >
                <Typography sx={{ fontSize: "12px" }}>حذف</Typography>
                <Typography sx={{ fontSize: "12px" }}></Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={1}>
            <Grid item xl={3} md={3} xs={12} container spacing={1}>
              <Grid item xl={4} md={6} xs={12}>
                <TextField
                  disabled={!buyPrice}
                  value={buyPenaltyPercent}
                  sx={{ width: "100%" }}
                  label="درصد جریمه خرید"
                  inputMode="numeric"
                  type="number"
                  onChange={(e) => {
                    if (isCheckedCopy) {
                      props.setCopyPenaltyBuyPercent(e.target.value);
                    }
                    if (
                      e.target.value &&
                      buyPrice &&
                      parseInt(e.target.value) >= 0 &&
                      parseInt(e.target.value) <= 100
                    ) {
                      setBuyPenaltyPercent(e.target.value);
                      setBuyPenaltyPrice(
                        formatInputWithCommas(
                          Math.round(
                            (parseInt(e.target.value) / 100) *
                              parseInt(buyPrice)
                          ).toString()
                        )
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_percent",
                        e.target.value
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_price",
                        (parseInt(formatInputWithOutCommas(e.target.value)) /
                          100) *
                          parseInt(
                            formatInputWithOutCommas(buyPrice.toString())
                          )
                      );
                    } else {
                      setBuyPenaltyPercent("");
                      setBuyPenaltyPrice("");
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_percent",
                        ""
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_price",
                        ""
                      );
                    }
                  }}
                />
              </Grid>
              <Grid item xl={8} md={6} xs={12}>
                <TextField
                  disabled={!buyPrice}
                  value={buyPenaltyPrice}
                  sx={{ width: "100%" }}
                  label="مبلغ جریمه خرید"
                  onChange={(e) => {
                    if (
                      e.target.value &&
                      buyPrice &&
                      parseInt(e.target.value) >= 0 &&
                      parseInt(e.target.value) <= parseInt(buyPrice)
                    ) {
                      setBuyPenaltyPrice(formatInputWithCommas(e.target.value));
                      setBuyPenaltyPercent(
                        parseInt(
                          (parseInt(formatInputWithOutCommas(e.target.value)) /
                            parseInt(
                              formatInputWithOutCommas(buyPrice.toString())
                            )) *
                            100
                        )
                      );

                      props.handleChange(
                        props.item.id,
                        "penalty_buy_percent",
                        parseInt(
                          (parseInt(formatInputWithOutCommas(e.target.value)) /
                            parseInt(
                              formatInputWithOutCommas(buyPrice.toString())
                            )) *
                            100
                        )
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_price",
                        formatInputWithOutCommas(e.target.value)
                      );
                    } else {
                      setBuyPenaltyPercent("");
                      setBuyPenaltyPrice("");
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_percent",
                        ""
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_buy_price",
                        ""
                      );
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xl={3} md={3} xs={12} container spacing={1}>
              <Grid item xl={4} md={6} xs={12}>
                <TextField
                  disabled={!sellPrice}
                  value={sellPenaltyPercent}
                  sx={{ width: "100%" }}
                  label="درصد جریمه فروش"
                  onChange={(e) => {
                    if (isCheckedCopy) {
                      props.setCopyPenaltySellPercent(e.target.value);
                    }
                    if (
                      e.target.value &&
                      sellPrice &&
                      parseInt(e.target.value) >= 0 &&
                      parseInt(e.target.value) <= 100
                    ) {
                      setSellPenaltyPercent(e.target.value);
                      setSellPenaltyPrice(
                        formatInputWithCommas(
                          Math.round(
                            (parseInt(e.target.value) / 100) *
                              parseInt(sellPrice)
                          ).toString()
                        )
                      );

                      props.handleChange(
                        props.item.id,
                        "penalty_sell_percent",
                        e.target.value
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_sell_price",
                        (parseInt(formatInputWithOutCommas(e.target.value)) /
                          100) *
                          parseInt(
                            formatInputWithOutCommas(sellPrice.toString())
                          )
                      );
                    } else {
                      setSellPenaltyPercent("");
                      setSellPenaltyPrice("");
                      props.handleChange(
                        props.item.id,
                        "penalty_sell_percent",
                        ""
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_sell_price",
                        ""
                      );
                    }
                  }}
                />
              </Grid>
              <Grid item xl={8} md={6} xs={12}>
                <TextField
                  disabled={!sellPrice}
                  value={sellPenaltyPrice}
                  sx={{ width: "100%" }}
                  label="مبلغ جریمه فروش"
                  onChange={(e) => {
                    if (
                      e.target.value &&
                      sellPrice &&
                      parseInt(e.target.value) >= 0 &&
                      parseInt(e.target.value) <= parseInt(sellPrice)
                    ) {
                      setSellPenaltyPrice(
                        formatInputWithCommas(e.target.value)
                      );
                      setSellPenaltyPercent(
                        parseInt(
                          (parseInt(formatInputWithOutCommas(e.target.value)) /
                            parseInt(
                              formatInputWithOutCommas(sellPrice.toString())
                            )) *
                            100
                        )
                      );

                      props.handleChange(
                        props.item.id,
                        "penalty_sell_percent",
                        parseInt(
                          (parseInt(formatInputWithOutCommas(e.target.value)) /
                            parseInt(
                              formatInputWithOutCommas(sellPrice.toString())
                            )) *
                            100
                        )
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_sell_price",
                        formatInputWithOutCommas(e.target.value)
                      );
                    } else {
                      setSellPenaltyPercent("");
                      setSellPenaltyPrice("");
                      props.handleChange(
                        props.item.id,
                        "penalty_sell_percent",
                        ""
                      );
                      props.handleChange(
                        props.item.id,
                        "penalty_sell_price",
                        ""
                      );
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xl={2} md={2} xs={12} container>
              <LocalizationProvider
                sx={{ width: "100%" }}
                s
                dateAdapter={AdapterDateFnsJalali}
              >
                <DatePicker
                  value={extraditionDate}
                  sx={{ width: "100%" }}
                  views={["year", "month", "day"]}
                  label="تاریخ استرداد"
                  onChange={(value) => {
                    if (isCheckedCopy) {
                      props.setCopyExtraditionDate(value);
                    }
                    const formattedDate = value
                      ? convertPersianToEnglishNumbers(
                          value.toLocaleDateString("fa-IR", options)
                        )
                      : null;
                    setExtraditionDate(value);
                    props.handleChange(
                      props.item.id,
                      "extradition_date",
                      formattedDate
                    );
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xl={3} md={3} xs={12} container>
              {" "}
              <TextField
                value={inputDescription}
                onChange={(e) => {
                  if (isCheckedCopy) {
                    props.setCopyReason(e.target.value);
                  }
                  setInputDescription(e.target.value);
                  props.handleChange(props.item.id, "reason", e.target.value);
                }}
                sx={{ width: "100%" }}
                label="علت استرداد"
              />
            </Grid>
            <Grid item xl={1} md={1} xs={12} container>
              {" "}
              {props.item.data.refund && (
                <IconButton
                  onClick={() =>
                    props.deleteItem(
                      props.item.data.refund.id,
                      false,
                      "extradition"
                    )
                  }
                >
                  <DeleteIcon />
                </IconButton>
              )}
              <Checkbox
                checked={isCheckedCopy}
                onChange={(e) => {
                  setIsCheckedCopy(e.target.checked);
                  props.handleChange(
                    props.item.id,
                    "is_Checked_copy",
                    e.target.checked
                  );
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

const ParentExtradition = (props) => {
  const [copyPenaltyBuyPercent, setCopyPenaltyBuyPercent] = useState("");
  const [copyPenaltySellPercent, setCopyPenaltySellPercent] = useState("");
  const [copyReason, setCopyReason] = useState("");
  const [copyExtraditionDate, setCopyExtraditionDate] = useState(null);
  return (
    <>
      {props.items.map((item) => (
        <Extradition
          copyPenaltyBuyPercent={copyPenaltyBuyPercent}
          setCopyPenaltyBuyPercent={setCopyPenaltyBuyPercent}
          copyPenaltySellPercent={copyPenaltySellPercent}
          setCopyPenaltySellPercent={setCopyPenaltySellPercent}
          copyReason={copyReason}
          setCopyReason={setCopyReason}
          copyExtraditionDate={copyExtraditionDate}
          setCopyExtraditionDate={setCopyExtraditionDate}
          handleChange={props.handleChange}
          item={item}
          deleteItem={props.deleteItem}
        />
      ))}
    </>
  );
};
//end Extradition
// start SendMessage
const SendMessage = (props) => {
  const langDirection = useSelector(selectCurrentLanguage);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [categoryNotify, setCategoryNotify] = useState([]);
  const [openCategoryNotify, setOpenCategoryNotify] = useState(false);
  function getCategories() {
    axios
      .post(base_url + "/v2/notif/simple/list", {
        lang: langDirection,
        access_token: getAccessToken(),
        product: props.itemForEdit.action,
        byproduct: props.itemForEdit[props.itemForEdit.action].type,
        type: "sms",
        category: "all",
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item Created:", response.data);
        setCategoryNotify(response.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openCategoryNotify) {
      getCategories();
    }
  }, [openCategoryNotify]);

  useEffect(() => {
    if (props.clickedSubmit) {
      if (props.leader.phone_number && message) {
        const data = {
          lang: langDirection,
          goal_type: "reference",
          goal: props.serial_id,
          type: "sms",
          mobile: props.leader.phone_number,
          body: message,
          access_token: getAccessToken(),
        };
        props.getEditedData("send_message", data);
      } else {
        dispatch(
          showMessage({
            message: !props.leader.phone_number
              ? "شماره موبایل سرپرست وجود ندارد"
              : "متن پیام را وارد کنید", //text or html
            autoHideDuration: 6000, //ms
            anchorOrigin: {
              vertical: "top", //top bottom
              horizontal: "center", //left center right
            },
            variant: "error", //success error info warning null
          })
        );
        props.setClickedSubmit(false);
      }
    }
  }, [props.clickedSubmit]);

  const typeOfNotify = [
    { label: "پیامک", id: 1, staus: true },
    { label: "ایمیل", id: 2, staus: false },
    { label: "تلگرام", id: 3, staus: false },
  ];
  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const Textarea = styled(TextareaAutosize)(
    ({ theme }) => `
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  );
  return (
    <>
      <Box>
        <Grid spacing={1} container>
          <Grid item xl={6} md={6} xs={12}>
            <Autocomplete
              defaultValue={typeOfNotify[0]}
              sx={{ width: "100%" }}
              id="combo-box-demo"
              onChange={(event, newValue) => {
                if (newValue) {
                }
              }}
              disableClearable
              options={typeOfNotify.map((option) => option)}
              getOptionLabel={(option) => option.label}
              getOptionDisabled={(option) => !option.staus}
              renderInput={(params) => (
                <TextField {...params} label="نوع پیام" />
              )}
            />
          </Grid>
          <Grid item xl={6} md={6} xs={12}>
            <Autocomplete
              sx={{ width: "100%" }}
              onChange={(event, newValue) => {
                if (newValue) {
                  const originalString = newValue.body;
                  console.log("Original String:", originalString);

                  const changedString = originalString
                    .replace(
                      /%\s*FullName\s*%/gi,
                      (props.itemForEdit,
                      props.leader.name_fa && props.itemForEdit,
                      props.leader.lastname_fa
                        ? props.leader.name_fa + " " + props.leader.lastname_fa
                        : props.leader.name_en + " " + props.leader.lastname_en)
                    )
                    .replace(/%\s*Slug\s*%/gi, props.slug);
                  console.log("Changed String:", changedString);

                  setMessage(changedString);
                }
              }}
              disablePortal
              options={categoryNotify.map((option) => option)}
              getOptionLabel={(option) => option.title}
              open={openCategoryNotify}
              onOpen={() => setOpenCategoryNotify(true)}
              onClose={() => setOpenCategoryNotify(false)}
              renderInput={(params) => (
                <TextField {...params} label="دسته پیام" />
              )}
            />
          </Grid>
          <Grid item xl={12} md={12} xs={12}>
            <Textarea
              sx={{ width: "100%", fontSize: "16px" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minRows={3}
              placeholder="متن پیام"
            />

            {/* <TextAreaAutosiz
              sx={{ width: "100%" }}
              aria-label="minimum height"
              minRows={3}
              placeholder="متن پیام"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            /> */}
          </Grid>
          <Box
            display="flex"
            flexDirection="row"
            gap={"5px"}
            marginTop={"24px"}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
              ارسال پیام به شماره:
            </Typography>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "12px",
                color: props.leader.phone_number ? "green" : "red",
              }}
            >
              {props.leader.phone_number
                ? props.leader.phone_number
                : "شماره موبایل سرپرست وجود ندارد"}
            </Typography>
          </Box>
        </Grid>
      </Box>
    </>
  );
};
