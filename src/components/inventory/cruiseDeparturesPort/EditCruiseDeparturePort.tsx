import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { DeparturePortDto, DestinationDto } from "../../Services/cruiseDepartures/DeparturePortService";

interface Props {
  show: boolean;
  onHide: () => void;
  onSave: (data: DeparturePortDto) => void;
  selectedPort: DeparturePortDto;
  destinations: DestinationDto[];
}

const EditCruiseDeparture: React.FC<Props> = ({ show, onHide, onSave, selectedPort, destinations }) => {
  const [portData, setPortData] = useState<DeparturePortDto>(selectedPort);

  useEffect(() => {
    setPortData(selectedPort);
  }, [selectedPort]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setPortData({ ...portData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(portData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{portData.departurePortId ? "Edit Departure Port" : "Add Departure Port"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Departure Port Code</Form.Label>
            <Form.Control
              type="text"
              name="departurePortCode"
              value={portData.departurePortCode || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Departure Port Name</Form.Label>
            <Form.Control
              type="text"
              name="departurePortName"
              value={portData.departurePortName || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Destination</Form.Label>
            <Form.Select name="destinationCode" value={portData.destinationCode || ""} onChange={handleChange} required>
              <option value="">-- Select Destination --</option>
              {destinations.map(d => (
                <option key={d.destinationCode} value={d.destinationCode}>
                  {d.destinationName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
          <Button type="submit" variant="primary">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditCruiseDeparture;
