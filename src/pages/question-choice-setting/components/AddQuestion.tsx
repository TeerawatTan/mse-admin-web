import { useState } from "react";
import api from "../../../api";

interface AddQuestionProps {
  onQuestionAdded: () => void;
}

const AddQuestion = ({ onQuestionAdded }: AddQuestionProps) => {
  const [questionNum, setQuestionNum] = useState("");
  const [questionName, setQuestionName] = useState("");
  const [isUse, setIsUse] = useState(true);

  const handleSubmit = async () => {
    if (!questionNum.trim() || !questionName.trim())
      return alert("กรุณากรอกข้อมูลให้ครบ");

    try {
      const response = await api.post("/QuestionAndChoice/Question", {
        questionNum,
        questionName,
        choiceID: 2,
        isUse,
      });

      if (response.status === 200) {
        alert("เพิ่มคำถามสำเร็จ!");
        setQuestionNum("");
        setQuestionName("");
        onQuestionAdded();
      } else {
        throw new Error("เพิ่มคำถามไม่สำเร็จ");
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(
        `เกิดข้อผิดพลาด: ${
          error.response?.data?.message || "ไม่สามารถเพิ่มคำถามได้"
        }`
      );
    }
  };

  return (
    <div className="p-3 rounded bg-gray-100 shadow-md">
      <h4 className="text-md font-semibold mb-2">เพิ่มคำถาม</h4>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="หมายเลขคำถาม..."
          value={questionNum}
          onChange={(e) => setQuestionNum(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="ชื่อคำถาม..."
          value={questionName}
          onChange={(e) => setQuestionName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          เพิ่มคำถาม
        </button>
      </div>
    </div>
  );
};

export default AddQuestion;
