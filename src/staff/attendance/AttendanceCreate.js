import React, { Fragment, useState } from "react";
/* CSS */
import "./AttendanceCreate.scss";
/* COMPONENTS */
import AttendanceCreateToolbar from "../toolbar/attendance/AttendanceCreateToolbar";

/* COMPONENTS - ATTENDANCE CREATE */
function AttendanceCreate({ csrfToken }) {
  /* ----------------------------------------------------- */
  /* ------------- ATTENDANCE CREATE - STATE ------------- */
  /* ----------------------------------------------------- */

  const [disableToolbarButtons] = useState(false);

  /* ----------------------------------------------------- */
  /* ----------- ATTENDANCE CREATE - FUNCTIONS ----------- */
  /* ----------------------------------------------------- */

  /* ----------------------------------------------------- */
  /* -------------- ATTENDANCE CREATE - JSX -------------- */
  /* ----------------------------------------------------- */

  return (
    <Fragment>
      <section id="attendance-create-section">
        {/* TEXT DESCRIPTORS */}
        <div id="display-descriptors-container">
          <ul>
            <li>新しい出欠表を作成しています</li>
          </ul>
        </div>
        {/* FORM */}
        <div className="attendance-create-card-container">
          <div className="attendance-create-card">
            <div className="attendance-header-container">
              <div className="attendance-name-text"></div>
            </div>
            <div className="attendance-body-container"></div>
          </div>
        </div>
      </section>
      <AttendanceCreateToolbar disableToolbarButtons={disableToolbarButtons} />
    </Fragment>
  );
}

export default AttendanceCreate;
