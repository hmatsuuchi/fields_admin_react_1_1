import React, { Fragment, useState } from "react";
/* AXIOS */
import instance from "../../axios/axios_authenticated";
/* CSS */
import "./AttendanceUpdate.scss";
/* COMPONENTS */
import StudentContainer from "./Attendance/AttendanceUpdate/StudentContainer";
import StudentEnrolledContainer from "./Attendance/AttendanceUpdate/StudentEnrolledContainer";
import DeleteAttendanceButton from "./Attendance/AttendanceUpdate/DeleteAttendanceButton";
import ConfirmationModal from "./Attendance/AttendanceUpdate/ConfirmationModal";

/* timeout id used to delay backend communcation */
let timeoutId;

function AttendanceUpdate({
  csrfToken,
  setShowAttendanceUpdateContainer,
  activePrimaryInstructor,
  studentChoices,
  eventNameSelected,
  eventCapacitySelected,
  eventDateSelected,
  attendanceStartTimeSelected,
  setAttendanceStartTimeSelected,
  attendanceStudentsSelected,
  setAttendanceStudentsSelected,
  attendances,
  setAttendances,
  attendanceSelectedId,
  primaryInstructorChoices,
}) {
  /* ------------------------------------------------------ */
  /* ----------------------- STATE ------------------------ */
  /* ------------------------------------------------------ */

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  /* ------------------------------------------------------- */
  /* ---------------------- FUNCTIONS ---------------------- */
  /* ------------------------------------------------------- */

  /* HANDLE CLICKS TO EXIT BUTTON */
  const handleClicksToExitButton = () => {
    setShowAttendanceUpdateContainer(false);
  };

  /* HANDLE CHANGES TO EVENT START TIME INPUT */
  const handleChangesToEventStartTimeInput = (event) => {
    const newValue = event.target.value;

    setAttendanceStartTimeSelected(newValue);

    if (newValue !== "") {
      /* makes a copy of the attendance records array */
      const updatedAttendances = [...attendances];

      /* finds the attendance record to update */
      updatedAttendances.map((record) => {
        if (record.id === attendanceSelectedId) {
          return (record.start_time = event.target.value);
        }

        return record;
      });

      /* sets the updated attendances array */
      setAttendances(updatedAttendances);

      /* updates the backend with the new start time */
      const updateBackend = async () => {
        const data = {
          attendance_id: attendanceSelectedId,
          start_time: event.target.value,
        };

        try {
          await instance
            .put("api/attendance/attendance/attendance_details/", data, {
              headers: {
                "X-CSRFToken": csrfToken,
              },
            })
            .then((response) => {
              if (response) {
              }
            });
        } catch (e) {
          console.log(e);
        }
      };

      /* clears the timeout id */
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      /* sets the timeout id and makes endpoint call after timer elapsed */
      timeoutId = setTimeout(() => {
        updateBackend();
      }, 1000);
    }
  };

  /* ------------------------------------------------------ */
  /* ------------------------ JSX ------------------------- */
  /* ------------------------------------------------------ */

  return (
    <Fragment>
      <div
        className="attendance-update-background"
        onClick={handleClicksToExitButton}
      ></div>
      <div className="attendance-update-container">
        <div className="attendance-update-card">
          {/* HEADER */}
          <div className="attendance-update-card-header">
            <div className="attendance-event-name">{eventNameSelected}</div>
            <div
              className="exit-button"
              onClick={handleClicksToExitButton}
            ></div>
          </div>
          {/* BODY */}
          <div
            className={`attendance-update-card-body${
              studentChoices.length === 0 ? " disable-clicks" : ""
            }`}
          >
            <div className="label-and-data instructor">
              <div className="label">講師</div>
              <select
                className="data instructor"
                readOnly
                value={activePrimaryInstructor.id}
              >
                {primaryInstructorChoices.map((instructor) => (
                  <option
                    key={`instructor-id-${instructor.id}`}
                    value={instructor.id}
                  >
                    {`${instructor.userprofilesinstructors.last_name_kanji}先生`}
                  </option>
                ))}
              </select>
            </div>
            <div className="label-and-data date">
              <div className="label">日付</div>
              <input type="date" value={eventDateSelected} readOnly={true} />
            </div>

            <div className="label-and-data time">
              <div className="label">開始時間</div>
              <input
                className="data"
                type="time"
                value={attendanceStartTimeSelected.slice(0, 5)}
                onChange={handleChangesToEventStartTimeInput}
              />
            </div>
            <StudentContainer
              csrfToken={csrfToken}
              studentChoices={studentChoices}
              attendanceStudentsSelected={attendanceStudentsSelected}
              setAttendanceStudentsSelected={setAttendanceStudentsSelected}
              attendances={attendances}
              setAttendances={setAttendances}
              attendanceSelectedId={attendanceSelectedId}
            />
            <StudentEnrolledContainer
              csrfToken={csrfToken}
              attendanceStudentsSelected={attendanceStudentsSelected}
              setAttendanceStudentsSelected={setAttendanceStudentsSelected}
              eventCapacitySelected={eventCapacitySelected}
              attendances={attendances}
              setAttendances={setAttendances}
              attendanceSelectedId={attendanceSelectedId}
            />
          </div>
          {/* FOOTER */}
          <div
            className={`attendance-update-card-footer${
              studentChoices.length === 0 ? " disable-clicks" : ""
            }`}
          >
            <DeleteAttendanceButton
              csrfToken={csrfToken}
              attendances={attendances}
              setAttendances={setAttendances}
              attendanceSelectedId={attendanceSelectedId}
              setShowAttendanceUpdateContainer={
                setShowAttendanceUpdateContainer
              }
              setShowConfirmationModal={setShowConfirmationModal}
            />
          </div>
        </div>
      </div>
      {showConfirmationModal ? (
        <ConfirmationModal
          csrfToken={csrfToken}
          setShowAttendanceUpdateContainer={setShowAttendanceUpdateContainer}
          setShowConfirmationModal={setShowConfirmationModal}
          attendances={attendances}
          setAttendances={setAttendances}
          attendanceSelectedId={attendanceSelectedId}
          eventNameSelected={eventNameSelected}
        />
      ) : null}
    </Fragment>
  );
}

export default AttendanceUpdate;
