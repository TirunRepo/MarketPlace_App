import React, { useEffect, useState, useCallback } from "react";
import { Card, Table, Button, Col, Row } from "react-bootstrap";
import CruiseDestinationService, {
  type DestinationDto,
} from "../../Services/cruiseDestination/CruiseDestinationService";
import EditCruiseDestination from "./EditCruiseDestination";
import CustomPagination from "../../../common/CustomPagination";
import LoadingOverlay from "../../../common/LoadingOverlay";
import { useToast } from "../../../common/Toaster";
import ConfirmationModal from "../../../common/ConfirmationModal";

const DEFAULT_PAGE_SIZE = 5;

const CruiseDestinationManager: React.FC = () => {
  const [destinations, setDestinations] = useState<DestinationDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationDto>({
    destinationCode: "",
    destinationName: "",
  });

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [destinationToDelete, setDestinationToDelete] = useState<string | null>(
    null
  );

  const { showToast } = useToast();

  // Fetch destinations
  const fetchDestinations = useCallback(
    async (page = currentPage, size = pageSize) => {
      setLoading(true);
      try {
        const response = await CruiseDestinationService.getAll(page, size);
        const data = response.data;
        setDestinations(data.items || []);
        setCurrentPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        showToast("Failed to fetch destinations", "error");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, showToast]
  );

  useEffect(() => {
    fetchDestinations(currentPage, pageSize);
  }, [currentPage, pageSize, fetchDestinations]);

  // Add Destination
  const handleAdd = () => {
    setSelectedDestination({ destinationCode: "", destinationName: "" });
    setModalVisible(true);
  };

  // Edit Destination
  const handleEdit = (destination: DestinationDto) => {
    setSelectedDestination(destination);
    setModalVisible(true);
  };

  // Delete Destination
  const handleDelete = (code: string) => {
    setDestinationToDelete(code);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!destinationToDelete) return;
    setLoading(true);
    try {
      await CruiseDestinationService.delete(destinationToDelete);
      showToast("Destination deleted successfully", "success");
      fetchDestinations(1, pageSize); // reset to first page after delete
    } catch (error) {
      console.error("Failed to delete destination:", error);
      showToast("Failed to delete destination", "error");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setDestinationToDelete(null);
    }
  };

  // Save Destination
  const handleSave = async (destination: DestinationDto) => {
    setLoading(true);
    try {
      if (destination.destinationCode) {
        await CruiseDestinationService.update(destination);
        showToast("Destination updated successfully", "success");
      } else {
        await CruiseDestinationService.add(destination);
        showToast("Destination added successfully", "success");
      }
      setModalVisible(false);
      fetchDestinations(1, pageSize); // reset to first page after save
    } catch (error) {
      console.error("Failed to save destination:", error);
      showToast("Failed to save destination", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <LoadingOverlay show={loading} />

      <Row className="mb-3">
        <Col xs={12} md={3}>
          <Button variant="primary" onClick={handleAdd}>
            Add Destination
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card className="p-4 shadow-sm">
            <Table hover responsive striped bordered className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Destination Name</th>
                  <th>Destination Code</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.length > 0 ? (
                  destinations.map((d) => (
                    <tr key={d.destinationCode}>
                      <td>{d.destinationName}</td>
                      <td>{d.destinationCode}</td>
                      <td className="text-center d-flex justify-content-center gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEdit(d)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(d.destinationCode)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-muted">
                      No destinations found
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

      <EditCruiseDestination
        show={modalVisible}
        onHide={() => setModalVisible(false)}
        onSave={handleSave}
        destination={selectedDestination}
      />

      <ConfirmationModal
        show={deleteModalVisible}
        title="Delete Destination"
        message="Are you sure you want to delete this destination?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default CruiseDestinationManager;
