import { Modal, Button } from "react-bootstrap";
export default function DialogModal(props) {
  let onAccept = () => {
    props.closeModal();
    props.task();
  };
  return (
    <Modal show={props.show} onHide={props.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.closeModal}>
          Не
        </Button>
        <Button variant="primary" onClick={onAccept}>
          Да
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
