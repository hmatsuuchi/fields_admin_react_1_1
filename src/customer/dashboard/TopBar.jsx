import React from "react";
// CSS
import "./TopBar.scss";

function TopBar({ customerLastNameKanji }) {
  return (
    <section id="top-bar-section">
      <div className="top-bar-container">
        <div className="customer-container">
          <button className="customer-chip"></button>
          <div className="fields-name">フィールズ英会話</div>
          <div className="customer-name">
            {customerLastNameKanji ? `${customerLastNameKanji}様` : ""}
          </div>
        </div>
        <button className="menu-button">
          <div className="bar-element" />
          <div className="bar-element" />
          <div className="bar-element" />
        </button>
      </div>
    </section>
  );
}

export default TopBar;
