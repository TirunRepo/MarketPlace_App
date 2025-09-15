import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import CruiseService, { type ICabinRow } from "../Services/CruiseService";

const AddCruiseInventory: React.FC = () => {
  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    sailDate: "",
    groupId: "",
    nights: "",
    packageName: "",
    destination: "",
    cruiseLine: "",
    departurePort: "",
    shipName: "",
    shipCode: "",
    categoryId: "",
    stateroomType: "",
    cabinOccupancy: "",
    cabins: [] as ICabinRow[],
    currency: "",
    pricingType: "", // Net or Commissionable
    commissionPercentage: "", // only used if pricingType = Commissionable
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** Add new empty cabin row */
  const addCabin = () => {
    setForm((prev) => ({
      ...prev,
      cabins: [
        ...prev.cabins,
        {
          cabinType: "GTY",
          cabinNo: "",
          status: "Occupied",
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

  /** Update cabin row */
  const handleCabinChange = (
    index: number,
    field: keyof ICabinRow,
    value: string | number
  ) => {
    const updated = [...form.cabins];
    updated[index][field] = value as never;
    setForm((prev) => ({ ...prev, cabins: updated }));
  };

  /** Save to API */
  const handleSave = async () => {
    try {
      await CruiseService.saveCruiseInventory(form);
      alert("Cruise Inventory Saved Successfully ✅");
      setShow(false);
    } catch (err) {
      console.error(err);
      alert("Error saving cruise inventory ❌");
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <Button variant="primary" onClick={() => setShow(true)}>
        Add Cruise Inventory
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Cruise Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Row 1 */}
            <Row className="mb-3">
              <Col>
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
              <Col>
                <Form.Group>
                  <Form.Label>Group Id</Form.Label>
                  <Form.Control
                    type="text"
                    name="groupId"
                    value={form.groupId}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
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

            {/* Package Name */}
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Package Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="packageName"
                    value={form.packageName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Destination & Cruise Line */}
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Destination</Form.Label>
                  <Form.Control
                    as="select"
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Destination --</option>
                    <option value="Caribbean">Caribbean</option>
                    <option value="Mediterranean">Mediterranean</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Cruise Line</Form.Label>
                  <Form.Control
                    as="select"
                    name="cruiseLine"
                    value={form.cruiseLine}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Cruise Line --</option>
                    <option value="Royal">Royal Caribbean</option>
                    <option value="Carnival">Carnival</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            {/* Ship details */}
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Departure Port</Form.Label>
                  <Form.Control
                    as="select"
                    name="departurePort"
                    value={form.departurePort}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Departure Port --</option>
                    <option value="Miami">Miami</option>
                    <option value="Barcelona">Barcelona</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Ship Name</Form.Label>
                  <Form.Control
                    as="select"
                    name="shipName"
                    value={form.shipName}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Cruise Ship --</option>
                    <option value="Symphony">Symphony of the Seas</option>
                    <option value="CarnivalVista">Carnival Vista</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            {/* Extra ship info */}
            <Row className="mb-3">
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
                  <Form.Label>Category Id</Form.Label>
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
                  <Form.Control
                    as="select"
                    name="stateroomType"
                    value={form.stateroomType}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Stateroom Type --</option>
                    <option value="Interior">Interior</option>
                    <option value="Balcony">Balcony</option>
                    <option value="Suite">Suite</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Cabin Occupancy</Form.Label>
                  <Form.Control
                    as="select"
                    name="cabinOccupancy"
                    value={form.cabinOccupancy}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Cabin Occupancy --</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            {/* Pricing Type Choice Group */}
            <Row className="mb-3">
              <Col>
                <Form.Group>
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

                    {/* Commissionable with input field */}
                    <Form.Check
                      inline
                      type="radio"
                      name="pricingType"
                      value="Commissionable"
                      checked={form.pricingType === "Commissionable"}
                      onChange={handleChange}
                      label={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span>Commissionable</span>
                          {form.pricingType === "Commissionable" && (
                            <Form.Control
                              type="number"
                              min="0"
                              max="100"
                              name="commissionPercentage"
                              value={form.commissionPercentage}
                              onChange={handleChange}
                              placeholder="%"
                              style={{
                                width: "80px",
                                marginLeft: "8px",
                                display: "inline-block",
                              }}
                            />
                          )}
                        </div>
                      }
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* Pricing Section (only if selected) */}
            {form.pricingType && (
              <>
                <h5 className="mt-3">Pricing</h5>
                <Row className="mb-2">
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Single Price"
                      name="singlePrice"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Double Price"
                      name="doublePrice"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Three Fourth Price"
                      name="threeFourthPrice"
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="NCCF"
                      name="nccf"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Tax"
                      name="tax"
                      onChange={handleChange}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Grats"
                      name="grats"
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              </>
            )}

            {/* Cabins */}
            <h5 className="mt-3">Cabins</h5>
            {form.cabins.map((cabin, index) => (
              <Row key={index} className="mb-2">
                <Col>
                  <Form.Select
                    value={cabin.cabinType}
                    onChange={(e) =>
                      handleCabinChange(index, "cabinType", e.target.value)
                    }
                  >
                    <option value="GTY">GTY</option>
                    <option value="Suite">Suite</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Cabin No"
                    value={cabin.cabinNo}
                    onChange={(e) =>
                      handleCabinChange(index, "cabinNo", e.target.value)
                    }
                  />
                </Col>
                <Col>
                  <Form.Select
                    value={cabin.status}
                    onChange={(e) =>
                      handleCabinChange(index, "status", e.target.value)
                    }
                  >
                    <option value="Occupied">Occupied</option>
                    <option value="Available">Available</option>
                  </Form.Select>
                </Col>
              </Row>
            ))}
            <Button variant="secondary" className="mt-2" onClick={addCabin}>
              + Add Cabin
            </Button>

            {/* Currency */}
            <Row className="mt-3">
              <Col>
                <Form.Group>
                  <Form.Label>Currency</Form.Label>
                  <Form.Control
                    as="select"
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Currency --</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddCruiseInventory;
