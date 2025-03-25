// src/pages/question-choice-setting/index.tsx
import React from "react";
import { Link } from "react-router-dom";
import QuestionAndChoiceList from "./components/QuestionAndChoiceList";
import PageBreadcrumb from "../../components/PageBreadcrumb";

const QuestionChoiceSettingIndex = () => {
  return (
    <>
        <div className="card-body">
          <QuestionAndChoiceList />
        </div>
    </>
  );
};

export default QuestionChoiceSettingIndex;
