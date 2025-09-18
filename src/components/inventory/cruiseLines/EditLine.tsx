import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { CruiseLine } from "../../Services/cruiseLines/CruiseLinesServices";

interface EditLineModalProps {
  show: boolean;
  onHide: () => void;
  lineData: CruiseLine;
  onSave: (data: CruiseLine) => void;
}

// Validation schema
const validationSchema = Yup.object().shape({
  code: Yup.string()
    .max(10, "Maximum 10 characters allowed")
    .required("Cruise Line Code is required"),
  name: Yup.string()
    .max(50, "Maximum 50 characters allowed")
    .required("Cruise Line Name is required"),
});

const EditLine: React.FC<EditLineModalProps> = ({ show, onHide, lineData, onSave }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static" keyboard={false}>
      <Formik
        enableReinitialize
        initialValues={lineData || { id: "", code: "", name: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => onSave(values)}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <FormikForm>
            <Modal.Header closeButton>
              <Modal.Title>{values.id ? "Edit Cruise Line" : "Add Cruise Line"}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="px-4 py-3">
              <Row className="g-3">
                {/* Hidden ID */}
                <Col md={4} style={{ display: "none" }}>
                  <Form.Group controlId="cruiseLineId">
                    <Form.Label>Cruise Line ID</Form.Label>
                    <Form.Control type="text" name="cruiseLineId" value={values.id || ""} readOnly />
                  </Form.Group>
                </Col>

                {/* Cruise Line Code */}
                <Col md={6}>
                  <Form.Group className="form-floating">
                    <Form.Control
                      type="text"
                      id="code"
                      name="code"
                      placeholder="Cruise Line Code"
                      value={values.code || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.code && touched.code}
                    />
                    <Form.Label htmlFor="code">Cruise Line Code</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name="code" />
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Cruise Line Name */}
                <Col md={6}>
                  <Form.Group className="form-floating">
                    <Form.Control
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Cruise Line Name"
                      value={values.name || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.name && touched.name}
                    />
                    <Form.Label htmlFor="name">Cruise Line Name</Form.Label>
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

export default EditLine;
