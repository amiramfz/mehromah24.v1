const moment = require("jalali-moment");

export const formatInputWithCommas = (input) => {
  const cleanValue = input.replace(/[^\d]/g, "");
  const formattedValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedValue;
};

export const formatInputWithOutCommas = (input) => {
  const cleanValue = input.replace(/[^\d]/g, "");
  return cleanValue;
};

export function convertPersianToEnglishNumbers(inputString) {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  for (let i = 0; i < persianDigits.length; i++) {
    const regex = new RegExp(persianDigits[i], "g");
    inputString = inputString.replace(regex, englishDigits[i]);
  }

  return inputString;
}
// "jYYYY/jM/jD, H:mm:ss"
export function convertJalalitoMiladiDate(input, format = "jYYYY/jMM/jDD") {
  const timeMoment = moment(convertPersianToEnglishNumbers(input), format);
  const gregorianTime = timeMoment.toDate();
  return gregorianTime;
}

export function convertMiladiToJalaliDate(input, format = "jYYYY/jMM/jDD") {
  const gregorianDate = moment(convertPersianToEnglishNumbers(input));
  const shamsiDate = gregorianDate.format(format);
  return shamsiDate;
}
// for  convert created_at like this 2023-10-07T11:19:10.000000Z to like this  سه‌شنبه, 04 مهر 1402 ساعت 10:28
export function convertToPersianDate(inputDate) {
  // Parse the input date
  const date = new Date(convertPersianToEnglishNumbers(inputDate));
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
