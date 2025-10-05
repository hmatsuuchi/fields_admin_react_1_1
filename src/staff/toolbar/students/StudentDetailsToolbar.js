import React from "react";
// CSS
import "./StudentDetailsToolbar.scss";
// Components
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function StudentDetailsToolbar({
  backButtonLink,
  backButtonText,
  displayBackButton,
  setDisplayBackButton,
}) {
  return (
    <div id="student-profile-details-toolbar">
      <ToolbarBackButton
        backButtonLink={backButtonLink}
        backButtonText={backButtonText}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />
    </div>
  );
}

export default StudentDetailsToolbar;
