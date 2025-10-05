import React, { useEffect, useState } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./UpcomingBirthdays.scss";
/* COMPONENTS */
import LoadingSpinner from "../../micro/LoadingSpinner";
// React Router DOM
import { useNavigate } from "react-router-dom";

function UpcomingBirthdays({
  setBackButtonText,
  setBackButtonLink,
  setDisplayBackButton,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [studentsWithUpcomingBirthdays, setStudentsWithUpcomingBirthdays] =
    useState(null);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* REACT ROUTER DOM USENAVIGATE */
  const navigate = useNavigate();

  /* fetch list of students with upcoming birthdays */
  const fetchData = React.useCallback(() => {
    instance
      .get("api/dashboard/dashboard/upcoming_birthdays/")
      .then((response) => {
        if (response) {
          setStudentsWithUpcomingBirthdays(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  /* runs on component mount */
  useEffect(() => {
    /* drives code */
    fetchData();
  }, [fetchData]);

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    date.setFullYear(new Date().getFullYear()); // Set to current year
    return date.toLocaleDateString("ja-JP", { weekday: "long" });
  };

  const convertToJapaneseDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.getFullYear() +
      "年" +
      (date.getMonth() + 1) +
      "月" +
      date.getDate() +
      "日"
    );
  };

  const jumpToStudentProfile = (studentId) => {
    /* sets back button text and link */
    setBackButtonText("ダッシュボード");
    setBackButtonLink("/staff/dashboard/");
    setDisplayBackButton(true);

    /* navigates to clicked student profile */
    navigate(`/staff/students/profiles/details/${studentId}`);
  };

  const howOldStudentWillBecome = (student) => {
    const today = new Date();
    const studentBirthday = new Date(student.birthday);
    const studentAge = parseInt(student.age);

    const todayMonthDayString = `${today.getMonth()}${today.getDate()}`;
    const todayMonthDay = parseInt(todayMonthDayString);

    const studentBirthdayMonthDayString = `${studentBirthday.getMonth()}${studentBirthday.getDate()}`;
    const studentBirthdayMonthDay = parseInt(studentBirthdayMonthDayString);

    if (todayMonthDay === studentBirthdayMonthDay) {
      return `本日 (${studentAge - 1}歳 → ${studentAge}歳)`;
    } else if (todayMonthDay + 1 === studentBirthdayMonthDay) {
      return `明日 (${studentAge}歳 → ${studentAge + 1}歳)`;
    } else {
      return `${getDayOfWeek(studentBirthday)} (${studentAge}歳 → ${
        studentAge + 1
      }歳)`;
    }
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div id="upcoming-birthdays" className="component-primary-container">
      <div className="component-title">近日誕生日</div>
      <div className="upcoming-birthdays-container">
        {!studentsWithUpcomingBirthdays ? (
          <LoadingSpinner />
        ) : studentsWithUpcomingBirthdays.length > 0 ? (
          studentsWithUpcomingBirthdays.map((student) => {
            return (
              <div
                key={`student-id-${student.id}`}
                className="student-container"
                onClick={() => jumpToStudentProfile(student.id)}
              >
                <div className="student-name-container">
                  <div className="student-name-kanji">{`${student.last_name_kanji} ${student.first_name_kanji}`}</div>
                  <div className="student-name-katakana">{`${student.last_name_katakana} ${student.first_name_katakana}`}</div>
                </div>
                <div>{howOldStudentWillBecome(student)}</div>
                <div>{`${convertToJapaneseDate(student.birthday)}`}</div>
                {student.events_set.map((event) => {
                  return (
                    <div
                      className="event-container"
                      key={`event-id-${event.id}`}
                    >
                      <div>{event.event_name}</div>
                      <div>{event.start_time.slice(0, 5)}</div>
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="no-upcoming-birthdays">
            🎁 本日、データはありません。
          </div>
        )}
      </div>
    </div>
  );
}

export default UpcomingBirthdays;
