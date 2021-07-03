import React from 'react';
import {Form, Col, Button } from 'react-bootstrap';
export default class RegisterUser extends React.Component
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
        phoneNumber: "",
        password: "",
        confirmPassword: ""
      },
      errors:{
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        isValid: false
      }

    };

  }
  submitForm = (event)=>
  {
    event.preventDefault();
    this.validate();
    if(this.state.errors.isValid)
    {
      console.log(this.state);
    }
  }
  validate()
  {
    let errors = {
      firstName: "",
      lastName: "",
      email: "",
      city: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      isValid: true
    };
    let fields = this.state.fields;
    const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isPhoneNumber = /^\+(?:[0-9]●?){6,14}[0-9]$/;
    const checkPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)” + “(?=.*[-+_!@#$%^&*., ?]).+$/;
    
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
    if(!isPhoneNumber.test(fields["phoneNumber"]))
    {
      errors["phoneNumber"] = "Невалиден телефонен номер!";
      errors["isValid"] = false;
    }
    if(!checkPass.test(fields["password"]) && fields["password"].length < 8)
    {
      errors["password"] = "Паролата трябва да съдържа поне една малка буква, главна буква, една цифра, един специален символ и да е поне 8 символа!";
      errors["isValid"] = false;
    }
    if(fields["password"] != fields["confirmPassword"])
    {
      errors["confirmPassword"] = "Двете пароли не съвпадат!";
      errors["isValid"] = false;
    }
    this.setState({errors});
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
    return (<div><h3 className="text-center">Регистрация като потребител</h3>
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

      <Form.Group as={Col} controlId="city">
        <Form.Label>Град</Form.Label>
        <Form.Control type="text" value={this.state.fields.city} onChange={this.handleOnChangeValue}/>
        <span className="text-danger">{this.state.errors.city}</span>
      </Form.Group>
    </Form.Row>
    <Form.Row>
    <Form.Group as={Col} controlId="phoneNumber">
        <Form.Label>Телефонен номер</Form.Label>
        <Form.Control type="text" value={this.state.fields.phoneNumber} onChange={this.handleOnChangeValue}/>
        <span className="text-danger">{this.state.errors.phoneNumber}</span>
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