import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Card, Row, Col } from "react-bootstrap";
import EditLineModal from "./EditLine";
import CruiseLineService, { type CruiseLineDto } from "../../Services/cruiseLines/CruiseLinesServices";

const CruiseLineManager: React.FC = () => {
    const [lines, setLines] = useState<CruiseLineDto[]>([]);
    const [modalShow, setModalShow] = useState(false);
    const [selectedLine, setSelectedLine] = useState<CruiseLineDto>({
        cruiseLineId: "",
        cruiseLineCode: "",
        cruiseLineName: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;

    const fetchLines = async (page: number = currentPage) => {
        try {
            const data = await CruiseLineService.getCruiseLines(page, pageSize);
            setLines(data.data.items);
            setCurrentPage(data.data.currentPage);
            setTotalPages(data.data.totalPages);
        } catch (error) {
            console.error("Error fetching cruise lines", error);
        }
    };

    useEffect(() => {
        fetchLines();
    }, [currentPage]);

    const handleEdit = (line: CruiseLineDto) => {
        setSelectedLine(line);
        setModalShow(true);
    };

    const handleAdd = () => {
        setSelectedLine({ cruiseLineId: "", cruiseLineCode: "", cruiseLineName: "" });
        setModalShow(true);
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!window.confirm("Are you sure you want to delete this line?")) return;

        try {
            await CruiseLineService.deleteCruiseLine(id);
            alert("Line deleted successfully");
            fetchLines();
        } catch (error) {
            console.error(error);
            alert("Error deleting line");
        }
    };

    const handleSave = async (lineData: CruiseLineDto) => {
        try {
            if (lineData.cruiseLineId) {
                await CruiseLineService.updateCruiseLine(lineData);
            } else {
                await CruiseLineService.addCruiseLine(lineData);
            }
            alert("Line saved successfully");
            setModalShow(false);
            fetchLines();
        } catch (error) {
            console.error(error);
            alert("Error saving line");
        }
    };

    // Dynamic pagination
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNeighbors = 2;
        const pages: (number | string)[] = [];

        if (currentPage > 1 + pageNeighbors + 1) {
            pages.push(1, "...");
        } else {
            for (let i = 1; i < currentPage; i++) pages.push(i);
        }

        for (let i = Math.max(1, currentPage - pageNeighbors); i <= Math.min(totalPages, currentPage + pageNeighbors); i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - pageNeighbors - 1) {
            pages.push("...", totalPages);
        } else {
            for (let i = currentPage + 1; i <= totalPages; i++) pages.push(i);
        }

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
                    <Button variant="primary" onClick={handleAdd} className="w-80">
                        Add Cruise Line
                    </Button>
                </Col>
            </Row>

            {/* Table below */}
            <Row>
                <Col xs={12}>
                    <Card className="p-4 shadow-sm">
                        <h4 className="mb-4">Cruise Lines</h4>
                        <Table hover responsive striped bordered className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lines.length ? (
                                    lines.map((line) => (
                                        <tr key={line.cruiseLineId}>
                                            <td>{line.cruiseLineCode}</td>
                                            <td>{line.cruiseLineName}</td>
                                            <td className="text-center">
                                                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(line)}>
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(line.cruiseLineId)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center text-muted">
                                            No cruise lines found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        {renderPagination()}
                    </Card>
                </Col>
            </Row>

            {/* Modal */}
            <EditLineModal show={modalShow} onHide={() => setModalShow(false)} lineData={selectedLine} onSave={handleSave} />
        </div>
    );
};

export default CruiseLineManager;
