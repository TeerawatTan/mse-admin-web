import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import api from "../../api";

interface Choice {
  id: number;
  choiceNum: string;
  choiceName: string;
  score: number;
  isUse: boolean;
}

const ChoicePage: React.FC = () => {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChoice, setEditingChoice] = useState<Choice | null>(null);
  const [choiceNum, setChoiceNum] = useState("");
  const [choiceName, setChoiceName] = useState("");
  const [score, setScore] = useState(0);
  const [isUse, setIsUse] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = choices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(choices.length / itemsPerPage);

  const fetchChoices = async () => {
    try {
      const res = await api.get("/QuestionAndChoice/Choice");
      setChoices(res.data);
    } catch (error) {
      console.error("Get Choice data failed", error);
    }
  };

  const addChoice = async () => {
    try {
      await api.post("/QuestionAndChoice/Choice", {
        choiceNum,
        choiceName,
        score,
        isUse,
      });
      await fetchChoices();
    } catch (error) {
      console.error("Add Choice failed", error);
    }
  };

  const handleEdit = async () => {
    if (!editingChoice) return;
    try {
      await api.patch(`/QuestionAndChoice/Choice/${editingChoice.id}`, {
        choiceNum,
        choiceName,
        score,
        isUse,
      });
      Swal.fire("Updated!", "The choice has been updated.", "success");
      await fetchChoices();
      closeModal();
    } catch (error) {
      console.error("Edit error:", error);
      Swal.fire("Error!", "Failed to update choice.", "error");
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
      await api.delete(`/QuestionAndChoice/Choice/${id}`);
      await fetchChoices();
      Swal.fire("Deleted!", "The choice has been deleted.", "success");
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error!", "Failed to delete choice.", "error");
    }
  };

  const handleSave = async () => {
    if (!choiceNum.trim() || !choiceName.trim()) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    if (editingChoice) {
      await handleEdit();
    } else {
      await addChoice();
      Swal.fire("Success", "Choice added successfully", "success");
    }

    closeModal();
  };

  const openModal = (choice?: Choice) => {
    setEditingChoice(choice || null);
    setChoiceNum(choice?.choiceNum || "");
    setChoiceName(choice?.choiceName || "");
    setScore(choice?.score ?? 0);
    setIsUse(choice?.isUse ?? true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingChoice(null);
    setChoiceNum("");
    setChoiceName("");
    setScore(0);
    setIsUse(true);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchChoices();
  }, []);

  return (
    <>
      <PageBreadcrumb
        title="Choice"
        name="Choice"
        breadCrumbItems={["Menu", "Choice"]}
      />

      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h4 className="card-title">Choice List</h4>
          <button
            className="text-primary hover:text-sky-700"
            onClick={() => openModal()}
          >
            + Add Choice
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
                  Choice Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Score
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Use
                </th>
                <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.map((c, idx) => (
                <tr key={c.id}>
                  <td className="px-6 py-4 text-sm">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-6 py-4 text-sm">{c.choiceName}</td>
                  <td className="px-6 py-4 text-sm">{c.choiceNum}</td>
                  <td className="px-6 py-4 text-sm">{c.score}</td>
                  <td className="px-6 py-4 text-center text-sm">
                    {c.isUse ? "✅" : "❌"}
                  </td>
                  <td className="px-6 py-4 text-end text-sm space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => openModal(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(c.id)}
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
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
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
                {editingChoice ? "Edit Choice" : "Add Choice"}
              </h3>
              <input
                type="text"
                value={choiceNum}
                onChange={(e) => setChoiceNum(e.target.value)}
                className="border w-full p-3 mb-4 rounded-lg"
                placeholder="Enter choice number"
              />
              <input
                type="text"
                value={choiceName}
                onChange={(e) => setChoiceName(e.target.value)}
                className="border w-full p-3 mb-4 rounded-lg"
                placeholder="Enter choice name"
              />
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                className="border w-full p-3 mb-4 rounded-lg"
                placeholder="Score (default 0)"
              />
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={isUse}
                  onChange={(e) => setIsUse(e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm">Use</label>
              </div>
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

export default ChoicePage;
