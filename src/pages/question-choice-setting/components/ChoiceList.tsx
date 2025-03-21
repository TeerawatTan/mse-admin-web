import { useEffect, useState } from "react";
import api from "../../../api";
import AddChoice from "./AddChoice";

interface Choice {
  choiceID: number;
  choiceNum: string;
  choiceName: string;
  score: number;
}

interface ChoiceListProps {
  questionNum: string;
}

const ChoiceList = ({ questionNum }: ChoiceListProps) => {
  const [choices, setChoices] = useState<Choice[]>([]); 

  const fetchChoices = async () => {
    try {
      const response = await api.get(
        `/QuestionAndChoice/MapQuestionAndChoice?questionNumber=${questionNum}`
      );

      setChoices(
        Array.isArray(response.data.choices) ? response.data.choices : []
      );
    } catch (error) {
      console.error("โหลดตัวเลือกไม่สำเร็จ:", error);
      setChoices([]);
    }
  };

  const handleChoiceAdded = () => {
    fetchChoices();
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/QuestionAndChoice/Choice/${id}`);
      setChoices((prevChoices) => prevChoices.filter((c) => c.choiceID !== id));
      alert("ลบตัวเลือกสำเร็จ");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการลบตัวเลือก");
    }
  };

  useEffect(() => {
    fetchChoices();
  }, []);

  return (
    <div className="p-3 rounded bg-white shadow-md">
      <h4 className="text-md font-semibold mb-2">ตัวเลือกของคำถาม</h4>
      <ul>
        {choices.length === 0 ? (
          <p className="text-gray-500">ไม่มีตัวเลือก</p>
        ) : (
          choices.map((choice) => (
            <li
              key={choice.choiceID}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {choice.choiceName} (คะแนน: {choice.score})
              </span>
              <button
                onClick={() => handleDelete(choice.choiceID)}
                className="text-red-500"
              >
                ลบ
              </button>
            </li>
          ))
        )}
      </ul>
      <AddChoice questionNum={questionNum} onChoiceAdded={handleChoiceAdded} />
    </div>
  );
};

export default ChoiceList;
