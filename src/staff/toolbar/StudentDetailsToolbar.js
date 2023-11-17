import React from "react";
// CSS
import "./StudentDetailsToolbar.scss";
// Components
import ToolbarBackButton from "../micro/ToolbarBackButton";

function StudentDetailsToolbar() {
  return (
    <div id="details-toolbar">
      <ToolbarBackButton />
    </div>
  );
}

export default StudentDetailsToolbar;
