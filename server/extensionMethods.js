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
(function () {
  if (typeof Object.defineProperty === "function") {
    try {
      Object.defineProperty(Array.prototype, "sortBy", { value: sb });
    } catch (e) {}
  }
  if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

  function sb(f) {
    let i;
    for (i = this.length; i; ) {
      var o = this[--i];
      this[i] = [].concat(f.call(o, o, i), o);
    }
    this.sort(function (a, b) {
      let len;
      for (i = 0, len = a.length; i < len; ++i) {
        if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
      }
      return 0;
    });
    for (i = this.length; i; ) {
      this[--i] = this[i][this[i].length - 1];
    }
    return this;
  }
})();
module.exports = {
  getAllIndexes,
  randomString,
  randomStringWithSpecialSymbols,
};
