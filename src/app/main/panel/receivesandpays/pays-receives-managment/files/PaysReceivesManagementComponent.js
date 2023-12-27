import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  TextField,
  styled,
  Button,
  DialogActions,
  Checkbox,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import UploadIcon from "@mui/icons-material/Upload";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import { formatInputWithCommas } from "../../../trade/trade-managment/files/oprations/functions";
import { base_url } from "src/app/constant";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import DynamicFeedTwoToneIcon from "@mui/icons-material/DynamicFeedTwoTone";
import InsertDriveFileTwoToneIcon from "@mui/icons-material/InsertDriveFileTwoTone";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import Tooltip from "@mui/material/Tooltip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

export const PaysReceivesManagementComponent = () => {
  // for add dialog
  const [openDialogAdd, setOpenDialogAdd] = React.useState(false);
  const handleCloseDialogAdd = () => {
    setOpenDialogAdd(false);
  };
  const handleOpenDialogAdd = () => {
    setOpenDialogAdd(true);
  };
  // for tabs
  const [tabValue, setTabValue] = useState(0);
  const handleChangeTabs = (event, newValue) => {
    setTabValue(newValue);
  };

  // for add menu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <>
      <Box width="100%" display={"flex"} flexDirection={"column"}>
        {/* start tabs */}
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            marginBottom: "20px",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleChangeTabs}
            variant="fullWidth"
            centered
          >
            <Tab
              width="50%"
              icon={<CallReceivedIcon />}
              iconPosition="start"
              sx={{ fontSize: "20px", textShadow: "0 0 3px" }}
              label={"مدیریت دریافتی"}
            />
            <Tab
              width="50%"
              icon={<CallMadeIcon />}
              iconPosition="end"
              sx={{ fontSize: "20px", textShadow: "0 0 3px" }}
              label={"مدیریت پرداختی"}
            />
          </Tabs>
        </Box>
        {/* end tabs */}
        <AddDialog
          action={tabValue}
          openDialogAdd={openDialogAdd}
          setOpenDialogAdd={setOpenDialogAdd}
          handleCloseDialogAdd={handleCloseDialogAdd}
          handleOpenDialogAdd={handleOpenDialogAdd}
        />
        <Box position={"fixed"} bottom={"50px"} right={"50px"}>
          {/* hover in sx */}
          <Fab
            sx={{
              backgroundColor: tabValue === 0 ? "#34d399" : "#f87171",
              "&:hover": {
                backgroundColor: tabValue === 0 ? "#6ee7b7" : "#fca5a5",
              },
            }}
            onClick={handleOpenDialogAdd}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Box>
    </>
  );
};
const EditDialog = () => {
  return (
    <>
      <Typography variant="h6">ویرایش</Typography>
    </>
  );
};
const AddDialog = (props) => {
  const typeDialog = props.action === 0 ? "receive" : "payment";
  const langDirection = useSelector(selectCurrentLanguage);
  // handle open and close dialog
  const [openDialogAdd, setOpenDialogAdd] = [
    props.openDialogAdd,
    props.setOpenDialogAdd,
  ];
  const handleCloseDialogAdd = props.handleCloseDialogAdd;
  const handleOpenDialogAdd = props.handleOpenDialogAdd;
  // define states
  //define state
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

  // for handle autocomplete options
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

  // for other input
  const [price, setPrice] = useState("");
  const [wage, setWage] = useState("");
  const [refCode, setRefCode] = useState("");
  const [description, setDescription] = useState("");
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

  return (
    <>
      {/*  dialog */}
      <div style={{ with: "100%" }}>
        <BootstrapDialog
          onClose={handleCloseDialogAdd}
          open={openDialogAdd}
          fullWidth={true}
          maxWidth={"xl"}
        >
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {typeDialog === "payment" ? "افزودن پرداختی" : "افزودن دریافتی"}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialogAdd}
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
            {/* {showProgressLoading && <CircularIndeterminate />} */}
            <Box display={"flex"} flexDirection={"column"} gap={5}>
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
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
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
              <Grid columns={12} spacing={2} container>
                <Grid
                  item
                  xl={2}
                  xs={4}
                  md={2}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Tooltip title="استقرار">
                    <Checkbox
                      icon={<ImportContactsTwoToneIcon />}
                      checkedIcon={<ImportContactsTwoToneIcon />}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xl={4} xs={8} md={4}>
                  <Autocomplete
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
                        label="سطح معین"
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
                <Grid item xl={4} xs={8} md={4}>
                  <Autocomplete
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
                        label="سطح تفضیل"
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
                <Grid
                  item
                  xl={2}
                  xs={4}
                  md={2}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Tooltip title="تجمیعی / تک">
                    <Checkbox
                      icon={<InsertDriveFileTwoToneIcon />}
                      checkedIcon={<DynamicFeedTwoToneIcon />}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
              <Box>
              <DataTable
          //   value={props.refrence.pledgers}
          value={props.refrence.passengers}
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
                  {rowData.name_fa ? (
                    <Link
                      style={{ fontSize: "12px" }}
                      href={
                        host_url + "/customers/details/" + rowData.passenger_id
                      }
                      target="_blank"
                      underline="hover"
                    >
                      {rowData.name_fa + " " + rowData.lastname_fa}
                    </Link>
                  ) : (
                    <Link
                      style={{ fontSize: "12px" }}
                      href={
                        host_url + "/customers/details/" + rowData.passenger_id
                      }
                      target="_blank"
                      underline="hover"
                    >
                      {rowData.name_en + " " + rowData.lastname_en}
                    </Link>
                  )}
                  <br />
                </span>
              </div>
            )}
            style={{ textAlign: "right", fontSize: "12px" }}
            header="نام و نام خانوادگی"
          ></Column>
          
        </DataTable>
              </Box>
              <Grid columns={12} spacing={2} container>
                <Grid item xl={2} xs={12} md={6}>
                  <Autocomplete
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
                        label={typeDialog === "payment" ? "از حساب" : "به حساب"}
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
                          typeDialog === "payment" ? "پرداخت به" : "واریز کننده"
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
          </DialogContent>
          <DialogActions>
            <Box>
              <Button
                sx={{ width: "100px" }}
                color="secondary"
                endIcon={<CheckCircleOutlineIcon />}
                variant="contained"
              >
                <span>ارسال</span>
              </Button>
            </Box>
          </DialogActions>
        </BootstrapDialog>
      </div>
      {/* end  dialog */}
    </>
  );
};

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
