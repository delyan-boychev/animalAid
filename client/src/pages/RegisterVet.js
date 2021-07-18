import React from 'react';
import {Form, Col, Button } from 'react-bootstrap';
import CustomModal from '../components/CustomModal';
import config from "../config.json";
import { getCookie } from '../cookies';
import { Redirect } from 'react-router-dom';
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");
export default class RegisterVet extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      fields:{
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        address: "",
        diploma: null,
        phoneNumber: "",
        password: "",
        confirmPassword: ""
      },
      errors:{
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        address: "",
        diploma: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        isValid: false
      },
      modal:
      {
        show: false,
        title: "Съобщение",
        body: ""
      }

    };

  }
  submitForm = (event)=>
  {
    
    event.preventDefault();
    this.validate();
    if(this.state.errors.isValid)
    {
      const user = this.state.fields;
      let diploma = new FormData();
      diploma.append("diploma", user.diploma, user.diploma.name);
      axios.post(`${config.API_URL}/diplomas/upload`, diploma, {headers:{'Content-Type': `multipart/form-data; boundary=${diploma.getBoundary}`}}).then(res=>
        {
            if(res.status === 200){
                axios.post(`${config.API_URL}/user/regVet`, 
                {
                    name:{
                        first: user.firstName,
                        last: user.lastName
                    },
                    diplomaFile: res.data.filename,
                    email: user.email,
                    city: user.city,
                    address: user.address,
                    phoneNumber: user.phoneNumber,
                    password: user.password
                }).then((response)=>{
                    if(response.data === true)
                    {
                    this.openModal("Вие се регистрирахте успешно!");
                    }
                    else if(response.data ===false)
                    {
                    this.openModal("Вече същсетвува профил с този имейл адрес!");
                    }
                });
            }
        });
      
      this.setState({fields:{ firstName: "", lastName: "", email: "", city: "", address: "", diploma: null, phoneNumber: "", password: "", confirmPassword: "" }, errors:{ firstName: "", lastName: "", email: "", city: "", phoneNumber: "", password: "", confirmPassword: "", isValid: false }, modal: { show: false, title: "Съобщение", body: "" }});
    }
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
  validate()
  {
    let errors = {
      firstName: "",
      lastName: "",
      email: "",
      city: "",
      address: "",
      diploma: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      isValid: true
    };
    let fields = this.state.fields;
    const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isPhoneNumber = /^\+(?:[0-9]●?){6,14}[0-9]$/;
    const checkPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if(fields["firstName"].length < 2)
    {
      errors["firstName"] = "Името трябва да е поне 2 символа!";
      errors["isValid"] = false;
    }
    if(fields["lastName"].length < 2)
    {
      errors["lastName"] = "Фамилията трябва да е поне 2 символа!";
      errors["isValid"] = false;
    }
    if(!isEmail.test(fields["email"]))
    {
      errors["email"] = "Имейлът е невалиден!";
      errors["isValid"] = false;
    }
    if(fields["city"].length < 2)
    {
      errors["city"] = "Името на града трябва да е поне 2 символа!";
      errors["isValid"] = false;
    }
    if(fields["address"].length < 2)
    {
      errors["address"] = "Адресът трябва да е поне 2 символа!";
      errors["isValid"] = false;
    }
    if(fields["diploma"] === null)
    {
      errors["diploma"] = "Нужно е да качите диплома за висше образование със завършена специалност Ветеринарна медицина!";
      errors["isValid"] = false;
    }
    else
    {
        if(path.extname(fields["diploma"].name) !== ".pdf")
        {
            errors["diploma"] = "Дипломата трябва да бъде в pdf формат!";
            errors["isValid"] = false;
        }
    }
    if(!isPhoneNumber.test(fields["phoneNumber"]))
    {
      errors["phoneNumber"] = "Невалиден телефонен номер!";
      errors["isValid"] = false;
    }
    if(!checkPass.test(fields["password"]) || fields["password"].length < 8)
    {
      errors["password"] = "Паролата трябва да съдържа поне една малка буква, главна буква, една цифра, един специален символ и да е поне 8 символа!";
      errors["isValid"] = false;
    }
    if(fields["password"] !== fields["confirmPassword"])
    {
      errors["confirmPassword"] = "Двете пароли не съвпадат!";
      errors["isValid"] = false;
    }
    this.setState({errors});
  }
  handleOnChangeValue = (event) =>
  {
    let fields = this.state.fields;
    if(event.target.id === "diploma")
    {
        fields[event.target.id] = event.target.files[0];
    }
    else
    {
        fields[event.target.id] = event.target.value;
    }
    this.setState({fields});
    this.validate();
  }
  render()
  {
    if(getCookie("authorization") !== "" && getCookie("authorization") !== null)
    {
      return <Redirect to="/"></Redirect>
    }
    return (<div><h3 className="text-center">Регистрация на ветеринар</h3>
    <CustomModal show={this.state.modal.show} title={this.state.modal.title} body={this.state.modal.body} closeModal={this.closeModal}></CustomModal>
    <Form onSubmit={this.submitForm}>
    <Form.Row>
      <Form.Group as={Col} controlId="firstName">
        <Form.Label>Име</Form.Label>
        <Form.Control type="text" value={this.state.fields.firstName} onChange={this.handleOnChangeValue}/>
        <span className="text-danger">{this.state.errors.firstName}</span>
      </Form.Group>

      <Form.Group as={Col} controlId="lastName">
        <Form.Label>Фамилия</Form.Label>
        <Form.Control type="text" value={this.state.fields.lastName} onChange={this.handleOnChangeValue}/>
        <span className="text-danger">{this.state.errors.lastName}</span>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="email">
        <Form.Label>Имейл</Form.Label>
        <Form.Control type="email" value={this.state.fields.email} onChange={this.handleOnChangeValue}/>
        <span className="text-danger">{this.state.errors.email}</span>
      </Form.Group>
      <Form.Group as={Col} controlId="phoneNumber">
        <Form.Label>Телефонен номер</Form.Label>
        <Form.Control type="text" value={this.state.fields.phoneNumber} onChange={this.handleOnChangeValue}/>
        <span className="text-danger">{this.state.errors.phoneNumber}</span>
      </Form.Group>
    </Form.Row>
    <Form.Row>
    <Form.Group as={Col} controlId="city">
        <Form.Label>Град</Form.Label>
        <Form.Control type="text" value={this.state.fields.city} onChange={this.handleOnChangeValue}/>
        <span className="text-danger">{this.state.errors.city}</span>
      </Form.Group>
      <Form.Group as={Col} controlId="address">
        <Form.Label>Адрес</Form.Label>
        <Form.Control type="text" value={this.state.fields.address} onChange={this.handleOnChangeValue}/>
        <span className="text-danger">{this.state.errors.address}</span>
      </Form.Group>
    </Form.Row>
    <Form.Row>
        <Form.Group as={Col} controlId="diploma">
            <Form.Label>Диплома за висше образование със завършена специалност Ветеринарна медицина</Form.Label>
            <Form.Control type="file" onChange={this.handleOnChangeValue} accept=".pdf"/>
            <span className="text-danger">{this.state.errors.diploma}</span>
        </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="password">
        <Form.Label>Парола</Form.Label>
        <Form.Control type="password" value={this.state.fields.password} onChange={this.handleOnChangeValue}/>
        <span className="text-danger">{this.state.errors.password}</span>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="confirmPassword">
        <Form.Label>Потвърждение на парола</Form.Label>
        <Form.Control type="password" value={this.state.fields.confirmPassword} onChange={this.handleOnChangeValue}/>
        <span className="text-danger">{this.state.errors.confirmPassword}</span>
      </Form.Group>
    </Form.Row>
    <Button variant="primary" type="submit">
      Регистрация
    </Button>
  </Form>
    </div>);
  }
}