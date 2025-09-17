import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { DeparturePortDto, DestinationDto } from "../../Services/cruiseDepartures/DeparturePortService";

interface Props {
  show: boolean;
  onHide: () => void;
  onSave: (data: DeparturePortDto) => void;
  selectedPort: DeparturePortDto;
  destinations: DestinationDto[];
}

// Validation Schema
const validationSchema = Yup.object().shape({
  departurePortCode: Yup.string()
    .max(10, "Max 10 characters allowed")
    .required("Departure Port Code is required"),
  departurePortName: Yup.string()
    .max(50, "Max 50 characters allowed")
    .required("Departure Port Name is required"),
  destinationCode: Yup.string().required("Destination is required"),
});

const EditCruiseDeparture: React.FC<Props> = ({
  show,
  onHide,
  onSave,
  selectedPort,
  destinations,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          {selectedPort.departurePortId
            ? "Edit Departure Port"
            : "Add Departure Port"}
        </Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={selectedPort}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSave(values);
        }}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <FormikForm>
            <Modal.Body className="px-4 py-3">
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="form-floating">
                    <Form.Control
                      type="text"
                      name="departurePortCode"
                      id="departurePortCode"
                      placeholder="Departure Port Code"
                      value={values.departurePortCode || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        !!errors.departurePortCode && touched.departurePortCode
                      }
                    />
                    <Form.Label htmlFor="departurePortCode">
                      Departure Port Code
                    </Form.Label>
                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name="departurePortCode" />
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-floating">
                    <Form.Control
                      type="text"
                      name="departurePortName"
                      id="departurePortName"
                      placeholder="Departure Port Name"
                      value={values.departurePortName || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        !!errors.departurePortName && touched.departurePortName
                      }
                    />
                    <Form.Label htmlFor="departurePortName">
                      Departure Port Name
                    </Form.Label>
                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name="departurePortName" />
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group className="form-floating">
                    <Form.Select
                      name="destinationCode"
                      id="destinationCode"
                      value={values.destinationCode || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        !!errors.destinationCode && touched.destinationCode
                      }
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((d) => (
                        <option key={d.destinationCode} value={d.destinationCode}>
                          {d.destinationName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Label htmlFor="destinationCode">Destination</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name="destinationCode" />
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

export default EditCruiseDeparture;
