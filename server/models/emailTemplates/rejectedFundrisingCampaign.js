const rejectedFundrisingCampaign = (fname, titleCampaign, rejectedComment) => {
  return `<img src="https://animalaidbg.com/images/logoReverse.webp" style="background-color: transparent;" height="80"/><p>Здравейте ${fname},<br> Уведомяваме Ви, че кампанията Ви за набиране на средства, ${titleCampaign}, е отхвърлена! Открити са забележки по кампанията Ви. Модераторите са оставили следният коментар - ${rejectedComment}. Моля поправете това, което е описано в забележките и ни изпратете заявка за проверка! <br>Поздрави,<br>Екипът на Animal Aid</p>`;
};
module.exports = rejectedFundrisingCampaign;
