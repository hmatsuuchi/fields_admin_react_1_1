import React from "react";
// CSS
import "./InvoiceStatusAllToolbar.scss";
// COMPONENTS
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function InvoiceStatusAllToolbar({
  disableToolbarButtons,
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div
      id="invoice-status-all-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}
    >
      {/* <ToolbarBackButton
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      /> */}

      <ToolbarBackButton
        backButtonText={"ダッシュボード"}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />

      <div className="toolbar-right-side-container">
        <div className="year-month-container">
          <select>
            <option value={2025}>2026年</option>
            <option value={2024}>2025年</option>
          </select>
          <select>
            <option value={1}>1月</option>
            <option value={2}>2月</option>
            <option value={3}>3月</option>
            <option value={4}>4月</option>
            <option value={5}>5月</option>
            <option value={6}>6月</option>
            <option value={7}>7月</option>
            <option value={8}>8月</option>
            <option value={9}>9月</option>
            <option value={10}>10月</option>
            <option value={11}>11月</option>
            <option value={12}>12月</option>
          </select>
        </div>
        <button className="issued-filter-button"></button>
        <button className="paid-filter-button"></button>
      </div>
    </div>
  );
}

export default InvoiceStatusAllToolbar;
