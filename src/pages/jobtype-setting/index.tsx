import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageBreadcrumb from "../../components/PageBreadcrumb";

interface JobType {
  id: number;
  name: string;
}

const JobTypePage: React.FC = () => {
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobType | null>(null);
  const [jobName, setJobName] = useState("");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0TE8wNU4wVGNBQWtCUi9jQjMvZHpzellJRlMxR2NEd2szSUY0VHlWNGUwR2xRVHRDTkNmV2c9PSIsImp0aSI6IjBmNTI3MzdjLWVjZDItNDkyZS05MTBkLTM2NDc2YTAwY2RiNCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4yQHRlc3QuY29tIiwiZXhwIjoxNzQyNTMwMjUwLCJpc3MiOiJtc2UgaGVhbHRoIGNoZWNrdXAiLCJhdWQiOiJtc2UgaGVhbHRoIGNoZWNrdXAifQ._o19D-RfVzWzVpTvzEl2dLSk-6454GvxVmm_Az5eSGs"; // ดึง Token จาก Local Storage

  useEffect(() => {
    fetchJobTypes();
  }, []);

  const fetchJobTypes = async () => {
    try {
      const response = await fetch("/api/jobTypes");
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const data: JobType[] = await response.json();
      setJobTypes(data);
    } catch (error) {
      console.error("Fetch API Error:", error);
    }
  };
  const addJobType = async (name: string) => {
    try {
      const response = await fetch("/api/jobTypes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const newJobType = await response.json();
      setJobTypes((prevJobTypes) => [...prevJobTypes, newJobType]);
      await fetchJobTypes();
    } catch (error) {
      console.error("Fetch API Error:", error);
    }
  };

  const openModal = (jobType?: JobType) => {
    setEditingJob(jobType || null);
    setJobName(jobType?.name || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
    setJobName("");
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
      await addJobType(jobName);
      Swal.fire("Success", "Job type added successfully", "success");
    }

    closeModal();
  };
  const handleEdit = async () => {
    if (!editingJob) return;

    try {
      const response = await fetch(`/api/jobTypes/${editingJob.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: jobName }),
      });

      if (response.ok) {
        const updatedJob = await response.json();

        setJobTypes((prev) =>
          prev.map((jt) =>
            jt.id === editingJob.id ? { ...jt, name: jobName } : jt
          )
        );

        Swal.fire("Updated!", "The job type has been updated.", "success");
        closeModal();
      } else {
        const errorData = await response.json();
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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/jobTypes/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            setJobTypes(jobTypes.filter((jt) => jt.id !== id));
            Swal.fire("Deleted!", "The job type has been deleted.", "success");
          } else {
            const errorData = await res.json();
            Swal.fire(
              "Error!",
              errorData.message || "Failed to delete job type.",
              "error"
            );
          }
        } catch (error) {
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
          console.error("Delete error:", error);
        }
      }
    });
  };
  return (
    <>
      <PageBreadcrumb
        title="Job Type"
        name="Job Type"
        breadCrumbItems={["Menu", "Job Type"]}
      />

      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h4 className="card-title">Job Type List</h4>
            <div className="flex justify-end">
              <button
                className="text-primary hover:text-sky-700"
                onClick={() => openModal()}
              >
                + Add Job Type
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        No
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        Job Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {(jobTypes || []).map((jt, idx) => {
                      return (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                            {jt.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                            <button
                              className="text-primary hover:text-sky-700"
                              onClick={() => openModal(jt)}
                            >
                              Edit
                            </button>
                            <span> | </span>
                            <button
                              className="text-primary hover:text-sky-700"
                              onClick={() => handleDelete(jt.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition duration-300"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
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

export default JobTypePage;
