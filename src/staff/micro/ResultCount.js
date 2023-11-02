import React from "react";
// CSS
import "./ResultCount.scss";

function ResultCount({ resultCount }) {
  return (
    <div className="result-container">
      <div className="result">{resultCount}件</div>
    </div>
  );
}

export default ResultCount;
