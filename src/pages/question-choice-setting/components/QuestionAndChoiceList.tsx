import React, { useEffect, useState } from "react";
import api from "../../../api";
import PageBreadcrumb from "../../../components/PageBreadcrumb";
import { Link } from "react-router-dom";

interface Choice {
  choiceID: number;
  choiceNum: string;
  choiceName: string;
  score: number | null;
}

interface Question {
  questionID: number;
  questionNum: string;
  questionName: string;
  choices: Choice[];
}

export default function QuestionChoiceTable() {
  const [dataQCList, setDataQCList] = useState<Question[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataQCList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataQCList.length / itemsPerPage);

  const fetchQuestionAndChoiceList = async () => {
    try {
      const res = await api.get("/QuestionAndChoice/List");
      setDataQCList(res.data);
    } catch (err) {
      console.error("Failed to get data", err);
    }
  };

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchQuestionAndChoiceList();
  }, []);

  return (
    <>
      <PageBreadcrumb
        title="QuestionAndChoice"
        name="QuestionAndChoice"
        breadCrumbItems={["Menu", "QuestionAndChoice"]}
      />
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h4 className="card-title">QuestionAndChoice List</h4>
          <div className="space-x-2">
            <Link to="/question-choice-setting/question">
              <button className="text-primary hover:text-sky-700">
                | + Add Question |
              </button>
            </Link>
            <Link to="/question-choice-setting/choice">
              <button className="text-primary hover:text-sky-700">
                | + Add Choice |
              </button>
            </Link>
            <Link to="/question-choice-setting/mapchoiceandquestion">
              <button className="text-primary hover:text-sky-700">
                | + Map ChoiceToQuestion |
              </button>
            </Link>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Question
              </th>
              <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                Choices
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((q, index) => (
              <React.Fragment key={q.questionID}>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                    {q.questionName}
                  </td>
                  <td className="px-6 py-4 text-end text-sm">
                    <button
                      onClick={() => toggleRow(q.questionID)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {expandedRows.includes(q.questionID)
                        ? "🔼 Hide"
                        : "🔽 View Options"}
                    </button>
                  </td>
                </tr>

                {/* แถวแสดงตัวเลือกเมื่อกดดู */}
                {expandedRows.includes(q.questionID) && (
                  <tr key={`choices-${q.questionID}`}>
                    <td
                      colSpan={3}
                      className="px-6 py-4 bg-gray-50 text-sm text-gray-700"
                    >
                      <ul className="list-disc pl-6 space-y-1">
                        {q.choices.length > 0 ? (
                          q.choices.map((c) => (
                            <li key={c.choiceID}>
                              {c.choiceName} ({c.choiceNum})
                            </li>
                          ))
                        ) : (
                          <p className="italic text-gray-500">No Choice</p>
                        )}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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
    </>
  );
}
