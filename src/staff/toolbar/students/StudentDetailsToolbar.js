import React from "react";
// CSS
import "./StudentDetailsToolbar.scss";
// Components
import ToolbarBackButton from "../../micro/students/ToolbarBackButton";

function StudentDetailsToolbar({
  backButtonLink,
  backButtonText,
  displayContent,
}) {
  return (
    <div id="student-profile-details-toolbar">
      {displayContent && (
        <ToolbarBackButton
          backButtonLink={backButtonLink}
          backButtonText={backButtonText}
        />
      )}
    </div>
  );
}

export default StudentDetailsToolbar;
