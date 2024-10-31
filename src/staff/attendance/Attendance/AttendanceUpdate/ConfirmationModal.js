import React from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./ConfirmationModal.scss";

function ConfirmationModal({
  csrfToken,
  setShowAttendanceUpdateContainer,
  setShowConfirmationModal,
  attendances,
  setAttendances,
  attendanceSelectedId,
  eventNameSelected,
}) {
  /* ------------------------------------------------------ */
  /* ----------------------- STATE ------------------------ */
  /* ------------------------------------------------------ */

  /* ------------------------------------------------------- */
  /* ---------------------- FUNCTIONS ---------------------- */
  /* ------------------------------------------------------- */

  /* HANDLE CLICKS TO CONFIRM DELETE ATTENDANCE RECORD BUTTON */
  const handleClicksToConfirmButton = () => {
    /* hides the attendance update container */
    setShowAttendanceUpdateContainer(false);

    /* makes a copy of the attendance records array */
    const updatedAttendances = [...attendances];

    /* updates attendances array to remove the selected attendance record */
    const updatedAttendancesFiltered = updatedAttendances.filter(
      (attendance) => attendance.id !== attendanceSelectedId
    );

    /* sets the updated attendances array */
    setAttendances(updatedAttendancesFiltered);

    /* updates the backend */
    const updateBackend = async () => {
      const data = {
        attendance_id: attendanceSelectedId,
      };

      try {
        await instance
          .delete("api/attendance/attendance/attendance_details/", {
            headers: {
              "X-CSRFToken": csrfToken,
            },
            data: data,
          })
          .then((response) => {
            if (response) {
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drives code */
    updateBackend();
  };

  /* HANDLE CLICKS TO CANCEL BUTTON */
  const handleClicksToCancelButton = () => {
    setShowConfirmationModal(false);
  };

  /* ------------------------------------------------------ */
  /* ------------------------ JSX ------------------------- */
  /* ------------------------------------------------------ */

  return (
    <div id="confirmation-modal-container">
      <div className="confirmation-modal-dialog-container">
        <div className="confirmation-modal-dialog">{`「${eventNameSelected}」を削除しますか？`}</div>
        <button className="cancel-button" onClick={handleClicksToCancelButton}>
          戻る
        </button>
        <button
          className="confirm-button"
          onClick={handleClicksToConfirmButton}>
          アーカイブする
        </button>
      </div>
    </div>
  );
}

export default ConfirmationModal;
