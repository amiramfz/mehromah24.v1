export default function fixPersian(input) {
  input = input.toLowerCase();
  var letters = {
    q: "ض",
    w: "ص",
    e: "ث",
    r: "ق",
    t: "ف",
    y: "غ",
    u: "ع",
    i: "ه",
    o: "خ",
    p: "ح",
    "[": "ج",
    "]": "چ",
    a: "ش",
    s: "س",
    d: "ی",
    f: "ب",
    g: "ل",
    h: "ا",
    j: "ت",
    k: "ن",
    l: "م",
    ";": "ک",
    "'": "گ",
    z: "ظ",
    x: "ط",
    c: "ز",
    v: "ر",
    b: "ذ",
    n: "د",
    m: "ئ",
    ",": "و",
    C: "ژ",
    H: "ا",
    A: "ؤ",
    S: "ئ",
    G: "أ",
    L: "«",
    K: "»",
    "\\": "پ",
  };

  var output = "";

  for (var i = 0, il = input.length; i < il; i++) {
    output += letters[input.charAt(i)] || input.charAt(i);
  }

  return output;
}
