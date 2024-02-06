import React, { useState } from "react";
// CSS
import "./StudentProfilesToolbar.scss";
// COMPONENTS
import AddNewProfileButton from "../../micro/students/AddNewProfileButton";
import FilterButton from "../../micro/students/FilterButton";
import ResultCount from "../../micro/students/ResultCount";
import SortButton from "../../micro/students/SortButton";
import VerticalDividerThin from "../../micro/students/VerticalDividerThin";

function StudentProfilesToolbar({
  setSearchInput,
  resultCount,
  disableToolbarButtons,
  monthFilters,
  setMonthFilters,
  archiveFilters,
  setArchiveFilters,
  filtersActive,
  sorts,
  setSorts,
}) {
  const [displayFilterMenu, setDisplayFilterMenu] = useState(false);
  const [displaySortMenu, setDisplaySortMenu] = useState(false);

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
      <SortButton
        DOMOrder={0}
        displaySortMenu={displaySortMenu}
        setDisplaySortMenu={setDisplaySortMenu}
        sorts={sorts}
        setSorts={setSorts}
      />
      <FilterButton
        DOMOrder={1}
        monthFilters={monthFilters}
        setMonthFilters={setMonthFilters}
        archiveFilters={archiveFilters}
        setArchiveFilters={setArchiveFilters}
        filtersActive={filtersActive}
        displayFilterMenu={displayFilterMenu}
        setDisplayFilterMenu={setDisplayFilterMenu}
        setDisplaySortMenu={setDisplaySortMenu}
      />
      <AddNewProfileButton DOMOrder={2} />
      <VerticalDividerThin DOMOrder={3} />

      <ResultCount resultCount={resultCount} DOMOrder={5} />
    </div>
  );
}

export default StudentProfilesToolbar;
