import React from "react";
// CSS
import "./ResultCount.scss";

function ResultCount({ resultCount, DOMOrder }) {
  return (
    <div className="result-container" style={{ order: DOMOrder }}>
      <div className="result">{resultCount}件</div>
    </div>
  );
}

export default ResultCount;
