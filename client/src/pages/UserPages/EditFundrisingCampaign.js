import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrashAlt, faPen } from "@fortawesome/free-solid-svg-icons";
import {
  Row,
  FloatingLabel,
  Form,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";
import ImageUploading from "react-images-uploading";
import Cropper from "react-easy-crop";
import PageTitle from "../../components/PageTitle";
import InfoModal from "../../components/InfoModal";
import LargeModal from "../../components/LargeModal";
const client = require("../../clientRequests");
export default class EditFundrisingCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      campaign: {
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
      lastCampaign: {
        title: "",
        shortDescription: "",
        fullDescription: "",
        value: "0",
        paypalDonationURL: "",
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
    document.title = "Редактиране на кампания за набиране на средства";
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id !== null) {
      this.getInfo(id);
    } else {
      window.location.href = "/";
    }
  }
  async getInfo(id) {
    const res = await client.getRequestToken(
      `/fundrisingCampaign/getMyCampaign/${id}`
    );
    if (res !== false) {
      if (res.rejectedComment !== "") {
        res.image = null;
        res.images1 = null;
        res.images2 = null;
        res.value = res.value.toString();
        res.imageCrop = { x: null, y: null, width: null, height: null };
        this.setState({
          campaign: res,
          id,
          lastCampaign: {
            title: res.title,
            shortDescription: res.shortDescription,
            fullDescription: res.fullDescription,
            value: res.value.toString(),
            paypalDonationURL: res.paypalDonationURL,
          },
        });
      } else {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/";
    }
  }
  handleOnChangeValue = (event) => {
    let fields = this.state.campaign;
    fields[event.target.id] = event.target.value;
    this.setState({ fields });
    this.validate();
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
    this.getInfo(this.state.id);
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
  onEditButtonClick = async (event) => {
    let button = event.currentTarget.id.replace("_button", "");
    let body = {};
    switch (button) {
      case "mainPhotoDataURL":
        if (this.state.errors.image === "") {
          body = {
            mainPhotoDataURL: this.state.campaign.image,
            mainPhotoCrop: this.state.campaign.imageCrop,
          };
        } else {
          return;
        }
        break;
      case "photosDataURL":
        if (this.state.errors.images1 === "") {
          body = { photosDataURL: this.state.campaign.images1 };
        } else {
          return;
        }
        break;
      case "documentsForPaymentDataURL":
        if (this.state.errors.images2 === "") {
          body = { documentsForPaymentDataURL: this.state.campaign.images2 };
        } else {
          return;
        }
        break;
      case "value":
        if (this.state.errors.value === "") {
          body = { value: parseInt(this.state.campaign.value) };
        } else {
          return;
        }
        break;
      default:
        if (this.state.errors[button] === "") {
          body[button] = this.state.campaign[button];
        } else {
          return;
        }
    }
    body["campaignId"] = this.state.id;
    let res = await client.postRequestToken(
      `/fundrisingCampaign/editCampaign/${button}`,
      body
    );
    if (res === true) {
      this.openModal("Редакцията е успешна!");
    } else {
      this.openModal(
        "Възникна грешка при редакция! Извиняваме се за неудобството!"
      );
    }
  };
  async validate() {
    let errors = {
      title: "",
      shortDescription: "",
      fullDescription: "",
      value: "",
      paypalDonationURL: "",
      image: this.state.errors.image,
      images1: this.state.errors.images1,
      images2: this.state.errors.images2,
    };
    const checkPaypalDonationURL =
      /^https:\/\/(www.)?paypal\.com\/donate(\/)?\?hosted_button_id=[-a-zA-Z0-9@:%._\\+~#?&/=]{2,}$/;
    let fields = this.state.campaign;
    if (fields["title"].length < 5 || fields["title"].length > 50) {
      errors["title"] =
        "Заглавието трябва да бъде поне 5 символа и максимум 50 символа!";
    }
    if (
      fields["shortDescription"].length < 20 ||
      fields["shortDescription"].length > 200
    ) {
      errors["shortDescription"] =
        "Краткото описание трябва да бъде поне 20 символа и максимум 200 символа!";
    }
    if (
      fields["fullDescription"].length < 100 ||
      fields["fullDescription"].length > 1500
    ) {
      errors["fullDescription"] =
        "Пълното описание трябва да бъде поне 100 символа и максимум 1500 символа!";
    }
    if (parseInt(fields["value"]) < 20 || parseInt(fields["value"]) > 1000) {
      errors["value"] =
        "Стойността на средствата трябва да бъде не по-малка от 20 лева и не по-голяма от 1000 лева!";
    }
    if (!checkPaypalDonationURL.test(fields["paypalDonationURL"])) {
      errors["paypalDonationURL"] =
        "Линкът за дарение в Paypal трябва да изглежда по следният начин: https://paypal.com/donate?hosted_button_id=<идентификационен номер>";
    }
    if (
      (fields["image"] === null || fields["image"] === undefined) &&
      errors["image"] === ""
    ) {
      errors["image"] = "NOT_UPLOADED";
    }
    if (
      (fields["images1"] === null || fields["images1"] === undefined) &&
      errors["images1"] === ""
    ) {
      errors["images1"] = "NOT_UPLOADED";
    }
    if (
      (fields["images2"] === null || fields["images2"] === undefined) &&
      errors["images2"] === ""
    ) {
      errors["images2"] = "NOT_UPLOADED";
    }
    await this.setState({ errors });
  }
  onImageChange = (image) => {
    if (image[0] !== undefined) {
      let fields = this.state.campaign;
      fields["image"] = image[0].data_url;
      let errors = this.state.errors;
      errors["image"] = "";
      this.setState({ fields, errors });
    } else {
      let fields = this.state.campaign;
      fields["image"] = null;
      this.setState({ fields });
    }
    this.validate();
    if (this.state.campaign.image !== null) {
      this.openModal2();
    }
  };
  onCropChange = (crop) => {
    this.setState({ crop });
  };

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    let fields = this.state.campaign;
    fields.imageCrop = croppedAreaPixels;
    this.setState({ fields });
  };

  onZoomChange = (zoom) => {
    this.setState({ zoom });
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
      let fields = this.state.campaign;
      fields["images1"] = images.map((img) => {
        return img.data_url;
      });
      let errors = this.state.errors;
      errors["images1"] = "";
      this.setState({ fields, errors });
    } else {
      let fields = this.state.campaign;
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
      let fields = this.state.campaign;
      fields["images2"] = images.map((img) => {
        return img.data_url;
      });
      let errors = this.state.errors;
      errors["images2"] = "";
      this.setState({ fields, errors });
    } else {
      let fields = this.state.campaign;
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
        <PageTitle title="Редактиране на кампания за набиране на средства" />
        <InfoModal
          show={this.state.modal.show}
          title={this.state.modal.title}
          body={this.state.modal.body}
          closeModal={this.closeModal}
        ></InfoModal>
        <LargeModal
          body={
            <div className="cropper">
              <Cropper
                image={
                  this.state.campaign.image !== null
                    ? this.state.campaign.image
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
        ></LargeModal>
        <div className="text-center" hidden={this.state.campaign.title !== ""}>
          <Spinner animation="border" variant="primary" role="status"></Spinner>
        </div>
        <div hidden={this.state.campaign.title === ""}>
          <Row className="mb-3">
            <div className="d-flex">
              <Form.Group className="flex-fill">
                <FloatingLabel controlId="title" label="Заглавие">
                  <Form.Control
                    placeholder="Заглавие"
                    type="text"
                    value={this.state.campaign.title}
                    onChange={this.handleOnChangeValue}
                  />
                </FloatingLabel>
                <span className="text-danger">{this.state.errors.title}</span>
              </Form.Group>
              <Button
                variant="primary"
                id="title_button"
                onClick={this.onEditButtonClick}
                className="align-self-center ms-2"
                disabled={
                  this.state.errors.title !== "" ||
                  this.state.lastCampaign.title === this.state.campaign.title
                }
              >
                <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
              </Button>
            </div>
          </Row>
          <Row className="mb-3">
            <div className="d-flex">
              <Form.Group className="flex-fill">
                <FloatingLabel
                  controlId="shortDescription"
                  label="Кратко описание"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="Кратко описание"
                    onChange={this.handleOnChangeValue}
                    value={this.state.campaign.shortDescription}
                  />
                </FloatingLabel>
                <span className="text-danger">
                  {this.state.errors.shortDescription}
                </span>
              </Form.Group>
              <Button
                variant="primary"
                id="shortDescription_button"
                onClick={this.onEditButtonClick}
                className="align-self-end ms-2"
                disabled={
                  this.state.errors.shortDescription !== "" ||
                  this.state.lastCampaign.shortDescription ===
                    this.state.campaign.shortDescription
                }
              >
                <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
              </Button>
            </div>
          </Row>
          <Row className="mb-3">
            <div className="d-flex">
              <Form.Group className="flex-fill">
                <FloatingLabel
                  controlId="fullDescription"
                  label="Пълно описание"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="Пълно описание"
                    onChange={this.handleOnChangeValue}
                    value={this.state.campaign.fullDescription}
                  />
                </FloatingLabel>
                <span className="text-danger">
                  {this.state.errors.fullDescription}
                </span>
              </Form.Group>
              <Button
                variant="primary"
                id="fullDescription_button"
                onClick={this.onEditButtonClick}
                className="align-self-end ms-2"
                disabled={
                  this.state.errors.fullDescription !== "" ||
                  this.state.lastCampaign.fullDescription ===
                    this.state.campaign.fullDescription
                }
              >
                <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
              </Button>
            </div>
          </Row>
          <Row className="mb-3">
            <div className="d-flex">
              <Form.Group className="flex-fill">
                <FloatingLabel controlId="value" label="Стойност в лева">
                  <Form.Control
                    placeholder="Стойност в лева"
                    type="number"
                    value={this.state.campaign.value}
                    onChange={this.handleOnChangeValue}
                  />
                </FloatingLabel>
                <span className="text-danger">{this.state.errors.value}</span>
              </Form.Group>
              <Button
                variant="primary"
                id="value_button"
                onClick={this.onEditButtonClick}
                className="align-self-center ms-2"
                disabled={
                  this.state.errors.value !== "" ||
                  this.state.lastCampaign.value === this.state.campaign.value
                }
              >
                <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
              </Button>
            </div>
          </Row>
          <Row className="mb-3">
            <div className="d-flex">
              <Form.Group className="flex-fill">
                <FloatingLabel
                  controlId="paypalDonationURL"
                  label="Линк за дарение в Paypal"
                >
                  <Form.Control
                    placeholder="Линк за дарение в Paypal"
                    type="text"
                    value={this.state.campaign.paypalDonationURL}
                    onChange={this.handleOnChangeValue}
                  />
                </FloatingLabel>
                <span className="text-danger">
                  {this.state.errors.paypalDonationURL}
                </span>
              </Form.Group>
              <Button
                variant="primary"
                id="paypalDonationURL_button"
                onClick={this.onEditButtonClick}
                className="align-self-center ms-2"
                disabled={
                  this.state.errors.paypalDonationURL !== "" ||
                  this.state.lastCampaign.paypalDonationURL ===
                    this.state.campaign.paypalDonationURL
                }
              >
                <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
              </Button>
            </div>
          </Row>
          <Row className="mb-3">
            <div className="d-flex">
              <Form.Group as={Col} className="flex-fill" controlId="image">
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
                <span
                  className="text-danger"
                  hidden={this.state.errors.image === "NOT_UPLOADED"}
                >
                  {this.state.errors.image}
                </span>
              </Form.Group>
              <Button
                variant="primary"
                id="mainPhotoDataURL_button"
                onClick={this.onEditButtonClick}
                className="align-self-end ms-2"
                disabled={
                  this.state.errors.image !== "" ||
                  this.state.campaign.image === null
                }
              >
                <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
              </Button>
            </div>
          </Row>
          <Row className="mb-3">
            <div className="d-flex">
              <Form.Group as={Col} className="flex-fill" controlId="images1">
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
                <span
                  className="text-danger"
                  hidden={this.state.errors.images1 === "NOT_UPLOADED"}
                >
                  {this.state.errors.images1}
                </span>
              </Form.Group>
              <Button
                variant="primary"
                id="photosDataURL_button"
                onClick={this.onEditButtonClick}
                className="align-self-end ms-2"
                disabled={
                  this.state.errors.images1 !== "" ||
                  this.state.campaign.images1 === null
                }
              >
                <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
              </Button>
            </div>
          </Row>
          <Row className="mb-3">
            <div className="d-flex">
              <Form.Group as={Col} className="flex-fill" controlId="images2">
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
                <span
                  className="text-danger"
                  hidden={this.state.errors.images2 === "NOT_UPLOADED"}
                >
                  {this.state.errors.images2}
                </span>
              </Form.Group>
              <Button
                variant="primary"
                id="documentsForPaymentDataURL_button"
                onClick={this.onEditButtonClick}
                className="align-self-end ms-2"
                disabled={
                  this.state.errors.images2 !== "" ||
                  this.state.campaign.images2 === null
                }
              >
                <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
              </Button>
            </div>
          </Row>
        </div>
      </div>
    );
  }
}
