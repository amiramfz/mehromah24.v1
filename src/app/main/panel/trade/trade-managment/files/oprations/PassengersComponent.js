import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  Alert,
  Card,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
  DialogContent,
  IconButton,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import styled from "@emotion/styled";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import WomanIcon from "@mui/icons-material/Woman";
import ManIcon from "@mui/icons-material/Man";
import Autocomplete from "@mui/material/Autocomplete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";
import Fade from "@mui/material/Fade";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef } from "react";
import axios from "axios";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CircularProgress from "@mui/material/CircularProgress";
import fixPersian from "src/app/custom-components/farsitype";
import fixEnglish from "src/app/custom-components/englishtype";
import UploadIcon from "@mui/icons-material/Upload";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import dayjs from "dayjs";
// import {
//   convertPersianToEnglishNumbers,
//   convertJalalitoMiladiDate,
// } from "./functions";
import {
  convertPersianToEnglishNumbers,
  convertJalalitoMiladiDate,
} from "./functions";
import AddIcon from "@mui/icons-material/Add";
import PassengerInformation from "../../../temporary-submit/files/PassengerInformation";
import { LoadingButton } from "@mui/lab";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CircularIndeterminate from "src/app/custom-components/CircularProgress";
import { base_url, host_url } from "src/app/constant";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import Link from "@mui/material/Link";

// function persianToEnglishNumber(persianText) {
//   const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

