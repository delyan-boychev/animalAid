import { Form, FloatingLabel, Row, Col } from "react-bootstrap";
const daysTranslate = require("../../enums/daysTranslate");
export default function WorkingDay(props) {
  return (
    <div>
      <h5>{daysTranslate[props.day]}</h5>
      <hr />
      <Form.Group className="mb-3">
        <Form.Check
          label="Работен ден"
          id={`${props.day}-working`}
          type="checkbox"
          value={props.fields[props.day].working}
          onChange={props.onChange}
        />
      </Form.Group>
      Работа (Задължително)
      <Row>
        <Form.Group className="mb-3" as={Col}>
          <FloatingLabel controlId={`${props.day}-startHour`} label="Начало">
            <Form.Control
              placeholder="Начало"
              type="text"
              value={props.fields[props.day].startHour}
              onChange={props.onChange}
              disabled={props.fields[props.day].working === false}
            />
          </FloatingLabel>
          <span className="text-danger">
            {props.errors[props.day].startHour}
          </span>
        </Form.Group>
        <Form.Group className="mb-3" as={Col}>
          <FloatingLabel controlId={`${props.day}-endHour`} label="Край">
            <Form.Control
              placeholder="Край"
              type="text"
              value={props.fields[props.day].endHour}
              onChange={props.onChange}
              disabled={props.fields[props.day].working === false}
            />
          </FloatingLabel>
          <span className="text-danger">{props.errors[props.day].endHour}</span>
        </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Check
          label="Почивка (Опционално)"
          id={`${props.day}-pause`}
          type="checkbox"
          value={props.fields[props.day].pause}
          onChange={props.onChange}
          disabled={props.fields[props.day].working === false}
        />
      </Form.Group>
      <Row>
        <Form.Group className="mb-3" as={Col}>
          <FloatingLabel
            controlId={`${props.day}-pauseStartHour`}
            label="Начало"
          >
            <Form.Control
              placeholder="Начало"
              type="text"
              value={props.fields[props.day].pauseStartHour}
              onChange={props.onChange}
              disabled={
                props.fields[props.day].pause === false ||
                props.fields[props.day].working === false
              }
            />
          </FloatingLabel>
          <span className="text-danger">
            {props.errors[props.day].pauseStartHour}
          </span>
        </Form.Group>
        <Form.Group className="mb-3" as={Col}>
          <FloatingLabel controlId={`${props.day}-pauseEndHour`} label="Край">
            <Form.Control
              placeholder="Край"
              type="text"
              value={props.fields[props.day].pauseEndHour}
              onChange={props.onChange}
              disabled={
                props.fields[props.day].pause === false ||
                props.fields[props.day].working === false
              }
            />
          </FloatingLabel>
          <span className="text-danger">
            {props.errors[props.day].pauseEndHour}
          </span>
        </Form.Group>
      </Row>
      <span className="text-danger">{props.errors[props.day].timing}</span>
    </div>
  );
}
