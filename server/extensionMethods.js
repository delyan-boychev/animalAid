function getAllIndexes(arr, key, val) {
  var indexes = [],
    i;
  for (i = 0; i < arr.length; i++) if (arr[i][key] === val) indexes.push(i);
  return indexes;
}
function randomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function randomStringWithSpecialSymbols(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
/**
 * Get page from array
 * @param {Object[]} arr
 * @param {Number} numPerPage
 * @param {Number} pageNum
 * @param {String} nameEl
 * @returns {{}|Boolean}
 */
function getPageFromArr(arr, numPerPage, pageNum, nameEl) {
  const startIndex = pageNum * numPerPage - numPerPage;
  const endIndex = pageNum * numPerPage;
  const numPages = Math.ceil(arr.length / numPerPage);
  let page = { numPages };
  if (
    pageNum < 1 ||
    (arr.length < endIndex && arr.length < startIndex) ||
    pageNum > numPages
  ) {
    return false;
  } else if (arr.length < endIndex && arr.length > startIndex) {
    page[nameEl] = arr.slice(startIndex, arr.length);
  } else {
    page[nameEl] = arr.slice(startIndex, endIndex);
  }
  return page;
}
/*eslint no-extend-native: ["error", { "exceptions": ["Number"] }]*/
Number.prototype.pad = function (n) {
  return ("0" + this).slice((n || 2) * -1);
};
module.exports = {
  getAllIndexes,
  randomString,
  randomStringWithSpecialSymbols,
  getPageFromArr,
};
