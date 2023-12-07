import React from "react";
// CSS
import "./AddNewProfileButton.scss";
import { Link } from "react-router-dom";

function AddNewProfileButton() {
  return (
    <Link
      to="/staff/students/profiles/create"
      className="add-new-profile-button">
      <div className="cross-container">
        <div className="vertical-bar"></div>
        <div className="horizontal-bar"></div>
      </div>
    </Link>
  );
}

export default AddNewProfileButton;
