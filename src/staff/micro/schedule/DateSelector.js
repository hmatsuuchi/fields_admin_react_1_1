import "./DateSelector.scss";

function DateSelector({
  currentDateDisplay,
  setCurrentDateData,
  startDate,
  endDate,
}) {
  // add 9 hours to current date to display in local time
  let currentDateCopy = new Date(currentDateDisplay);
  currentDateCopy.setHours(currentDateCopy.getHours() + 9);

  return (
    <div id="date-selector-container">
      <div id="start-date">{`${
        startDate.getMonth() + 1
      }月${startDate.getDate()}日 (日)`}</div>
      <input
        type="date"
        id="current-date"
        value={currentDateCopy.toISOString().slice(0, 10)}
        onChange={(e) => {
          setCurrentDateData(new Date(e.target.value));
          e.target.blur();
        }}
      />
      <div id="end-date">{`${
        endDate.getMonth() + 1
      }月${endDate.getDate()}日 (土)`}</div>
    </div>
  );
}

export default DateSelector;
