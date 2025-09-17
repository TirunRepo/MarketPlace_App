import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Card, Row, Col } from "react-bootstrap";
import EditLineModal from "./EditLine";
import CruiseLineService, { type CruiseLineDto } from "../../Services/cruiseLines/CruiseLinesServices";
import CustomPagination from "../../../common/CustomPagination";
import LoadingOverlay from "../../../common/LoadingOverlay";
import { useToast } from "../../../common/Toaster";
import ConfirmationModal from "../../../common/ConfirmationModal";

const DEFAULT_PAGE_SIZE = 5;

const CruiseLineManager: React.FC = () => {
  const [lines, setLines] = useState<CruiseLineDto[]>([]);
  const [selectedLine, setSelectedLine] = useState<CruiseLineDto>({
    cruiseLineId: "",
    cruiseLineCode: "",
    cruiseLineName: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [lineToDelete, setLineToDelete] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Fetch cruise lines
  const fetchLines = useCallback(
    async (page = currentPage, size = pageSize) => {
      setLoading(true);
      try {
        const data = await CruiseLineService.getCruiseLines(page, size);
        setLines(data.data.items || []);
        setCurrentPage(data.data.currentPage || 1);
        setTotalPages(data.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching cruise lines", error);
        showToast("Failed to fetch cruise lines", "error");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, showToast]
  );

  useEffect(() => {
    fetchLines(currentPage, pageSize);
  }, [currentPage, pageSize, fetchLines]);

  // Add
  const handleAdd = () => {
    setSelectedLine({ cruiseLineId: "", cruiseLineCode: "", cruiseLineName: "" });
    setModalVisible(true);
  };

  // Edit
  const handleEdit = (line: CruiseLineDto) => {
    setSelectedLine(line);
    setModalVisible(true);
  };

  // Delete
  const handleDelete = (id: string) => {
    setLineToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!lineToDelete) return;
    setLoading(true);
    try {
      await CruiseLineService.deleteCruiseLine(lineToDelete);
      showToast("Cruise line deleted successfully", "success");
      fetchLines(1, pageSize); // reset to first page after delete
    } catch (error) {
      console.error("Error deleting cruise line", error);
      showToast("Failed to delete cruise line", "error");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setLineToDelete(null);
    }
  };

  // Save
  const handleSave = async (lineData: CruiseLineDto) => {
    setLoading(true);
    try {
      if (lineData.cruiseLineId) {
        await CruiseLineService.updateCruiseLine(lineData);
        showToast("Cruise line updated successfully", "success");
      } else {
        await CruiseLineService.addCruiseLine(lineData);
        showToast("Cruise line added successfully", "success");
      }
      setModalVisible(false);
      fetchLines(1, pageSize); // reset to first page after save
    } catch (error) {
      console.error("Error saving cruise line", error);
      showToast("Failed to save cruise line", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <LoadingOverlay show={loading} />

      {/* Add Button */}
      <Row className="mb-3">
        <Col xs={12} md={3}>
          <Button variant="primary" onClick={handleAdd} className="w-100">
            Add Cruise Line
          </Button>
        </Col>
      </Row>

      {/* Table */}
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
                {lines.length > 0 ? (
                  lines.map((line) => (
                    <tr key={line.cruiseLineId}>
                      <td>{line.cruiseLineCode}</td>
                      <td>{line.cruiseLineName}</td>
                      <td className="text-center d-flex justify-content-center gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEdit(line)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(line.cruiseLineId!)}
                        >
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
      <EditLineModal
        show={modalVisible}
        onHide={() => setModalVisible(false)}
        lineData={selectedLine}
        onSave={handleSave}
      />

      <ConfirmationModal
        show={deleteModalVisible}
        title="Delete Cruise Line"
        message="Are you sure you want to delete this cruise line?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default CruiseLineManager;
