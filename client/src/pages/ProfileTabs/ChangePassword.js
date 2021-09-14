import React from "react";
import CustomModal from "../../components/CustomModal";
import { Form, Col, Button, Card } from "react-bootstrap";
const client = require("../../clientRequests");

export default class ChangePassword extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state =
        {
            fields:
            {
                oldPassword: "",
                newPassword: "",
                newPasswordConfirm: ""
            },
            errors:
            {
                oldPassword: "",
                newPassword: "",
                newPasswordConfirm: "",
                isValid: false
            },
            modal:
            {
                show: false,
                title: "Съобщение",
                body: ""
            },
        }
    }
    submitForm = async (event) =>
    {
      
      event.preventDefault();
      this.validate();
      if(this.state.errors.isValid)
      {
          const fields = this.state.fields;
          fields.newPasswordConfirm = undefined;
          let res = await client.postRequestToken("/user/changePassword", fields);
          if(res === true)
          {
            this.openModal("Паролата е променена успешно!");
          }
          else
          {
            this.openModal("Старата парола е неправилна!");
          }
      }
    }
    validate()
    {
        const fields = this.state.fields;
        let errors =
        {
            oldPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
            isValid: true

        };
        const checkPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if(!checkPass.test(fields["oldPassword"]) || fields["oldPassword"].length < 8)
        {
            errors["oldPassword"] = "Паролата е невалидна!";
            errors["isValid"] = false;
        }
        if(!checkPass.test(fields["newPassword"]) || fields["newPassword"].length < 8)
        {
            errors["newPassword"] = "Паролата трябва да съдържа поне една малка латинска буква, една главна латинска буква, една цифра и да е поне 8 символа!";
            errors["isValid"] = false;
        }
        if(fields["newPassword"] !== fields["newPasswordConfirm"])
        {
            errors["newPasswordConfirm"] = "Двете пароли не съвпадат!";
            errors["isValid"] = false;
        }
        this.setState({errors});

    }
    openModal = (body) =>
    { 
        let modal = this.state.modal;
        modal.show = true;
        modal.body = body;
        this.setState({modal});
    }
    closeModal = () =>
    { 
        let modal = this.state.modal;
        modal.show = false;
        this.setState({modal});
    }
    handleOnChangeValue = (event) =>
    {
        let fields = this.state.fields;
        fields[event.target.id] = event.target.value;
        this.setState({fields});
        this.validate();
    }
    render()
    {
        return(
            <div>
                <CustomModal show={this.state.modal.show} title={this.state.modal.title} body={this.state.modal.body} closeModal={this.closeModal}></CustomModal>
                <Card body>
                    <Form onSubmit={this.submitForm}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="oldPassword">
                                <Form.Label>Стара парола</Form.Label>
                                <Form.Control type="password" value={this.state.fields.oldPassword} onChange={this.handleOnChangeValue}/>
                                <span className="text-danger">{this.state.errors.oldPassword}</span>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="newPassword">
                                <Form.Label>Нова парола</Form.Label>
                                <Form.Control type="password" value={this.state.fields.newPassword} onChange={this.handleOnChangeValue}/>
                                <span className="text-danger">{this.state.errors.newPassword}</span>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="newPasswordConfirm">
                                <Form.Label>Потвърждаване на нова парола</Form.Label>
                                <Form.Control type="password" value={this.state.fields.newPasswordConfirm} onChange={this.handleOnChangeValue}/>
                                <span className="text-danger">{this.state.errors.newPasswordConfirm}</span>
                            </Form.Group>
                        </Form.Row>
                        <Button variant="primary" type="submit" disabled={!this.state.errors.isValid}>
                            Промяна на парола
                        </Button>
                    </Form>
                </Card>
            </div>
        )

    }
}