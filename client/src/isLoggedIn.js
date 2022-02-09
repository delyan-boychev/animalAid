import Cookies from "universal-cookie";
function isLoggedIn() {
  const cookies = new Cookies();
  return (
    cookies.get("authorization") !== undefined &&
    cookies.get("validity") !== undefined
  );
}
module.exports = isLoggedIn;
