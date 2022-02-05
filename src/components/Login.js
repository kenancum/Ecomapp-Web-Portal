import React, { useRef, useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContexts";
import {  useNavigate  } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login(){

    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()

        try {
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value) 
            navigate("/dashboard")
        } catch {
            toast.error('Failed to log in')
        }

        setLoading(false)
    }
    return (
        <>
            <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Log In</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group id="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" ref={emailRef} required />
                                </Form.Group>
                                <Form.Group id="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" ref={passwordRef} required />
                                </Form.Group>
                                <Button disabled={loading} className="w-100 mt-4" type="submit">
                                    Log In
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
                <ToastContainer />
            </Container>
        </>
    )
}
