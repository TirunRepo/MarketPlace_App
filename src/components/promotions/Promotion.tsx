import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

const Promotion: React.FC = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialValues = {
    promotionTypeId: "",
    promotionName: "",
    promotionDescription: "",
    discountPer: "",
    discountAmount: "",
    promoCode: "",
    loyaltyLevel: "",
    isFirstTimeCustomer: false,
    minNoOfAdultRequired: "",
    minNoOfChildRequired: "",
    isAdultTicketDiscount: false,
    isChildTicketDiscount: false,
    minPassengerAge: "",
    maxPassengerAge: "",
    passengerType: "",
    cabinCountRequired: "",
    sailingId: "",
    supplierId: "",
    affiliateName: "",
    includesAirfare: false,
    includesHotel: false,
    includesWiFi: false,
    includesShoreExcursion: false,
    onboardCreditAmount: "",
    freeNthPassenger: "",
    startDate: "",
    endDate: "",
    isStackable: false,
    isActive: true,
    createdBy: "",
    createdDate: "",
    modifyBy: "",
    modifyDate: "",
  };

  const validationSchema = Yup.object({
    promotionTypeId: Yup.number().required("Promotion Type is required"),
    promotionName: Yup.string().required("Promotion Name is required"),
    promotionDescription: Yup.string().required("Description is required"),
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date().required("End Date is required"),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log("Promotion Data:", values);
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create Promotion
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Create Promotion</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row className="g-3">
                  {/* Basic Info */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Promotion Type</Form.Label>
                      <Form.Control
                        type="number"
                        name="promotionTypeId"
                        value={values.promotionTypeId}
                        onChange={handleChange}
                        isInvalid={
                          !!errors.promotionTypeId && touched.promotionTypeId
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.promotionTypeId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Promotion Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="promotionName"
                        value={values.promotionName}
                        onChange={handleChange}
                        isInvalid={
                          !!errors.promotionName && touched.promotionName
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.promotionName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="promotionDescription"
                        value={values.promotionDescription}
                        onChange={handleChange}
                        isInvalid={
                          !!errors.promotionDescription &&
                          touched.promotionDescription
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.promotionDescription}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Discounts */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Discount (%)</Form.Label>
                      <Form.Control
                        type="number"
                        name="discountPer"
                        value={values.discountPer}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Discount Amount</Form.Label>
                      <Form.Control
                        type="number"
                        name="discountAmount"
                        value={values.discountAmount}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Codes and Loyalty */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Promo Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="promoCode"
                        value={values.promoCode}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Loyalty Level</Form.Label>
                      <Form.Control
                        type="text"
                        name="loyaltyLevel"
                        value={values.loyaltyLevel}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Passenger Info */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Min Passenger Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="minPassengerAge"
                        value={values.minPassengerAge}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Max Passenger Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="maxPassengerAge"
                        value={values.maxPassengerAge}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Passenger Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="passengerType"
                        value={values.passengerType}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Travel Inclusions */}
                  <Col md={3}>
                    <Form.Check
                      type="checkbox"
                      label="Includes Airfare"
                      name="includesAirfare"
                      checked={values.includesAirfare}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Check
                      type="checkbox"
                      label="Includes Hotel"
                      name="includesHotel"
                      checked={values.includesHotel}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Check
                      type="checkbox"
                      label="Includes WiFi"
                      name="includesWiFi"
                      checked={values.includesWiFi}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Check
                      type="checkbox"
                      label="Includes Shore Excursion"
                      name="includesShoreExcursion"
                      checked={values.includesShoreExcursion}
                      onChange={handleChange}
                    />
                  </Col>

                  {/* Dates */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={values.startDate}
                        onChange={handleChange}
                        isInvalid={!!errors.startDate && touched.startDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.startDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={values.endDate}
                        onChange={handleChange}
                        isInvalid={!!errors.endDate && touched.endDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.endDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Flags */}
                  <Col md={4}>
                    <Form.Check
                      type="checkbox"
                      label="First Time Customer"
                      name="isFirstTimeCustomer"
                      checked={values.isFirstTimeCustomer}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Check
                      type="checkbox"
                      label="Adult Ticket Discount"
                      name="isAdultTicketDiscount"
                      checked={values.isAdultTicketDiscount}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Check
                      type="checkbox"
                      label="Child Ticket Discount"
                      name="isChildTicketDiscount"
                      checked={values.isChildTicketDiscount}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      label="Stackable"
                      name="isStackable"
                      checked={values.isStackable}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      label="Active"
                      name="isActive"
                      checked={values.isActive}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Promotion
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default Promotion;
