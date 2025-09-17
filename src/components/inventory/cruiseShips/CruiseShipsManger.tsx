import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Table } from "react-bootstrap";
import ShipService, { type ShipDto, type CruiseLineDto } from "../../Services/cruiseShips/CruiseShipsService";
import EditShips from "./EditShips";
import CustomPagination from "../../../common/CustomPagination";
import LoadingOverlay from "../../../common/LoadingOverlay";
import { useToast } from "../../../common/Toaster";
import ConfirmationModal from "../../../common/ConfirmationModal";

const CruiseShipsManager: React.FC = () => {
  const [ships, setShips] = useState<ShipDto[]>([]);
  const [cruiseLines, setCruiseLines] = useState<CruiseLineDto[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedShip, setSelectedShip] = useState<ShipDto>({ shipCode: "", shipName: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [shipToDelete, setShipToDelete] = useState<number | null>(null);

  const { showToast } = useToast();

  // Fetch ships with pagination
  const fetchShips = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const data = await ShipService.getShips(page, size);
      setShips(data.data.items || []);
      setCurrentPage(data.data.currentPage || 1);
      setTotalPages(data.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching ships:", error);
      showToast("Failed to fetch ships", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cruise lines for dropdown
  const fetchCruiseLines = async () => {
    try {
      const data = await ShipService.getCruiseLines();
      setCruiseLines(data.data || []);
    } catch (error) {
      console.error("Error fetching cruise lines:", error);
      showToast("Failed to fetch cruise lines", "error");
    }
  };

  useEffect(() => {
    fetchShips(currentPage, pageSize);
    fetchCruiseLines();
  }, [currentPage, pageSize]);

  // Save ship (add/update)
  const handleSave = async (ship: ShipDto) => {
    setLoading(true);
    try {
      if (ship.cruiseShipId) {
        await ShipService.updateShip(ship);
        showToast("Ship updated successfully", "success");
      } else {
        await ShipService.addShip(ship);
        showToast("Ship added successfully", "success");
      }
      setModalShow(false);
      fetchShips(currentPage, pageSize);
    } catch (error) {
      console.error("Error saving ship:", error);
      showToast("Error saving ship", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete ship
  const handleDeleteConfirm = async () => {
    if (!shipToDelete) return;
    setLoading(true);
    try {
      await ShipService.deleteShip(shipToDelete);
      showToast("Ship deleted successfully", "success");
      fetchShips(currentPage, pageSize);
    } catch (error) {
      console.error("Error deleting ship:", error);
      showToast("Error deleting ship", "error");
    } finally {
      setLoading(false);
      setDeleteModal(false);
      setShipToDelete(null);
    }
  };

  const handleDelete = (id: number) => {
    setShipToDelete(id);
    setDeleteModal(true);
  };

  return (
    <div className="mt-4">
      <LoadingOverlay show={loading} />

      {/* Add Ship Button */}
      <Row className="mb-3">
        <Col xs={12} md={3}>
          <Button
            variant="primary"
            className="w-100"
            onClick={() => {
              setSelectedShip({ shipCode: "", shipName: "" });
              setModalShow(true);
            }}
          >
            Add Ship
          </Button>
        </Col>
      </Row>

      {/* Ships Table */}
      <Row>
        <Col xs={12}>
          <Card className="p-4 shadow-sm">
            <h4 className="mb-4 text-center">Ships List</h4>
            <Table hover responsive striped bordered className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Cruise Line</th>
                  <th>Ship Code</th>
                  <th>Ship Name</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ships.length ? (
                  ships.map((ship) => (
                    <tr key={ship.cruiseShipId}>
                      <td>{ship.cruiseShipId}</td>
                      <td>{ship.cruiseLine?.cruiseLineCode || "-"}</td>
                      <td>{ship.shipCode}</td>
                      <td>{ship.shipName}</td>
                      <td className="text-center" style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                        <Button size="sm" variant="outline-primary" onClick={() => { setSelectedShip(ship); setModalShow(true); }}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => ship.cruiseShipId && handleDelete(ship.cruiseShipId)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No ships found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <EditShips
        show={modalShow}
        onHide={() => setModalShow(false)}
        shipData={selectedShip}
        cruiseLines={cruiseLines}
        onSave={handleSave}
      />

      <ConfirmationModal
        show={deleteModal}
        title="Delete Ship"
        message="Are you sure you want to delete this ship?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
};

export default CruiseShipsManager;
