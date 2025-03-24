import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import api from "../../api";

interface Question {
  id: number;
  questionNum: string;
  questionName: string;
  choices?: Choice[];
}

interface Choice {
  id: number;
  choiceNum: string;
  choiceName: string;
}

export default function MapChoiceToQuestionPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);
  const [selectedChoiceNum, setSelectedChoiceNum] = useState<string>('');
  const [groupChoices, setGroupChoices] = useState<Record<string, Choice[]>>({});


  const fetchQuestions = async () => {
    try {
      const res = await api.get("/QuestionAndChoice/Question");
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to retrieve Questions", err);
    }
  };

  const groupByNums = (data: Choice[]): Record<string, Choice[]> => {
    return data.reduce((acc, item) => {
      if (!acc[item.choiceNum]) {
        acc[item.choiceNum] = [];
      }
      acc[item.choiceNum].push(item);
      return acc;
    }, {} as Record<string, Choice[]>);
  };

  const fetchChoices = async () => {
    try {
      const res = await api.get("/QuestionAndChoice/Choice");
      const data: Choice[] = res.data;
      setChoices(data);
      const groupedData = groupByNums(data);
      setGroupChoices(groupedData);
    } catch (err) {
      console.error("Failed to retrieve Choices", err);
    }
  };

  const fetchQuestionDetail = async (q: Question) => {
    try {
      const res = await api.get(`/QuestionAndChoice/${q.questionNum}`);

      if (res.data && res.data.questionNum) {
        setSelectedQuestion(res.data);
      } else {
        const fallbackRes = await api.get(
          `/QuestionAndChoice/Question/${q.id}`
        );
        const fallbackData = fallbackRes.data;

        if (fallbackData && fallbackData.questionNum) {
          setSelectedQuestion(fallbackData);
        } else {
          setSelectedQuestion(null);
        }
      }
    } catch (err) {
      console.error("Failed to retrieve Question Detail", err);
      setSelectedQuestion(null);
    }
  };

  const handleMap = async () => {
    if (!selectedQuestion || !selectedChoiceId) return;

    const selectedChoice = choices.find((c) => c.id === selectedChoiceId);
    if (!selectedChoice) return;

    const mapPayload = [
      {
        choiceID: selectedChoice.id,
        choiceNum: selectedChoice.choiceNum,
        choiceName: selectedChoice.choiceName,
      },
    ];

    try {
      await api.post(
        `/QuestionAndChoice/MapQuestionAndChoice?questionNumber=${selectedQuestion.questionNum}`,
        mapPayload
      );
      Swal.fire(
        "Success",
        "Mapped choice to question successfully",
        "success"
      ).then(() => {
        navigate("/question-choice");
      });
    } catch (err) {
      console.error("Mapping Failed", err);
      Swal.fire("Failed", "Mapping choice to question failed", "error");
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchChoices();
  }, []);

  return (
    <>
      <PageBreadcrumb
        title="Map Choice To Question"
        name="Map Choice To Question"
        breadCrumbItems={["Menu", "Map Choice To Question"]}
      />

      <div className="card shadow-lg p-6 max-w-4xl mx-auto bg-white">
        <div className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Select Question
            </label>
            <select
              className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring focus:ring-blue-200"
              value={selectedQuestion?.id || ""}
              onChange={(e) => {
                const qId = parseInt(e.target.value);
                const q = questions.find((q) => q.id === qId) || null;
                setSelectedChoiceId(null);
                if (q) {
                  fetchQuestionDetail(q);
                }
              }}
            >
              <option value="">-- Select Question --</option>
              {questions
                .filter((q) => q.questionNum) // ✅ แสดงเฉพาะที่มี questionNum
                .map((q) => (
                  <option key={q.id} value={q.id}>
                    ({q.questionNum}) {q.questionName}
                  </option>
                ))}
            </select>
          </div>

          {selectedQuestion && (
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Detail Question
              </h3>
              <table className="w-full text-sm border border-gray-200 rounded overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-2 w-12">No</th>
                    <th className="text-left px-4 py-2">Question</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2 align-top">
                      <div className="font-medium mb-2 text-gray-800">
                        {selectedQuestion.questionNum}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium mb-2 text-gray-800">
                        {selectedQuestion.questionName}
                      </div>
                      <ul className="list-disc ml-5 mt-1 text-gray-700">
                        {selectedQuestion.choices?.length ? (
                          selectedQuestion.choices.map((c, idx) => (
                            <li key={c.id || idx}>
                              {c.choiceName} ({c.choiceNum})
                            </li>
                          ))
                        ) : (
                          <li className="italic text-gray-500">No Choice</li>
                        )}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6">
                <label className="block mb-1 font-semibold text-gray-700">
                  Select Choice
                </label>
                <select
                  className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                  value={
                    selectedChoiceNum !== null ? selectedChoiceNum.toString() : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value; // value of choiceNum
                    const id = choices.find((c) => c.choiceNum === value)?.id; // get first choice of choiceNum
                    setSelectedChoiceId(id ? id : null);
                    setSelectedChoiceNum(value);
                  }}
                >
                  <option value="">-- Select Choice --</option>
                  {/* {choices.map((c) => (
                    <option key={c.id} value={c.choiceNum}>
                      ({c.choiceNum}) {c.choiceName}
                    </option>
                  ))} */}
                  {Object.entries(groupChoices).map(([code, groups]) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                <ul className="list-disc ml-5 mt-1 text-gray-700">
                  {selectedChoiceNum ? (
                    choices.filter((c) => c.choiceNum === selectedChoiceNum)).map((ch, idx) => (
                      <li key={idx}>
                        {ch.choiceName} ({ch.choiceNum})
                      </li>
                    )) : (
                    <li className="italic text-gray-500">No Choice</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              disabled={!selectedQuestion || selectedChoiceId === null}
              onClick={handleMap}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50 transition-all"
            >
              Map To Question
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
