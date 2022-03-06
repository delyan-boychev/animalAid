import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faCircleCheck,
  faCircleXmark,
  faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";
export default function CampaignStatusAdminModeratorPanel(props) {
  if (props.moderationVerified === true) {
    if (props.completed === true) {
      return (
        <span className="text-danger">
          <FontAwesomeIcon icon={faFlagCheckered} /> Кампанията е приключила!
        </span>
      );
    } else {
      return (
        <span className="text-primary">
          <FontAwesomeIcon icon={faCircleCheck} /> Кампанията е активна!
        </span>
      );
    }
  } else {
    if (props.completed === true) {
      return (
        <span className="text-danger">
          <FontAwesomeIcon icon={faFlagCheckered} /> Кампанията е приключила!
        </span>
      );
    } else if (props.rejectedComment === "") {
      return (
        <span className="text-warning">
          <FontAwesomeIcon icon={faEye} /> Кампанията чака одобрение!
        </span>
      );
    } else {
      return (
        <span className="text-danger">
          <FontAwesomeIcon icon={faCircleXmark} /> Кампанията е отхвърлена!
        </span>
      );
    }
  }
}
