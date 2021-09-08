const BASE_URL = require("../../config.json").BASE_URL;
const verifyProfileUser = (fname, key)=>
{
    return `<p>Здравейте ${fname},<br> Вашият потребителски профил в платформата Animal Aid е създаден успешно! За да потвърдите профила си може да кликнете <a href="${BASE_URL}/verifyProfile?key=${key}">тук</a>.<br>Поздрави,<br>Екипът на Animal Aid</p>`;
}
const verifyProfileVet = (fname, key)=>
{
    return `<p>Здравейте ${fname},<br> Вашият профил като ветеринар в платформата Animal Aid е създаден успешно! Нужно е да изчакате модератор да провери Вашата самоличност и диплома. Това може да отнеме до няколко дни! За да потвърдите профила си може да кликнете <a href="${BASE_URL}/verifyProfile?key=${key}">тук</a>.<br>Поздрави,<br>Екипът на Animal Aid</p>`;
}
const verifyProfileChangeEmail = (key)=>
{
    return `<p>Здравейте, <br> Вие посочихте, че искате да използвате този имейл занапред в платформата на AnimalAid! За да потвърдите профила си може да кликнете <a href="${BASE_URL}/verifyProfile?key=${key}">тук</a>.<br>Поздрави,<br>Екипът на Animal Aid</p>`;
}
module.exports = {
    verifyProfileUser, verifyProfileVet, verifyProfileChangeEmail
}