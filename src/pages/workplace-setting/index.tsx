import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import api from "../../api";
interface WorkPlace {
  id: number;
  name: string;
}

const WorkPlacePage: React.FC = () => {
  const [workPlace, setWorkPlace] = useState<WorkPlace[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<WorkPlace | null>(null);
  const [jobName, setJobName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = workPlace.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(workPlace.length / itemsPerPage);

  const fetchWorkPlace = async () => {
    try {
      const response = await api.get(`/MasterWorkPlace`);
      if (!response.data) throw new Error(`Error ${response.status}`);
      const data: WorkPlace[] = await response.data;
      setWorkPlace(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const addWorkPlace = async (name: string) => {
    try {
      const response = await api.post(`/MasterWorkPlace`, { name });
      if (!response.data) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const newWorkPlace = await response.data;
      setWorkPlace((prevWorkPlace) => [...prevWorkPlace, newWorkPlace]);
      await fetchWorkPlace();
    } catch (error) {
      console.error("Fetch API Error:", error);
    }
  };
  const handleEdit = async () => {
    if (!editingJob) return;

    try {
      const response = await api.patch(`/MasterWorkPlace/${editingJob.id}`, {
        name: jobName,
      });

      if (response.data) {
        const updatedJob = response.data;

        setWorkPlace((prev) =>
          prev.map((jt) =>
            jt.id === editingJob.id ? { ...jt, name: jobName } : jt
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
      const res = await api.delete(`/MasterWorkPlace/${id}`);

      if (!res.data) throw new Error(`Error ${res.status}`);

      await fetchWorkPlace();
      Swal.fire("Deleted!", "The job type has been deleted.", "success");
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error!", "Failed to delete job type.", "error");
    }
  };

  const handleSave = async () => {
    if (!jobName.trim()) {
      Swal.fire("Error", "Job type name is required", "error");
      return;
    }

    if (editingJob) {
      await handleEdit();
      Swal.fire("Success", "Job type updated successfully", "success");
    } else {
      await addWorkPlace(jobName);
      Swal.fire("Success", "Job type added successfully", "success");
    }

    closeModal();
  };

  const openModal = (WorkPlace?: WorkPlace) => {
    setEditingJob(WorkPlace || null);
    setJobName(WorkPlace?.name || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingJob(null);
    setJobName("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchWorkPlace();
  }, []);

  return (
    <>
      <PageBreadcrumb
        title="Work Place"
        name="WorkPlace"
        breadCrumbItems={["Menu", "Work Place"]}
      />

      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h4 className="card-title">Work Place List</h4>
          <button
            className="text-primary hover:text-sky-700"
            onClick={() => openModal()}
          >
            + Add Work Place
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
                  Work Place
                </th>
                <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.map((wp, idx) => (
                <tr key={wp.id}>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                    {wp.name}
                  </td>
                  <td className="px-6 py-4 text-end text-sm font-medium">
                    <button
                      className="text-primary hover:text-sky-700"
                      onClick={() => openModal(wp)}
                    >
                      Edit
                    </button>
                    <span> | </span>
                    <button
                      className="text-primary hover:text-sky-700"
                      onClick={() => handleDelete(wp.id)}
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
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === i + 1
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {editingJob ? "Edit Job Type" : "Add Job Type"}
              </h3>
              <input
                type="text"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
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

export default WorkPlacePage;
