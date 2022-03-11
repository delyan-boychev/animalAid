require("../../extensionMethods");
const formatDate = (date) => {
  return `${date.getDate().pad()}-${(
    date.getMonth() + 1
  ).pad()}-${date.getFullYear()}`;
};
function numToHours(num) {
  let hours = parseInt(num).toString();
  let minutes = parseInt((num % 1) * 60).toString();
  return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`;
}
const appointmentRejected = (fName, vetName, startHour, endHour, date) => {
  return `<img src="https://animalaidbg.com/images/logoReverse.webp" style="background-color: transparent;" height="80"/><p>Здравейте ${fName},<br> Уведомяваме Ви, че часът Ви при ветеринарния лекар ${vetName} на ${formatDate(
    date
  )} от ${numToHours(startHour)}ч. до ${numToHours(
    endHour
  )}ч. е отменен! <br>Поздрави,<br>Екипът на Animal Aid</p>`;
};
const appointmentConfirmed = (fName, vetName, startHour, endHour, date) => {
  return `<img src="https://animalaidbg.com/images/logoReverse.webp" style="background-color: transparent;" height="80"/><p>Здравейте ${fName},<br> Уведомяваме Ви, че часът Ви при ветеринарния лекар ${vetName} на ${formatDate(
    date
  )} от ${numToHours(startHour)}ч. до ${numToHours(
    endHour
  )}ч. е потвърден успешно! <br>Поздрави,<br>Екипът на Animal Aid</p>`;
};
module.exports = { appointmentConfirmed, appointmentRejected };
