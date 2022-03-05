const crypto = require("crypto");
const key = require("./config.json").TOKEN_ENCRYPTION.key;
const encryptToken = (token) => {
  const iv = crypto.randomBytes(16).toString("hex");
  const cipher = crypto.createCipheriv(
    "aes128",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
  return caesarCipher(iv + encrypted.toString("hex"), 17);
};
const decryptToken = (token) => {
  try {
    token = caesarCipher(token, -17);
    const iv = token.slice(0, 32);
    const forDecrypt = token.slice(32);
    const decipher = crypto.createDecipheriv(
      "aes128",
      Buffer.from(key, "hex"),
      Buffer.from(iv, "hex")
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(forDecrypt, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString();
  } catch {
    return "";
  }
};
function caesarCipher(str, num) {
  num = num % 16;
  let lowerCaseString = str.toLowerCase();
  let alphabet = "0123456789abcdef".split("");
  let newString = "";

  for (let i = 0; i < lowerCaseString.length; i++) {
    let currentChar = lowerCaseString[i];
    if (currentChar === " ") {
      newString += currentChar;
      continue;
    }
    let currentIndex = alphabet.indexOf(currentChar);
    let newIndex = currentIndex + num;
    if (newIndex > 15) newIndex = newIndex - 16;
    if (newIndex < 0) newIndex = 16 + newIndex;
    newString += alphabet[newIndex];
  }

  return newString;
}
module.exports = { encryptToken, decryptToken };
