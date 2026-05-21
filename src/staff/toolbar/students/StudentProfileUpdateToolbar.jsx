import React from "react";
// CSS
import "./StudentProfileUpdateToolbar.scss";
// Components
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function StudentProfileUpdateToolbar({
  backButtonLink,
  backButtonText,
  displayBackButton,
  setDisplayBackButton,
  displayContent,
}) {
  return (
    <div id="student-profile-update-toolbar">
      {displayContent && (
        <ToolbarBackButton
          backButtonLink={backButtonLink}
          backButtonText={backButtonText}
          displayBackButton={displayBackButton}
          setDisplayBackButton={setDisplayBackButton}
        />
      )}
    </div>
  );
}

export default StudentProfileUpdateToolbar;
