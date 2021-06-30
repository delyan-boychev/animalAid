import React from 'react';
import {Form, Col, Button } from 'react-bootstrap';
export default class RegisterUser extends React.Component
{
  render()
  {
    return (<div><h3 className="text-center">Регистрация като потребител</h3>
    <Form>
    <Form.Row>
      <Form.Group as={Col} controlId="firstName">
        <Form.Label>Име</Form.Label>
        <Form.Control type="text"/>
      </Form.Group>

      <Form.Group as={Col} controlId="lastName">
        <Form.Label>Фамилия</Form.Label>
        <Form.Control type="text"/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="email">
        <Form.Label>Имейл</Form.Label>
        <Form.Control type="email"/>
      </Form.Group>

      <Form.Group as={Col} controlId="city">
        <Form.Label>Град</Form.Label>
        <Form.Control type="text"/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="password">
        <Form.Label>Парола</Form.Label>
        <Form.Control type="password"/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="confirmPassword">
        <Form.Label>Потвърждение на парола</Form.Label>
        <Form.Control type="password"/>
      </Form.Group>
    </Form.Row>
    <Button variant="primary" type="submit">
      Регистрация
    </Button>
  </Form>
    </div>);
  }
}