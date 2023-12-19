import React from "react";
// CSS
import "./FilterSortButton.scss";

function FilterSortButton({ displayFilterSortMenu, setDisplayFilterSortMenu }) {
  function handleClick() {
    setDisplayFilterSortMenu(!displayFilterSortMenu);
  }
  return <button className="filter-sort-button" onClick={handleClick}></button>;
}

export default FilterSortButton;
