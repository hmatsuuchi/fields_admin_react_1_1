import React, { useEffect, useState } from "react";
// Axios
import instance from "../../axios/axios_authenticated";
// CSS
import "../StudentProfilesCards.scss";
import "./EnrolledClasses.scss";
// React Router DOM
import { useNavigate } from "react-router-dom";

function EnrolledClasses({
  profileId,
  profileStatus,
  setDisplayProfile,
  profileLastNameKanji,
  profileFirstNameKanji,
  setBackButtonText,
  setBackButtonLink,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [enrolledClasses, setEnrolledClasses] = useState([]);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* REACT ROUTER DOM USENAVIGATE */
  const navigate = useNavigate();

  /* DAY OF WEEK CONVERSTION (STARTING CHARACTER) */
  const dayOfWeekKanji = {
    6: "日曜日",
    0: "月曜日",
    1: "火曜日",
    2: "水曜日",
    3: "木曜日",
    4: "金曜日",
    5: "土曜日",
  };

  /* STUDENT ENROLLMENT STATUS CSS CLASS CONVERSTION */
  const studentStatusClass = {
    1: "pre-enrolled",
    2: "enrolled",
    3: "short-absence",
    4: "long-absence",
  };

  /* HANDLE CLICKS TO ENROLLED STUDENTS */
  const handleClicksToEnrolledStudents = (event) => {
    /* resets profile details contents */
    setDisplayProfile(false);

    /* sets back button text and link */
    setBackButtonText(
      `生徒情報 (${profileLastNameKanji} ${profileFirstNameKanji})`
    );
    setBackButtonLink(`/staff/students/profiles/details/${profileId}`);

    /* navigates to clicked student profile */
    const studentId = event.target.dataset.student_id;
    navigate(`/staff/students/profiles/details/${studentId}`);
  };

  /* FETCH ENROLLED CLASSES DATA ON LOAD */
  useEffect(() => {
    (async () => {
      try {
        await instance
          .get("api/schedule/events/get_events_for_profile/", {
            params: { profile_id: profileId },
          })
          .then((response) => {
            if (response) {
              setEnrolledClasses(response.data.events);
            }
          });
      } catch (e) {
        console.log(e);
      }
    })();
  }, [profileId]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return enrolledClasses.length > 0 ? (
    <div id="enrolled-classes" className="card-container-full-width">
      <div className="card-full-width">
        <div
          className={`enrolled-class-header-container${` ${studentStatusClass[profileStatus]}`}`}
        >
          <div className="enrolled-class-title">現在授業</div>
          <div className="enrolled-class-number">{`${enrolledClasses.length}件`}</div>
        </div>
        <div className="enrolled-class-body-container">
          {enrolledClasses.map((enrolledClass) => (
            <div
              className="enrolled-class-container"
              key={`event-id-${enrolledClass.id}`}
            >
              <div className="event-info-container">
                <div className="event-data">
                  <div className="event-title">{enrolledClass.event_name}</div>
                  <div className="event-day-of-week">
                    {dayOfWeekKanji[enrolledClass.day_of_week]}
                  </div>
                  <div className="event-start-time">
                    {enrolledClass.start_time.slice(0, 5)}
                  </div>
                </div>

                <div
                  className="event-instructor-icon"
                  style={{
                    backgroundImage: `url(/img/instructors/${enrolledClass.primary_instructor.userprofilesinstructors.icon_stub})`,
                  }}
                />
              </div>
              <div className="enrolled-students-container">
                {enrolledClass.students.map((student) => {
                  return (
                    <div
                      onClick={handleClicksToEnrolledStudents}
                      data-student_id={student.id}
                      className={`enrolled-student-container${
                        parseInt(profileId) === parseInt(student.id)
                          ? " this-student"
                          : ""
                      }`}
                      key={`event-id-${enrolledClass.id}-student-id-${student.id}`}
                    >
                      <div
                        className={`student-status-indicator ${
                          studentStatusClass[student.status]
                        }`}
                      />
                      <div className="student-name-kanji">{`${student.last_name_kanji} ${student.first_name_kanji} (${student.grade_verbose})`}</div>
                      <div className="student-name-katakana">{`${student.last_name_katakana} ${student.first_name_katakana}`}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;
}

export default EnrolledClasses;
