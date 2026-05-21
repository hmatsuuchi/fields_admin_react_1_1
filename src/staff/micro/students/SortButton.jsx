import React from "react";
// Components
import SortMenu from "./SortMenu";
// CSS
import "./SortButton.scss";

function SortButton({
  DOMOrder,
  displaySortMenu,
  setDisplaySortMenu,
  sorts,
  setSorts,
}) {
  return (
    <div className="sort-button-and-menu-container" style={{ order: DOMOrder }}>
      <button
        className="sort-button-container"
        onClick={() => {
          setDisplaySortMenu(!displaySortMenu);
        }}>
        <div className="sort-button"></div>
        <div className="sort-button-text">並べ替え</div>
      </button>
      {displaySortMenu && (
        <SortMenu
          setDisplaySortMenu={setDisplaySortMenu}
          sorts={sorts}
          setSorts={setSorts}
        />
      )}
    </div>
  );
}

export default SortButton;
