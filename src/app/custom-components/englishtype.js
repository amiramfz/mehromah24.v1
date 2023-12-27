export default function fixEnglish(input) {
  var letters = {
    ض: "q",
    ص: "w",
    ث: "e",
    ق: "r",
    ف: "t",
    غ: "y",
    ع: "u",
    ه: "i",
    خ: "o",
    ح: "p",
    ج: "[",
    چ: "]",
    ش: "a",
    س: "s",
    ی: "d",
    ب: "f",
    ل: "g",
    ا: "h",
    ت: "j",
    ن: "k",
    م: "l",
    ک: ";",
    گ: "'",
    ظ: "z",
    ط: "x",
    ز: "c",
    ر: "v",
    ذ: "b",
    د: "n",
    ئ: "m",
    و: ",",
    ژ: "C",
    آ: "H",
    ؤ: "A",
    ئ: "m",
    أ: "G",
    "«": "L",
    "»": "K",
    پ: "\\",
  };

  var output = "";

  for (var i = 0, il = input.length; i < il; i++) {
    output += letters[input.charAt(i)] || input.charAt(i);
  }

  return output.charAt(0).toUpperCase() + output.slice(1).toLowerCase();
}
