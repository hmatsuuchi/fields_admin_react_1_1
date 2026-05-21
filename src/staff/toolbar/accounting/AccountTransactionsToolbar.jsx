import React from "react";
// CSS
import "./AccountTransactionsToolbar.scss";
// COMPONENTS
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function AccountTransactionsToolbar({
  disableToolbarButtons,
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  return (
    <div
      id="account-transactions-toolbar"
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

export default AccountTransactionsToolbar;
