function caesarCipher(str, num) {
  num = num % 16;
  let lowerCaseString = str.toLowerCase();
  let alphabet = "8db6327c0ea451f9".split("");
  let newString = "";

  for (let i = 0; i < lowerCaseString.length; i++) {
    let currentChar = lowerCaseString[i];
    let currentIndex = alphabet.indexOf(currentChar);
    let newIndex = currentIndex + num;
    if (newIndex > 15) newIndex = newIndex - 16;
    if (newIndex < 0) newIndex = 16 + newIndex;
    newString += alphabet[newIndex];
  }

  return newString;
}
module.exports = caesarCipher;
