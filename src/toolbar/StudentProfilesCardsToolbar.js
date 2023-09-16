import React from "react";
// CSS
import "./StudentProfilesCardsToolbar.scss";

function StudentProfilesCardsToolbar({ setSearchInput }) {
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div id="toolbar">
      <div id="search-container">
        <input
          id="search-input"
          type="text"
          tabIndex="1"
          onChange={handleInputChange}></input>
      </div>
    </div>
  );
}

export default StudentProfilesCardsToolbar;
