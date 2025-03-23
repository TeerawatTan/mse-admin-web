import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import api from "../../api";
interface Agency {
  id: number;
  name: string;
}

const AgencyPage: React.FC = () => {
  const [agency, setAgency] = useState<Agency[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [agencyName, setAgenyName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = agency.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(agency.length / itemsPerPage);

  const fetchAgency = async () => {
    try {
      const response = await api.get(`/MasterAgency`);
      if (!response.data) throw new Error(`Error ${response.status}`);
      const data: Agency[] = await response.data;
      setAgency(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const addAgency = async (name: string) => {
    try {
      const response = await api.post(`/MasterAgency`, { name });
      if (!response.data) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const newAgency = await response.data;
      setAgency((prevAgency) => [...prevAgency, newAgency]);
      await fetchAgency();
    } catch (error) {
      console.error("Fetch API Error:", error);
    }
  };
  const handleEdit = async () => {
    if (!editingAgency) return;

    try {
      const response = await api.patch(`/MasterAgency/${editingAgency.id}`, {
        name: agencyName,
      });

      if (response.data) {
        const updatedJob = response.data;

        setAgency((prev) =>
          prev.map((jt) =>
            jt.id === editingAgency.id ? { ...jt, name: agencyName } : jt
          )
        );

        Swal.fire("Updated!", "The job type has been updated.", "success");
        closeModal();
      } else {
        const errorData = await response.data;
        Swal.fire(
          "Error!",
          errorData.message || "Failed to update job type.",
          "error"
        );
      }
    } catch (error) {
      console.error("Edit error:", error);
      Swal.fire("Error!", "Something went wrong while updating.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await api.delete(`/MasterAgency/${id}`);

      if (!res.data) throw new Error(`Error ${res.status}`);

      await fetchAgency();
      Swal.fire("Deleted!", "The job type has been deleted.", "success");
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error!", "Failed to delete job type.", "error");
    }
  };

  const handleSave = async () => {
    if (!agencyName.trim()) {
      Swal.fire("Error", "Job type name is required", "error");
      return;
    }

    if (editingAgency) {
      await handleEdit();
      Swal.fire("Success", "Job type updated successfully", "success");
    } else {
      await addAgency(agencyName);
      Swal.fire("Success", "Job type added successfully", "success");
    }

    closeModal();
  };

  const openModal = (Agency?: Agency) => {
    setEditingAgency(Agency || null);
    setAgenyName(Agency?.name || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingAgency(null);
    setAgenyName("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchAgency();
  }, []);

  return (
    <>
      <PageBreadcrumb
        title="Agency"
        name="Agency"
        breadCrumbItems={["Menu", "Agency"]}
      />

      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h4 className="card-title">Agency List</h4>
          <button
            className="text-primary hover:text-sky-700"
            onClick={() => openModal()}
          >
            + Add Agency
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Agency
                </th>
                <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.map((ac, idx) => (
                <tr key={ac.id}>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                    {ac.name}
                  </td>
                  <td className="px-6 py-4 text-end text-sm font-medium">
                    <button
                      className="text-primary hover:text-sky-700"
                      onClick={() => openModal(ac)}
                    >
                      Edit
                    </button>
                    <span> | </span>
                    <button
                      className="text-primary hover:text-sky-700"
                      onClick={() => handleDelete(ac.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center mt-6 py-4 space-x-2 bg-white shadow-md rounded-lg">
            <button
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-all"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg transition-all ${currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-all"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {editingAgency ? "Edit Job Type" : "Add Job Type"}
              </h3>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgenyName(e.target.value)}
                className="border w-full p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter job type name"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AgencyPage;
