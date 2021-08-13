import axios from "axios";
import React from "react";
import config from "../config.json";
import {Form, Button, Col} from "react-bootstrap";
import CustomModal from "../components/CustomModal";
import {getCookie, setCookie} from "../cookies";
import  { Redirect } from 'react-router-dom';
export default class Login extends React.Component
{
    loginComplete = false;
    constructor(props)
    {
        super(props);
        this.state =
        {
            fields: 
            {
                email: "",
                password: ""
            },
            errors:
            {
                email: "",
                password: "",
                isValid: false

            },
            modal:
            {
                show: false,
                title: "Съобщение",
                body: ""
            }
        }
    }
    submitForm = (event)=>
    {
      
      event.preventDefault();
      this.validate();
      if(this.state.errors.isValid)
      {
          const user = this.state.fields;
          axios.post(`${config.API_URL}/user/log`, {
              email: user.email,
              password: user.password
          }).then((response)=>{
              if(response.data === false)
              {
                  this.openModal("Неправилен имейл адрес или парола!");
              }
              else if(response.data === "PROFILE_NOT_VERIFIED")
              {
                  this.openModal("Моля проверете имейл адреса си и потвърдете профила си!");
              }
              else
              {
                  this.openModal("Вие влязохте успешно в профила си!");
                  setCookie("authorization", response.data,  4444444);
                  this.loginComplete = true;
              }
          });
      }
    }
    validate()
    {
        const fields = this.state.fields;
        let errors =
        {
            email: "",
            password: "",
            isValid: true

        };
        const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const checkPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if(!isEmail.test(fields["email"]))
        {
            errors["email"] = "Имейлът е невалиден!";
            errors["isValid"] = false;
        }
        if(!checkPass.test(fields["password"]) || fields["password"].length < 8)
        {
            errors["password"] = "Паролата е невалидна!";
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
        if(this.loginComplete)
        {
            window.location.reload();
        }
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
        if(getCookie("authorization") !== "" && getCookie("authorization") !== null)
        {
            return <Redirect to="/"></Redirect>
        }
        return (<div><h3 className="text-center">Влизане</h3>
        <CustomModal show={this.state.modal.show} title={this.state.modal.title} body={this.state.modal.body} closeModal={this.closeModal}></CustomModal>
        <Form onSubmit={this.submitForm}>
        <Form.Row>
            <Form.Group as={Col} controlId="email">
                <Form.Label>Имейл</Form.Label>
                <Form.Control type="text" value={this.state.fields.email} onChange={this.handleOnChangeValue}/>
                <span className="text-danger">{this.state.errors.email}</span>
            </Form.Group>
            </Form.Row>
            <Form.Row>
            <Form.Group as={Col} controlId="password">
                <Form.Label>Парола</Form.Label>
                <Form.Control type="password" value={this.state.fields.password} onChange={this.handleOnChangeValue}/>
                <span className="text-danger">{this.state.errors.password}</span>
            </Form.Group>
            </Form.Row>
            <Button variant="primary" type="submit">
                Влизане
            </Button>
        </Form>
        </div>);
    }
}