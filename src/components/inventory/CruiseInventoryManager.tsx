import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Table, Pagination } from "react-bootstrap";
import EditInventory from "./EditInventory";
import CruiseService, { type ICruiseInventory } from "../Services/CruiseService";
import ApiUtility, { type IApiResponse } from "../../utility/ApiUtility";
import type { IPagedData } from "../../common/IPagedData";

const CruiseInventoryManager: React.FC = () => {
  const [inventories, setInventories] = useState<ICruiseInventory[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<ICruiseInventory | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  // Assume role comes from auth (hardcoded here for demo)
  const role: "Admin" | "Agent" = "Admin";

  const fetchInventories = async (page = 1) => {
    try {
      const data = await ApiUtility.get<IApiResponse<IPagedData<any>>>(
        `/api/CruiseInventories?page=${page}&pageSize=${pageSize}`
      );
      const paged = data.data.data;
      setInventories(paged.items || []);
      setCurrentPage(paged.currentPage || 1);
      setTotalPages(paged.totalPages || 1);
    } catch (error) {
      console.error("fetchInventories error", error);
    }
  };

  useEffect(() => {
    fetchInventories(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleSave = async (inventory: ICruiseInventory) => {
    try {
      await CruiseService.saveCruiseInventory(inventory);
      setModalShow(false);
      fetchInventories(currentPage);
    } catch (error) {
      console.error(error);
      alert("Error saving inventory");
    }
  };

  const handleDelete = async (id?: string | number) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this inventory?")) return;
    try {
      await ApiUtility.delete(`${"/api/CruiseInventories"}/${id}`);
      fetchInventories(currentPage);
    } catch (error) {
      console.error(error);
      alert("Error deleting inventory");
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNeighbors = 2;
    const pages: (number | string)[] = [];

    if (currentPage > pageNeighbors + 2) pages.push(1, "...");
    for (
      let i = Math.max(1, currentPage - pageNeighbors);
      i <= Math.min(totalPages, currentPage + pageNeighbors);
      i++
    )
      pages.push(i);
    if (currentPage < totalPages - pageNeighbors - 1) pages.push("...", totalPages);

    return (
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {pages.map((page, idx) =>
          typeof page === "number" ? (
            <Pagination.Item
              key={idx}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Pagination.Item>
          ) : (
            <Pagination.Ellipsis key={idx} disabled />
          )
        )}
        <Pagination.Next
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
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
                  inventories.map((inv: any) => (
                    <tr key={inv.cruiseInventoryId ?? inv.id ?? JSON.stringify(inv)}>
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
                          onClick={() =>
                            inv.cruiseInventoryId && handleDelete(inv.cruiseInventoryId)
                          }
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
            {renderPagination()}
          </Card>
        </Col>
      </Row>

      {selectedInventory !== null && (
        <EditInventory
          show={modalShow}
          onHide={() => setModalShow(false)}
          inventoryData={selectedInventory}
          onSave={handleSave}
          role={role}
        />
      )}
    </div>
  );
};

export default CruiseInventoryManager;
