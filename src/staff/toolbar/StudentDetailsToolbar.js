import React from "react";
// CSS
import "./StudentDetailsToolbar.scss";
// Components
import ToolbarBackButton from "../micro/ToolbarBackButton";

function StudentDetailsToolbar() {
  return (
    <div id="details-toolbar">
      <ToolbarBackButton
        backButtonLink={"/staff/students/profiles/cards"}
        backButtonText={"生徒情報"}
      />
    </div>
  );
}

export default StudentDetailsToolbar;
