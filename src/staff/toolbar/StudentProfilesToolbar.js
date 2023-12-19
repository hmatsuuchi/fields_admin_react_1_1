import React from "react";
// CSS
import "./StudentProfilesToolbar.scss";
// COMPONENTS
import ResultCount from "../micro/ResultCount";
import AddNewProfileButton from "../micro/AddNewProfileButton";
import VerticalDividerThin from "../micro/VerticalDividerThin";
import FilterSortButton from "../micro/FilterSortButton";

function StudentProfilesToolbar({
  setSearchInput,
  resultCount,
  displayFilterSortMenu,
  setDisplayFilterSortMenu,
}) {
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div id="toolbar">
      <FilterSortButton
        displayFilterSortMenu={displayFilterSortMenu}
        setDisplayFilterSortMenu={setDisplayFilterSortMenu}
      />
      <AddNewProfileButton />
      <VerticalDividerThin />
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
