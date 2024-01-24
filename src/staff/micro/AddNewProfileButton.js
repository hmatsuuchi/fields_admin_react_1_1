import React from "react";
// CSS
import "./AddNewProfileButton.scss";
import { Link } from "react-router-dom";

function AddNewProfileButton({ DOMOrder }) {
  return (
    <Link
      to="/staff/students/profiles/create/"
      className="add-new-profile-button"
      style={{ order: DOMOrder }}></Link>
  );
}

export default AddNewProfileButton;
