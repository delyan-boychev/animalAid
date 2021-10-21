const formatString = (date) => {
  return `${date.getDate().pad()}-${(
    date.getMonth() + 1
  ).pad()}-${date.getFullYear()} ${date.getHours().pad()}:${date
    .getMinutes()
    .pad()}:${date.getSeconds().pad()}ч.`;
};
module.exports = formatString;
