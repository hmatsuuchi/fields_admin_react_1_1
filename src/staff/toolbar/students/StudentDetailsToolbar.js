import React from "react";
// CSS
import "./StudentDetailsToolbar.scss";
// Components
import ToolbarBackButton from "../../micro/students/ToolbarBackButton";

function StudentDetailsToolbar({ backButtonLink, backButtonText }) {
  return (
    <div id="student-profile-details-toolbar">
      <ToolbarBackButton
        backButtonLink={backButtonLink}
        backButtonText={backButtonText}
      />
    </div>
  );
}

export default StudentDetailsToolbar;
