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
module.exports = { getAllIndexes, randomString };
