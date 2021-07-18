/*eslint no-extend-native: ["error", { "exceptions": ["Number"] }]*/
Number.prototype.pad = function(n) {
    return ('0' + this).slice((n||2)*-1);
}