import React from "react";
// CSS
import "./StudentDeleteToolbar.scss";
// Components
import ToolbarBackButton from "../micro/ToolbarBackButton";

function StudentDeleteToolbar({
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

export default StudentDeleteToolbar;
