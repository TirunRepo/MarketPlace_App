import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Table, Pagination } from "react-bootstrap";
import ShipService, { type ShipDto, type CruiseLineDto } from "../../Services/cruiseShips/CruiseShipsService";
import EditShips from "./EditShips";

const CruiseShipsManager: React.FC = () => {
    const [ships, setShips] = useState<ShipDto[]>([]);
    const [cruiseLines, setCruiseLines] = useState<CruiseLineDto[]>([]);
    const [modalShow, setModalShow] = useState(false);
    const [selectedShip, setSelectedShip] = useState<ShipDto>({ shipCode: "", shipName: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;

    const fetchShips = async (page = currentPage) => {
        try {
            const data = await ShipService.getShips(page, pageSize);
            setShips(data.data.items);
            setCurrentPage(data.data.currentPage);
            setTotalPages(data.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCruiseLines = async () => {
        try {
            const data = await ShipService.getCruiseLines();
            setCruiseLines(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchShips();
        fetchCruiseLines();
    }, [currentPage]);

    const handleSave = async (ship: ShipDto) => {
        try {
            if (ship.cruiseShipId) {
                await ShipService.updateShip(ship);
            } else {
                await ShipService.addShip(ship);
            }
            setModalShow(false);
            fetchShips();
        } catch (error) {
            console.error(error);
            alert("Error saving ship");
        }
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (!window.confirm("Are you sure you want to delete this ship?")) return;
        try {
            await ShipService.deleteShip(id);
            fetchShips();
        } catch (error) {
            console.error(error);
            alert("Error deleting ship");
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pageNeighbors = 2;
        const pages: (number | string)[] = [];

        if (currentPage > pageNeighbors + 2) pages.push(1, "...");
        for (let i = Math.max(1, currentPage - pageNeighbors); i <= Math.min(totalPages, currentPage + pageNeighbors); i++)
            pages.push(i);
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
        <div className="mt-4">
            <Row className="mb-3">
                <Col xs={12} md={3}>
                    <Button
                        variant="primary"
                        className="w-80"
                        onClick={() => {
                            setSelectedShip({ shipCode: "", shipName: "" });
                            setModalShow(true);
                        }}
                    >
                        Add Ship
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Card className="p-4 shadow-sm">
                        <h4 className="mb-4 text-center">Ships List</h4>
                        <Table hover responsive striped bordered className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Cruise Ship ID</th>
                                    <th>Cruise Line Code</th>
                                    <th>Ship Code</th>
                                    <th>Ship Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ships.length ? (
                                    ships.map((ship) => (
                                        <tr key={ship.cruiseShipId}>
                                            <td>{ship.cruiseShipId}</td>
                                            <td>{ship.cruiseLine?.cruiseLineCode}</td>
                                            <td>{ship.shipCode}</td>
                                            <td>{ship.shipName}</td>
                                            <td style={{ display: "flex", gap: "10px" }}>
                                                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => { setSelectedShip(ship); setModalShow(true); }}>
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
                        {renderPagination()}
                    </Card>
                </Col>
            </Row>

            {/* Modal */}
            <EditShips show={modalShow} onHide={() => setModalShow(false) } shipData={selectedShip} cruiseLines={cruiseLines} onSave={handleSave}/>
        </div>
    );
};

export default CruiseShipsManager;
