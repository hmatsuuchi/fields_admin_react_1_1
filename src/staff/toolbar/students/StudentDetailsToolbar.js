import React from "react";
// CSS
import "./StudentDetailsToolbar.scss";
// Components
import ToolbarBackButton from "../../micro/students/ToolbarBackButton";

function StudentDetailsToolbar({
  backButtonLink,
  backButtonText,
  setBackButtonText,
}) {
  return (
    <div id="student-profile-details-toolbar">
      <ToolbarBackButton
        backButtonLink={backButtonLink}
        backButtonText={backButtonText}
        setBackButtonText={setBackButtonText}
      />
    </div>
  );
}

export default StudentDetailsToolbar;
