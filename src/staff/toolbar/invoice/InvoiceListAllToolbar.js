import React from "react";
// CSS
import "./InvoiceListAllToolbar.scss";
// COMPONENTS
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function InvoiceListAllToolbar({
  disableToolbarButtons,
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  return (
    <div
      id="invoice-list-all-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}
    >
      <ToolbarBackButton
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />
    </div>
  );
}

export default InvoiceListAllToolbar;
