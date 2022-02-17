const BASE_URL = require("../../config.json").BASE_URL;
const forgotPasswordEmail = (token) => {
  return `<img src="https://animalaidbg.com/images/logoReverse.webp" height="80"/><p>Здравейте, <br> Беше изпратена заявка за забравена парола! За да смените паролата си кликнете <a href="${BASE_URL}/changeForgotPassword?token=${token}">тук</a>.<br>Поздрави,<br>Екипът на Animal Aid</p>`;
};
module.exports = forgotPasswordEmail;
