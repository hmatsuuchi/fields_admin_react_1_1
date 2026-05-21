import React from "react";
// CSS
import "./DataLoadError.scss";

function DataLoadError({ errorMessage, retryFunction }) {
  return (
    <div id="data-load-error-container">
      <h3>{errorMessage}</h3>
      <button onClick={retryFunction}>再読み込み</button>
    </div>
  );
}

export default DataLoadError;
