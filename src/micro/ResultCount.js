import React from "react";
// CSS
import "./ResultCount.scss";

function ResultCount({ resultInteger }) {
  return <div className="result-count">{resultInteger}件を表示しています</div>;
}

export default ResultCount;
