function getAllIndexes(arr, key, val) {
  var indexes = [],
    i;
  for (i = 0; i < arr.length; i++) if (arr[i][key] === val) indexes.push(i);
  return indexes;
}
module.exports = { getAllIndexes };
