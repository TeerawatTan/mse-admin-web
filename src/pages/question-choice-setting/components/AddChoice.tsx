import { useState } from "react";
import api from "../../../api";

interface AddChoiceProps {
  questionNum: string;
  onChoiceAdded: () => void;
}

const AddChoice = ({ questionNum, onChoiceAdded }: AddChoiceProps) => {
  const [choiceName, setChoiceName] = useState("");
  const [score, setScore] = useState(0);

  const handleSubmit = async () => {
    if (!choiceName.trim()) return alert("กรุณากรอกตัวเลือก");

    try {
      const choiceResponse = await api.post("/QuestionAndChoice/Choice", {
        choiceNum: `Choice${Date.now()}`,
        choiceName,
        score: score || 0,
        isUse: true,
      });

      const newChoice = choiceResponse.data;

      if (!newChoice.id) {
        throw new Error("API ไม่คืนค่า choiceID");
      }

      const mapResponse = await api.post(
        `/QuestionAndChoice/MapQuestionAndChoice?questionNumber=${questionNum}`,
        [
          {
            choiceID: newChoice.id,
            choiceNum: newChoice.choiceNum,
            choiceName: newChoice.choiceName,
            score: newChoice.score || 0,
          },
        ]
      );

      if (mapResponse.status !== 200) {
        throw new Error("การแมปตัวเลือกไม่สำเร็จ");
      }

      setChoiceName("");
      setScore(0);
      alert("เพิ่มตัวเลือกและเชื่อมโยงกับคำถามเรียบร้อย!");
      onChoiceAdded();
    } catch (error: any) {
      console.error("Error:", error);
      alert(
        `เกิดข้อผิดพลาด: ${
          error.response?.data?.message ||
          "ไม่สามารถเชื่อมโยงตัวเลือกกับคำถามได้"
        }`
      );
    }
  };

  return (
    <div className="p-3 rounded bg-gray-100 shadow-md">
      <h4 className="text-md font-semibold mb-2">เพิ่มตัวเลือก</h4>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="ชื่อของตัวเลือก..."
          value={choiceName}
          onChange={(e) => setChoiceName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="คะแนน"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          เพิ่มตัวเลือก
        </button>
      </div>
    </div>
  );
};

export default AddChoice;
