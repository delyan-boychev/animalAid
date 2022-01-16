import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { postRequest } from "../clientRequests";
export default class VerifyProfile extends React.Component {
  constructor(props) {
    super(props);
    let urlParams = new URLSearchParams(window.location.search);
    this.state = {
      fields: {
        key: urlParams.get("key") ?? "",
      },
      verificationComplete: null,
    };
  }
  componentDidMount() {
    this.verifyProfile();
  }
  verifyProfile = async () => {
    const key = this.state.fields.key;
    if (key !== "") {
      const verified = await postRequest("/user/verifyProfile", { key: key });
      this.setState({ verificationComplete: verified });
    } else {
      this.setState({ verificationComplete: false });
    }
  };
  render() {
    return (
      <div>
        <div hidden={this.state.verificationComplete !== true}>
          <h1 className="text-center">Профилът е потвърден успешно!</h1>
          <p style={{ fontSize: "150px" }} className="text-center text-primary">
            <FontAwesomeIcon icon={faCheckCircle}></FontAwesomeIcon>
          </p>
        </div>
        <div hidden={this.state.verificationComplete === null}>
          <h1 className="text-center">
            Линкът за потвърждаване на профила е невалиден!
          </h1>
          <p style={{ fontSize: "150px" }} className="text-center text-primary">
            <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
          </p>
        </div>
      </div>
    );
  }
}
