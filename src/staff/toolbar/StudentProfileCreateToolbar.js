import React from "react";
// CSS
import "./StudentProfileCreateToolbar.scss";
// Components
import ToolbarBackButton from "../micro/ToolbarBackButton";

function StudentProfileCreateToolbar() {
  return (
    <div id="student-profile-create-toolbar">
      <ToolbarBackButton
        backButtonLink={"/staff/students/profiles/cards"}
        backButtonText={"生徒情報"}
      />
    </div>
  );
}

export default StudentProfileCreateToolbar;
