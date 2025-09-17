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
  role: "Admin" | "Agent";
}

const emptyShip = (): ICruiseShip => ({
  cruiseShipId: "",
  shipName: "",
  shipCode: "",
  cruiseLine: { cruiseLineId: "", cruiseLineCode: "", cruiseLineName: "" },
});

const emptyInventory = (): ICruiseInventory => ({
  cruiseInventoryId: undefined,
  sailDate: "",
  groupId: "",
  nights: "",
  packageName: "",
  destination: "",
  departurePort: "",
  cruiseShip: emptyShip(),
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

  // Prefill form when editing
  useEffect(() => {
    setForm(inventoryData ? { ...inventoryData, cruiseShip: inventoryData.cruiseShip ?? emptyShip() } : emptyInventory());
  }, [inventoryData, show]);

  // Load dropdowns
  useEffect(() => {
    CruiseService.getDestinations().then((res) => setDestinations(res.data || []));
    CruiseService.getCruiseLines().then((res) => setCruiseLines(res.data || []));
  }, []);

  // Load ports when destination changes
  useEffect(() => {
    if (form.destination) {
      CruiseService.getPorts(form.destination)
        .then((res) => setDeparturePorts(res.data || []))
        .catch(() => setDeparturePorts([]));
    } else {
      setDeparturePorts([]);
    }
  }, [form.destination]);

  // Load ships when cruise line changes
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

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCruiseLineChange = (cruiseLineId: string) => {
    const selectedLine = cruiseLines.find((c) => c.cruiseLineId === cruiseLineId);
    setForm((prev) => ({
      ...prev,
      cruiseShip: { ...(prev.cruiseShip ?? emptyShip()), cruiseLine: selectedLine ?? emptyShip().cruiseLine },
    }));
  };

  const handleShipChange = (shipId: string) => {
    const selectedShip = ships.find((s) => s.cruiseShipId === shipId);
    if (selectedShip) {
      setForm((prev:any) => ({
        ...prev,
        cruiseShip: { ...selectedShip, cruiseLine: prev.cruiseShip?.cruiseLine ?? emptyShip().cruiseLine },
      }));
    }
  };

  const addCabin = () => {
    setForm((prev) => ({
      ...prev,
      cabins: [
        ...prev.cabins,
        { cabinType: "GTY", cabinNo: "", status: "Available", singlePrice: 0, doublePrice: 0, threeFourthPrice: 0, nccf: 0, tax: 0, grats: 0 },
      ],
    }));
  };

  const removeCabin = (index: number) => {
    setForm((prev) => ({ ...prev, cabins: prev.cabins.filter((_, i) => i !== index) }));
  };

  const handleCabinChange = (index: number, field: keyof ICabinRow, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      cabins: prev.cabins.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }));
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>{form.cruiseInventoryId ? "Edit Cruise Inventory" : "Add Cruise Inventory"}</Modal.Title>
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
                    <Form.Control type="date" name="sailDate" value={form.sailDate} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Group ID</Form.Label>
                    <Form.Control type="text" name="groupId" value={form.groupId} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Nights</Form.Label>
                    <Form.Control type="number" name="nights" value={form.nights} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mt-3">
                <Form.Label>Package Name</Form.Label>
                <Form.Control type="text" name="packageName" value={form.packageName} onChange={handleChange} />
              </Form.Group>
            </Card.Body>
          </Card>

          {/* CRUISE DETAILS */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Cruise Details</h5>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Destination</Form.Label>
                    <Form.Select name="destination" value={form.destination} onChange={handleChange}>
                      <option value="">-- Select Destination --</option>
                      {destinations.map((d) => (
                        <option key={d.destinationCode} value={d.destinationCode}>{d.destinationName}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Departure Port</Form.Label>
                    <Form.Select name="departurePort" value={form.departurePort} onChange={handleChange} disabled={!departurePorts.length}>
                      <option value="">-- Select Departure Port --</option>
                      {departurePorts.map((p) => <option key={p.departurePortId} value={p.departurePortId}>{p.departurePortName}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-3 mt-1">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Cruise Line</Form.Label>
                    <Form.Select value={form.cruiseShip?.cruiseLine?.cruiseLineId || ""} onChange={(e) => handleCruiseLineChange(e.target.value)}>
                      <option value="">-- Select Cruise Line --</option>
                      {cruiseLines.map((c) => <option key={c.cruiseLineId} value={c.cruiseLineId}>{c.cruiseLineName}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Ship</Form.Label>
                    <Form.Select value={form.cruiseShip?.cruiseShipId || ""} onChange={(e) => handleShipChange(e.target.value)} disabled={!ships.length}>
                      <option value="">-- Select Ship --</option>
                      {ships.map((s) => <option key={s.cruiseShipId} value={s.cruiseShipId}>{s.shipName}</option>)}
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

          {/* PRICING & CABINS */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Pricing & Cabins</h5>
              {/* Pricing Fields */}
              <Row className="g-3 mb-3">
                <Col md={4}><Form.Control type="number" placeholder="Single Price" name="singlePrice" value={form.singlePrice} onChange={handleChange} /></Col>
                <Col md={4}><Form.Control type="number" placeholder="Double Price" name="doublePrice" value={form.doublePrice} onChange={handleChange} /></Col>
                <Col md={4}><Form.Control type="number" placeholder="Three Fourth Price" name="threeFourthPrice" value={form.threeFourthPrice} onChange={handleChange} /></Col>
              </Row>
              {/* Cabins Table */}
              <h6 className="fw-semibold mt-4">Cabins</h6>
              <Table bordered hover size="sm" responsive>
                <thead className="table-light">
                  <tr><th>Type</th><th>Cabin No</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {form.cabins.map((cabin, i) => (
                    <tr key={i}>
                      <td>
                        <Form.Select value={cabin.cabinType} onChange={(e) => handleCabinChange(i, "cabinType", e.target.value)}>
                          <option value="GTY">GTY</option>
                          <option value="Manual">Manual</option>
                        </Form.Select>
                      </td>
                      <td><Form.Control type="text" value={cabin.cabinNo} onChange={(e) => handleCabinChange(i, "cabinNo", e.target.value)} /></td>
                      <td>
                        <Form.Select value={cabin.status} onChange={(e) => handleCabinChange(i, "status", e.target.value)}>
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                        </Form.Select>
                      </td>
                      <td className="text-center"><Button size="sm" variant="outline-danger" onClick={() => removeCabin(i)}>Delete</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="outline-secondary" size="sm" onClick={addCabin}>+ Add Cabin</Button>
            </Card.Body>
          </Card>

          {/* ROLE SETTINGS */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Role Settings</h5>
              {role === "Admin" && <Form.Check type="switch" id="enableAgentSwitch" label="Enable for Agent" name="enableAgent" checked={form.enableAgent} onChange={handleChange} />}
              {role === "Agent" && <Form.Check type="switch" id="enableAdminSwitch" label="Enable for Admin" name="enableAdmin" checked={form.enableAdmin} onChange={handleChange} />}
            </Card.Body>
          </Card>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={() => onSave(form)}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditInventory;
