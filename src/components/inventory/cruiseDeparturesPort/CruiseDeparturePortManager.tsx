import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Card, Col, Row } from "react-bootstrap";
import DeparturePortService, {
  type DestinationDto,
  type DeparturePortDto,
} from "../../Services/cruiseDepartures/DeparturePortService";
import EditCruiseDeparture from "./EditCruiseDeparturePort";
import CustomPagination from "../../../common/CustomPagination";
import LoadingOverlay from "../../../common/LoadingOverlay";
import { useToast } from "../../../common/Toaster";
import ConfirmationModal from "../../../common/ConfirmationModal";

const DEFAULT_PAGE_SIZE = 5;

const CruiseDeparturePortManager: React.FC = () => {
  const [ports, setPorts] = useState<DeparturePortDto[]>([]);
  const [destinations, setDestinations] = useState<DestinationDto[]>([]);
  const [selectedPort, setSelectedPort] = useState<DeparturePortDto>({
    departurePortCode: "",
    departurePortName: "",
    destinationCode: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [portToDelete, setPortToDelete] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  // Fetch departure ports
  const fetchPorts = useCallback(async (page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const response = await DeparturePortService.getAll(page, size);
      const data = response.data;
      setPorts(data.items);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch departure ports.", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, showToast]);

  // Fetch destinations
  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await DeparturePortService.getAllDestinations();
      setDestinations(response.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch destinations.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPorts();
    fetchDestinations();
  }, [fetchPorts, fetchDestinations]);

  useEffect(() => {
    fetchPorts(currentPage, pageSize);
  }, [currentPage, pageSize, fetchPorts]);

  // Handlers
  const handleAdd = () => {
    setSelectedPort({
      departurePortCode: "",
      departurePortName: "",
      destinationCode: "",
    });
    setModalVisible(true);
  };

  const handleEdit = (port: DeparturePortDto) => {
    setSelectedPort(port);
    setModalVisible(true);
  };

  const handleDelete = (portId: string) => {
    setPortToDelete(portId);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!portToDelete) return;
    setLoading(true);
    try {
      await DeparturePortService.delete(portToDelete);
      showToast("Departure port deleted successfully.", "success");
      fetchPorts(1, pageSize);
    } catch (error) {
      console.error(error);
      showToast("Failed to delete departure port.", "error");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setPortToDelete(null);
    }
  };

  const handleSave = async (portData: DeparturePortDto) => {
    setLoading(true);
    try {
      if (portData.departurePortId) {
        await DeparturePortService.update(portData);
        showToast("Departure port updated successfully.", "success");
      } else {
        await DeparturePortService.add(portData);
        showToast("Departure port added successfully.", "success");
      }
      setModalVisible(false);
      fetchPorts(1, pageSize);
    } catch (error) {
      console.error(error);
      showToast("Failed to save departure port.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoadingOverlay show={loading} />

      <Row className="mb-3">
        <Col xs={12} md={3}>
          <Button variant="primary" onClick={handleAdd}>
            Add Departure Port
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card className="p-4 shadow-sm">
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
                {ports.length > 0 ? (
                  ports.map((port) => (
                    <tr key={port.departurePortId}>
                      <td>{port.departurePortCode}</td>
                      <td>{port.departurePortName}</td>
                      <td>{port.destinationCode}</td>
                      <td className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEdit(port)}
                        >
                          Edit
                        </Button>
                        {port.departurePortId && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(port.departurePortId!)}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      No departure ports found
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

      <EditCruiseDeparture
        show={modalVisible}
        onHide={() => setModalVisible(false)}
        selectedPort={selectedPort}
        destinations={destinations}
        onSave={handleSave}
      />

      <ConfirmationModal
        show={deleteModalVisible}
        title="Delete Departure Port"
        message="Are you sure you want to delete this departure port?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default CruiseDeparturePortManager;
