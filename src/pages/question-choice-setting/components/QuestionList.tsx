import React, { useEffect, useState } from "react";
import api from "../../../api"; 
import { PageBreadcrumb } from "../../../components";
import ChoiceList from "./ChoiceList";
import AddQuestion from "./AddQuestion";

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

const QuestionChoice = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/QuestionAndChoice/List`);
      if (!response.data) throw new Error(`Error ${response.status}`);
      const data: Question[] = await response.data;
      setQuestions(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/webs/QuestionAndChoice/Question/${id}`);
      setQuestions((prev) => prev.filter((q) => q.questionID !== id));
      alert("ลบคำถามสำเร็จ");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการลบคำถาม");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);
  return (
    <>
      <PageBreadcrumb
        title="Question And Choice"
        name="Question And Choice"
        breadCrumbItems={["Menu", "Question And Choice"]}
      />

      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h4 className="card-title">List</h4>
          </div>
          <div className="p-3">
            <AddQuestion onQuestionAdded={fetchQuestions} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Question
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Choices
                </th>
                <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {questions.map((question) => (
                <>
                  <tr key={question.questionID}>
                    <td className="px-6 py-4">{question.questionNum}</td>
                    <td className="px-6 py-4">{question.questionName}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          setExpandedQuestion(
                            expandedQuestion === question.questionID
                              ? null
                              : question.questionID
                          )
                        }
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {expandedQuestion === question.questionID
                          ? "ซ่อน"
                          : "แสดง"}{" "}
                        ตัวเลือก
                      </button>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <button
                        onClick={() => handleDelete(question.questionID)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expandedQuestion === question.questionID && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 bg-gray-100">
                        <ul>
                          {question.choices.length === 0 ? (
                            <p className="text-gray-500">ไม่มีตัวเลือก</p>
                          ) : (
                            question.choices.map((choice) => (
                              <li
                                key={choice.choiceID}
                                className="flex justify-between items-center border-b py-2"
                              >
                                <span>
                                  {choice.choiceName} (คะแนน:{" "}
                                  {choice.score ?? 0})
                                </span>
                              </li>
                            ))
                          )}
                        </ul>
                        <ChoiceList questionNum={question.questionNum} />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default QuestionChoice;
