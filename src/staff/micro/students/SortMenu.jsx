import React, { Fragment } from "react";
// CSS
import "./SortMenu.scss";

function SortMenu({ setDisplaySortMenu, sorts, setSorts }) {
  const handleIDSortClick = () => {
    setSorts((prevSorts) => ({
      ...prevSorts,
      id: prevSorts.id === 1 ? 2 : 1,
      birth_month_day: 0,
    }));
  };
  const handleBirthMonthDaySortClick = () => {
    setSorts((prevSorts) => ({
      ...prevSorts,
      id: 0,
      birth_month_day: prevSorts.birth_month_day === 1 ? 2 : 1,
    }));
  };

  return (
    <Fragment>
      <div className="sort-menu-container">
        <div className="sort-main-title">並べ替え</div>
        <button className={"sort-item-container"} onClick={handleIDSortClick}>
          <div
            className={`sort-item-arrow${
              sorts.id === 0
                ? ""
                : sorts.id === 1
                ? " descending"
                : " ascending"
            }`}
          />
          <div className="sort-item-text">ID</div>
        </button>
        <button
          className="sort-item-container"
          onClick={handleBirthMonthDaySortClick}>
          <div
            className={`sort-item-arrow${
              sorts.birth_month_day === 0
                ? ""
                : sorts.birth_month_day === 1
                ? " descending"
                : " ascending"
            }`}
          />
          <div className="sort-item-text">誕生日</div>
        </button>
      </div>
      <div
        className="close-sort-menu-background-button"
        onClick={() => {
          setDisplaySortMenu(false);
        }}></div>
    </Fragment>
  );
}

export default SortMenu;
