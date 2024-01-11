import React from "react";
// Components
import FilterMenu from "./FilterMenu";
// CSS
import "./FilterButton.scss";

function FilterButton({
  DOMOrder,
  monthFilters,
  setMonthFilters,
  filtersActive,
  displayFilterMenu,
  setDisplayFilterMenu,
  archiveFilters,
  setArchiveFilters,
}) {
  function handleClick() {
    setDisplayFilterMenu(!displayFilterMenu);
  }
  return (
    <div className="filter-button-and-menu-container">
      <button
        className={`filter-button-container${
          filtersActive ? " filters-active" : ""
        }`}
        onClick={handleClick}
        style={{ order: DOMOrder }}>
        <div className={"filter-button"}></div>
        <div className="filter-button-text">フィルター</div>
      </button>
      {displayFilterMenu && (
        <FilterMenu
          setDisplayFilterMenu={setDisplayFilterMenu}
          monthFilters={monthFilters}
          setMonthFilters={setMonthFilters}
          archiveFilters={archiveFilters}
          setArchiveFilters={setArchiveFilters}
        />
      )}
    </div>
  );
}

export default FilterButton;
