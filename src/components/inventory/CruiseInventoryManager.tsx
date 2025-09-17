import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Table } from "react-bootstrap";
import EditInventory from "./EditInventory";
import CruiseService, { type ICruiseInventory } from "../Services/CruiseService";
import ApiUtility, { type IApiResponse } from "../../utility/ApiUtility";
import type { IPagedData } from "../../common/IPagedData";
import CustomPagination from "../../common/CustomPagination";
import LoadingOverlay from "../../common/LoadingOverlay";
import { useToast } from "../../common/Toaster";
import ConfirmationModal from "../../common/ConfirmationModal";

const CruiseInventoryManager: React.FC = () => {
  const [inventories, setInventories] = useState<ICruiseInventory[]>([]);
  const [selectedInventory, setSelectedInventory] = useState<ICruiseInventory | null>(null);
  const [modalShow, setModalShow] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState<string | number | null>(null);

  const role: "Admin" | "Agent" = "Admin";
  const { showToast } = useToast();

  // Fetch inventories
  const fetchInventories = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const res = await ApiUtility.get<IApiResponse<IPagedData<ICruiseInventory>>>(
        `/api/CruiseInventories?page=${page}&pageSize=${size}`
      );
      const paged = res.data.data;
      setInventories(paged.items || []);
      setCurrentPage(paged.currentPage || 1);
      setTotalPages(paged.totalPages || 1);
    } catch (err) {
      console.error("Error fetching inventories:", err);
      showToast("Failed to fetch inventories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Save inventory
  const handleSave = async (inventory: ICruiseInventory) => {
    setLoading(true);
    try {
      await CruiseService.saveCruiseInventory(inventory);
      showToast("Inventory saved successfully", "success");
      setModalShow(false);
      fetchInventories(currentPage, pageSize);
    } catch (err) {
      console.error("Error saving inventory:", err);
      showToast("Error saving inventory", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete inventory
  const handleDeleteConfirm = async () => {
    if (!inventoryToDelete) return;
    setLoading(true);
    try {
      await ApiUtility.delete(`/api/CruiseInventories/${inventoryToDelete}`);
      showToast("Inventory deleted successfully", "success");
      fetchInventories(currentPage, pageSize);
    } catch (err) {
      console.error("Error deleting inventory:", err);
      showToast("Error deleting inventory", "error");
    } finally {
      setLoading(false);
      setDeleteModal(false);
      setInventoryToDelete(null);
    }
  };

  const handleDelete = (id: string | number) => {
    setInventoryToDelete(id);
    setDeleteModal(true);
  };

  const emptyInventory = (): ICruiseInventory => ({
    sailDate: "",
    groupId: "",
    nights: "",
    packageName: "",
    destination: "",
    departurePort: "",
    cruiseShip: {
      cruiseShipId: "",
      shipName: "",
      shipCode: "",
      cruiseLine: { cruiseLineId: "", cruiseLineCode: "", cruiseLineName: "" },
    },
    categoryId: "",
    stateroomType: "",
    cabinOccupancy: "",
    cabins: [],
    currency: "",
    pricingType: "",
    commissionPercentage: null,
    singlePrice: 0,
    doublePrice: 0,
    threeFourthPrice: 0,
    nccf: 0,
    tax: 0,
    grats: 0,
    enableAgent: true,
    enableAdmin: true,
  });

  return (
    <div className="mt-4">
      <LoadingOverlay show={loading} />

      {/* Add Inventory Button */}
      <Row className="mb-3">
        <Col xs={12} md={3}>
          <Button
            variant="primary"
            className="w-100"
            onClick={() => {
              setSelectedInventory(emptyInventory());
              setModalShow(true);
            }}
          >
            Add Inventory
          </Button>
        </Col>
      </Row>

      {/* Inventory Table */}
      <Row>
        <Col xs={12}>
          <Card className="p-4 shadow-sm">
            <h4 className="mb-4 text-center">Cruise Inventory List</h4>
            <Table hover responsive striped bordered className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Departure Port</th>
                  <th>Destination</th>
                  <th>Sail Date</th>
                  <th>Ship Name</th>
                  <th>Line Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventories.length ? (
                  inventories.map((inv) => (
                    <tr key={inv.cruiseInventoryId ?? JSON.stringify(inv)}>
                      <td>{inv.cruiseInventoryId ?? "-"}</td>
                      <td>{inv.departurePort ?? "-"}</td>
                      <td>{inv.destination ?? "-"}</td>
                      <td>{inv.sailDate ?? "-"}</td>
                      <td>{inv.cruiseShip?.shipName ?? "-"}</td>
                      <td>{inv.cruiseShip?.cruiseLine?.cruiseLineCode ?? "-"}</td>
                      <td style={{ display: "flex", gap: "10px" }}>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => {
                            setSelectedInventory(inv);
                            setModalShow(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => inv.cruiseInventoryId && handleDelete(inv.cruiseInventoryId)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      No inventory found
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

      {/* Edit Inventory Modal */}
      {selectedInventory && (
        <EditInventory
          show={modalShow}
          onHide={() => setModalShow(false)}
          inventoryData={selectedInventory}
          onSave={handleSave}
          role={role}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={deleteModal}
        title="Delete Inventory"
        message="Are you sure you want to delete this inventory?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
};

export default CruiseInventoryManager;
