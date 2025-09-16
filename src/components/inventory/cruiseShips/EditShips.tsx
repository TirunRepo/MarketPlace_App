import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import type { ShipDto, CruiseLineDto } from "../../Services/cruiseShips/CruiseShipsService";

interface ShipFormModalProps {
  show: boolean;
  onHide: () => void;
  shipData: ShipDto;
  cruiseLines: CruiseLineDto[];
  onSave: (data: ShipDto) => void;
}

const EditShips: React.FC<ShipFormModalProps> = ({ show, onHide, shipData, cruiseLines, onSave }) => {
  const [ship, setShip] = useState<ShipDto>(shipData);

  useEffect(() => {
    setShip(shipData);
  }, [shipData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "cruiseLineId") {
      const selectedLine = cruiseLines.find((line) => line.cruiseLineId === value);
      setShip({
        ...ship,
        cruiseLineId: value,
        cruiseLine: selectedLine,
      });
    } else {
      setShip({ ...ship, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(ship);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{ship.cruiseShipId ? "Edit Ship" : "Add Ship"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Ship Name</Form.Label>
              <Form.Control type="text" name="shipName" value={ship.shipName || ""} onChange={handleChange} required />
            </Col>
            <Col md={6}>
              <Form.Label>Ship Code</Form.Label>
              <Form.Control type="text" name="shipCode" value={ship.shipCode || ""} onChange={handleChange} required />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Cruise Line</Form.Label>
              <Form.Select name="cruiseLineId" value={ship.cruiseLineId || ""} onChange={handleChange}>
                <option value="">-- Select Cruise Line --</option>
                {cruiseLines.map((line) => (
                  <option key={line.cruiseLineId} value={line.cruiseLineId}>
                    {line.cruiseLineCode} - {line.cruiseLineName}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditShips;
