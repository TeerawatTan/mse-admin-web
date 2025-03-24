import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../api";
import PageBreadcrumb from "../../components/PageBreadcrumb";

interface Question {
  id: number;
  questionNum: string;
  questionName: string;
  isUse: boolean;
}

const QuestionPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionNum, setQuestionNum] = useState("");
  const [questionName, setQuestionName] = useState("");
  const [isUse, setIsUse] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = questions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(questions.length / itemsPerPage);

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/QuestionAndChoice/Question`);
      if (!response.data) throw new Error(`Error ${response.status}`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const addQuestion = async () => {
    try {
      await api.post(`/QuestionAndChoice/Question`, {
        questionNum,
        questionName,
        choiceID: 1,
        isUse,
      });
      await fetchQuestions();
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  const handleEdit = async () => {
    if (!editingQuestion) return;
    try {
      await api.patch(`/QuestionAndChoice/Question/${editingQuestion.id}`, {
        questionNum,
        questionName,
        questionPeriod: new Date().toISOString(),
        isUse,
      });

      Swal.fire("Updated!", "The question has been updated.", "success");
      await fetchQuestions();
      closeModal();
    } catch (error) {
      console.error("Edit error:", error);
      Swal.fire("Error!", "Failed to update question.", "error");
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
      await api.delete(`/QuestionAndChoice/Question/${id}`);
      await fetchQuestions();
      Swal.fire("Deleted!", "The question has been deleted.", "success");
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error!", "Failed to delete question.", "error");
    }
  };

  const handleSave = async () => {
    if (!questionName.trim() || !questionNum.trim()) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    if (editingQuestion) {
      await handleEdit();
    } else {
      await addQuestion();
      Swal.fire("Success", "Question added successfully", "success");
    }

    closeModal();
  };

  const openModal = (question?: Question) => {
    setEditingQuestion(question || null);
    setQuestionNum(question?.questionNum || "");
    setQuestionName(question?.questionName || "");
    setIsUse(question?.isUse ?? true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingQuestion(null);
    setQuestionNum("");
    setQuestionName("");
    setIsUse(true);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <>
      <PageBreadcrumb
        title="Question"
        name="Question"
        breadCrumbItems={["Menu", "Question"]}
      />

      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h4 className="card-title">Question List</h4>
          <button
            className="text-primary hover:text-sky-700"
            onClick={() => openModal()}
          >
            + Add Question
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
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
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
              {currentItems.map((q, idx) => (
                <tr key={q.id}>
                  <td className="px-6 py-4 text-sm">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-6 py-4 text-sm">{q.questionName}</td>
                  <td className="px-6 py-4 text-sm">{q.questionNum}</td>
                  <td className="px-6 py-4 text-center text-sm">
                    {q.isUse ? "✅" : "❌"}
                  </td>
                  <td className="px-6 py-4 text-end text-sm space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => openModal(q)}
                    >
                      Edit
                    </button>
                    <span> | </span>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(q.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
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
                {editingQuestion ? "Edit Question" : "Add Question"}
              </h3>
              <input
                type="text"
                value={questionNum}
                onChange={(e) => setQuestionNum(e.target.value)}
                className="border w-full p-3 mb-4 rounded-lg"
                placeholder="Enter question number"
              />
              <input
                type="text"
                value={questionName}
                onChange={(e) => setQuestionName(e.target.value)}
                className="border w-full p-3 mb-4 rounded-lg"
                placeholder="Enter question name"
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

export default QuestionPage;
