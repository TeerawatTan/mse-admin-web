import { useState } from "react";
import QuestionList from "./components/QuestionList";

const QuestionChoice = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <QuestionList key={refresh.toString()} />
    </div>
  );
};

export default QuestionChoice;
