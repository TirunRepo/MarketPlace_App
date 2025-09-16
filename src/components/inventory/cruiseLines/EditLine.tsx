import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import type { CruiseLineDto } from "../../Services/cruiseLines/CruiseLinesServices";


interface EditLineModalProps {
  show: boolean;
  onHide: () => void;
  lineData: CruiseLineDto;      // matches interface
  onSave: (data: CruiseLineDto) => void;  // must match exactly
}


const EditLine: React.FC<EditLineModalProps> = ({ show, onHide, lineData, onSave }) => {
  const [formData, setFormData] = useState<CruiseLineDto>(lineData);

  useEffect(() => {
    setFormData(lineData);
  }, [lineData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.cruiseLineId ? "Edit Line" : "Add Line"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={4} style={{ display: "none" }}>
              <Form.Group controlId="modalLineID">
                <Form.Label>Cruise Line ID</Form.Label>
                <Form.Control
                  type="text"
                  name="cruiseLineId"
                  value={formData.cruiseLineId || ""}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="modalLineCode">
                <Form.Label>Cruise Line Code</Form.Label>
                <Form.Control
                  type="text"
                  name="cruiseLineCode"
                  value={formData.cruiseLineCode || ""}
                  onChange={handleChange}
                  placeholder="Cruise Line Code"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="modalLineName">
                <Form.Label>Cruise Line Name</Form.Label>
                <Form.Control
                  type="text"
                  name="cruiseLineName"
                  value={formData.cruiseLineName || ""}
                  onChange={handleChange}
                  placeholder="Cruise Line Name"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditLine;
