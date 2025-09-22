import React, { useEffect, useState } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./UpcomingBirthdays.scss";
/* COMPONENTS */
import LoadingSpinner from "../../micro/LoadingSpinner";

function UpcomingBirthdays() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [studentsWithUpcomingBirthdays, setStudentsWithUpcomingBirthdays] =
    useState(null);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

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
              >
                <div className="student-name-container">
                  <div className="student-name-kanji">{`${student.last_name_kanji} ${student.first_name_kanji}`}</div>
                  <div className="student-name-katakana">{`${student.last_name_katakana} ${student.first_name_katakana}`}</div>
                </div>
                <div>{`${getDayOfWeek(student.birthday)} (${[
                  parseInt(student.age) + 1,
                ]}歳)`}</div>
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
