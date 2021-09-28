import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router-dom";
import { postRequest } from "../clientRequests";
export default class VerifyProfile extends React.Component {
  constructor(props) {
    super(props);
    let urlParams = new URLSearchParams(window.location.search);
    this.state = {
      fields: {
        key: urlParams.get("key") ?? "",
      },
      verificationComplete: false,
      redirect: false,
    };
    this.verifyProfile();
  }
  verifyProfile = async () => {
    const key = this.state.fields.key;
    if (key !== "") {
      const verified = await postRequest("/user/verifyProfile", { key: key });
      if (verified) {
        this.setState({ verificationComplete: true });
      }
    }
  };
  render() {
    if (this.state.redirect === true) {
      return <Redirect to="/login"></Redirect>;
    }
    return (
      <div>
        {this.state.verificationComplete === true ? (
          <div>
            <h1 className="text-center">Профилът е потвърден успешно!</h1>
            <p
              style={{ fontSize: "150px" }}
              className="text-center text-primary"
            >
              <FontAwesomeIcon icon={faCheckCircle}></FontAwesomeIcon>
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-center">
              Линкът за потвърждаване на профила е невалиден!
            </h1>
            <p
              style={{ fontSize: "150px" }}
              className="text-center text-primary"
            >
              <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
            </p>
          </div>
        )}
      </div>
    );
  }
}
