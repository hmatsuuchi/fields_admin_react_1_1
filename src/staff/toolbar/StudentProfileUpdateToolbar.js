import React from "react";
// CSS
import "./StudentProfileCreateToolbar.scss";
// Components
import ToolbarBackButton from "../micro/ToolbarBackButton";

function StudentProfileCreateToolbar({
  backButtonLink,
  backButtonText,
  displayContent,
}) {
  return (
    <div id="student-profile-create-toolbar">
      {displayContent && (
        <ToolbarBackButton
          backButtonLink={backButtonLink}
          backButtonText={backButtonText}
        />
      )}
    </div>
  );
}

export default StudentProfileCreateToolbar;
