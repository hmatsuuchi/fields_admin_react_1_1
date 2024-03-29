import React from "react";
// CSS
import "./ScheduleWeekToolbar.scss";
// COMPONENTS

function ScheduleWeekToolbar({
  selectedDate,
  setSelectedDate,
  loadingData,
  setLoadingData,
}) {
  return (
    <div id="schedule-week-toolbar">
      <input
        type="date"
        id="date-selector"
        value={selectedDate.toISOString().split("T")[0]}
        onChange={(e) => {
          !isNaN(new Date(e.target.value)) &&
            !loadingData &&
            setSelectedDate(new Date(e.target.value));
          setLoadingData(true);
        }}
      />
    </div>
  );
}

export default ScheduleWeekToolbar;
