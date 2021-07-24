import React from 'react';
import { Button, FormControl, Form, FormGroup, FormLabel } from 'react-bootstrap';
import { postRequest } from '../clientRequests';
import CustomModal from '../components/CustomModal';
export default class VerifyProfile extends React.Component
{
    constructor(props)
    {
        super(props);
        let urlParams = new URLSearchParams(window.location.search);
        this.state =
        {
            fields:
            {
                key: urlParams.get("key") ?? ""
            },
            modal:
            {
                show: false,
                title: "Съобщение",
                body: "",
            }
        };
    }
    submitForm = async (e) =>
    {
        e.preventDefault();
        const key = this.state.fields.key;
        if(key !== "")
        {
            const verified = await postRequest("/user/verifyProfile", {key: key});
            if(verified)
            {
                this.openModal("Вашият профил е потвърден успешно!");
            }
            else
            {
                this.openModal("Ключът за потвърждение е невалиден!");
            }
        }
        else
        {
            this.openModal("Ключът за потвърждение е невалиден!");
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
    handleOnChnageKey = (event)=>
    {
        this.setState({fields:{key:event.target.value}});
    }
    render()
    {
        return (<div><h3 className="text-center">Потвърждаване на профил</h3>
        <CustomModal show={this.state.modal.show} title={this.state.modal.title} body={this.state.modal.body} closeModal={this.closeModal}></CustomModal>
        <Form onSubmit={this.submitForm}>
            <FormGroup controlId="key">
                <FormLabel>Ключ</FormLabel>
                <FormControl type="text" onChange={this.handleOnChnageKey} value={this.state.fields.key}></FormControl>
            </FormGroup>
            <Button variant="primary" type="submit" className="mt-4">Потвърждаване</Button>
        </Form>
        </div>);
    }
}