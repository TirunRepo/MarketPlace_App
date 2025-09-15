import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddMarkup: React.FC = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const initialValues = {
    minMarkup: "",
    maxMarkup: "",
    minBaseFare: "",
    maxBaseFare: "",
    markupPercentage: "",
    supplierId: "",
    sailingId: "",
    isActive: true,
    startDate: "",
    endDate: "",
    createdBy: "",
    createdOn: "",
    updatedBy: "",
    updatedOn: "",
  };

  const validationSchema = Yup.object({
    minMarkup: Yup.number().nullable(),
    maxMarkup: Yup.number().nullable(),
    minBaseFare: Yup.number().nullable(),
    maxBaseFare: Yup.number().nullable(),
    markupPercentage: Yup.number()
      .required("Markup Percentage is required")
      .min(0, "Must be positive"),
    supplierId: Yup.number().nullable(),
    sailingId: Yup.number().nullable(),
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date()
      .required("End Date is required")
      .min(Yup.ref("startDate"), "End Date must be after Start Date"),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log("Submitted Markup Detail:", values);
    handleClose(); // close modal after submit
  };

  return (
    <>
      {/* Trigger Button */}
      <Button variant="primary" onClick={handleShow}>
        Add Markup Detail
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Markup Detail</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange }) => (
            <FormikForm>
              <Modal.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Min Markup</Form.Label>
                    <Field
                      as={Form.Control}
                      type="number"
                      name="minMarkup"
                      placeholder="Enter Min Markup"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Max Markup</Form.Label>
                    <Field
                      as={Form.Control}
                      type="number"
                      name="maxMarkup"
                      placeholder="Enter Max Markup"
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Min Base Fare</Form.Label>
                    <Field
                      as={Form.Control}
                      type="number"
                      name="minBaseFare"
                      placeholder="Enter Min Base Fare"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Max Base Fare</Form.Label>
                    <Field
                      as={Form.Control}
                      type="number"
                      name="maxBaseFare"
                      placeholder="Enter Max Base Fare"
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Markup Percentage</Form.Label>
                    <Field
                      as={Form.Control}
                      type="number"
                      name="markupPercentage"
                      placeholder="Enter Markup %"
                    />
                    <ErrorMessage
                      name="markupPercentage"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Supplier ID</Form.Label>
                    <Field
                      as={Form.Control}
                      type="number"
                      name="supplierId"
                      placeholder="Enter Supplier ID"
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Sailing ID</Form.Label>
                    <Field
                      as={Form.Control}
                      type="number"
                      name="sailingId"
                      placeholder="Enter Sailing ID"
                    />
                  </Col>
                  <Col md={6} className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      name="isActive"
                      checked={values.isActive}
                      onChange={handleChange}
                      label="Is Active"
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Start Date</Form.Label>
                    <Field as={Form.Control} type="date" name="startDate" />
                    <ErrorMessage
                      name="startDate"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>End Date</Form.Label>
                    <Field as={Form.Control} type="date" name="endDate" />
                    <ErrorMessage
                      name="endDate"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                </Row>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Markup
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default AddMarkup;
