import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import type { DestinationDto } from "../../Services/cruiseDestination/CruiseDestinationService";

interface Props {
    show: boolean;
    onHide: () => void;
    destination?: DestinationDto;
    onSave: (data: DestinationDto) => void;
}

const EditCruiseDestination: React.FC<Props> = ({ show, onHide, destination, onSave }) => {
    const [formData, setFormData] = useState<DestinationDto>({ destinationCode: "", destinationName: "" });

    useEffect(() => {
        if (destination) setFormData(destination);
        else setFormData({ destinationCode: "", destinationName: "" });
    }, [destination]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{destination ? "Edit Destination" : "Add Destination"}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Destination Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="destinationCode"
                            value={formData.destinationCode}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Destination Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="destinationName"
                            value={formData.destinationName}
                            onChange={handleChange}
                            required
                        />
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

export default EditCruiseDestination;
