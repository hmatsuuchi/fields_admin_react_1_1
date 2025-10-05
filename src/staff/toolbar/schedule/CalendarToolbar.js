import React from "react";
// CSS
import "./CalendarToolbar.scss";
// COMPONENTS
import AddNewEventButton from "../../micro/schedule/AddNewEventButton";
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function CalendarToolbar({
  disableToolbarButtons,
  backButtonText,
  setBackButtonText,
  backButtonLink,
  setBackButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  return (
    <div
      id="calendar-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}
    >
      <ToolbarBackButton
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />
      <AddNewEventButton
        DOMOrder={1}
        setBackButtonText={setBackButtonText}
        setBackButtonLink={setBackButtonLink}
        setDisplayBackButton={setDisplayBackButton}
      />
    </div>
  );
}

export default CalendarToolbar;
