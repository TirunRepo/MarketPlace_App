import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { DestinationDto } from "../../Services/cruiseDestination/CruiseDestinationService";

interface Props {
  show: boolean;
  onHide: () => void;
  destination?: DestinationDto;
  onSave: (data: DestinationDto) => void;
}

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  destinationCode: Yup.string()
    .max(10, "Maximum 10 characters allowed")
    .required("Destination Code is required"),
  destinationName: Yup.string()
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
        initialValues={destination || { destinationCode: "", destinationName: "" }}
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
                      name="destinationCode"
                      id="destinationCode"
                      placeholder="Destination Code"
                      value={values.destinationCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.destinationCode && touched.destinationCode}
                    />
                    <Form.Label htmlFor="destinationCode">Destination Code</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name="destinationCode" />
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-floating">
                    <Form.Control
                      type="text"
                      name="destinationName"
                      id="destinationName"
                      placeholder="Destination Name"
                      value={values.destinationName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.destinationName && touched.destinationName}
                    />
                    <Form.Label htmlFor="destinationName">Destination Name</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name="destinationName" />
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
