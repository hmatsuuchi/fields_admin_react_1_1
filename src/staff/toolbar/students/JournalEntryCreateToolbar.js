import React from "react";
// CSS
import "./JournalEntryCreateToolbar.scss";
// Components
import ToolbarBackButton from "../../micro/students/ToolbarBackButton";

function JournalEntryCreateToolbar({
  backButtonText,
  setBackButtonText,
  backButtonLink,
  displayContent,
}) {
  return (
    <div id="journal-entry-create-toolbar">
      {displayContent && (
        <ToolbarBackButton
          backButtonText={backButtonText}
          setBackButtonText={setBackButtonText}
          backButtonLink={backButtonLink}
        />
      )}
    </div>
  );
}

export default JournalEntryCreateToolbar;
