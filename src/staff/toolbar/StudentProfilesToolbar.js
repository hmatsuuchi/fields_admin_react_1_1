import React from "react";
// CSS
import "./StudentProfilesToolbar.scss";
// COMPONENTS
import ResultCount from "../micro/ResultCount";
import AddNewProfileButton from "../micro/AddNewProfileButton";
import VerticalDividerThin from "../micro/VerticalDividerThin";
import FilterButton from "../micro/FilterButton";

function StudentProfilesToolbar({
  setSearchInput,
  resultCount,
  disableToolbarButtons,
  monthFilters,
  setMonthFilters,
  filtersActive,
}) {
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div
      id="student-profile-list-toolbar"
      className={`${disableToolbarButtons ? "disable-toolbar-buttons" : ""}`}>
      <div id="search-container">
        <input
          id="search-input"
          type="text"
          tabIndex="0"
          onChange={handleInputChange}></input>
      </div>
      <FilterButton
        DOMOrder={1}
        monthFilters={monthFilters}
        setMonthFilters={setMonthFilters}
        filtersActive={filtersActive}
      />
      <AddNewProfileButton DOMOrder={2} />
      <VerticalDividerThin DOMOrder={3} />

      <ResultCount resultCount={resultCount} DOMOrder={5} />
    </div>
  );
}

export default StudentProfilesToolbar;
