import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Card, Table } from "react-bootstrap";
import CruiseService, {
  type IDestination,
  type IPort,
  type ICruiseLine,
  type IShip,
  type ICabinDetails,
  type ICruiseInventory,
} from "../Services/CruiseService";

interface EditInventoryProps {
  show: boolean;
  onHide: () => void;
  inventoryData?: ICruiseInventory | null;
  onSave: (data: ICruiseInventory) => void;
  role: "Admin" | "Agent";
}

// ==== HELPERS ====

const emptyInventory = (): ICruiseInventory => ({
  id: null,
  sailDate: "",
  groupId: "",
  nights: "",
  packageName: "",
  destinationId: "",
  departurePortId: "",
  cruiseLineId: 0,
  shipId: 0,
  shipCode: "",
  categoryId: "",
  stateroom: "",
  cabinOccupancy: "",
  currency: "",
  pricingType: "",
  commissionPercentage: null,
  singleRate: null,
  doubleRate: null,
  tripleRate: null,
  nccf: null,
  tax: null,
  grats: null,
  enableAgent: false,
  enableAdmin: false,
  cabins: [],
});

const emptyCabin = (): ICabinDetails => ({
  cabinNo: "",
  cabinType: "GTY",
  cabinOccupancy: "Available",
});

// ==== COMPONENT ====

