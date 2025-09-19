import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { Destination } from "../../Services/cruiseDestination/CruiseDestinationService";

interface Props {
  show: boolean;
  onHide: () => void;
  destination?: Destination;
  onSave: (data: Destination) => void;
}

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  code: Yup.string()
    .max(10, "Maximum 10 characters allowed")
    .required("Destination Code is required"),
  name: Yup.string()
    .max(50, "Maximum 50 characters allowed")
    .required("Destination Name is required"),
});

const EditCruiseDestination: React.FC<Props> = ({ show, onHide, destination, onSave }) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{destination ? "Edit Destination" : "Add Destination"}</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={destination || { code: "", name: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => onSave(values)}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <FormikForm>
            <Modal.Body className="px-4 py-3">
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="form-floating">
                    <Form.Control
                      type="text"
                      name="code"
                      id="code"
                      placeholder="Destination Code"
                      value={values.code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.code && touched.code}
                    />
                    <Form.Label htmlFor="code">Destination Code</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name="code" />
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-floating">
                    <Form.Control
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Destination Name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.name && touched.name}
                    />
                    <Form.Label htmlFor="name">Destination Name</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name="name" />
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-end gap-2 px-4 py-3">
              <Button variant="outline-secondary" onClick={onHide}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

export default EditCruiseDestination;
