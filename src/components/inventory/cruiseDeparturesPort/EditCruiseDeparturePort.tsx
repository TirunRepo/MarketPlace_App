import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { DeparturePort, DestinationDTO} from "../../Services/cruiseDepartures/DeparturePortService";

interface Props {
  show: boolean;
  onHide: () => void;
  onSave: (data: DeparturePort) => void;
  selectedPort: DeparturePort;
  destinations: DestinationDTO[];
}

// Validation Schema
const validationSchema = Yup.object().shape({
  code: Yup.string()
    .max(10, "Max 10 characters allowed")
    .required("Departure Port Code is required"),
  name: Yup.string()
    .max(50, "Max 50 characters allowed")
    .required("Departure Port Name is required"),
  destinationId: Yup.string().required("Destination is required"),
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
          {selectedPort.id
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
                      name="code"
                      id="code"
                      placeholder="Departure Port Code"
                      value={values.code || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        !!errors.code && touched.code
                      }
                    />
                    <Form.Label htmlFor="code">
                      Departure Port Code
                    </Form.Label>
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
                      placeholder="Departure Port Name"
                      value={values.name || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        !!errors.name && touched.name
                      }
                    />
                    <Form.Label htmlFor="name">
                      Departure Port Name
                    </Form.Label>
                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name="name" />
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group className="form-floating">
                    <Form.Select
                      name="code"
                      id="code"
                      value={values.code || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        !!errors.code && touched.code
                      }
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Label htmlFor="destinationId">Destination</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      <ErrorMessage name="destinationId" />
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