const EditInventory: React.FC<EditInventoryProps> = ({
  show,
  onHide,
  inventoryData,
  onSave,
  role,
}) => {
  const [form, setForm] = useState<ICruiseInventory>(emptyInventory());

  const [destinations, setDestinations] = useState<IDestination[]>([]);
  const [departurePorts, setDeparturePorts] = useState<IPort[]>([]);
  const [cruiseLines, setCruiseLines] = useState<ICruiseLine[]>([]);
  const [ships, setShips] = useState<IShip[]>([]);

  // Prefill form
  useEffect(() => {
    setForm(inventoryData ? { ...inventoryData } : emptyInventory());
  }, [inventoryData, show]);

  // Load dropdown data
  useEffect(() => {
    CruiseService.getDestinations().then((res) =>
      setDestinations(res.data ?? [])
    );
    CruiseService.getCruiseLines().then((res) =>
      setCruiseLines(res.data ?? [])
    );
  }, []);

  // Load ports when destination changes
  useEffect(() => {
    if (form.destinationId) {
      CruiseService.getPorts(form.destinationId)
        .then((res) => setDeparturePorts(res.data ?? []))
        .catch(() => setDeparturePorts([]));
    } else {
      setDeparturePorts([]);
    }
  }, [form.destinationId]);

  // Load ships when cruise line changes
  useEffect(() => {
    if (form.cruiseLineId) {
      CruiseService.getShips(form.cruiseLineId)
        .then((res) => setShips(res.data ?? []))
        .catch(() => setShips([]));
    } else {
      setShips([]);
    }
  }, [form.cruiseLineId]);

  // ==== HANDLERS ====

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addCabin = () => {
    setForm((prev) => ({ ...prev, cabins: [...prev.cabins, emptyCabin()] }));
  };

  const removeCabin = (index: number) => {
    setForm((prev) => ({
      ...prev,
      cabins: prev.cabins.filter((_, i) => i !== index),
    }));
  };

  const handleCabinChange = (
    index: number,
    field: keyof ICabinDetails,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      cabins: prev.cabins.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  };

  // ==== RENDER ====

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          {form.id ? "Edit Cruise Inventory" : "Add Cruise Inventory"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* === BASIC INFO === */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Basic Information</h5>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Sail Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="sailDate"
                      value={form.sailDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Group ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="groupId"
                      value={form.groupId}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Nights</Form.Label>
                    <Form.Control
                      type="number"
                      name="nights"
                      value={form.nights}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mt-3">
                <Form.Label>Package Name</Form.Label>
                <Form.Control
                  type="text"
                  name="packageName"
                  value={form.packageName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Card.Body>
          </Card>

          {/* === CRUISE DETAILS === */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Cruise Details</h5>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Destination</Form.Label>
                    <Form.Select
                      name="destinationId"
                      value={form.destinationId}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Destination --</option>
                      {destinations.map((d) => (
                        <option key={d.destinationCode} value={d.destinationCode}>
                          {d.destinationName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Departure Port</Form.Label>
                    <Form.Select
                      name="departurePortId"
                      value={form.departurePortId}
                      onChange={handleChange}
                      disabled={!departurePorts.length}
                    >
                      <option value="">-- Select Departure Port --</option>
                      {departurePorts.map((p) => (
                        <option key={p.departurePortId} value={p.departurePortId}>
                          {p.departurePortName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mt-1">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Cruise Line</Form.Label>
                    <Form.Select
                      name="cruiseLineId"
                      value={form.cruiseLineId}
                      onChange={handleChange}
                    >
                      <option value={0}>-- Select Cruise Line --</option>
                      {cruiseLines.map((c) => (
                        <option key={c.cruiseLineId} value={c.cruiseLineId}>
                          {c.cruiseLineName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Ship</Form.Label>
                    <Form.Select
                      name="shipId"
                      value={form.shipId}
                      onChange={handleChange}
                      disabled={!ships.length}
                    >
                      <option value={0}>-- Select Ship --</option>
                      {ships.map((s) => (
                        <option key={s.cruiseShipId} value={s.cruiseShipId}>
                          {s.shipName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Ship Code, Category, Stateroom, Cabin Occupancy */}
              <Row className="mt-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Ship Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="shipCode"
                      value={form.shipCode}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Category ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="categoryId"
                      value={form.categoryId}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Stateroom Type</Form.Label>
                    <Form.Select
                      name="stateroom"
                      value={form.stateroom}
                      onChange={handleChange}
                    >
                      <option value="">-- Select --</option>
                      <option value="Interior">Interior</option>
                      <option value="Balcony">Balcony</option>
                      <option value="Suite">Suite</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Cabin Occupancy</Form.Label>
                    <Form.Select
                      name="cabinOccupancy"
                      value={form.cabinOccupancy}
                      onChange={handleChange}
                    >
                      <option value="">-- Select --</option>
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Triple">Triple</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* === PRICING === */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Pricing & Cabins</h5>

              {/* Currency */}
              <Form.Group className="mb-3">
                <Form.Label>Currency</Form.Label>
                <Form.Select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                >
                  <option value="">-- Select Currency --</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="INR">INR</option>
                </Form.Select>
              </Form.Group>

              {/* Pricing Type */}
              <Form.Group className="mb-3">
                <Form.Label>Pricing Type</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    name="pricingType"
                    value="Net"
                    checked={form.pricingType === "Net"}
                    onChange={handleChange}
                    label="Net"
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name="pricingType"
                    value="Commissionable"
                    checked={form.pricingType === "Commissionable"}
                    onChange={handleChange}
                    label="Commissionable"
                  />
                  {form.pricingType === "Commissionable" && (
                    <Form.Control
                      type="number"
                      min={0}
                      max={100}
                      name="commissionPercentage"
                      value={form.commissionPercentage ?? ""}
                      onChange={handleChange}
                      placeholder="%"
                      className="d-inline-block ms-2"
                      style={{ width: "80px" }}
                    />
                  )}
                </div>
              </Form.Group>

              {/* Rates */}
              {form.pricingType && (
                <>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        placeholder="Single Rate"
                        name="singleRate"
                        value={form.singleRate ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        placeholder="Double Rate"
                        name="doubleRate"
                        value={form.doubleRate ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        placeholder="Triple Rate"
                        name="tripleRate"
                        value={form.tripleRate ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                  <Row className="g-3 mt-1">
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        placeholder="NCCF"
                        name="nccf"
                        value={form.nccf ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        placeholder="Tax"
                        name="tax"
                        value={form.tax ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        placeholder="Grats"
                        name="grats"
                        value={form.grats ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </>
              )}

              {/* Cabins */}
              <h6 className="fw-semibold mt-4">Cabins</h6>
              <Table bordered hover size="sm" responsive>
                <thead className="table-light">
                  <tr>
                    <th>Type</th>
                    <th>Cabin No</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {form.cabins.map((cabin, i) => (
                    <tr key={i}>
                      <td>
                        <Form.Select
                          value={cabin.cabinType}
                          onChange={(e) =>
                            handleCabinChange(i, "cabinType", e.target.value)
                          }
                        >
                          <option value="GTY">GTY</option>
                          <option value="Manual">Manual</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={cabin.cabinNo}
                          onChange={(e) =>
                            handleCabinChange(i, "cabinNo", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Form.Select
                          value={cabin.cabinOccupancy}
                          onChange={(e) =>
                            handleCabinChange(i, "cabinOccupancy", e.target.value)
                          }
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                        </Form.Select>
                      </td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => removeCabin(i)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="outline-secondary" size="sm" onClick={addCabin}>
                + Add Cabin
              </Button>
            </Card.Body>
          </Card>

          {/* === ROLE SETTINGS === */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Role Settings</h5>
              {role === "Admin" && (
                <Form.Check
                  type="switch"
                  label="Enable for Agent"
                  name="enableAgent"
                  checked={form.enableAgent}
                  onChange={handleChange}
                />
              )}
              {role === "Agent" && (
                <Form.Check
                  type="switch"
                  label="Enable for Admin"
                  name="enableAdmin"
                  checked={form.enableAdmin}
                  onChange={handleChange}
                />
              )}
            </Card.Body>
          </Card>
        </Form>
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onSave(form)}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditInventory;
