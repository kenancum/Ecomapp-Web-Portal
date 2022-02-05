import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { Form,Button, Card, Container, Row, Col } from "react-bootstrap"
import { v4 as uuidv4 } from "uuid";
import firebase from "../firebase";
import * as yup from 'yup';
import { Formik } from 'formik';

export default function AddEdit() {
    const { id } = useParams()
    const isAddMode = !id;
    const ref = firebase.firestore().collection("recyclebins")
    const navigate = useNavigate()

    const schema = yup.object().shape({
        adress: yup.string().required('Required'),
        borough: yup.string().required('Required'),
        siteType: yup.string().required('Required'),
        latitude: yup.number().required('Required'),
        longitude: yup.number().required('Required')
    });

    function addRecycleBin(values) {
        let idv4 = uuidv4()
        console.log(values.adress)
        ref.doc(idv4).set({
            id: idv4,
            adress: values.adress,
            borough: values.borough,
            site_type: values.siteType,
            added_by: "Antalya government",
            location: new firebase.firestore.GeoPoint(values.latitude,values.longitude)
          }).then(function() {
              navigate('/dashboard')
            console.log("Recycle bin created");
          });
    }

    function editRecycleBin(newRecycleBin){
        ref
            .doc(newRecycleBin.id)
            .update(newRecycleBin)
            .catch((err)=>{
                console.error(err);
            })
    }

    function isAddOrEdit(data) {
        return isAddMode
            ? addRecycleBin(data)
            : editRecycleBin(data);
    }

    return (
        <Container style={{ paddingTop: '20px' }} >
            <Card>
                <Card.Body>
                <Formik
                    validationSchema={schema}
                    onSubmit={values => {isAddOrEdit(values)} }
                    initialValues={{
                        adress: '',
                        borough: '',
                        siteType: '',
                        latitude: '',
                        longitude: '',
                    }}
                    >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        touched,
                        errors,
                    }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control 
                                    type="text"
                                    placeholder="Adress"
                                    name="adress"
                                    value={values.adress}
                                    onChange={handleChange}
                                    isValid={touched.adress && !errors.adress}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Borough</Form.Label>
                                    <Form.Control
                                    type="text" 
                                    placeholder="Borough"
                                    name="borough"
                                    value={values.borough}
                                    onChange={handleChange}
                                    isValid={touched.borough && !errors.borough}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Site Type</Form.Label>
                                    <Form.Control
                                    type="text"
                                    placeholder="Site Type"
                                    name="siteType"
                                    value={values.siteType}
                                    onChange={handleChange}
                                    isValid={touched.siteType && !errors.siteType}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3 ">
                                    <Form.Label>Latitude</Form.Label>
                                    <Form.Control 
                                    type="text"
                                    placeholder="Latitude"
                                    name="latitude"
                                    value={values.latitude}
                                    onChange={handleChange}
                                    isValid={touched.latitude && !errors.latitude}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Longitude</Form.Label>
                                    <Form.Control 
                                    type="text" 
                                    placeholder="Longitude"
                                    name="longitude"
                                    value={values.longitude}
                                    onChange={handleChange}
                                    isValid={touched.longitude && !errors.longitude}
                                    />
                                </Form.Group>
                            </Col>                            
                        </Row>
                        <Row>
                            <Col style={{display: 'flex', justifyContent: 'center'}}>
                                <Button variant="primary" type='submit'>Submit</Button>
                            </Col>
                        </Row>
                        
                    </Form>
                    )}
                    </Formik>
                </Card.Body>
            </Card>
        </Container>

    );
}
