import React from "react";
// CSS
import "./AddNewEventButton.scss";
import { Link } from "react-router-dom";

function AddNewEventButton({ DOMOrder }) {
  return (
    <Link
      to="/staff/schedule/events/calendar/create/"
      className="add-new-event-button"
      style={{ order: DOMOrder }}></Link>
  );
}

export default AddNewEventButton;
