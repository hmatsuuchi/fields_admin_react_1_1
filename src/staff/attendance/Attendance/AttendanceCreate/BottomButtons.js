import React from "react";
/* Axios */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./BottomButtons.scss";
/* REACT ROUTER DOM */
import { useNavigate } from "react-router-dom";

function BottomButtons({
  csrfToken,
  eventIdSelected,
  activePrimaryInstructor,
  attendanceDate,
  attendanceStartTimeSelected,
  attendanceStudentsSelected,
}) {
  /* React Router DOM */
  const navigate = useNavigate();

  /* ----------------------------------------------------- */
  /* ----------------------- STATE ----------------------- */
  /* ----------------------------------------------------- */

  /* ----------------------------------------------------- */
  /* --------------------- FUNCTIONS --------------------- */
  /* ----------------------------------------------------- */

  /* HANDLE CLICKS TO CANCEL BUTTON */
  const handleClicksToCancelButton = () => {
    navigate(`/staff/attendance/day-view/`);
  };

  /* HANDLE CLICKS TO SUBMIT BUTTON */
  const handleClicksToSubmitButton = () => {
    const submitFormData = async () => {
      const attendanceRecords = attendanceStudentsSelected.map((student) => {
        return {
          student: student.id,
          status: 2,
        };
      });
      const attendanceData = {
        linked_class: eventIdSelected,
        instructor: activePrimaryInstructor.id,
        date: attendanceDate,
        start_time: attendanceStartTimeSelected,
        attendance_records: attendanceRecords,
      };

      try {
        await instance
          .post(
            "api/attendance/attendance/attendance_details/",
            attendanceData,
            {
              headers: {
                "X-CSRFToken": csrfToken,
              },
            }
          )
          .then((response) => {
            if (response) {
              console.log(response);
              navigate(`/staff/attendance/day-view/`);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drive code */
    submitFormData();
  };

  /* ----------------------------------------------------- */
  /* ------------------------ JSX ------------------------ */
  /* ----------------------------------------------------- */

  return (
    <div className="bottom-buttons-container">
      <button className="button cancel" onClick={handleClicksToCancelButton}>
        キャンセル
      </button>
      <button className="button submit" onClick={handleClicksToSubmitButton}>
        作成
      </button>
    </div>
  );
}

export default BottomButtons;
