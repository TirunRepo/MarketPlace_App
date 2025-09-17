import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { CruiseLineDto } from "../../Services/cruiseLines/CruiseLinesServices";

interface EditLineModalProps {
  show: boolean;
  onHide: () => void;
  lineData: CruiseLineDto;
  onSave: (data: CruiseLineDto) => void;
}

// Validation schema
const validationSchema = Yup.object().shape({
  cruiseLineCode: Yup.string()
    .max(10, "Maximum 10 characters allowed")
    .required("Cruise Line Code is required"),
  cruiseLineName: Yup.string()
    .max(50, "Maximum 50 characters allowed")
    .required("Cruise Line Name is required"),
});

const EditLine: React.FC<EditLineModalProps> = ({ show, onHide, lineData, onSave }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static" keyboard={false}>
      <Formik
        enableReinitialize
        initialValues={lineData || { cruiseLineId: "", cruiseLineCode: "", cruiseLineName: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => onSave(values)}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <FormikForm>
            <Modal.Header closeButton>
              <Modal.Title>{values.cruiseLineId ? "Edit Cruise Line" : "Add Cruise Line"}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="px-4 py-3">
              <Row className="g-3">
                {/* Hidden ID */}
                <Col md={4} style={{ display: "none" }}>
                  <Form.Group controlId="cruiseLineId">
                    <Form.Label>Cruise Line ID</Form.Label>
                    <Form.Control type="text" name="cruiseLineId" value={values.cruiseLineId || ""} readOnly />
                  </Form.Group>
                </Col>

                {/* Cruise Line Code */}
                <Col md={6}>
                  <Form.Group className="form-floating">
                    <Form.Control
                      type="text"
                      id="cruiseLineCode"
                      name="cruiseLineCode"
                      placeholder="Cruise Line Code"
                      value={values.cruiseLineCode || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.cruiseLineCode && touched.cruiseLineCode}
                    />
                    <Form.Label htmlFor="cruiseLineCode">Cruise Line Code</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name="cruiseLineCode" />
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Cruise Line Name */}
                <Col md={6}>
                  <Form.Group className="form-floating">
                    <Form.Control
                      type="text"
                      id="cruiseLineName"
                      name="cruiseLineName"
                      placeholder="Cruise Line Name"
                      value={values.cruiseLineName || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.cruiseLineName && touched.cruiseLineName}
                    />
                    <Form.Label htmlFor="cruiseLineName">Cruise Line Name</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name="cruiseLineName" />
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
