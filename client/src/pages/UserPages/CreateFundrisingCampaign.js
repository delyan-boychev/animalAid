import React from "react";
import { Form, Col, Button, Row, FloatingLabel } from "react-bootstrap";
import InfoModal from "../../components/InfoModal";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageUploading from "react-images-uploading";
import Cropper from "react-easy-crop";
import PageTitle from "../../components/PageTitle";
import { faUpload, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
const client = require("../../clientRequests");
class CreateFundrisingCampaign extends React.Component {
  submitted = false;
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        title: "",
        shortDescription: "",
        fullDescription: "",
        value: "0",
        paypalDonationURL: "",
        image: null,
        imageCrop: {
          x: null,
          y: null,
          width: null,
          height: null,
        },
        images1: null,
        images2: null,
      },
      errors: {
        title: "",
        shortDescription: "",
        fullDescription: "",
        value: "",
        paypalDonationURL: "",
        image: "",
        images1: "",
        images2: "",
        isValid: false,
      },
      modal: {
        show: false,
        title: "Съобщение",
        body: "",
      },
      modal2: {
        show: false,
        title: "Изрязване на изображение",
        body: "",
      },
      crop: { x: 0, y: 0 },
      zoom: 1,
    };
  }
  componentDidMount() {
    document.title = "Създаване на кампания за набиране на средства";
  }
  submitForm = async (event) => {
    event.preventDefault();
    this.submitted = true;
    await this.validate();
    if (this.state.errors.isValid) {
      const fields = this.state.fields;
      this.setState({
        fields: {
          title: "",
          shortDescription: "",
          fullDescription: "",
          value: "0",
          paypalDonationURL: "",
          image: null,
          imageCrop: {
            x: null,
            y: null,
            width: null,
            height: null,
          },
          images1: null,
          images2: null,
        },
      });
      const response = await client.postRequestToken(
        "/fundrisingCampaign/createFundrisingCampaign",
        {
          title: fields.title,
          shortDescription: fields.shortDescription,
          fullDescription: fields.fullDescription,
          value: parseInt(fields.value),
          paypalDonationURL: fields.paypalDonationURL,
          mainPhotoDataURL: fields.image,
          mainPhotoCrop: fields.imageCrop,
          photosDataURL: fields.images1,
          documentsForPaymentDataURL: fields.images2,
        }
      );
      if (response === true) {
        this.openModal(
          "Кампанията за набиране на средства е създадена успешно!"
        );
      } else {
        this.openModal(
          "Не успяхме да създадем кампанията за набиране на средства!"
        );
      }
    } else {
      let keys = Object.keys(this.state.errors).filter((key) => {
        return this.state.errors[key] !== "" && key !== "isValid";
      });
      document.getElementById(keys[0]).scrollIntoView({ behavior: "smooth" });
    }
  };
  openModal = (body) => {
    let modal = this.state.modal;
    modal.show = true;
    modal.body = body;
    this.setState({ modal });
  };
  closeModal = () => {
    let modal = this.state.modal;
    modal.show = false;
    this.setState({ modal });
  };
  openModal2 = () => {
    let modal2 = this.state.modal2;
    modal2.show = true;
    this.setState({ modal2 });
  };
  closeModal2 = () => {
    let modal2 = this.state.modal2;
    modal2.show = false;
    this.setState({ modal2 });
  };
  async validate() {
    if (this.submitted === true) {
      let errors = {
        title: "",
        shortDescription: "",
        fullDescription: "",
        value: "",
        paypalDonationURL: "",
        image: this.state.errors.image,
        images1: this.state.errors.images1,
        images2: this.state.errors.images2,
        isValid: true,
      };
      const checkPaypalDonationURL =
        /^https:\/\/(www.)?paypal\.com\/donate(\/)?\?hosted_button_id=[-a-zA-Z0-9@:%._\\+~#?&/=]{2,}$/;
      let fields = this.state.fields;
      if (fields["title"].length < 5 || fields["title"].length > 50) {
        errors["title"] =
          "Заглавието трябва да бъде поне 5 символа и максимум 50 символа!";
        errors["isValid"] = false;
      }
      if (
        fields["shortDescription"].length < 20 ||
        fields["shortDescription"].length > 200
      ) {
        errors["shortDescription"] =
          "Краткото описание трябва да бъде поне 20 символа и максимум 200 символа!";
        errors["isValid"] = false;
      }
      if (
        fields["fullDescription"].length < 100 ||
        fields["fullDescription"].length > 1500
      ) {
        errors["fullDescription"] =
          "Пълното описание трябва да бъде поне 100 символа и максимум 1500 символа!";
        errors["isValid"] = false;
      }
      if (parseInt(fields["value"]) < 20 || parseInt(fields["value"]) > 1000) {
        errors["value"] =
          "Стойността на средствата трябва да бъде не по-малка от 20 лева и не по-голяма от 1000 лева!";
        errors["isValid"] = false;
      }
      if (!checkPaypalDonationURL.test(fields["paypalDonationURL"])) {
        errors["paypalDonationURL"] =
          "Линкът за дарение в Paypal трябва да изглежда по следният начин: https://paypal.com/donate?hosted_button_id=<идентификационен номер>";
        errors["isValid"] = false;
      }
      if (errors["image"] !== "") {
        errors["isValid"] = false;
      } else if (fields["image"] === null || fields["image"] === undefined) {
        errors["image"] = "Не сте прикачили изображение!";
        errors["isValid"] = false;
      }
      if (errors["images1"] !== "") {
        errors["isValid"] = false;
      } else if (
        fields["images1"] === null ||
        fields["images1"] === undefined
      ) {
        errors["images1"] = "Не сте прикачили изображения!";
        errors["isValid"] = false;
      }
      if (errors["images2"] !== "") {
        errors["isValid"] = false;
      } else if (
        fields["images2"] === null ||
        fields["images2"] === undefined
      ) {
        errors["images2"] = "Не сте прикачили изображения!";
        errors["isValid"] = false;
      }
      await this.setState({ errors });
    }
  }
  onImageChange = (image) => {
    if (image[0] !== undefined) {
      let fields = this.state.fields;
      fields["image"] = image[0].data_url;
      let errors = this.state.errors;
      errors["image"] = "";
      this.setState({ fields, errors });
    } else {
      let fields = this.state.fields;
      fields["image"] = null;
      this.setState({ fields });
    }
    this.validate();
    if (this.state.fields.image !== null) {
      this.openModal2();
    }
  };
  onCropChange = (crop) => {
    this.setState({ crop });
  };

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    let fields = this.state.fields;
    fields.imageCrop = croppedAreaPixels;
    this.setState({ fields });
  };

  onZoomChange = (zoom) => {
    this.setState({ zoom });
  };
  handleOnChangeValue = (event) => {
    let fields = this.state.fields;
    fields[event.target.id] = event.target.value;
    this.setState({ fields });
    this.validate();
  };
  onError = (error) => {
    if (error["acceptType"]) {
      let errors = this.state.errors;
      errors["image"] = "Неподдържан файлов формат!";
      this.setState({ errors });
    } else if (error["maxFileSize"]) {
      let errors = this.state.errors;
      errors["image"] = "Файлът трябва да е по-малък от 1MB!";
      this.setState({ errors });
    }
    this.validate();
  };
  onImagesChange1 = (images) => {
    if (images.length > 0) {
      let fields = this.state.fields;
      fields["images1"] = images.map((img) => {
        return img.data_url;
      });
      let errors = this.state.errors;
      errors["images1"] = "";
      this.setState({ fields, errors });
    } else {
      let fields = this.state.fields;
      fields["images1"] = null;
      let errors = this.state.errors;
      errors.images1 = "";
      this.setState({ fields, errors });
    }
    this.validate();
  };
  onError1 = (error) => {
    if (error["acceptType"]) {
      let errors = this.state.errors;
      errors["images1"] = "Неподдържан файлов формат!";
      this.setState({ errors });
    } else if (error["maxFileSize"]) {
      let errors = this.state.errors;
      errors["images1"] = "Файловете трябва да са по-малки от 1MB!";
      this.setState({ errors });
    } else if (error["maxNumber"]) {
      let errors = this.state.errors;
      errors["images1"] = "Можете да прикачите най-много 5 снимки!";
      this.setState({ errors });
    }
    this.validate();
  };
  onImagesChange2 = (images) => {
    if (images.length > 0) {
      let fields = this.state.fields;
      fields["images2"] = images.map((img) => {
        return img.data_url;
      });
      let errors = this.state.errors;
      errors["images2"] = "";
      this.setState({ fields, errors });
    } else {
      let fields = this.state.fields;
      fields["images2"] = null;
      let errors = this.state.errors;
      errors.images2 = "";
      this.setState({ fields, errors });
    }
    this.validate();
  };
  onError2 = (error) => {
    if (error["acceptType"]) {
      let errors = this.state.errors;
      errors["images2"] = "Неподдържан файлов формат!";
      this.setState({ errors });
    } else if (error["maxFileSize"]) {
      let errors = this.state.errors;
      errors["images2"] = "Файловете трябва да са по-малки от 1MB!";
      this.setState({ errors });
    } else if (error["maxNumber"]) {
      let errors = this.state.errors;
      errors["images2"] = "Можете да прикачите най-много 5 снимки!";
      this.setState({ errors });
    }
    this.validate();
  };
  render() {
    return (
      <div>
        <PageTitle title="Създаване на кампания за набиране на средства" />
        <InfoModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></InfoModal>
        <InfoModal
          body={
            <div style={{ height: "500px" }}>
              <Cropper
                image={
                  this.state.fields.image !== null
                    ? this.state.fields.image
                    : null
                }
                crop={this.state.crop}
                zoom={this.state.zoom}
                aspect={1 / 1}
                onCropChange={this.onCropChange}
                onCropComplete={this.onCropComplete}
                onZoomChange={this.onZoomChange}
              />
            </div>
          }
          show={this.state.modal2.show}
          title={this.state.modal2.title}
          closeModal={this.closeModal2}
        ></InfoModal>
        <Form onSubmit={this.submitForm}>
          <Row className="mb-3">
            <Form.Group>
              <FloatingLabel controlId="title" label="Заглавие">
                <Form.Control
                  placeholder="Заглавие"
                  type="text"
                  value={this.state.fields.title}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">{this.state.errors.title}</span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group>
              <FloatingLabel
                controlId="shortDescription"
                label="Кратко описание"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Кратко описание"
                  onChange={this.handleOnChangeValue}
                  value={this.state.fields.shortDescription}
                  style={{ resize: "none", height: "150px" }}
                />
              </FloatingLabel>
              <span className="text-danger">
                {this.state.errors.shortDescription}
              </span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group>
              <FloatingLabel controlId="fullDescription" label="Пълно описание">
                <Form.Control
                  as="textarea"
                  placeholder="Пълно описание"
                  onChange={this.handleOnChangeValue}
                  value={this.state.fields.fullDescription}
                  style={{ resize: "none", height: "220px" }}
                />
              </FloatingLabel>
              <span className="text-danger">
                {this.state.errors.fullDescription}
              </span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group>
              <FloatingLabel controlId="value" label="Стойност в лева">
                <Form.Control
                  placeholder="Стойност в лева"
                  type="number"
                  value={this.state.fields.value}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">{this.state.errors.value}</span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group>
              <FloatingLabel
                controlId="paypalDonationURL"
                label="Линк за дарение в Paypal"
              >
                <Form.Control
                  placeholder="Линк за дарение в Paypal"
                  type="text"
                  value={this.state.fields.paypalDonationURL}
                  onChange={this.handleOnChangeValue}
                />
              </FloatingLabel>
              <span className="text-danger">
                {this.state.errors.paypalDonationURL}
              </span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="image">
              <Form.Label>Заглавна снимка</Form.Label>
              <br />
              <ImageUploading
                className="mt-3"
                maxNumber={1}
                maxFileSize={1048576}
                onError={this.onError}
                acceptType={["png", "jpg", "jpeg", "webp"]}
                onChange={this.onImageChange}
                dataURLKey="data_url"
              >
                {({
                  onImageUpload,
                  onImageRemoveAll,
                  isDragging,
                  dragProps,
                }) => (
                  <div className="upload__image-wrapper d-flex">
                    <Button
                      style={
                        isDragging ? { backgroundColor: "red" } : undefined
                      }
                      className="mt-3 me-3"
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                    </Button>
                    <Button className="mt-3" onClick={onImageRemoveAll}>
                      <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                    </Button>
                  </div>
                )}
              </ImageUploading>
              <span className="text-danger">{this.state.errors.image}</span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="images1">
              <Form.Label>Допълнителни снимки</Form.Label>
              <br />
              <ImageUploading
                className="mt-3"
                maxNumber={5}
                multiple={true}
                maxFileSize={1048576}
                onError={this.onError1}
                acceptType={["png", "jpg", "jpeg", "webp"]}
                onChange={this.onImagesChange1}
                dataURLKey="data_url"
              >
                {({
                  onImageUpload,
                  onImageRemoveAll,
                  isDragging,
                  dragProps,
                }) => (
                  <div className="upload__image-wrapper d-flex">
                    <Button
                      style={
                        isDragging ? { backgroundColor: "red" } : undefined
                      }
                      className="mt-3 me-3"
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                    </Button>
                    <Button className="mt-3" onClick={onImageRemoveAll}>
                      <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                    </Button>
                  </div>
                )}
              </ImageUploading>
              <span className="text-danger">{this.state.errors.images1}</span>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="images2">
              <Form.Label>
                Снимки на документи удостоверяващи плащанията
              </Form.Label>
              <br />
              <ImageUploading
                className="mt-3"
                maxNumber={5}
                multiple={true}
                maxFileSize={1048576}
                onError={this.onError2}
                acceptType={["png", "jpg", "jpeg", "webp"]}
                onChange={this.onImagesChange2}
                dataURLKey="data_url"
              >
                {({
                  onImageUpload,
                  onImageRemoveAll,
                  isDragging,
                  dragProps,
                }) => (
                  <div className="upload__image-wrapper d-flex">
                    <Button
                      style={
                        isDragging ? { backgroundColor: "red" } : undefined
                      }
                      className="mt-3 me-3"
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                    </Button>
                    <Button className="mt-3" onClick={onImageRemoveAll}>
                      <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                    </Button>
                  </div>
                )}
              </ImageUploading>
              <span className="text-danger">{this.state.errors.images2}</span>
            </Form.Group>
          </Row>
          <Button variant="primary" type="submit">
            Създаване на кампания
          </Button>
        </Form>
      </div>
    );
  }
}
function WithNavigate(props) {
  let navigate = useNavigate();
  return <CreateFundrisingCampaign {...props} navigate={navigate} />;
}
export default WithNavigate;
