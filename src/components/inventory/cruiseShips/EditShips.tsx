import React  from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { ShipDto, CruiseLineDto } from "../../Services/cruiseShips/CruiseShipsService";

interface ShipFormModalProps {
  show: boolean;
  onHide: () => void;
  shipData: ShipDto;
  cruiseLines: CruiseLineDto[];
  onSave: (data: ShipDto) => void;
}

// Validation schema
const ShipSchema = Yup.object().shape({
  shipName: Yup.string().max(50, "Max 50 characters").required("Ship Name is required"),
  shipCode: Yup.string().max(20, "Max 20 characters").required("Ship Code is required"),
  cruiseLineId: Yup.string().required("Cruise Line is required"),
});

const EditShips: React.FC<ShipFormModalProps> = ({ show, onHide, shipData, cruiseLines, onSave }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{shipData.cruiseShipId ? "Edit Ship" : "Add Ship"}</Modal.Title>
      </Modal.Header>
      <Formik
        enableReinitialize
        initialValues={shipData}
        validationSchema={ShipSchema}
        onSubmit={(values) => {
          const selectedLine = cruiseLines.find(line => line.cruiseLineId === values.cruiseLineId);
          onSave({ ...values, cruiseLine: selectedLine });
        }}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <FormikForm>
            <Modal.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>Ship Name</Form.Label>
                  <Field
                    as={Form.Control}
                    type="text"
                    name="shipName"
                    value={values.shipName || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.shipName && touched.shipName}
                  />
                  <Form.Control.Feedback type="invalid">
                    <ErrorMessage name="shipName" />
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Ship Code</Form.Label>
                  <Field
                    as={Form.Control}
                    type="text"
                    name="shipCode"
                    value={values.shipCode || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.shipCode && touched.shipCode}
                  />
                  <Form.Control.Feedback type="invalid">
                    <ErrorMessage name="shipCode" />
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row className="g-3 mt-3">
                <Col md={6}>
                  <Form.Label>Cruise Line</Form.Label>
                  <Field
                    as={Form.Select}
                    name="cruiseLineId"
                    value={values.cruiseLineId || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.cruiseLineId && touched.cruiseLineId}
                  >
                    <option value="">-- Select Cruise Line --</option>
                    {cruiseLines.map((line) => (
                      <option key={line.cruiseLineId} value={line.cruiseLineId}>
                        {line.cruiseLineCode} - {line.cruiseLineName}
                      </option>
                    ))}
                  </Field>
                  <Form.Control.Feedback type="invalid">
                    <ErrorMessage name="cruiseLineId" />
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
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

export default EditShips;
