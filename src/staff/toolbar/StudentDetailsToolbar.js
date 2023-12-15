import React from "react";
// CSS
import "./StudentDetailsToolbar.scss";
// Components
import ToolbarBackButton from "../micro/ToolbarBackButton";

function StudentDetailsToolbar({
  backButtonLink,
  backButtonText,
  displayContent,
}) {
  return (
    <div id="details-toolbar">
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
