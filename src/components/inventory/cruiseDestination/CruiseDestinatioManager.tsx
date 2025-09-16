import React, { useEffect, useState } from "react";
import { Card, Table, Button, Pagination, Col, Row } from "react-bootstrap";
import CruiseDestinationService, { type DestinationDto } from "../../Services/cruiseDestination/CruiseDestinationService";
import EditCruiseDestination from "./EditCruiseDestination";

const pageSize = 5; // items per page

const CruiseDestinationManager: React.FC = () => {
    const [destinations, setDestinations] = useState<DestinationDto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [modalShow, setModalShow] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState<DestinationDto>({
        destinationCode: "",
        destinationName: "",
    });

    // Fetch destinations with pagination
    const fetchDestinations = async (page = currentPage) => {
        try {
            const data = await CruiseDestinationService.getAll(page, pageSize); // API should support page & pageSize
            setDestinations(data.data.items || []);
            setCurrentPage(data.data.currentPage || 1);
            setTotalPages(data.data.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch destinations:", error);
        }
    };

    useEffect(() => {
        fetchDestinations();
    }, [currentPage]);

    // Open modal for add
    const handleAdd = () => {
        setSelectedDestination({ destinationCode: "", destinationName: "" });
        setModalShow(true);
    };

    // Open modal for edit
    const handleEdit = (destination: DestinationDto) => {
        setSelectedDestination(destination);
        setModalShow(true);
    };

    // Delete destination
    const handleDelete = async (code: string) => {
        if (!window.confirm("Are you sure you want to delete this destination?")) return;
        try {
            await CruiseDestinationService.delete(code);
            fetchDestinations();
        } catch (error) {
            console.error("Failed to delete destination:", error);
        }
    };

    // Save destination (add or update)
    const handleSave = async () => {
        try {
            if (selectedDestination.destinationCode) {
                await CruiseDestinationService.update(selectedDestination);
            } else {
                await CruiseDestinationService.add(selectedDestination);
            }
            setModalShow(false);
            fetchDestinations();
        } catch (error) {
            console.error("Failed to save destination:", error);
        }
    };

    // Render pagination
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNeighbors = 2;
        const pages: (number | string)[] = [];

        if (currentPage > 1 + pageNeighbors + 1) pages.push(1, "...");
        else for (let i = 1; i < currentPage; i++) pages.push(i);

        for (let i = Math.max(1, currentPage - pageNeighbors); i <= Math.min(totalPages, currentPage + pageNeighbors); i++) pages.push(i);

        if (currentPage < totalPages - pageNeighbors - 1) pages.push("...", totalPages);
        else for (let i = currentPage + 1; i <= totalPages; i++) pages.push(i);

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
        <div className="mt-4">
            {/* Add Button at top */}
            <Row className="mb-3">
                <Col xs={12} md={3}>
                    <Button variant="primary" onClick={handleAdd}>Add Destination</Button>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Card className="p-4 shadow-sm">

                        {/* Table */}
                        <Table hover responsive striped bordered className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Destination Name</th>
                                    <th>Destination Code</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {destinations.map(d => (
                                    <tr key={d.destinationCode}>
                                        <td>{d.destinationName}</td>
                                        <td>{d.destinationCode}</td>
                                        <td style={{ display: "flex", gap: "10px" }}>
                                            <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(d)}>Edit</Button>
                                            <Button size="sm" variant="outline-danger" onClick={() => handleDelete(d.destinationCode)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {renderPagination()}
                    </Card>
                </Col>
            </Row>
            <EditCruiseDestination show={modalShow} onHide={() => setModalShow(false)} onSave={handleSave} />
        </div>
    );
};

export default CruiseDestinationManager;
