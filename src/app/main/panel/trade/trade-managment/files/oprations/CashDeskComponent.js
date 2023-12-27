import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  Box,
  CircularProgress,
  Grid,
  TextField,
  styled,
  Button,
  DialogActions,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { get } from "react-hook-form";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import UploadIcon from "@mui/icons-material/Upload";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import {
  convertJalalitoMiladiDate,
  convertPersianToEnglishNumbers,
  formatInputWithCommas,
  formatInputWithOutCommas,
  getAccessUser,
} from "./functions";
import AddIcon from "@mui/icons-material/Add";
import { base_url } from "src/app/constant";
import { LoadingButton } from "@mui/lab";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Chip from "@mui/material/Chip";
import CircularIndeterminate from "src/app/custom-components/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import NumberToPersianWordMin from "number_to_persian_word";
import { showMessage } from "app/store/fuse/messageSlice";
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

export const CashDeskComponent = (props) => {
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
  const [itemForEdit, setItemForEdit] = useState("");
  const [isAddRecive, setIsAddRecive] = useState(false);
  const [isAddPayment, setIsAddPayment] = useState(false);
  const [isAddPledger, setIsAddPledger] = useState(false);
  //**** for receves
  //recive dialog
  const [typeDialog, setTypeDialog] = useState("recive");
  const [openDialogRecive, setOpenDialogRecive] = React.useState(false);
  const handleClickOpenDialogRecive = () => {
    setOpenDialogRecive(true);
  };
  const handleCloseDialogRecive = () => {
    setOpenDialogRecive(false);
  };
  // for get types in dialog
  const [selectedPayType, setSelectedPayType] = useState("");
  const [selectedPayTypeID, setSelectedPayTypeID] = useState("");
  const [payTypes, setPayPayTypes] = useState([]);
  const [openPayTypes, setOpenPayTypes] = useState(false);
  const [payTypesLoading, setPayTypesLoading] = useState(false);

  const [selectedCheckouts, setSelectedCheckouts] = useState("");
  const [selectedCheckoutsID, setSelectedCheckoutsID] = useState("");
  const [checkouts, setCheckOuts] = useState([]);
  const [openCheckouts, setOpenCheckouts] = useState(false);
  const [checkoutsLoading, setCheckoutsLoading] = useState(false);

  const [selectedtoAcounts, setSelectedtoAcounts] = useState("");
  const [selectedtoAcountsID, setSelectedtoAcountsID] = useState("");
  const [toAcounts, setToAcounts] = useState([]);
  const [openToAcounts, setOpenToAcounts] = useState(false);
  const [toAcountsLoading, setToAcountsLoading] = useState(false);

  const [selectedTypeFunctors, setSelectedTypeFunctors] = useState("");
  const [selectedTypeFunctorsID, setSelectedTypeFunctorsID] = useState("");
  const [typeFunctors, setTypeFunctors] = useState([]);
  const [openTypeFunctors, setOpenTypeFunctors] = useState(false);
  const [typeFunctorsLoading, setTypeFunctorsLoading] = useState(false);

  const [selectedFunctors, setSelectedFunctors] = useState("");
  const [selectedFunctorsID, setSelectedFunctorsID] = useState("");
  const [functors, setFunctors] = useState([]);
  const [openFunctors, setOpenFunctors] = useState(false);
  const [functorsLoading, setFunctorsLoading] = useState(false);

  const [selectedStatuses, setSelectedStatuses] = useState("");
  const [selectedStatusesID, setSelectedStatusesID] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [openStatuses, setOpenStatuses] = useState(false);
  const [statusesLoading, setStatusesLoading] = useState(false);

  const [date, setDate] = useState(null);

  //for pledgers
  const [pledgers, setPledgers] = useState([]);
  const [selectedPledger, setSelectedPledger] = useState("");
  const [promiserCredit, setPromiserCridit] = useState("");
  const [validCreditPromiser, setValidCreditPromiser] = useState(false);
  const [openPledgers, setOpenPledgers] = useState(false);
  const [payPledgersLoading, setPayPledgersLoading] = useState(false);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  function getDialogType(action, q = "") {
    // setTypeFunctorsLoading(true);
    setResult(action, [], true);
    axios
      .post(base_url + "/v2/trade/refrence/type", {
        lang: langDirection,
        access_token: getAccessToken(),
        goal: action,
        separator: true,
        // separator: action === "1300,8200" ? true : false,
        q: q,
      })
      .then((response) => {
        // Handle the successful response
        console.log("Item created:", response.data);
        setResult(action, response.data.results);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  function setResult(type, value, loading = false) {
    switch (type) {
      case "pay_type_recive":
        setPayTypesLoading(false);
        !loading ? setPayPayTypes(value) : setPayTypesLoading(true);
        break;
      case selectedPayTypeID:
        setCheckoutsLoading(false);
        !loading ? setCheckOuts(value) : setCheckoutsLoading(true);
        break;
      case selectedCheckoutsID:
        setToAcountsLoading(false);
        !loading ? setToAcounts(value) : setToAcountsLoading(true);
        break;
      case "type_functor":
        setTypeFunctorsLoading(false);
        !loading ? setTypeFunctors(value) : setTypeFunctorsLoading(true);
        break;
      case selectedTypeFunctorsID:
        setFunctorsLoading(false);
        !loading ? setFunctors(value) : setFunctorsLoading(true);
        break;
      case "status":
        setStatusesLoading(false);
        !loading ? setStatuses(value) : setStatusesLoading(true);
        break;
      case "1300,8200":
        setPayPledgersLoading(false);
        !loading ? setPledgers(value) : setPayPledgersLoading(true);
        break;
    }
  }

  useEffect(() => {
    if (openPayTypes) {
      getDialogType("pay_type_recive");
    }
  }, [openPayTypes]);
  useEffect(() => {
    if (openCheckouts && selectedPayTypeID) {
      getDialogType(selectedPayTypeID);
    }
  }, [openCheckouts]);
  useEffect(() => {
    if (openToAcounts && selectedCheckoutsID) {
      getDialogType(selectedCheckoutsID);
    }
  }, [openToAcounts]);
  useEffect(() => {
    if (openTypeFunctors) {
      getDialogType("type_functor");
    }
  }, [openTypeFunctors]);
  useEffect(() => {
    if (openFunctors && selectedTypeFunctorsID) {
      getDialogType(selectedTypeFunctorsID);
    }
  }, [openFunctors]);
  useEffect(() => {
    if (openStatuses) {
      getDialogType("status");
    }
  }, [openStatuses]);
  useEffect(() => {
    if (openPledgers) {
      getDialogType("1300,8200");
    }
  }, [openPledgers]);
  // for other input
  const [price, setPrice] = useState("");
  const [wage, setWage] = useState("");
  const [refCode, setRefCode] = useState("");
  const [description, setDescription] = useState("");
  const [pledgersPrice, setPledgerPrice] = useState("");

  const handleImageUpload = async (e, action) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage); // 'image' should match the field name expected by your API
      formData.append("access_token", getAccessToken());
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
        console.log("Image upload response:", response.data);
        if (action === "document") {
          setUploadedImage(base_url + "/App/" + response.data.image_name);
        }
      } catch (error) {
        // Handle any errors that occur during the upload.
        console.error("Error uploading image:", error);
      }
    }
  };
  const [uploadedImage, setUploadedImage] = useState("");
  const fileInputRefDocument = useRef(null);
  const handleUploadButtonClick = (action) => {
    if (action === "document") {
      fileInputRefDocument.current.click();
    }
  };
  //for handle edit or add and open dialog
  function handleClickEdit(action, rowData) {
    setTypeDialog(action);
    setItemForEdit(rowData);
    if (action === "payment" || action === "recive") {
      rowData.type_pay
        ? setSelectedPayType(rowData.type_pay.text) +
          setSelectedPayTypeID(rowData.type_pay.id)
        : setSelectedPayType("");
      rowData.account_party_type
        ? setSelectedCheckouts(rowData.account_party_type.text) +
          setSelectedCheckoutsID(rowData.account_party_type.id)
        : setSelectedCheckouts("");
      rowData.account_party
        ? setSelectedtoAcounts(rowData.account_party.text) +
          setSelectedtoAcountsID(rowData.account_party.id)
        : setSelectedtoAcounts("");
      console.log(rowData.functor_type);
      rowData.functor_type
        ? setSelectedTypeFunctors(rowData.functor_type.text) +
          setSelectedTypeFunctorsID(rowData.functor_type.id)
        : setSelectedTypeFunctors("");
      rowData.functor_account
        ? setSelectedFunctors(rowData.functor_account.text) +
          setSelectedFunctorsID(rowData.functor_account.id)
        : setSelectedFunctors("");
      rowData.status
        ? setSelectedStatuses(rowData.status.text) +
          setSelectedStatusesID(rowData.status.id)
        : setSelectedStatuses("");
      rowData.currency_amount
        ? setPrice(formatInputWithCommas(rowData.currency_amount.toString()))
        : setPrice("");
      rowData.tracking_code
        ? setRefCode(rowData.tracking_code)
        : setRefCode("");
      rowData.description
        ? setDescription(rowData.description)
        : setDescription("");
      rowData.wage
        ? setWage(formatInputWithCommas(rowData.wage.toString()))
        : setWage("");
      rowData.deadline
        ? setDate(convertJalalitoMiladiDate(rowData.deadline))
        : null;
    } else if (action === "pledgers") {
      // console.log("pledger", rowData);
      rowData ? setSelectedPledger(rowData) : setSelectedPledger("");
      rowData.data
        ? setPledgerPrice(formatInputWithCommas(rowData.data.amount.toString()))
        : setPledgerPrice("");
      setValidCreditPromiser(true);
      setPromiserCridit("");
    }
    handleClickOpenDialogRecive();
  }

  function handleClickAddItem(action) {
    setItemForEdit("");
    setTypeDialog(action);
    if (action === "payment" || action === "recive") {
      setSelectedPayType("");
      setSelectedPayTypeID("");
      setSelectedCheckouts("");
      setSelectedCheckoutsID("");
      setSelectedtoAcounts("");
      setSelectedtoAcountsID("");
      setSelectedTypeFunctors("");
      setSelectedTypeFunctorsID("");
      setSelectedFunctors("");
      setSelectedFunctorsID("");
      setSelectedStatuses("در حال بررسی");
      setSelectedStatusesID(1);
      setPrice("");
      setRefCode("");
      setWage("");
      setDescription("");
      setDate(null);
    } else if (action === "pledgers") {
      setSelectedPledger("");
      setPledgerPrice("");
      setValidCreditPromiser(false);
      setPromiserCridit("");
    }

    handleClickOpenDialogRecive();
  }
  //**** end for recives
  const [loadingButton, setLoadingButton] = React.useState(false);
  function addItem(data) {
    data["access_token"] = getAccessToken();
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/pay/store", data)
      .then((response) => {
        console.log(data);
        // Handle the response from the web service
        console.log("Response from the web service:", response.data);
        if (!response.data.status) {
          console.log(response.data.message);
        } else {
          setShowProgressLoading(false);
          setOpenDialogRecive(false);
          props.getRefrenceEdit(serialId);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Error sending JSON data:", error);
      });
  }
  function editItem(data) {
    data["access_token"] = getAccessToken();
    console.log(data);
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/pay/update", data)
      .then((response) => {
        // Handle the response from the web service
        console.log("Response from the web service:", response.data);
        if (!response.data.status) {
          console.log(response.data.message);
        } else {
          setShowProgressLoading(false);
          setOpenDialogRecive(false);
          props.getRefrenceEdit(serialId);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Error sending JSON data:", error);
      });
  }
  function addPledger(data) {
    data["access_token"] = getAccessToken();
    console.log(data);
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/pledger/store", data)
      .then((response) => {
        console.log(data);
        // Handle the response from the web service
        console.log("Response from the web service:", response.data);
        if (!response.data.status) {
          console.log(response.data.message);
        } else {
          setShowProgressLoading(false);
          setOpenDialogRecive(false);
          props.getRefrenceEdit(serialId);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Error sending JSON data:", error);
      });
  }
  function editPledger(data) {
    data["access_token"] = getAccessToken();
    console.log(data);
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/pledger/update", data)
      .then((response) => {
        // Handle the response from the web service
        console.log("Response from the web service:", response.data);
        if (!response.data.status) {
          console.log(response.data.message);
        } else {
          setShowProgressLoading(false);
          setOpenDialogRecive(false);
          props.getRefrenceEdit(serialId);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Error sending JSON data:", error);
      });
  }
  function handleClickLoadingButton() {
    const data = {
      serial_id: serialId,
      item_id: itemForEdit.id,
      action: "reference",
      type: typeDialog === "payment" ? "payment" : "receive",
      functor_type: selectedTypeFunctorsID,
      functor_account: selectedFunctorsID,
      moeen: props.refrence.internal ? 103 : 104,
      type_pay: selectedPayTypeID,
      deadline: date
        ? convertPersianToEnglishNumbers(
            date.toLocaleDateString("fa-IR", options)
          )
        : null,
      account_party_type: selectedCheckoutsID,
      account_party: selectedtoAcountsID,
      amount: formatInputWithOutCommas(price.toString()),
      wage: formatInputWithOutCommas(wage.toString()),
      track: refCode,
      description: description,
      documents: uploadedImage,
      status: getAccessUser("accounting", "cash", props.user.data.access)
        ? selectedStatusesID
        : 1,
    };
    if (itemForEdit) {
      if (typeDialog === "recive" || typeDialog === "payment") {
        if (getAccessUser("accounting", "cash", props.user.data.access)) {
          if (!selectedPayTypeID) {
            showAlert("نوع سند انتخاب نشده است");
          } else if (!selectedCheckoutsID) {
            showAlert("گروه حساب انتخاب نشده است");
          } else if (!selectedtoAcountsID) {
            showAlert("به/از حساب انتخاب نشده است");
          } else if (!date || date === "Invalid Date") {
            showAlert("تاریخ موثر سند وارد نشده است");
          } else if (!price) {
            showAlert("مبلغ وارد نشده است");
          } else if (!selectedTypeFunctorsID) {
            showAlert("گروه واریز/پرداخت انتخاب نشده است");
          } else if (!selectedFunctorsID) {
            showAlert("پرداخت/واریز کننده انتخاب نشده است");
          } else if (!refCode) {
            showAlert("کد پیگیری وارد نشده است");
          } else if (!selectedStatusesID) {
            showAlert("وضعیت انتخاب نشده است");
          } else {
            editItem(data);
          }
        } else {
          if (!date || date === "Invalid Date") {
            showAlert("تاریخ موثر سند وارد نشده است");
          } else if (!price) {
            showAlert("مبلغ وارد نشده است");
          } else if (!selectedTypeFunctorsID) {
            showAlert("گروه واریز/پرداخت انتخاب نشده است");
          } else if (!selectedFunctorsID) {
            showAlert("پرداخت/واریز کننده انتخاب نشده است");
          } else {
            editItem(data);
          }
        }
      } else if (typeDialog === "pledgers") {
        const data = {
          pledger_id: itemForEdit.data.id,
          pledger: selectedPledger ? selectedPledger.id : "",
          amount: pledgersPrice,
          serial_id: serialId,
        };
        if (!selectedPledger.id) {
          showAlert("تعهد کننده انتخاب نشده است");
        } else if (!pledgersPrice) {
          showAlert("مبلغ تعهد وارد نشده است");
        } else {
          editPledger(data);
        }
      }
    } else {
      if (typeDialog === "recive" || typeDialog === "payment") {
        const data = {
          serial_id: serialId,
          action: "reference",
          type: typeDialog === "payment" ? "payment" : "receive",
          functor_type: selectedTypeFunctorsID,
          functor_account: selectedFunctorsID,
          moeen: props.refrence.internal ? 103 : 104,
          type_pay: selectedPayTypeID,
          deadline: date
            ? convertPersianToEnglishNumbers(
                date.toLocaleDateString("fa-IR", options)
              )
            : null,
          account_party_type: selectedCheckoutsID,
          account_party: selectedtoAcountsID,
          amount: formatInputWithOutCommas(price.toString()),
          wage: formatInputWithOutCommas(wage.toString()),
          track: refCode,
          description: description,
          documents: uploadedImage,
          status: getAccessUser("accounting", "cash", props.user.data.access)
            ? selectedStatusesID
            : 1,
        };
        if (getAccessUser("accounting", "cash", props.user.data.access)) {
          if (!selectedPayTypeID) {
            showAlert("نوع سند انتخاب نشده است");
          } else if (!selectedCheckoutsID) {
            showAlert("گروه حساب انتخاب نشده است");
          } else if (!selectedtoAcountsID) {
            showAlert("به/از حساب انتخاب نشده است");
          } else if (!date || date === "Invalid Date") {
            showAlert("تاریخ موثر سند وارد نشده است");
          } else if (!price) {
            showAlert("مبلغ وارد نشده است");
          } else if (!selectedTypeFunctorsID) {
            showAlert("گروه واریز/پرداخت انتخاب نشده است");
          } else if (!selectedFunctorsID) {
            showAlert("پرداخت/واریز کننده انتخاب نشده است");
          } else if (!refCode) {
            showAlert("کد پیگیری وارد نشده است");
          } else if (!selectedStatusesID) {
            showAlert("وضعیت انتخاب نشده است");
          } else {
            addItem(data);
          }
        } else {
          if (!date || date === "Invalid Date") {
            showAlert("تاریخ موثر سند وارد نشده است");
          } else if (!price) {
            showAlert("مبلغ وارد نشده است");
          } else if (!selectedTypeFunctorsID) {
            showAlert("گروه واریز/پرداخت انتخاب نشده است");
          } else if (!selectedFunctorsID) {
            showAlert("پرداخت/واریز کننده انتخاب نشده است");
          } else {
            addItem(data);
          }
        }
      } else if (typeDialog === "pledgers") {
        const data = {
          pledger: selectedPledger ? selectedPledger.id : "",
          amount: pledgersPrice,
          serial_id: props.refrence.serial_id,
        };
        if (!selectedPledger.id) {
          showAlert("تعهد کننده انتخاب نشده است");
        } else if (!pledgersPrice) {
          showAlert("مبلغ تعهد وارد نشده است");
        } else {
          addPledger(data);
        }
      }
    }
    // setLoadingButton(true);
  }

  const [financialDescription, setFinancialDescription] = useState(
    props.refrence.financial_description
  );
  function sendDescription() {
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/trade/edit", {
        action: "financial_description",
        financial_description: financialDescription,
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

  // for amber bg
  function getClass(data) {
    if (data.status.id === 1) {
      return "bg-amber-100-i";
    }
  }

  return (
    <>
      {showProgressLoading && <CircularIndeterminate />}
      {/*  dialog */}
      <div style={{ with: "100%" }}>
        <BootstrapDialog
          onClose={handleCloseDialogRecive}
          aria-labelledby="customized-dialog-title"
          open={openDialogRecive}
          fullWidth={true}
          maxWidth={"xl"}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {typeDialog === "payment"
              ? "افزودن/ویرایش پرداختی"
              : typeDialog === "recive"
              ? "افزودن/ویرایش دریافتی"
              : "افزودن/ویرایش متعهد"}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialogRecive}
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
            {/* recive payment */}
            {typeDialog !== "pledgers" && (
              <Box display={"flex"} flexDirection={"column"} gap={5}>
                {itemForEdit && (
                  <Button
                    sx={{ width: "120px" }}
                    onClick={() => {
                      setOpenDialogRecive(false);
                      Swal.fire({
                        title: "آیا میخواهید این آیتم حذف شود",
                        text: "این عملیات غیرقابل یازگشت است",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "بله ادامه میدهم",
                        cancelButtonText: "انصراف",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          // Handle the OK (confirm) action
                          console.log({
                            access_token: getAccessToken(),
                            pay_id: itemForEdit.id,
                          });
                          setShowProgressLoading(true);
                          axios
                            .post(base_url + "/v2/pay/trash", {
                              access_token: getAccessToken(),
                              pay_id: itemForEdit.id,
                              serial_id: serialId,
                            })
                            .then((response) => {
                              // Handle the response from the web service
                              if (!response.data.status) {
                                console.log(response.data.message);
                              } else {
                                setShowProgressLoading(false);
                                setOpenDialogRecive(false);
                                props.getRefrenceEdit(serialId);
                              }
                            })
                            .catch((error) => {
                              // Handle any errors that occurred during the request
                              console.error("Error sending JSON data:", error);
                            });

                          // Swal.fire("آیتم با موفقیت حذف شد");
                        } else if (
                          result.dismiss === Swal.DismissReason.cancel
                        ) {
                          // Handle the Cancel action
                          // Swal.fire("Cancelled", "Your action was cancelled", "error");
                        }
                      });
                    }}
                    variant="outlined"
                    color="error"
                  >
                    حذف آیتم
                  </Button>
                )}
                <Grid columns={12} spacing={2} container>
                  <Grid item xl={2} xs={12} md={6}>
                    <Autocomplete
                      disabled={
                        !getAccessUser(
                          "accounting",
                          "cash",
                          props.user.data.access
                        )
                      }
                      inputValue={selectedPayType}
                      open={openPayTypes}
                      onOpen={() => {
                        setOpenPayTypes(true);
                      }}
                      onClose={() => {
                        setOpenPayTypes(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          setSelectedPayType(value.text);
                          setSelectedPayTypeID(value.id);
                        } else {
                          setSelectedPayType("");
                          setSelectedPayTypeID("");
                          setSelectedCheckouts("");
                          setSelectedCheckoutsID("");
                        }
                      }}
                      options={payTypes.map((option) => option)}
                      getOptionLabel={(option) => option.text}
                      id="combo-box-demo"
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="نوع سند"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {payTypesLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                          onChange={(e) => setSelectedPayType(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xl={2} xs={12} md={6}>
                    <Autocomplete
                      disabled={
                        !getAccessUser(
                          "accounting",
                          "cash",
                          props.user.data.access
                        )
                      }
                      inputValue={selectedCheckouts}
                      open={openCheckouts}
                      onOpen={() => {
                        setOpenCheckouts(true);
                      }}
                      onClose={() => {
                        setOpenCheckouts(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          console.log(value);
                          setSelectedCheckouts(value.text);
                          setSelectedCheckoutsID(value.id);
                        } else {
                          setSelectedCheckouts("");
                          setSelectedCheckoutsID("");
                        }
                      }}
                      options={checkouts.map((option) => option)}
                      getOptionLabel={(option) => option.text}
                      id="combo-box-demo"
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="گروه حساب"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {checkoutsLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                          onChange={(e) => setSelectedCheckouts(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xl={2} xs={12} md={6}>
                    <Autocomplete
                      disabled={
                        !getAccessUser(
                          "accounting",
                          "cash",
                          props.user.data.access
                        )
                      }
                      inputValue={selectedtoAcounts}
                      open={openToAcounts}
                      onOpen={() => {
                        setOpenToAcounts(true);
                      }}
                      onClose={() => {
                        setOpenToAcounts(false);
                      }}
                      onChange={(e, value) => {
                        setSelectedtoAcounts(value.text);
                        setSelectedtoAcountsID(value.id);
                      }}
                      options={toAcounts.map((option) => option)}
                      getOptionLabel={(option) => option.text}
                      id="combo-box-demo"
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            typeDialog === "payment" ? "از حساب" : "به حساب"
                          }
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {toAcountsLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                          onChange={(e) => setSelectedtoAcounts(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xl={2} xs={12} md={6}>
                    <LocalizationProvider
                      sx={{ width: "100%" }}
                      dateAdapter={AdapterDateFnsJalali}
                    >
                      <DatePicker
                        value={date}
                        sx={{ width: "100%" }}
                        views={["year", "month", "day"]}
                        label="تاریخ موثر سند"
                        onChange={(value) => {
                          setDate(value);
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xl={2} xs={12} md={6}>
                    <TextField
                      sx={{ width: "100%" }}
                      value={price}
                      onChange={(e) => {
                        setPrice(formatInputWithCommas(e.target.value));
                      }}
                      dir="ltr"
                      id="outlined-basic"
                      label="مبلغ"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xl={2} xs={12} md={6}>
                    <TextField
                      disabled={
                        !getAccessUser(
                          "accounting",
                          "cash",
                          props.user.data.access
                        )
                      }
                      sx={{ width: "100%" }}
                      value={wage}
                      onChange={(e) => {
                        setWage(formatInputWithCommas(e.target.value));
                      }}
                      dir="ltr"
                      id="outlined-basic"
                      label="کارمزد خدمات"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xl={2} xs={12} md={6}>
                    <Autocomplete
                      // disabled={
                      //   !getAccessUser(
                      //     "accounting",
                      //     "cash",
                      //     props.user.data.access
                      //   )
                      // }
                      inputValue={selectedTypeFunctors}
                      open={openTypeFunctors}
                      onOpen={() => {
                        setOpenTypeFunctors(true);
                      }}
                      onClose={() => {
                        setOpenTypeFunctors(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          setSelectedTypeFunctors(value.text);
                          setSelectedTypeFunctorsID(value.id);
                        } else {
                          setSelectedTypeFunctors("");
                          setSelectedTypeFunctorsID("");
                          setSelectedFunctors("");
                          setSelectedFunctorsID("");
                        }
                      }}
                      id="combo-box-demo"
                      options={typeFunctors.map((option) => option)}
                      getOptionLabel={(option) => option.text}
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            typeDialog === "payment"
                              ? "گروه پرداخت"
                              : "گروه واریز"
                          }
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {typeFunctorsLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                          onChange={(e) =>
                            setSelectedTypeFunctors(e.target.value)
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xl={2} xs={12} md={6}>
                    <Autocomplete
                      // disabled={
                      //   !getAccessUser(
                      //     "accounting",
                      //     "cash",
                      //     props.user.data.access
                      //   )
                      // }
                      inputValue={selectedFunctors}
                      open={openFunctors}
                      onOpen={() => {
                        setOpenFunctors(true);
                      }}
                      onClose={() => {
                        setOpenFunctors(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          setSelectedFunctors(value.text);
                          setSelectedFunctorsID(value.id);
                        } else {
                          setSelectedFunctors("");
                          setSelectedFunctorsID("");
                        }
                      }}
                      options={functors.map((option) => option)}
                      getOptionLabel={(option) => option.text}
                      id="combo-box-demo"
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            typeDialog === "payment"
                              ? "پرداخت به"
                              : "واریز کننده"
                          }
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {functorsLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                          onChange={(e) => {
                            setSelectedFunctors(e.target.value);
                            if (openFunctors && selectedTypeFunctorsID) {
                              getDialogType(
                                selectedTypeFunctorsID,
                                e.target.value
                              );
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xl={2} xs={12} md={6}>
                    <Box display={"flex"} alignItems={"center"}>
                      <TextField
                        disabled={
                          !getAccessUser(
                            "accounting",
                            "cash",
                            props.user.data.access
                          )
                        }
                        sx={{ width: "100%" }}
                        value={refCode}
                        onChange={(e) => {
                          setRefCode(e.target.value);
                        }}
                        dir="ltr"
                        id="outlined-basic"
                        label="کد پیگیری"
                        variant="outlined"
                      />
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
                          onClick={() => handleUploadButtonClick("document")}
                          disabled={
                            !getAccessUser(
                              "accounting",
                              "cash",
                              props.user.data.access
                            )
                          }
                        >
                          {uploadedImage ? (
                            <FileDownloadDoneIcon />
                          ) : (
                            <UploadIcon />
                          )}
                        </IconButton>
                        {/* Step 1: Hidden file input element */}
                        <input
                          ref={fileInputRefDocument}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleImageUpload(e, "document")}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xl={4} xs={12} md={6}>
                    <TextField
                      // disabled={
                      //   !getAccessUser(
                      //     "accounting",
                      //     "cash",
                      //     props.user.data.access
                      //   )
                      // }
                      sx={{ width: "100%" }}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      dir="ltr"
                      id="outlined-basic"
                      label="توضیحات"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xl={2} xs={12} md={6}>
                    <Autocomplete
                      disabled={
                        !getAccessUser(
                          "accounting",
                          "cash",
                          props.user.data.access
                        )
                      }
                      inputValue={selectedStatuses}
                      open={openStatuses}
                      onOpen={() => {
                        setOpenStatuses(true);
                      }}
                      onClose={() => {
                        setOpenStatuses(false);
                      }}
                      onChange={(e, value) => {
                        if (value) {
                          setSelectedStatuses(value.text);
                          setSelectedStatusesID(value.id);
                        } else {
                          setSelectedStatuses("");
                          setSelectedStatusesID("");
                        }
                      }}
                      options={statuses.map((option) => option)}
                      getOptionLabel={(option) => option.text}
                      id="combo-box-demo"
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="وضعیت"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {statusesLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                          onChange={(e) => setSelectedStatuses(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {/* end recive payment */}
            {/* pledgers */}
            {typeDialog === "pledgers" && (
              <Box display={"flex"} flexDirection={"column"} gap={5}>
                {itemForEdit && (
                  <Button
                    sx={{ width: "120px" }}
                    onClick={() => {
                      setOpenDialogRecive(false);
                      console.log({
                        access_token: getAccessToken(),
                        pledger_id: itemForEdit.data.id,
                      });
                      Swal.fire({
                        title: "آیا میخواهید این آیتم حذف شود",
                        text: "این عملیات غیرقابل یازگشت است",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "بله ادامه میدهم",
                        cancelButtonText: "انصراف",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          // Handle the OK (confirm) action
                          console.log({
                            access_token: getAccessToken(),
                            pledger_id: itemForEdit.id,
                            serial_id: serialId,
                          });
                          setShowProgressLoading(true);
                          axios
                            .post(base_url + "/v2/pledger/delete", {
                              access_token: getAccessToken(),
                              pledger_id: itemForEdit.item_id,
                              serial_id: serialId,
                            })
                            .then((response) => {
                              console.log(response);
                              // Handle the response from the web service
                              if (!response.data.status) {
                                console.log(response.data.message);
                              } else {
                                setShowProgressLoading(false);
                                setOpenDialogRecive(false);
                                props.getRefrenceEdit(serialId);
                              }
                            })
                            .catch((error) => {
                              // Handle any errors that occurred during the request
                              console.error("Error sending JSON data:", error);
                            });

                          // Swal.fire("آیتم با موفقیت حذف شد");
                        } else if (
                          result.dismiss === Swal.DismissReason.cancel
                        ) {
                          // Handle the Cancel action
                          // Swal.fire("Cancelled", "Your action was cancelled", "error");
                        }
                      });
                    }}
                    variant="outlined"
                    color="error"
                  >
                    حذف آیتم
                  </Button>
                )}
                <Grid columns={12} spacing={2} container>
                  <Grid item xl={4} xs={12} md={6}>
                    <Box
                      width={"100%"}
                      display={"flex"}
                      flexDirection={"column"}
                    >
                      <Autocomplete
                        value={selectedPledger ? selectedPledger : null}
                        open={openPledgers}
                        onOpen={() => {
                          setOpenPledgers(true);
                        }}
                        onClose={() => {
                          setOpenPledgers(false);
                        }}
                        onChange={(e, value) => {
                          if (value) {
                            //get credit from API
                            axios
                              .post(base_url + "/v2/colleagues/billing", {
                                lang: langDirection,
                                id: value.id,
                                access_token: getAccessToken(),
                              })
                              .then((response) => {
                                console.log(response.data);
                                // Handle the successful response
                                if (response.data.CreditBalance === false) {
                                  setValidCreditPromiser(true);
                                  setPromiserCridit("");
                                } else {
                                  if (response.data.CreditBalance > 0) {
                                    setValidCreditPromiser(true);
                                  } else {
                                    setValidCreditPromiser(false);
                                  }
                                  setPromiserCridit(
                                    response.data.CreditBalance
                                  );
                                }
                              })
                              .catch((error) => {
                                // Handle any errors
                                console.error("Error creating item:", error);
                              });

                            setSelectedPledger(value);
                          }
                        }}
                        options={pledgers.map((option) => option)}
                        getOptionLabel={(option) => option.text}
                        id="combo-box-demo"
                        sx={{ width: "100%" }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="تعهد دهنده"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {payPledgersLoading ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                      />
                      {promiserCredit && validCreditPromiser && (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "green",
                          }}
                        >
                          مانده اعتبار:{" "}
                          {" " +
                            formatInputWithCommas(promiserCredit.toString())}
                          {" " + "ریال"}
                        </Typography>
                      )}
                      {promiserCredit && !validCreditPromiser && (
                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: "red",
                          }}
                        >
                          عدم اعتبار
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xl={2} xs={12} md={6}>
                    <Box
                      width={"100%"}
                      display={"flex"}
                      flexDirection={"column"}
                    >
                      <TextField
                        disabled={!validCreditPromiser}
                        sx={{ width: "100%" }}
                        value={pledgersPrice}
                        onChange={(e) => {
                          setPledgerPrice(
                            formatInputWithCommas(e.target.value)
                          );
                        }}
                        dir="ltr"
                        id="outlined-basic"
                        label="مبلغ"
                        variant="outlined"
                      />
                      {promiserCredit &&
                        formatInputWithOutCommas(pledgersPrice.toString()) >
                          promiserCredit && (
                          <Typography sx={{ fontSize: "14px" }} color={"red"}>
                            عدم رعایت سقف تعهد
                          </Typography>
                        )}
                      {promiserCredit >=
                        formatInputWithOutCommas(pledgersPrice.toString()) &&
                        pledgersPrice && (
                          <Typography sx={{ fontSize: "12px" }} color={"green"}>
                            {NumberToPersianWordMin.convert(
                              formatInputWithOutCommas(pledgersPrice.toString())
                            )}{" "}
                            {" ریال"}
                          </Typography>
                        )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
            {/* end pledgers */}
          </DialogContent>
          <DialogActions>
            <Box>
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
        </BootstrapDialog>
      </div>
      {/* end  dialog */}
      <div>
        {/* collaps */}

        <Accordion sx={{ marginBottom: "20PX" }} defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
              backgroundColor={
                parseInt(props.refrence.sum_sell_price) -
                  parseInt(props.refrence.pays.operation.sum_receive) <
                0
                  ? "#fef2f2"
                  : ""
              }
              padding={"10px"}
            >
              <Typography>دریافت ها</Typography>
              <Box display={"flex"} gap={1} justifyContent={"space-between"}>
                <Box display={"flex"}>
                  <Chip
                    sx={{ minWidth: "180px" }}
                    label={
                      "دریافت: " +
                      formatInputWithCommas(
                        props.refrence.pays.operation.sum_receive
                      ) +
                      " ریال"
                    }
                    color="success"
                  />
                </Box>
                <Box display={"flex"}>
                  <Chip
                    sx={{ minWidth: "180px" }}
                    label={
                      "مانده: " +
                      formatInputWithCommas(
                        parseInt(props.refrence.sum_sell_price) -
                          parseInt(props.refrence.pays.operation.sum_receive)
                      ) +
                      " ریال"
                    }
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {/* start data table for recive */}
            <div className="card">
              <DataTable
                value={props.refrence.pays.receive}
                showGridlines
                tableStyle={{ minWidth: "50rem" }}
                rowClassName={getClass}
              >
                <Column
                  header="#"
                  body={(rowData, { rowIndex }) => <span>{rowIndex + 1}</span>}
                  style={{ textAlign: "center", fontSize: "14px" }}
                />
                <Column
                  style={{ textAlign: "right", fontSize: "12px" }}
                  field="id"
                  header="ID"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.type_pay && rowData.type_pay.text}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="نوع سند"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.account_party_type &&
                          rowData.account_party_type.text}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="گروه حساب"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.account_party && rowData.account_party.text}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="از حساب"
                ></Column>
                <Column
                  style={{
                    textAlign: "right",
                    fontSize: "12px",
                  }}
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.deadline && rowData.deadline}
                        <br />
                      </span>
                    </div>
                  )}
                  header="تاریخ موثر سند"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.currency_amount &&
                          formatInputWithCommas(
                            rowData.currency_amount.toString()
                          ) + " ریال"}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ fontSize: "12px" }}
                  header="مبلغ"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.currency_amount &&
                          formatInputWithCommas(rowData.wage.toString()) +
                            " ریال"}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ fontSize: "12px" }}
                  header="کارمزد خدمات"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.functor_type && rowData.functor_type.text}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="گروه واریز"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.functor_account &&
                          rowData.functor_account.text}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="واریز کننده"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.tracking_code && rowData.tracking_code}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ fontSize: "12px" }}
                  header="کد پیگیری"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.description && rowData.description}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="توضیحات"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.status && rowData.status.text}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="وضعیت"
                ></Column>
                <Column
                  body={(rowData) => (
                    <Box
                      display={"flex"}
                      width={"100%"}
                      height={"100%"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {props.status.id === 1 &&
                        rowData.status.id !== 6 &&
                        rowData.financial_lock === null &&
                        (getAccessUser(
                          "accounting",
                          "cash",
                          props.user.data.access
                        ) ||
                          rowData.status.id === 1) && (
                          <IconButton
                            onClick={() => handleClickEdit("recive", rowData)}
                            color="primary"
                            aria-label="add to shopping cart"
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                    </Box>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="عملیات"
                ></Column>
              </DataTable>
            </div>
            {/* end data table  for recive */}
          </AccordionDetails>
        </Accordion>
        {/* start add new items button for recive */}
        {props.status.id === 1 && (
          <Box marginTop={2} marginBottom={2}>
            <Grid container>
              <Grid item xl={12} md={12} xs={12}>
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Button
                    onClick={() => handleClickAddItem("recive")}
                    size="large"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ fontSize: "12px" }}
                  >
                    {"افزودن دربافتی"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* end new items button for recive */}
        <Accordion sx={{ marginBottom: "20PX" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
              padding={"10px"}
              backgroundColor={
                parseInt(props.refrence.sum_buy_price) -
                  parseInt(props.refrence.pays.operation.sum_payment) <
                0
                  ? "#fef2f2"
                  : ""
              }
            >
              <Typography>پرداخت ها</Typography>
              <Box display={"flex"} gap={1} justifyContent={"space-between"}>
                <Box display={"flex"}>
                  <Chip
                    sx={{ minWidth: "180px" }}
                    label={
                      "پرداخت: " +
                      formatInputWithCommas(
                        props.refrence.pays.operation.sum_payment
                      ) +
                      " ریال"
                    }
                    color="error"
                  />
                </Box>
                <Box display={"flex"}>
                  <Chip
                    sx={{ minWidth: "180px" }}
                    label={
                      "مانده: " +
                      formatInputWithCommas(
                        parseInt(props.refrence.sum_buy_price) -
                          parseInt(props.refrence.pays.operation.sum_payment)
                      ) +
                      " ریال"
                    }
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {/* start data table for payment */}
            <div className="card">
              <DataTable
                value={props.refrence.pays.payment}
                showGridlines
                tableStyle={{ minWidth: "50rem" }}
                rowClassName={getClass}
              >
                <Column
                  header="#"
                  body={(rowData, { rowIndex }) => <span>{rowIndex + 1}</span>}
                  style={{ textAlign: "center", fontSize: "14px" }}
                />
                <Column
                  style={{ textAlign: "right", fontSize: "12px" }}
                  field="id"
                  header="ID"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.type_pay && rowData.type_pay.text}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="نوع سند"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.account_party_type &&
                          rowData.account_party_type.text}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="گروه حساب"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.account_party && rowData.account_party.text}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="به حساب"
                ></Column>
                <Column
                  style={{ textAlign: "right", fontSize: "12px" }}
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.deadline && rowData.deadline}
                        <br />
                      </span>
                    </div>
                  )}
                  header="تاریخ موثر سند"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.currency_amount &&
                          formatInputWithCommas(
                            rowData.currency_amount.toString()
                          ) + " ریال"}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ fontSize: "12px" }}
                  header="مبلغ"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.currency_amount &&
                          formatInputWithCommas(rowData.wage.toString()) +
                            " ریال"}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ fontSize: "12px" }}
                  header="کارمزد خدمات"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.functor_type && rowData.functor_type.text}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="گروه پرداخت"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.functor_account &&
                          rowData.functor_account.text}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="پرداخت کننده"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.tracking_code && rowData.tracking_code}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ fontSize: "12px" }}
                  header="کد پیگیری"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.description && rowData.description}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="توضیحات"
                ></Column>
                <Column
                  body={(rowData) => (
                    <div>
                      <span>
                        {rowData.status && rowData.status.text}
                        <br />
                      </span>
                    </div>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="وضعیت"
                ></Column>
                <Column
                  body={(rowData) => (
                    <Box
                      display={"flex"}
                      width={"100%"}
                      height={"100%"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {props.status.id === 1 &&
                        rowData.status.id !== 6 &&
                        rowData.financial_lock === null &&
                        (getAccessUser(
                          "accounting",
                          "cash",
                          props.user.data.access
                        ) ||
                          rowData.status.id === 1) && (
                          <IconButton
                            onClick={() => handleClickEdit("payment", rowData)}
                            color="primary"
                            aria-label="add to shopping cart"
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                    </Box>
                  )}
                  style={{ textAlign: "right", fontSize: "12px" }}
                  header="عملیات"
                ></Column>
              </DataTable>
            </div>
            {/* end data table  for payment */}
          </AccordionDetails>
        </Accordion>
        {/* start add new items button for payment */}
        {props.status.id === 1 && (
          <Box marginTop={2} marginBottom={2}>
            <Grid container>
              <Grid item xl={12} md={12} xs={12}>
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Button
                    onClick={() => handleClickAddItem("payment")}
                    size="large"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ fontSize: "12px" }}
                  >
                    {"افزودن پرداختی"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* end new items button for payment */}
        {/* end collaps */}

        {/* start data table for pledger */}
        <div className="card">
          <Typography sx={{ marginBottom: "10px" }}>متعهد ها</Typography>
          <DataTable
            value={props.refrence.pledgers}
            showGridlines
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              header="#"
              body={(rowData, { rowIndex }) => <span>{rowIndex + 1}</span>}
              style={{ textAlign: "center", fontSize: "14px" }}
            />
            <Column
              style={{ textAlign: "right", fontSize: "12px" }}
              // field="id"
              body={(rowData) => (
                <div>
                  <span>
                    {rowData.id.split("-")[0] + " " + rowData.id.split("-")[1]}
                    <br />
                  </span>
                </div>
              )}
              header="ID"
            ></Column>
            <Column
              body={(rowData) => (
                <div>
                  <span>
                    {rowData.text && rowData.text}
                    <br />
                  </span>
                </div>
              )}
              style={{ textAlign: "right", fontSize: "12px" }}
              header="متعهد"
            ></Column>
            <Column
              // field="amount"
              body={(rowData) => (
                <div>
                  <span>
                    {rowData.data &&
                      formatInputWithCommas(rowData.data.amount.toString()) +
                        " ریال"}
                    <br />
                  </span>
                </div>
              )}
              style={{ fontSize: "12px" }}
              header="مبلغ"
            ></Column>

            <Column
              body={(rowData) => (
                <Box
                  display={"flex"}
                  width={"100%"}
                  height={"100%"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  {getAccessUser(
                    "accounting",
                    "cash",
                    props.user.data.access
                  ) &&
                    props.status.id === 1 && (
                      <IconButton
                        onClick={() => handleClickEdit("pledgers", rowData)}
                        color="primary"
                        aria-label="add to shopping cart"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                </Box>
              )}
              style={{ textAlign: "right", fontSize: "12px" }}
              header="عملیات"
            ></Column>
          </DataTable>
        </div>
        {/* end data table  for pledger */}
        {/* start add new items button for pledger */}
        {getAccessUser("accounting", "cash", props.user.data.access) &&
          props.status.id === 1 && (
            <Box marginTop={2} marginBottom={2}>
              <Grid container>
                <Grid item xl={12} md={12} xs={12}>
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Button
                      onClick={() => handleClickAddItem("pledgers")}
                      size="large"
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{ fontSize: "12px" }}
                    >
                      {"افزودن متعهد"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

        {/* end new items button for pledger */}
      </div>
      {/* description */}
      <div style={{ marginTop: "35px" }}>
        <Grid spacing={1} container>
          <Grid item xl={12} xs={12} md={12}>
            <Box
              display={"flex"}
              flexDirection={"row"}
              gap={1}
              height={"100%"}
              alignItems={"center"}
              padding={2}
              border={1}
            >
              <TextField
                value={financialDescription}
                onChange={(e) => {
                  setFinancialDescription(e.target.value);
                }}
                sx={{ width: "100%", backgroundColor: "#f7fee7" }}
                Autocomplete="off"
                label="توضیحات"
                variant="outlined"
                color="primary"
                disabled={
                  !getAccessUser(
                    "accounting",
                    "description",
                    props.user.data.access
                  ) || !(props.status.id === 1)
                }
              />
              {props.status.id === 1 && (
                <IconButton onClick={() => sendDescription()} variant="solid">
                  <CheckCircleIcon />
                </IconButton>
              )}
            </Box>
          </Grid>
        </Grid>{" "}
      </div>
      {/* end description */}
    </>
  );
};