//   return persianText.replace(/[۰-۹]/g, function (match) {
//     return persianNumbers.indexOf(match).toString();
//   });
// }
const options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
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
export const PassengersComponent = (props) => {
  const langDirection = useSelector(selectCurrentLanguage);

  const [showProgressLoading, setShowProgressLoading] = React.useState(false);
  const [clickedSubmit, setClickedSubmit] = useState(false);

  const [itemForEdit, setItemForEdit] = useState("");
  const [isAddItem, setIsAddItem] = useState("");
  const [addedPersons, setAddedPersons] = useState([]);
  //dialog
  const [typeDialog, setTypeDialog] = useState("national");
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  //for handle edit and open dialog
  function handleClickEdit(action, rowData) {
    setIsAddItem(false);
    setTypeDialog(action);
    setItemForEdit(rowData);
    handleClickOpenDialog();
  }
  function handleClickAddItem() {
    setIsAddItem(true);
    handleClickOpenDialog();
  }
  function handleeClickDeleteAddedPerson(rowData) {
    setAddedPersons((prevPersons) =>
      prevPersons.filter((person) => person.id !== rowData.id)
    );
  }
  function handleSubmitAddItems(data) {
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/passenger/store", {
        access_token: getAccessToken(),
        data: data,
      })
      .then((response) => {
        setClickedSubmit(false);
        // Handle the response from the web service
        if (!response.data.status) {
        } else {
          response.data.data.forEach((item) => {
            setAddedPersons((preItems) => [...preItems, item]);
            props.setAddedPersons((preItems) => [...preItems, item]);
          });
          setShowProgressLoading(false);
          setOpenDialog(false);
          props.refrence.getRefrenceEdit(props.refrence.serial_id);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Error sending JSON data:", error);
      });
    handleCloseDialog();
  }
  const [loadingButton, setLoadingButton] = React.useState(false);

  function handleClickLoadingButton() {
    // setLoadingButton(true);
    setClickedSubmit(!clickedSubmit);
  }
  function sendEditedData(data) {
    console.log(data);
    data["access_token"] = getAccessToken();
    setShowProgressLoading(true);
    axios
      .post(base_url + "/v2/passenger/update", data)
      .then((response) => {
        setClickedSubmit(false);
        // Handle the successful response
        console.log("Item created:", response.data);
        setShowProgressLoading(false);
        setOpenDialog(false);
        props.getRefrenceEdit(props.refrence.serial_id);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  return (
    <>
      {showProgressLoading && <CircularIndeterminate />}
      {/*  dialog */}
      <Box marginTop={5}>
        <Typography marginBottom={2} variant="h6">
          مسافران ثبت شده
        </Typography>
        <div style={{ with: "100%" }}>
          <BootstrapDialog
            onClose={handleCloseDialog}
            aria-labelledby="customized-dialog-title"
            open={openDialog}
            fullWidth={true}
            maxWidth={"xl"}
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
              {itemForEdit && !isAddItem && (
                <NationalEdit
                  itemForEdit={itemForEdit}
                  clickedSubmit={clickedSubmit}
                  setClickedSubmit={setClickedSubmit}
                  sendEditedData={sendEditedData}
                  langDirection={langDirection}
                />
              )}
              {isAddItem && (
                <PassengerInformation
                  action={"opration"}
                  handleSubmitAddItems={handleSubmitAddItems}
                />
              )}
            </DialogContent>
            {!isAddItem && (
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
            )}
          </BootstrapDialog>
        </div>
      </Box>

      {/* end  dialog */}
      {/* start data table for passengers */}
      <div className="card">
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
          <Column
            field="amount"
            body={(rowData) => (
              <div>
                <span>
                  {rowData.national_code}
                  <br />
                </span>
              </div>
            )}
            style={{ fontSize: "12px" }}
            header="کد ملی"
          ></Column>

          <Column
            body={(rowData) => (
              <div>
                <span>
                  {rowData.phone_number}
                  <br />
                </span>
              </div>
            )}
            style={{ fontSize: "12px" }}
            header="تلفن همراه"
          ></Column>
          <Column
            body={(rowData) => (
              <div>
                <span>
                  {rowData.birthday}
                  <br />
                </span>
              </div>
            )}
            style={{ fontSize: "12px" }}
            header="تاریخ تولد"
          ></Column>
          <Column
            body={(rowData) => (
              <div>
                <span>
                  {rowData.pass_code}
                  <br />
                </span>
              </div>
            )}
            style={{ fontSize: "12px" }}
            header="شماره گذرنامه"
          ></Column>
          <Column
            body={(rowData) => (
              <div>
                <span>
                  {rowData.pass_ex}
                  <br />
                </span>
              </div>
            )}
            style={{ fontSize: "12px" }}
            header="تاریخ انقضا"
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
                {props.status.id === 1 && (
                  <IconButton
                    onClick={() => handleClickEdit("national", rowData)}
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
      {/* end data table for passengers */}

      {/* start data table for added passengers */}
      {addedPersons.length !== 0 && (
        <Box marginTop={5}>
          <Typography marginBottom={2} variant="h6">
            مسافران اضافه شده
          </Typography>

          <div className="card">
            <DataTable
              //   value={props.refrence.pledgers}
              value={addedPersons}
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
                      {rowData.name_fa
                        ? rowData.name_fa + " " + rowData.lastname_fa
                        : rowData.name_en + " " + rowData.lastname_en}
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
                  <div>
                    <span>
                      {rowData.national_code}
                      <br />
                    </span>
                  </div>
                )}
                style={{
                  fontSize: "12px",
                }}
                header="کد ملی"
              ></Column>

              <Column
                body={(rowData) => (
                  <div>
                    <span>
                      {rowData.phone_number}
                      <br />
                    </span>
                  </div>
                )}
                style={{ fontSize: "12px" }}
                header="تلفن همراه"
              ></Column>
              <Column
                body={(rowData) => (
                  <div>
                    <span>
                      {rowData.birthday}
                      <br />
                    </span>
                  </div>
                )}
                style={{ fontSize: "12px" }}
                header="تاریخ تولد"
              ></Column>
              <Column
                body={(rowData) => (
                  <div>
                    <span>
                      {rowData.pass_code}
                      <br />
                    </span>
                  </div>
                )}
                style={{ fontSize: "12px" }}
                header="شماره گذرنامه"
              ></Column>
              <Column
                body={(rowData) => (
                  <div>
                    <span>
                      {rowData.pass_ex}
                      <br />
                    </span>
                  </div>
                )}
                style={{ fontSize: "12px" }}
                header="تاریخ انقضا"
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
                    <IconButton
                      onClick={() => handleeClickDeleteAddedPerson(rowData)}
                      color="primary"
                      aria-label="add to shopping cart"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
                style={{ textAlign: "right", fontSize: "12px" }}
                header="عملیات"
              ></Column>
            </DataTable>
          </div>
        </Box>
      )}

      {/* end data table for added passengers */}
      {/* start add new items button */}
      {props.status.id === 1 && (
        <Box marginTop={2}>
          <Grid container>
            <Grid item xl={2} md={2} xs={6}>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Button
                  onClick={() => handleClickAddItem()}
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

//NationalEdit
const NationalEdit = (props) => {
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
  //for validation schema
  const [nationalRequired, setNationalRequired] = useState(true);
  const [phoneRequired, setPhoneRequired] = useState(true);
  const schema = yup.object().shape({
    nationalCode: nationalRequired
      ? yup
          .string()
          .required("باید یک نام شماره ملی وارد کنید")
          .length(10, "شماره ملی باید 10 رقم باشد")
      : yup.string().nullable(),

    name: yup.string().required("باید یک نام لاتین وارد کنید"),
    lastName: yup.string().required("باید یک نام خانوادگی لاتین وارد کنید"),
    nameFa: nationalRequired
      ? yup.string().required("باید یک نام فارسی وارد کنید")
      : yup.string().nullable(),
    lastNameFa: nationalRequired
      ? yup.string().required("باید یک نام خانوادگی فارسی وارد کنید")
      : yup.string().nullable(),
    birthday: yup
      .date()
      .typeError("فرمت تاریخ اشتباه است")
      .required("باید یک تاریخ وارد کنید"),
    phone: phoneRequired
      ? yup
          .string()
          .required("باید یک شماره موبایل وارد کنید")
          .min(11, "تلفن باید حداقل 11 رقم باشد")
      : yup
          .string()
          .test(
            "is-valid-phone",
            "تلفن باید 0 یا 11 رقم باشد",
            (value) =>
              typeof value === "undefined" ||
              value.length === 0 ||
              value.length === 11
          )
          .nullable(),
  });
  const defaultValues = {
    nationalCode: props.itemForEdit.national_code,
    name: props.itemForEdit.name_en,
    lastName: props.itemForEdit.lastname_en,
    nameFa: props.itemForEdit.name_fa,
    lastNameFa: props.itemForEdit.lastname_fa,
    birthday: convertJalalitoMiladiDate(props.itemForEdit.birthday),
    phone: props.itemForEdit.phone_number,
  };
  const { control, formState, trigger } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  //useref for controll axious requests
  const sourceRef = useRef(null);
  const [userInfos, setUserInfos] = useState([]);
  //for nationalcode autocomp
  const [nationalCode, setNationalCode] = useState(
    props.itemForEdit.national_code
  );
  const [openNational, setOpenNational] = React.useState(false);
  const [NationalLoading, setNationalLoading] = React.useState(false);
  //for citizens autocomp
  const [openCitizen, setOpenCitizen] = React.useState(false);
  const [citizenLoading, setCitizenLoading] = React.useState(false);
  const [citizens, setCitizens] = React.useState([]);
  function getCountries() {
    setCitizenLoading(true);
    axios
      .post(base_url + "/v2/get_country", {
        lang: props.langDirection,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
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
  //for english name
  const [name, setName] = useState(props.itemForEdit.name_en);
  //for english lastname
  const [lastName, setLastName] = useState(props.itemForEdit.lastname_en);
  //for farsi name
  const [nameFa, setNameFa] = useState(props.itemForEdit.name_fa);
  //for farsi lastname
  const [lastNameFa, setLastNameFa] = useState(props.itemForEdit.lastname_fa);
  //for mobile
  const [phone, setPhone] = useState(props.itemForEdit.phone_number);
  //for passcode
  const [passCode, setPassCode] = useState(props.itemForEdit.pass_code);
  //for birthday
  // Parse the Jalali date
  const [deFaultBirthday, setDeFaultBirthday] = useState(
    convertJalalitoMiladiDate(props.itemForEdit.birthday)
  );
  //for pass expire
  const [deFaultPassExp, setDeFaultPassExp] = useState(
    props.itemForEdit.pass_ex ? new Date(props.itemForEdit.pass_ex) : null
  );
  //for isMale
  const [isMale, setIsMale] = useState(props.itemForEdit.sex);
  //for citizen
  const [citizenSheep, setCitizenSheep] = useState(
    props.itemForEdit.citizenship
  );

  // useEffect(() => {
  //   if (openSnackBar) trigger();
  // }, [openSnackBar]);
  // const handleValidityChange = () => {
  //   handleChange(id, "validated", isValid);
  // };
  // useEffect(() => {
  //   handleValidityChange();
  // }, [isValid]);
  //uplaod national image
  const [nationalImage, setNationalImage] = useState("");
  const [passportImage, setPassportImage] = useState("");
  const fileInputRefNational = useRef(null);
  const fileInputRefPassport = useRef(null);
  const handleUploadButtonClick = (action) => {
    if (action === "national") {
      fileInputRefNational.current.click();
    } else if (action === "passport") {
      fileInputRefPassport.current.click();
    }
  };
  const handleImageUpload = async (e, action) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage); // 'image' should match the field name expected by your API
      formData.append("access_token", getAccessToken());
      formData.append("type", action);
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
        if (action === "national") {
          setNationalImage(response.data.image_name);
        } else if (action === "passport") {
          setPassportImage(response.data.image_name);
        }
      } catch (error) {
        // Handle any errors that occur during the upload.
        console.error("Error uploading image:", error);
      }
    }
  };
  //national city
  const [nationalCity, setNationalCity] = useState("");
  function getCityNational(code) {
    axios
      .post(base_url + "/v2/trade/national", {
        lang: props.langDirection,
        code: code,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setNationalCity(response.data.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (props.clickedSubmit) {
      if (isValid) {
        props.sendEditedData({
          passenger_id: props.itemForEdit.passenger_id,
          national_code: nationalCode,
          birthday: deFaultBirthday
            ? convertPersianToEnglishNumbers(
                deFaultBirthday.toLocaleDateString("fa-IR", options)
              )
            : null,
          name_en: name,
          lastname_en: lastName,
          name_fa: nameFa,
          lastname_fa: lastNameFa,
          pass_code: passCode,
          pass_ex: dayjs(deFaultPassExp).format("YYYY/MM/DD"),
          phone_number: phone,
          citizenship: citizenSheep,
          sex: isMale,
          pass_image: passportImage,
          national_image: nationalImage,
        });
      } else {
        showAlert("تمامی فیلد های ضروری پر شوند");
        trigger();
        props.setClickedSubmit(false);
      }
    }
  }, [props.clickedSubmit]);
  return (
    <>
      <Fade in={true}>
        <Box marginTop={5}>
          <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
          <Box display={"flex"} alignItems={"center"}>
            <Grid columns={10} spacing={2} container>
              <Grid item xl={3} xs={10} md={3}>
                <Box display={"flex"} gap={1}>
                  <Box
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Checkbox
                      onChange={(e) => {
                        // handleChange(id, "is_male", !e.target.checked);
                        setIsMale(!isMale);
                      }}
                      checked={!isMale}
                      size="large"
                      icon={<ManIcon />}
                      checkedIcon={<WomanIcon />}
                    />
                  </Box>
                  <Box width={"100%"} display={"flex"} flexDirection={"column"}>
                    {/* <Controller
                      name="nationalCode"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          sx={{ width: "100%" }}
                          open={openNational}
                          onOpen={() => {
                            setOpenNational(true);
                          }}
                          onClose={() => {
                            setOpenNational(false);
                          }}
                          id="combo-box-demo"
                          freeSolo
                          onChange={(e, value) => {
                            if (value) {
                              getCityNational(value.national_code);
                              // handleChange(
                              //   id,
                              //   "temp_national_code",
                              //   value.national_code
                              // );
                              // handleChange(
                              //   id,
                              //   "national_code",
                              //   value.national_code
                              // );
                              // handleChange(id, "passenger_id", value.id);
                              setNationalCode(value.national_code);
                              setName(value.first_name);
                              // handleChange(id, "name_en", value.first_name);
                              setLastName(value.last_name);
                              // handleChange(id, "lastname_en", value.last_name);
                              setNameFa(value.first_name_fa);
                              // handleChange(id, "name_fa", value.first_name_fa);
                              setLastNameFa(value.last_name_fa);
                              // handleChange(
                              //   id,
                              //   "lastname_fa",
                              //   value.last_name_fa
                              // );
                              setPhone(value.mobile);
                              // handleChange(id, "phone_number", value.mobile);
                              setPassCode(value.passport_code);
                              // handleChange(
                              //   id,
                              //   "pass_code",
                              //   value.passport_code
                              // );
                              //for birthday
                              const birthdayDate = new Date(value.birth.en);
                              setDeFaultBirthday(birthdayDate);
                              const formattedDate = birthdayDate
                                ? birthdayDate.toLocaleDateString("fa-IR")
                                : null;
                              // handleChange(id, "birthday", formattedDate);
                              setValue("birthday", birthdayDate);
                              trigger("birthday");
                              //end for birthday

                              // for pass exp
                              if (value.passport_expire) {
                                // handleChange(
                                //   id,
                                //   "pass_ex",
                                //   value.passport_expire
                                // );
                                setDeFaultPassExp(value.passport_expire);
                              }
                              // end for pass exp
                              setValue("nationalCode", value.national_code);
                              trigger("nationalCode");
                              setValue("name", value.last_name);
                              trigger("name");
                              setValue("lastName", value.last_name);
                              trigger("lastName");
                              setValue("nameFa", value.first_name_fa);
                              trigger("nameFa");
                              setValue("lastNameFa", value.last_name_fa);
                              trigger("lastNameFa");
                              setValue("phone", value.mobile);
                              trigger("phone");

                              setCitizenSheep(value.nationality);
                              // handleChange(
                              //   id,
                              //   "citizenship",
                              //   value.nationality
                              // );

                              setIsMale(value.sex === "male" ? false : true);
                              // handleChange(
                              //   id,
                              //   "is_male",
                              //   value.sex === "male" ? true : false
                              // );
                            } else {
                              // handleChange(id, "temp_national_code", "");
                              // handleChange(id, "national_code", "");
                              // handleChange(id, "passenger_id", "");
                              // handleChange(id, "pass_ex", "");
                              setDeFaultPassExp("no_value");
                              setNationalCode("");
                              setNationalCity("");
                              setValue("nationalCode", "");
                              trigger("nationalCode");
                            }
                            setUserInfos([]);
                          }}
                          onInputChange={(e, newInputValue) => {
                            changeCombo(newInputValue, "nationalCode");
                          }}
                          getOptionLabel={(option) => option.national_code}
                          renderOption={(props, option) => (
                            <li {...props}>
                              <Box
                                width={"100%"}
                                display={"flex"}
                                flexDirection={"column"}
                                gap={1}
                              >
                                <Box display={"flex"} gap={1}>
                                  <Typography>
                                    {option.first_name_fa}
                                  </Typography>
                                  <Typography>{option.last_name_fa}</Typography>
                                </Box>
                                <Box
                                  width={"100%"}
                                  display={"flex"}
                                  justifyContent={"space-between"}
                                >
                                  <Typography sx={{ fontSize: "12px" }}>
                                    {option.national_code}
                                  </Typography>
                                  <Typography sx={{ fontSize: "12px" }}>
                                    {option.mobile}
                                  </Typography>
                                </Box>
                                <Divider component="li" />
                              </Box>
                            </li>
                          )}
                          options={userInfos}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              {...field}
                              dir="ltr"
                              value={nationalCode}
                              required
                              autoComplete="off"
                              error={!!errors.nationalCode}
                              helperText={errors?.nationalCode?.message}
                              label={
                                nationalCity
                                  ? "محل صدور: " + nationalCity
                                  : "شماره ملی"
                              }
                              variant="outlined"
                              color="primary"
                              type="number"
                              max
                              onChange={(e) => {
                                if (e.target.value.length === 0) {
                                  setNationalCity("");
                                }
                                // if (e.target.value.length >= 10) {
                                field.onChange(e); // This is necessary for React Hook Form to track the value changesc
                                // changeCombo(e);
                                // handleChange(
                                //   id,
                                //   "national_code",
                                //   e.target.value
                                // );
                                setNationalCode(e.target.value);
                                if (
                                  e.target.value.length >= 10 &&
                                  nationalRequired
                                ) {
                                  getCityNational(e.target.value);
                                }
                                // }
                              }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {NationalLoading ? (
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
                      )}
                    /> */}
                    <Controller
                      name="nationalCode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          dir="ltr"
                          value={nationalCode}
                          required
                          autoComplete="off"
                          error={!!errors.nationalCode}
                          helperText={errors?.nationalCode?.message}
                          label={
                            nationalCity
                              ? "محل صدور: " + nationalCity
                              : "شماره ملی"
                          }
                          variant="outlined"
                          color="primary"
                          type="number"
                          max
                          onChange={(e) => {
                            if (e.target.value.length === 0) {
                              setNationalCity("");
                            }
                            // if (e.target.value.length >= 10) {
                            field.onChange(e); // This is necessary for React Hook Form to track the value changesc
                            // changeCombo(e);
                            // handleChange(
                            //   id,
                            //   "national_code",
                            //   e.target.value
                            // );
                            setNationalCode(e.target.value);
                            if (
                              e.target.value.length >= 10 &&
                              nationalRequired
                            ) {
                              getCityNational(e.target.value);
                            }
                            // }
                          }}
                        />
                      )}
                    />
                  </Box>
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
                      onClick={() => handleUploadButtonClick("national")}
                    >
                      {nationalImage ? (
                        <FileDownloadDoneIcon />
                      ) : (
                        <UploadIcon />
                      )}
                    </IconButton>
                    {/* Step 1: Hidden file input element */}
                    <input
                      ref={fileInputRefNational}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageUpload(e, "national")}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xl={2} xs={10} md={2}>
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                      <DatePicker
                        {...field}
                        sx={{ width: "100%" }}
                        required
                        label="تاریخ تولد*"
                        color="primary"
                        value={field.value || deFaultBirthday} // Set the initial value to null
                        onChange={(value) => {
                          field.onChange(value);
                          setDeFaultBirthday(value);
                        }}
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xl={1} xs={10} md={1}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={name}
                      dir="ltr"
                      required
                      autoComplete="off"
                      sx={{ width: "100%" }}
                      label="نام"
                      variant="outlined"
                      color="primary"
                      error={!!errors.name}
                      helperText={errors?.name?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        let fixed = fixEnglish(e.target.value);
                        setName(fixed);
                        // handleChange(id, "name_en", fixed);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={10} md={2}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={lastName}
                      dir="ltr"
                      required
                      autoComplete="off"
                      sx={{ width: "100%" }}
                      label="نام خانوادگی"
                      variant="outlined"
                      color="primary"
                      error={!!errors.lastName}
                      helperText={errors?.lastName?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        let fixed = fixEnglish(e.target.value);
                        setLastName(fixed);
                        // handleChange(id, "lastname_en", fixed);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={10} md={2}>
                <Controller
                  name="nameFa"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={nameFa}
                      dir="rtl"
                      autoComplete="off"
                      required
                      sx={{ width: "100%" }}
                      label="نام(فارسی)"
                      variant="outlined"
                      color="primary"
                      error={!!errors.nameFa}
                      helperText={errors?.nameFa?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        let fixed = fixPersian(e.target.value);
                        setNameFa(fixed);
                        // handleChange(id, "name_fa", fixed);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={10} md={2}>
                <Controller
                  name="lastNameFa"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={lastNameFa}
                      required
                      dir="rtl"
                      sx={{ width: "100%" }}
                      autoComplete="off"
                      label="نام خانوادگی(فارسی)"
                      variant="outlined"
                      color="primary"
                      error={!!errors.lastNameFa}
                      helperText={errors?.lastNameFa?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        let fixed = fixPersian(e.target.value);
                        setLastNameFa(fixed);
                        // handleChange(id, "lastname_fa", fixed);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={10} md={2}>
                <TextField
                  dir="ltr"
                  value={passCode}
                  sx={{ width: "100%" }}
                  autoComplete="off"
                  label="شماره گذرنامه"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => {
                    let fixed = fixEnglish(e.target.value).toUpperCase();
                    // handleChange(id, "pass_code", fixed);
                    setPassCode(fixed);
                  }}
                />
              </Grid>
              <Grid item xl={2} xs={10} md={2}>
                <Box display={"flex"} gap={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {deFaultPassExp ? (
                      <DatePicker
                        value={dayjs(deFaultPassExp)}
                        format="YYYY/MM/DD"
                        sx={{ width: "100%" }}
                        label="انقضاء پاسپورت"
                        color="primary"
                        onChange={(value) => {
                          console.log(value);
                          // const formattedDate = value.format("YYYY/MM/DD");
                          setDeFaultPassExp(value);
                          // handleChange(id, "pass_ex", formattedDate);
                        }}
                        slotProps={{
                          textField: {
                            error: false,
                          },
                        }}
                      />
                    ) : (
                      <DatePicker
                        format="YYYY/MM/DD"
                        sx={{ width: "100%" }}
                        label="انقضاء پاسپورت"
                        color="primary"
                        onChange={(value) => {
                          setDeFaultPassExp(value);
                          // handleChange(id, "pass_ex", formattedDate);
                        }}
                        slotProps={{
                          textField: {
                            error: false,
                          },
                        }}
                      />
                    )}
                  </LocalizationProvider>
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
                      onClick={() => handleUploadButtonClick("passport")}
                    >
                      {passportImage ? (
                        <FileDownloadDoneIcon />
                      ) : (
                        <UploadIcon />
                      )}
                    </IconButton>
                    {/* Step 1: Hidden file input element */}
                    <input
                      ref={fileInputRefPassport}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageUpload(e, "passport")}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xl={2} xs={10} md={2}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={phone}
                      dir="ltr"
                      required
                      sx={{ width: "100%" }}
                      autoComplete="off"
                      label="شماره موبایل"
                      variant="outlined"
                      color="primary"
                      error={!!errors.phone}
                      helperText={errors?.phone?.message}
                      onChange={(e) => {
                        if (e.target.value.length <= 13) {
                          field.onChange(e);
                          // handleChange(id, "phone_number", e.target.value);
                          setPhone(e.target.value);
                        }
                      }}
                      type="number"
                      inputProps={{
                        maxLength: 11, // Add this line to restrict input to a maximum of 10 characters
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={10} md={2}>
                <Autocomplete
                  sx={{ width: "100%" }}
                  value={citizenSheep}
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
                  getOptionLabel={(option) => option.fa_nationality}
                  options={citizens}
                  loading={citizenLoading}
                  onChange={async (e, value) => {
                    if (value) {
                      console.log(value);
                      if (value.fa_nationality !== "ایرانی") {
                        setNationalRequired(false);
                      } else {
                        setNationalRequired(true);
                      }
                      setCitizenSheep(value);
                      trigger();
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      value={citizenSheep}
                      autoComplete="off"
                      label="تابعیت"
                      variant="outlined"
                      color="primary"
                      onChange={(e, value) => {
                        if (value) {
                          setCitizenSheep(value);
                        }
                      }}
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
                        {option.fa_nationality}
                        <img
                          src={
                            "./custom_assets/flags/flat/24/" +
                            option.iso +
                            ".png"
                          }
                        />
                      </Box>
                    </li>
                  )}
                  // defaultValue={{
                  //   id: 118,
                  //   iso: "IR",
                  //   fa_nationality: "ایرانی",
                  //   en_nationality: "Iranian",
                  // }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </>
  );
};
