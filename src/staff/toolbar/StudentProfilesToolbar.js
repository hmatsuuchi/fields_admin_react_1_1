import React from "react";
// CSS
import "./StudentProfilesToolbar.scss";
// COMPONENTS
import ResultCount from "../micro/ResultCount";

function StudentProfilesToolbar({ setSearchInput, resultCount }) {
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div id="toolbar">
      <div id="search-container">
        <input
          id="search-input"
          type="text"
          tabIndex="-1"
          onChange={handleInputChange}></input>
      </div>
      <ResultCount resultCount={resultCount} />
    </div>
  );
}

export default StudentProfilesToolbar;
