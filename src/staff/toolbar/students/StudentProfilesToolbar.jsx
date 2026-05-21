import React, { useEffect, useState } from "react";
// CSS
import "./StudentProfilesToolbar.scss";
// COMPONENTS
import AddNewProfileButton from "../../micro/students/AddNewProfileButton";
import FilterButton from "../../micro/students/FilterButton";
import ResultCount from "../../micro/students/ResultCount";
import SortButton from "../../micro/students/SortButton";
import VerticalDividerThin from "../../micro/students/VerticalDividerThin";
import ToolbarBackButton from "../../micro/ToolbarBackButton";

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
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [displayFilterMenu, setDisplayFilterMenu] = useState(false);
  const [displaySortMenu, setDisplaySortMenu] = useState(false);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  /* ------------------------------------------- */
  /* ---------------- FUNCTIONS ---------------- */
  /* ------------------------------------------- */

  /* focus on search input on component mount */
  useEffect(() => {
    const searchField = document.getElementById("search-input");
    searchField.focus();
  }, []);

  /* ------------------------------------------- */
  /* ------------------- JSX ------------------- */
  /* ------------------------------------------- */

  return (
    <div
      id="student-profile-list-toolbar"
      className={`${disableToolbarButtons ? "disable-toolbar-buttons" : ""}`}
    >
      <ToolbarBackButton
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />
      <div className="right-side-element-container">
        <div id="search-container">
          <input
            id="search-input"
            type="text"
            tabIndex="0"
            onChange={handleInputChange}
          ></input>
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
    </div>
  );
}

export default StudentProfilesToolbar;
