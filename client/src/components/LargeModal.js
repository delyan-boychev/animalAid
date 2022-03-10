import { Modal, Button } from "react-bootstrap";
export default function LargeModal(props) {
  return (
    <Modal size="xl" show={props.show} onHide={props.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={props.closeModal}>
          Затвори
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
