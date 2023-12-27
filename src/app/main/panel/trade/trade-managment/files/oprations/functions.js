const moment = require("jalali-moment");

export const formatInputWithCommas = (input) => {
  if (!input) {
    return input;
  }
  const cleanValue = input.toString().replace(/[^\d]/g, "");
  const formattedValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedValue;
};

export const formatInputWithOutCommas = (input) => {
  if (!input) {
    return input;
  }
  const cleanValue = input.replace(/[^\d]/g, "");
  return cleanValue;
};

export function convertPersianToEnglishNumbers(input) {
  if (!input) {
    return input;
  }
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  for (let i = 0; i < persianDigits.length; i++) {
    const regex = new RegExp(persianDigits[i], "g");
    input = input.replace(regex, englishDigits[i]);
  }

  return input;
}
// "jYYYY/jM/jD, H:mm:ss"
export function convertJalalitoMiladiDate(input, format = "jYYYY/jMM/jDD") {
  if (!input) {
    return input;
  }
  const timeMoment = moment(convertPersianToEnglishNumbers(input), format);
  const gregorianTime = timeMoment.toDate();
  return gregorianTime;
}

export function convertMiladiToJalaliDate(input) {
  if (!input) {
    return input;
  }
  const gregorianDate = moment(convertPersianToEnglishNumbers(input));
  const shamsiDate = gregorianDate.format("jYYYY/jMM/jDD");
  return shamsiDate;
}

// for  convert created_at like this 2023-10-07T11:19:10.000000Z to like this  سه‌شنبه, 04 مهر 1402 ساعت 10:28
export function convertToPersianDate(input) {
  if (!input) {
    return input;
  }
  // Parse the input date
  const date = new Date(convertPersianToEnglishNumbers(input));
  // Convert to Persian (Jalali) date
  const persianDate = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);

  return persianDate;
}

// for get access
export function getAccessUser(
  goal = false,
  subgoal = false,
  dataAccess = false
) {
  // var dataAccess;
  // dataAccess = JSON.parse(access);
  if (!dataAccess.all) {
    if (goal) {
      if (dataAccess[goal]) {
        if (subgoal) {
          if (dataAccess[goal][subgoal]) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return true;
  }
}

// Function to format date from "1402-09-21" to "1402/09/21"
export function formatDateWithSlash(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${year}/${month}/${day}`;
}

// Function to format date from "1402/09/21" to "1402-09-21"
export function formatDateWithDash(dateString) {
  const [year, month, day] = dateString.split('/');
  return `${year}-${month}-${day}`;
}

export function getFullname(data, lang = "fa") {
  if (lang === "fa") {
    return data.last_name_fa !== null
      ? data.first_name_fa + " " + data.last_name_fa
      : data.first_name + " " + data.last_name;
    s;
  } else if (lang.id === "en") {
    return data.first_name + " " + data.last_name;
  }
}
