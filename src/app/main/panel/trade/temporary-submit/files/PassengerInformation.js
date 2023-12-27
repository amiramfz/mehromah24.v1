import { base_url } from "src/app/constant";
import * as React from "react";
import {
  Box,
  Card,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import WomanIcon from "@mui/icons-material/Woman";
import ManIcon from "@mui/icons-material/Man";
import Autocomplete from "@mui/material/Autocomplete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
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
import Snackbar from "@mui/material/Snackbar";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "app/store/i18nSlice";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { action } from "mobx";
import { convertPersianToEnglishNumbers } from "../../trade-managment/files/oprations/functions";
import { getFullname } from "../../trade-managment/files/oprations/functions";

const tab = "\xa0\xa0\xa0\xa0\xa0";
const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};

// Form Validation Schema

const PassengerInformation = (props) => {
  const [persons, setPersons] = useState([
    {
      id: uuidv4(),
      passenger_id: "",
      validated: false,
      temp_national_code: "",
      national_code: "",
      birthday: "",
      name_en: "",
      lastname_en: "",
      name_fa: "",
      lastname_fa: "",
      pass_code: "",
      pass_ex: "",
      phone_number: "",
      citizenship: {
        id: 118,
        iso: "IR",
        fa_nationality: "ایرانی",
        en_nationality: "Iranian",
      },
      sex: true,
      pass_image: "",
      national_image: "",
    },
  ]);
  useEffect(() => {
    if (props.action === "online") {
      if (props.online.length !== 0) {
        let defaultPersons = [];
        for (let i = 0; i < props.count; i++) {
          defaultPersons.push({
            id: uuidv4(),
            passenger_id: "",
            validated: false,
            temp_national_code: "",
            national_code: "",
            birthday: "",
            name_en: "",
            lastname_en: "",
            name_fa: "",
            lastname_fa: "",
            pass_code: "",
            pass_ex: "",
            phone_number: "",
            citizenship: {
              id: 118,
              iso: "IR",
              fa_nationality: "ایرانی",
              en_nationality: "Iranian",
            },
            sex: true,
            pass_image: "",
            national_image: "",
          });
        }
        setPersons(defaultPersons);
      }
    }
  }, [props.online]);
  const dispatch = useDispatch();
  const langDirection = useSelector(selectCurrentLanguage);
  //snacke bar
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const handleClickSnackBar = (message) => {
    setOpenSnackBar(!openSnackBar);
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
  };

  //income snackebar
  const [openSnackBarIncome, setOpenSnackBarIncome] = React.useState(false);
  const handleClickSnackBarIncome = (message) => {
    setOpenSnackBarIncome(!openSnackBarIncome);
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
  };

  //for income autocomp
  const [income, setIncome] = useState(
    props.action === "online" ? "خدمات تور داخلی" : ""
  );
  const [incomeId, setIncomeId] = useState(
    props.action === "online" ? "15" : ""
  );
  const [incomes, setIncomes] = useState([]);
  const [incomeLoading, setIncomeLoading] = useState(false);
  const [openIncome, setOpenIncome] = useState(false);
  function getIncomTitles() {
    setIncomeLoading(true);
    axios
      .post(base_url + "/v2/get_titels", {
        lang: langDirection,
        table: "accounting",
        action: "income",
        route: internal ? 1 : 2,
        access_token: getAccessToken(),
      })
      .then((response) => {
        // Handle the successful response
        setIncomes(response.data.data.titles);
        setIncomeLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error creating item:", error);
      });
  }
  useEffect(() => {
    if (openIncome) {
      getIncomTitles();
    }
  }, [openIncome]);
  //for internal or international
  const [internal, setInternal] = useState(true);
  const handleChange = (id, action, value) => {
    persons.forEach((person) => {
      if (person.id === id) {
        person[action] = value;
      }
    });
  };

  const handleAddPerson = () => {
    setPersons((prevPersons) => [
      ...prevPersons,
      {
        id: uuidv4(),
        passenger_id: "",
        validated: false,
        temp_national_code: "",
        national_code: "",
        birthday: "",
        name_en: "",
        lastname_en: "",
        name_fa: "",
        lastname_fa: "",
        pass_code: "",
        pass_ex: "",
        phone_number: "",
        citizenship: {
          id: 118,
          iso: "IR",
          fa_nationality: "ایرانی",
          en_nationality: "Iranian",
        },
        sex: true,
        pass_image: "",
        national_image: "",
      },
    ]);
  };
  const handleDeletePerson = (id) => {
    setPersons((prevPersons) =>
      prevPersons.filter((person) => person.id !== id)
    );
  };
  const handleSubmitNext = async () => {
    let isValid = true; // Initialize isValid to true
    for (const person of persons) {
      if (!person.validated) {
        isValid = false;
        break; // No need to continue checking
      }
    }
    if (isValid) {
      if (props.action !== "opration") {
        if (!income) {
          handleClickSnackBar("درآمد وارد شود");
        } else {
          await props.handleSetPersonsJSON({
            internal: internal,
            income_id: incomeId,
            income: {
              title: income,
              income_id: incomeId,
            },
            passengers: persons,
          });
          props.handleNext();
        }
      } else {
        props.handleSubmitAddItems(persons);
      }
    } else {
      handleClickSnackBar("تمامی فیلدهای ضروری به درستی پر شوند");
    }
  };
  const handleSubmitBack = () => {
    props.handleBack();
  };
  return (
    <>
      <Card sx={{ margin: "10px", padding: "15px" }}>
        {props.action !== "opration" && (
          <Grid columns={10} spacing={1} container>
            <Grid item xl={10} xs={10} md={10}>
              <Box
                display={"flex"}
                // flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={2}
              >
                  <Paper
                    elevation={0}
                    sx={{
                      height: "56px",
                      width: "200px",
                      display: "flex",
                      justifyContent: "center",
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box
                      width={"200px"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <img
                        onClick={() => {
                          setIncomes([]);
                          setIncome("");
                          setIncomeId("");
                          setInternal(true);
                        }}
                        style={{
                          filter: internal ? "" : "grayscale(1)",
                          width: "55px",
                        }}
                        src="./custom_assets/internal.svg"
                      />
                      <img
                        onClick={() => {
                          setIncomes([]);
                          setIncome("");
                          setIncomeId("");
                          setInternal(false);
                        }}
                        style={{ filter: !internal ? "" : "grayscale(1)" }}
                        src="./custom_assets/international.svg"
                      />
                    </Box>
                  </Paper>

                <Autocomplete
                  inputValue={income}
                  sx={{ width: "200px" }}
                  open={openIncome}
                  onOpen={() => {
                    setOpenIncome(true);
                  }}
                  onClose={() => {
                    setOpenIncome(false);
                  }}
                  loading={incomeLoading}
                  onChange={(e, value) => {
                    if (value) {
                      console.log(value);
                      setIncome(value.title);
                      setIncomeId(value.id);
                    } else {
                      setIncome("");
                      setIncomeId("");
                    }
                  }}
                  getOptionLabel={(option) => option.title}
                  options={incomes}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      autoComplete="off"
                      label="درآمد"
                      variant="outlined"
                      color="primary"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {incomeLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        )}

        {persons.map((person, index) => (
          <Person
            key={person.id}
            id={person.id}
            onDelete={handleDeletePerson}
            handleChange={handleChange}
            counter={index + 1}
            openSnackBar={openSnackBar}
            internal={internal}
          />
        ))}
        <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
        <Box display={"flex"} justifyContent={"space-between"}>
          <Button
            onClick={handleAddPerson}
            size="large"
            variant="outlined"
            startIcon={<PersonAddIcon />}
          >
            {tab + "افزودن همراه"}
          </Button>

          <Box display={"flex"} gap={"5px"}>
            <Button
              sx={{ visibility: "hidden" }}
              onClick={handleSubmitBack}
              size="large"
              variant="contained"
            >
              قبلی
            </Button>
            <Button
              onClick={handleSubmitNext}
              size="large"
              variant="contained"
              color="secondary"
            >
              {props.action === "opration" ? "ثبت" : "بعدی"}
            </Button>
          </Box>
        </Box>
      </Card>
    </>
  );
};
export default PassengerInformation;
const Person = ({
  id,
  onDelete,
  handleChange,
  counter,
  openSnackBar,
  internal,
}) => {
  //store real passenger id
  const [passengerId, setPassengerId] = useState("");
  //for show image
  const [hasNationalImage, setHasNationalImage] = useState(null);
  const [hasPassportImage, setHasPassportImage] = useState(null);
  const langDirection = useSelector(selectCurrentLanguage);
  //for validation schema
  const [nationalRequired, setNationalRequired] = useState(true);
  const [phoneRequired, setPhoneRequired] = useState(true);
  useEffect(() => {
    counter === 1 ? setPhoneRequired(true) : setPhoneRequired(false);
  }, []);
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
    birthday: nationalRequired
      ? yup
          .date()
          .typeError("فرمت تاریخ اشتباه است")
          .required("باید یک تاریخ وارد کنید")
      : yup.string().nullable(),
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
    passportCode: internal
      ? yup.string().nullable()
      : yup.string().required("باید یک شماره گذرنامه وارد کنید"),
    passportEx: internal
      ? yup.string().nullable()
      : yup
          .date()
          .typeError("فرمت تاریخ اشتباه است")
          .required("باید یک تاریخ وارد کنید"),
  });
  const defaultValues = {
    nationalCode: "",
    name: "",
    lastName: "",
    nameFa: "",
    lastNameFa: "",
  };
  //useref for controll axious requests
  const sourceRef = useRef(null);
  const [userInfos, setUserInfos] = useState([]);
  //for nationalcode autocomp
  const [nationalCode, setNationalCode] = useState("");
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
        lang: langDirection,
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
  const [name, setName] = useState("");
  //for english lastname
  const [lastName, setLastName] = useState("");
  //for farsi name
  const [nameFa, setNameFa] = useState("");
  //for farsi lastname
  const [lastNameFa, setLastNameFa] = useState("");
  //for mobile
  const [phone, setPhone] = useState("");
  //for passcode
  const [passCode, setPassCode] = useState("");
  //for birthday
  const [deFaultBirthday, setDeFaultBirthday] = useState(null);
  //for pass expire
  const [deFaultPassExp, setDeFaultPassExp] = useState(null);
  //for isMale
  const [isMale, setIsMale] = useState(false);
  //for citizen
  const [citizenSheep, setCitizenSheep] = useState({
    id: 118,
    iso: "IR",
    fa_nationality: "ایرانی",
    en_nationality: "Iranian",
  });
  //another
  const changeCombo = async (newInputValue, action) => {
    // Cancel any previous API requests
    if (sourceRef.current) {
      sourceRef.current.cancel("Operation canceled due to new request.");
    }
    // Create a new cancel token source
    const source = axios.CancelToken.source();
    sourceRef.current = source;
    if (action === "nationalCode") {
      if (newInputValue.length > 2) {
        setNationalLoading(true);
        try {
          const response = await axios.post(
            base_url + "/v2/get_user_info",
            {
              lang: langDirection,
              like: newInputValue,
              access_token: getAccessToken(),
            },
            {
              cancelToken: source.token, // Pass the cancel token to the request
            }
          );

          // Handle the successful response
          console.log(response.data);
          setUserInfos(response.data);
          setNationalLoading(false);
        } catch (error) {
          if (axios.isCancel(error)) {
            // Request was canceled, so no need to handle the response
          } else {
            // Handle other errors
            console.error("Error:", error);
          }
        }
      } else {
        setUserInfos([]);
      }
    }
  };
  const { control, formState, trigger, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  useEffect(() => {
    if (openSnackBar) trigger();
  }, [openSnackBar]);
  const handleValidityChange = () => {
    handleChange(id, "validated", isValid);
  };
  useEffect(() => {
    handleValidityChange();
  }, [isValid]);
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
        if (action === "national") {
          setNationalImage(response.data.image_name);
          setHasNationalImage(base_url + "/App/" + response.data.image_name);
          handleChange(
            id,
            "national_image",
            base_url + "/App/" + response.data.image_name
          );
        } else if (action === "passport") {
          setPassportImage(response.data.image_name);
          setHasPassportImage(base_url + "/App/" + response.data.image_name);
          handleChange(
            id,
            "pass_image",
            base_url + "/App/" + response.data.image_name
          );
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
        lang: langDirection,
        code: code, // Pass the parameter inside the 'params' object
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
    trigger("passportCode");
    trigger("passportEx");
  }, [internal]);

  return (
    <>
      <Fade in={true}>
        <Box marginTop={5}>
          <Divider sx={{ marginBottom: 2, marginTop: 2 }} variant="middle" />
          <Box display={"flex"} alignItems={"center"}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Box
                elevation={0}
                sx={{
                  width: "100px",
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography sx={{ fontSize: "18px" }} variant="h1">
                    {counter}
                  </Typography>
                </Box>
              </Box>

              <IconButton
                sx={{ visibility: counter == 1 ? "hidden" : "" }}
                onClick={() => {
                  onDelete(id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Grid columns={10} spacing={2} container>
              <Grid item xl={3} xs={10} md={5}>
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
                        handleChange(id, "sex", !e.target.checked);
                        setIsMale(!isMale);
                      }}
                      checked={isMale}
                      size="large"
                      icon={<ManIcon />}
                      checkedIcon={<WomanIcon />}
                    />
                  </Box>
                  <Box width={"100%"} display={"flex"} flexDirection={"column"}>
                    <Controller
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
                              handleChange(
                                id,
                                "temp_national_code",
                                value.national_code
                              );
                              handleChange(
                                id,
                                "national_code",
                                value.national_code
                              );
                              //for national image
                              setHasNationalImage(value.national_img);
                              handleChange(
                                id,
                                "national_image",
                                value.national_img
                              );
                              handleChange(id, "passenger_id", value.id);
                              setPassengerId(value.id);
                              value.national_code
                                ? setNationalCode(value.national_code)
                                : setNationalCode("");
                              setName(value.first_name);
                              handleChange(id, "name_en", value.first_name);
                              setLastName(value.last_name);
                              handleChange(id, "lastname_en", value.last_name);
                              setNameFa(value.first_name_fa);
                              handleChange(id, "name_fa", value.first_name_fa);
                              setLastNameFa(value.last_name_fa);
                              handleChange(
                                id,
                                "lastname_fa",
                                value.last_name_fa
                              );
                              setPhone(value.mobile);
                              handleChange(id, "phone_number", value.mobile);
                              setHasPassportImage(value.passport_img);
                              handleChange(
                                id,
                                "pass_image",
                                value.national_img
                              );
                              setPassCode(value.passport_code);
                              handleChange(
                                id,
                                "pass_code",
                                value.passport_code
                              );
                              setValue("passportCode", value.passport_code);
                              trigger("passportCode");
                              //for birthday
                              const birthdayDate = new Date(value.birth.en);
                              setDeFaultBirthday(birthdayDate);
                              const options = {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              };
                              const formattedDate = birthdayDate
                                ? birthdayDate.toLocaleDateString(
                                    "fa-IR",
                                    options
                                  )
                                : null;
                              handleChange(
                                id,
                                "birthday",
                                convertPersianToEnglishNumbers(formattedDate)
                              );
                              setValue("birthday", birthdayDate);
                              trigger("birthday");
                              //end for birthday

                              // for pass exp
                              if (value.passport_expire) {
                                handleChange(
                                  id,
                                  "pass_ex",
                                  value.passport_expire
                                );
                                setDeFaultPassExp(value.passport_expire);
                              }
                              setValue("passportEx", value.passport_expire);
                              trigger("passportEx");
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
                              handleChange(
                                id,
                                "citizenship",
                                value.nationality
                              );

                              setIsMale(value.sex === "male" ? false : true);
                              handleChange(
                                id,
                                "sex",
                                value.sex === "male" ? true : false
                              );
                            } else {
                              handleChange(id, "temp_national_code", "");
                              handleChange(id, "national_code", "");
                              handleChange(id, "passenger_id", "");
                              handleChange(id, "pass_ex", "");
                              setDeFaultPassExp("no_value");
                              setNationalCode("");
                              setNationalCity("");
                              setValue("nationalCode", "");
                              trigger("nationalCode");
                              setHasNationalImage(false);
                              setHasPassportImage(false);
                            }
                            setUserInfos([]);
                          }}
                          onInputChange={(e, newInputValue) => {
                            changeCombo(newInputValue, "nationalCode");
                            if (newInputValue.length === 9 && passengerId) {
                              handleChange(id, "temp_national_code", "");
                              handleChange(id, "national_code", "");
                              //for national image
                              setHasNationalImage(false);
                              handleChange(id, "passenger_id", "");
                              setPassengerId("");
                              setNationalCode("");
                              setName("");
                              handleChange(id, "name_en", "");
                              setLastName("");
                              handleChange(id, "lastname_en", "");
                              setNameFa("");
                              handleChange(id, "name_fa", "");
                              setLastNameFa("");
                              handleChange(id, "lastname_fa", "");
                              setPhone("");
                              handleChange(id, "phone_number", "");
                              setPassCode("");
                              handleChange(id, "pass_code", "");
                              //for birthday
                              setDeFaultBirthday(null);
                              handleChange(id, "birthday", "");
                              setValue("birthday", "");
                              trigger("birthday");
                              //end for birthday
                              // for pass exp
                              handleChange(id, "pass_ex", "");
                              setDeFaultPassExp("no_value");
                              // end for pass exp
                              setHasPassportImage(false);
                              setValue("nationalCode", "");
                              trigger("nationalCode");
                              setValue("name", "");
                              trigger("name");
                              setValue("lastName", "");
                              trigger("lastName");
                              setValue("nameFa", "");
                              trigger("nameFa");
                              setValue("lastNameFa", "");
                              trigger("lastNameFa");
                              setValue("phone", "");
                              trigger("phone");
                              setCitizenSheep({
                                id: 118,
                                iso: "IR",
                                fa_nationality: "ایرانی",
                                en_nationality: "Iranian",
                              });
                              handleChange(id, "citizenship", {
                                id: 118,
                                iso: "IR",
                                fa_nationality: "ایرانی",
                                en_nationality: "Iranian",
                              });
                              setIsMale(false);
                              handleChange(id, "sex", true);
                            }
                          }}
                          getOptionLabel={(option) =>
                            `${option.national_code} - ${option.first_name_fa} - ${option.last_name_fa} - ${option.first_name} - ${option.last_name}`
                          }
                          // getOptionLabel={(option) => option.last_name_fa}
                          // getOptionLabel={(option) => {
                          //   if (typeof option === "object" && option !== null) {
                          //     // Handle the case where the option is an object
                          //     // You can return a default label or extract a specific property from the object
                          //     return "Default Label";
                          //   }
                          //   // Return the string label for valid options
                          //   return option;
                          // }}
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
                                    {getFullname(option, langDirection.id)}
                                  </Typography>
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
                          inputValue={nationalCode}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              {...field}
                              color="primary"
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
                              // type="number"
                              max
                              onChange={(e) => {
                                if (e.target.value.length === 0) {
                                  setNationalCity("");
                                }
                                // if (e.target.value.length >= 10) {
                                field.onChange(e); // This is necessary for React Hook Form to track the value changesc
                                // changeCombo(e);
                                handleChange(
                                  id,
                                  "national_code",
                                  e.target.value
                                );
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
                    />
                    {hasNationalImage && (
                      <a
                        target="_blank"
                        style={{
                          textDecoration: "none",
                          position: "absolute",
                          marginTop: "45px",
                          fontSize: "xx-small",
                          marginRight: "10px",
                          backgroundColor: "#fafbfd",
                          padding: "0px 5px",
                        }}
                        href={hasNationalImage}
                      >
                        مشاهده تصویر
                      </a>
                    )}
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

              <Grid item xl={1} xs={10} md={5}>
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
                        handleChange(id, "name_en", fixed);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={10} md={5}>
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
                        handleChange(id, "lastname_en", fixed);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={10} md={5}>
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
                        handleChange(id, "name_fa", fixed);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={10} md={5}>
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
                        handleChange(id, "lastname_fa", fixed);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={10} md={5}>
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                      <DatePicker
                        {...field}
                        sx={{ width: "100%" }}
                        required
                        format="dd/MM/yyyy"
                        label="تاریخ تولد (شمسی)"
                        color="primary"
                        value={field.value || deFaultBirthday} // Set the initial value to null
                        onChange={(value) => {
                          field.onChange(value);
                          const options = {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          };
                          const formattedDate = value
                            ? value.toLocaleDateString("fa-IR", options)
                            : null;
                          handleChange(
                            id,
                            "birthday",
                            convertPersianToEnglishNumbers(formattedDate)
                          );
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
              <Grid item xl={2} xs={10} md={5}>
                <Controller
                  name="passportCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      dir="ltr"
                      value={passCode}
                      sx={{ width: "100%" }}
                      autoComplete="off"
                      label="شماره گذرنامه"
                      variant="outlined"
                      color="primary"
                      error={!!errors.passportCode}
                      helperText={errors?.passportCode?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        let fixed = fixEnglish(e.target.value).toUpperCase();
                        handleChange(id, "pass_code", fixed);
                        setPassCode(fixed);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xl={2} xs={10} md={5}>
                <Box display={"flex"} gap={1}>
                  <Box width={"100%"} display={"flex"} flexDirection={"column"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      {deFaultPassExp ? (
                        <Controller
                          name="passportEx"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <DatePicker
                              {...field}
                              value={dayjs(deFaultPassExp)}
                              format="DD/MM/YYYY"
                              sx={{ width: "100%" }}
                              label="انقضاء پاسپورت (میلادی)"
                              color="primary"
                              onChange={(value) => {
                                field.onChange(value);
                                const formattedDate =
                                  value.format("YYYY/MM/DD");
                                handleChange(id, "pass_ex", formattedDate);
                              }}
                              slotProps={{
                                textField: {
                                  variant: "outlined",
                                  error: !!error,
                                  helperText: error?.message,
                                },
                              }}
                            />
                          )}
                        />
                      ) : (
                        <Controller
                          name="passportEx"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <DatePicker
                              {...field}
                              format="DD/MM/YYYY"
                              sx={{ width: "100%" }}
                              label="انقضاء پاسپورت (میلادی)"
                              color="primary"
                              onChange={(value) => {
                                field.onChange(value);
                                const formattedDate =
                                  value.format("YYYY/MM/DD");
                                handleChange(id, "pass_ex", formattedDate);
                              }}
                              slotProps={{
                                textField: {
                                  variant: "outlined",
                                  error: !!error,
                                  helperText: error?.message,
                                },
                              }}
                            />
                          )}
                        />
                      )}
                    </LocalizationProvider>
                    {hasPassportImage && (
                      <a
                        target="_blank"
                        style={{
                          textDecoration: "none",
                          position: "absolute",
                          marginTop: "45px",
                          fontSize: "xx-small",
                          marginRight: "10px",
                          backgroundColor: "#fafbfd",
                          padding: "0px 5px",
                        }}
                        href={hasPassportImage}
                      >
                        مشاهده تصویر
                      </a>
                    )}
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
              <Grid item xl={2} xs={10} md={5}>
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
                          handleChange(id, "phone_number", e.target.value);
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
              <Grid item xl={2} xs={10} md={5}>
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
                      handleChange(id, "citizenship", value);
                      if (value.fa_nationality !== "ایرانی") {
                        await setNationalRequired(false);
                      } else {
                        await setNationalRequired(true);
                      }
                      setCitizenSheep(value);
                      trigger();
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      autoComplete="off"
                      label="تابعیت"
                      variant="outlined"
                      // color="primary"
                      onChange={(e) => {
                        handleChange(id, "citizenship", e.target.value);
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
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </>
  );
};
