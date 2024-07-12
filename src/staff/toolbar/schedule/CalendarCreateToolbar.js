import React from "react";
// CSS
import "./CalendarCreateToolbar.scss";
// COMPONENTS
import ToolbarBackButton from "../../micro/schedule/ToolbarBackButton";

function CalendarCreateToolbar({ disableToolbarButtons }) {
  return (
    <div
      id="calendar-create-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}>
      <ToolbarBackButton
        backButtonLink={"/staff/schedule/events/calendar/week-view"}
        backButtonText={"カレンダー"}
      />
    </div>
  );
}

export default CalendarCreateToolbar;
