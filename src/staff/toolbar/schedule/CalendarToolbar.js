import React from "react";
// CSS
import "./CalendarToolbar.scss";
// COMPONENTS
import AddNewEventButton from "../../micro/schedule/AddNewEventButton";

function CalendarToolbar({ disableToolbarButtons }) {
  return (
    <div
      id="calendar-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}>
      <AddNewEventButton DOMOrder={1} />
    </div>
  );
}

export default CalendarToolbar;
