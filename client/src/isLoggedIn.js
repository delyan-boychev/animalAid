import Cookies from "universal-cookie";
const isLoggedIn = () => {
  const cookies = new Cookies();
  return (
    cookies.get("authorization") !== undefined &&
    cookies.get("validity") !== undefined
  );
};
export default isLoggedIn;
