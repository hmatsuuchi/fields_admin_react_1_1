import React from "react";
// CSS
import "./AddNewEventButton.scss";
import { Link } from "react-router-dom";

function AddNewEventButton({
  DOMOrder,
  setBackButtonText,
  setBackButtonLink,
  setDisplayBackButton,
}) {
  const handleClicksToAddNewEventButton = () => {
    setBackButtonText("カレンダー");
    setBackButtonLink("/staff/schedule/events/calendar/week-view/");
    setDisplayBackButton(true);
  };

  return (
    <Link
      to="/staff/schedule/events/calendar/create/"
      className="add-new-event-button"
      style={{ order: DOMOrder }}
      onClick={() => {
        handleClicksToAddNewEventButton();
      }}
    ></Link>
  );
}

export default AddNewEventButton;
