function hoursToNum(string) {
  let splitString = string.split(":");
  try {
    return parseInt(splitString[0]) + parseInt(splitString[1]) / 60;
  } catch {
    return 0;
  }
}
function numToHours(num) {
  let hours = parseInt(num).toString();
  let minutes = parseInt((num % 1) * 60).toString();
  return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`;
}
module.exports = { hoursToNum, numToHours };
