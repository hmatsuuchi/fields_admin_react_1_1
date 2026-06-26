import React from "react";
// CSS
import "./DashboardToolbar.scss";

function BalanceSheetToolbar({ disableToolbarButtons }) {
  return (
    <div
      id="balance-sheet-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}
    ></div>
  );
}

export default BalanceSheetToolbar;
