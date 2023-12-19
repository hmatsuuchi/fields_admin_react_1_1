import React from "react";
// CSS
import "./FilterSortMenu.scss";

function FilterSortMenu() {
  return (
    <div className="filter-sort-menu-container">
      <form>
        <label htmlFor="month-1">January</label>
        <input type="checkbox" name="month-1" />
        <label htmlFor="month-2">February</label>
        <input type="checkbox" name="month-2" />
        <label htmlFor="month-3">March</label>
        <input type="checkbox" name="month-3" />
        <label htmlFor="month-4">April</label>
        <input type="checkbox" name="month-4" />
        <label htmlFor="month-5">May</label>
        <input type="checkbox" name="month-5" />
        <label htmlFor="month-6">June</label>
        <input type="checkbox" name="month-6" />
        <label htmlFor="month-7">July</label>
        <input type="checkbox" name="month-7" />
        <label htmlFor="month-8">August</label>
        <input type="checkbox" name="month-8" />
        <label htmlFor="month-9">September</label>
        <input type="checkbox" name="month-9" />
        <label htmlFor="month-10">October</label>
        <input type="checkbox" name="month-10" />
        <label htmlFor="month-11">November</label>
        <input type="checkbox" name="month-11" />
        <label htmlFor="month-12">December</label>
        <input type="checkbox" name="month-12" />
      </form>
    </div>
  );
}

export default FilterSortMenu;
