const moment = require("jalali-moment");

function persianToEnglishNumber(persianText) {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  if (persianText !== null) {
    return persianText.replace(/[۰-۹]/g, function (match) {
      return persianNumbers.indexOf(match).toString();
    });
  } else {
    return persianText;
  }
}

export default function calculateAgeCategory(jalaliBirthday) {
  if (jalaliBirthday !== null) {
    // Parse the Jalali date
    const birthdayMoment = moment(
      persianToEnglishNumber(jalaliBirthday),
      "jYYYY/jMM/jDD"
    );

    // Convert the Jalali date to Gregorian
    const gregorianBirthday = birthdayMoment.toDate();

    // Calculate the age in days
    const today = new Date();
    const ageInMilliseconds = today - gregorianBirthday;
    const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));

    // Determine the age category
    let category;

    if (ageInDays > 4380) {
      category = "ADU";
    } else if (ageInDays >= 730 && ageInDays < 4380) {
      category = "CHI";
    } else {
      category = "INF";
    }
    return category;
  } else {
    return "ADU";
  }
}
