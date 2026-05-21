import React from "react";
// CSS
import "./JournalEntryCreateToolbar.scss";
// Components
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function JournalEntryCreateToolbar({
  backButtonText,
  setBackButtonText,
  backButtonLink,
  displayContent,
  displayBackButton,
  setDisplayBackButton,
}) {
  return (
    <div id="journal-entry-create-toolbar">
      {displayContent && (
        <ToolbarBackButton
          backButtonText={backButtonText}
          setBackButtonText={setBackButtonText}
          backButtonLink={backButtonLink}
          displayBackButton={displayBackButton}
          setDisplayBackButton={setDisplayBackButton}
        />
      )}
    </div>
  );
}

export default JournalEntryCreateToolbar;
