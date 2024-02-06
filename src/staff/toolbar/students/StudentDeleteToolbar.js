import React from "react";
// CSS
import "./StudentDeleteToolbar.scss";
// Components
import ToolbarBackButton from "../../micro/students/ToolbarBackButton";

function StudentDeleteToolbar({
  backButtonLink,
  backButtonText,
  displayContent,
}) {
  return (
    <div id="student-profile-delete-toolbar">
      {displayContent && (
        <ToolbarBackButton
          backButtonLink={backButtonLink}
          backButtonText={backButtonText}
        />
      )}
    </div>
  );
}

export default StudentDeleteToolbar;
