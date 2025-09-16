import React, { useEffect, useState } from "react";
import { Table, Button, Card,Pagination, Col, Row } from "react-bootstrap";
import DeparturePortService, { type DestinationDto, type DeparturePortDto } from "../../Services/cruiseDepartures/DeparturePortService";
import EditCruiseDeparture from "./EditCruiseDeparturePort";

const CruiseDeparturePortManager: React.FC = () => {
  const [ports, setPorts] = useState<DeparturePortDto[]>([]);
  const [destinations, setDestinations] = useState<DestinationDto[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedPort, setSelectedPort] = useState<DeparturePortDto>({
    departurePortCode: "",
    departurePortName: "",
    destinationCode: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  // Fetch ports list for current page
  const fetchPorts = async (page = currentPage) => {
    try {
      const data = await DeparturePortService.getAll(page, pageSize);
      setPorts(data.data.items);
      setCurrentPage(data.data.currentPage);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDestinations = async () => {
    try {
      const data = await DeparturePortService.getAllDestinations();
      debugger
      setDestinations(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPorts();
    fetchDestinations();
  }, []);

  // Refetch ports whenever currentPage changes
  useEffect(() => {
    fetchPorts(currentPage);
  }, [currentPage]);

  // Open modal for edit
  const handleEdit = (port: DeparturePortDto) => {
    setSelectedPort(port);
    setModalShow(true);
  };

  // Open modal for add
  const handleAdd = () => {
    setSelectedPort({ departurePortCode: "", departurePortName: "", destinationCode: "" });
    setModalShow(true);
  };

  // Delete port
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this port?")) return;
    await DeparturePortService.delete(id);
    fetchPorts();
  };

  // Save port (add or update)
  const handleSave = async (portData: DeparturePortDto) => {
    if (portData.departurePortId) {
      await DeparturePortService.update(portData);
    } else {
      await DeparturePortService.add(portData);
    }
    setModalShow(false);
    fetchPorts();
  };

  // Pagination renderer
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNeighbors = 2;
    const pages: (number | string)[] = [];

    if (currentPage > pageNeighbors + 2) pages.push(1, "...");
    for (let i = Math.max(1, currentPage - pageNeighbors); i <= Math.min(totalPages, currentPage + pageNeighbors); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - pageNeighbors - 1) pages.push("...", totalPages);

    return (
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
        {pages.map((page, idx) =>
          typeof page === "number" ? (
            <Pagination.Item key={idx} active={page === currentPage} onClick={() => setCurrentPage(page)}>
              {page}
            </Pagination.Item>
          ) : (
            <Pagination.Ellipsis key={idx} disabled />
          )
        )}
        <Pagination.Next onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>
    );
  };

  return (
    <div>
      <Row className="mb-3">
        <Col xs={12} md={3}>
          <Button variant="primary" onClick={handleAdd}>Add Departure Port</Button></Col></Row>
      <Row>
        <Col xs={12}>
          <Card className="p-4 shadow-sm">


            {/* Table */}
            <Table hover responsive striped bordered className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Port Code</th>
                  <th>Port Name</th>
                  <th>Destination Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ports.map(port => (
                  <tr key={port.departurePortId}>
                    <td>{port.departurePortCode}</td>
                    <td>{port.departurePortName}</td>
                    <td>{port.destinationCode}</td>
                    <td style={{ display: "flex", gap: "10px" }}>
                      <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(port)}>Edit</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => port.departurePortId && handleDelete(port.departurePortId)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
            {renderPagination()}
          </Card>
        </Col></Row>

      {/* Modal */}
      <EditCruiseDeparture show={modalShow} onHide={() => setModalShow(false)} selectedPort={selectedPort} destinations={destinations} onSave={handleSave} />

    </div>
  );
};

export default CruiseDeparturePortManager;
