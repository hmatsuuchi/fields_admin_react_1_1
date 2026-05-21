import React from "react";
// CSS
import "./DisplayDescriptors.scss";

function DisplayDescriptors({ displayTextArray }) {
  return (
    <div id="display-descriptors-container">
      <ul>
        {displayTextArray.map((displayText, index) => (
          <li key={index}>{displayText}</li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayDescriptors;
