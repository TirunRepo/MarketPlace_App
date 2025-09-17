import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Card, Table } from "react-bootstrap";
import CruiseService, {
  type ICabinRow,
  type IDestination,
  type IPort,
  type ICruiseLine,
  type IShip,
  type ICruiseInventory,
  type ICruiseShip,
} from "../Services/CruiseService";

interface EditInventoryProps {
  show: boolean;
  onHide: () => void;
  inventoryData?: ICruiseInventory | null;
  onSave: (data: ICruiseInventory) => void;
  role: "Admin" | "Agent"; // 👈 NEW role prop
}

const emptyShip = (): ICruiseShip => ({
  cruiseShipId: "",
  shipName: "",
  shipCode: "",
  cruiseLine: { cruiseLineId: "", cruiseLineCode: "", cruiseLineName: "" },
});

const EditInventory: React.FC<EditInventoryProps> = ({
  show,
  onHide,
  inventoryData,
  onSave,
  role,
}) => {
  const [destinations, setDestinations] = useState<IDestination[]>([]);
  const [departurePorts, setDeparturePorts] = useState<IPort[]>([]);
  const [cruiseLines, setCruiseLines] = useState<ICruiseLine[]>([]);
  const [ships, setShips] = useState<IShip[]>([]);

  const [form, setForm] = useState<ICruiseInventory>({
    cruiseInventoryId: undefined,
    sailDate: "",
    groupId: "",
    nights: "",
    packageName: "",
    destination: "",
    departurePort: "",
    cruiseShip: undefined,
    categoryId: "",
    stateroomType: "",
    cabinOccupancy: "",
    currency: "",
    pricingType: "",
    commissionPercentage: null,
    singlePrice: 0,
    doublePrice: 0,
    threeFourthPrice: 0,
    nccf: 0,
    tax: 0,
    grats: 0,
    cabins: [],
    enableAgent: false,
    enableAdmin: false,
  });

  // Prefill when editing
  useEffect(() => {
    if (inventoryData) {
      setForm((prev) => ({
        ...prev,
        ...inventoryData,
        cruiseShip: inventoryData.cruiseShip ?? undefined,
        cabins: inventoryData.cabins ?? [],
      }));
    }
  }, [inventoryData, show]);

  // Load dropdowns
  useEffect(() => {
    CruiseService.getDestinations().then((res) => setDestinations(res.data || []));
    CruiseService.getCruiseLines().then((res) => setCruiseLines(res.data || []));
  }, []);

  useEffect(() => {
    if (form.destination) {
      CruiseService.getPorts(form.destination)
        .then((res) => setDeparturePorts(res.data || []))
        .catch(() => setDeparturePorts([]));
    } else {
      setDeparturePorts([]);
    }
  }, [form.destination]);

  useEffect(() => {
    const cruiseLineId = form.cruiseShip?.cruiseLine?.cruiseLineId;
    if (cruiseLineId) {
      CruiseService.getShips(cruiseLineId)
        .then((res) => setShips(res.data || []))
        .catch(() => setShips([]));
    } else {
      setShips([]);
    }
  }, [form.cruiseShip?.cruiseLine?.cruiseLineId]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addCabin = () => {
    setForm((prev) => ({
      ...prev,
      cabins: [
        ...prev.cabins,
        {
          cabinType: "GTY",
          cabinNo: "",
          status: "Available",
          singlePrice: 0,
          doublePrice: 0,
          threeFourthPrice: 0,
          nccf: 0,
          tax: 0,
          grats: 0,
        },
      ],
    }));
  };

  const removeCabin = (index: number) => {
    setForm((prev) => ({
      ...prev,
      cabins: prev.cabins.filter((_, i) => i !== index),
    }));
  };

  const handleCabinChange = (
    index: number,
    field: keyof ICabinRow,
    value: string | number
  ) => {
    setForm((prev) => {
      const updated = prev.cabins.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      );
      return { ...prev, cabins: updated };
    });
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold">
          {form.cruiseInventoryId ? "Edit Cruise Inventory" : "Add Cruise Inventory"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* BASIC INFO */}
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

          {/* CRUISE DETAILS */}
          {/* CRUISE DETAILS */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Cruise Details</h5>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Destination</Form.Label>
                    <Form.Select
                      name="destination"
                      value={form.destination}
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
                      name="departurePort"
                      value={form.departurePort}
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
                      value={form.cruiseShip?.cruiseLine?.cruiseLineId || ""}
                      onChange={(e) => {
                        const selectedLine = cruiseLines.find(
                          (c) => c.cruiseLineId === e.target.value
                        );
                        setForm((prev) => ({
                          ...prev,
                          cruiseShip: {
                            ...(prev.cruiseShip ?? emptyShip()),
                            cruiseLine:
                              selectedLine || {
                                cruiseLineId: "",
                                cruiseLineCode: "",
                                cruiseLineName: "",
                              },
                          },
                        }));
                      }}
                    >
                      <option value="">-- Select Cruise Line --</option>
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
                      value={form.cruiseShip?.cruiseShipId || ""}
                      onChange={(e) => {
                        const selectedShip = ships.find(
                          (s) => s.cruiseShipId === e.target.value
                        );
                        setForm((prev: any) => ({
                          ...prev,
                          cruiseShip: selectedShip
                            ? {
                              ...selectedShip,
                              cruiseLine:
                                prev.cruiseShip?.cruiseLine ?? {
                                  cruiseLineId: "",
                                  cruiseLineCode: "",
                                  cruiseLineName: "",
                                },
                            }
                            : prev.cruiseShip,
                        }));
                      }}
                      disabled={!ships.length}
                    >
                      <option value="">-- Select Ship --</option>
                      {ships.map((s) => (
                        <option key={s.cruiseShipId} value={s.cruiseShipId}>
                          {s.shipName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* ✅ NEW SECTION */}
              <Row className="mb-3 mt-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Ship Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="shipCode"
                      value={form.cruiseShip?.shipCode || ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          cruiseShip: prev.cruiseShip
                            ? { ...prev.cruiseShip, shipCode: e.target.value }
                            : { ...emptyShip(), shipCode: e.target.value },
                        }))
                      }
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
                      name="stateroomType"
                      value={form.stateroomType}
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

          {/* PRICING */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Pricing & Cabins</h5>
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
                    label={
                      <span>
                        Commissionable{" "}
                        {form.pricingType === "Commissionable" && (
                          <Form.Control
                            type="number"
                            min={0}
                            max={100}
                            name="commissionPercentage"
                            value={form.commissionPercentage || ""}
                            onChange={handleChange}
                            placeholder="%"
                            className="d-inline-block ms-2"
                            style={{ width: "80px" }}
                          />
                        )}
                      </span>
                    }
                  />
                </div>
              </Form.Group>

              {form.pricingType && (
                <>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        placeholder="Single Price"
                        name="singlePrice"
                        value={form.singlePrice}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        placeholder="Double Price"
                        name="doublePrice"
                        value={form.doublePrice}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        placeholder="Three Fourth Price"
                        name="threeFourthPrice"
                        value={form.threeFourthPrice}
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
                        value={form.nccf}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        placeholder="Tax"
                        name="tax"
                        value={form.tax}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="number"
                        placeholder="Grats"
                        name="grats"
                        value={form.grats}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </>
              )}

              <Form.Group className="mt-3">
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

              {/* Cabins */}
              <h6 className="fw-semibold mt-4">Cabins</h6>
              <Table bordered hover size="sm" responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Type</th>
                    <th>Cabin No</th>
                    <th>Status</th>
                    <th style={{ width: "80px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {form.cabins.map((cabin, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Select
                          value={cabin.cabinType}
                          onChange={(e) =>
                            handleCabinChange(index, "cabinType", e.target.value)
                          }
                        >
                          <option value="GTY">GTY</option>
                          <option value="Manual">Manual</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="Cabin No"
                          value={cabin.cabinNo}
                          onChange={(e) =>
                            handleCabinChange(index, "cabinNo", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Form.Select
                          value={cabin.status}
                          onChange={(e) =>
                            handleCabinChange(index, "status", e.target.value)
                          }
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                        </Form.Select>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeCabin(index)}
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

          {/* ROLE SETTINGS */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Role Settings</h5>
              {role === "Admin" && (
                <Form.Check
                  type="switch"
                  id="enableAgentSwitch"
                  label="Enable for Agent"
                  name="enableAgent"
                  checked={form.enableAgent}
                  onChange={handleChange}
                />
              )}
              {role === "Agent" && (
                <Form.Check
                  type="switch"
                  id="enableAdminSwitch"
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
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditInventory;
