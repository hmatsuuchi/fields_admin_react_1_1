import React from "react";
// CSS
import "./StudentProfileUpdateToolbar.scss";
// Components
import ToolbarBackButton from "../micro/ToolbarBackButton";

function StudentProfileUpdateToolbar({
  backButtonLink,
  backButtonText,
  displayContent,
}) {
  return (
    <div id="student-profile-update-toolbar">
      {displayContent && (
        <ToolbarBackButton
          backButtonLink={backButtonLink}
          backButtonText={backButtonText}
        />
      )}
    </div>
  );
}

export default StudentProfileUpdateToolbar;
