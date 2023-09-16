import React, { Fragment, useState } from "react";
import { useEffect } from "react";
// Axios
import instance from "../../axios/axios";
// CSS
import "./StudentProfilesCards.scss";
// Components
import LoadingSpinner from "../../micro/LoadingSpinner";
import DividerThin from "../../micro/DividerThin";
import ResultCount from "../../micro/ResultCount";
import StudentProfilesCardsToolbar from "../../toolbar/StudentProfilesCardsToolbar";

// ======= NEXT =======
// need to write code to disable search bar before data has loaded

function StudentProfiles() {
  const [studentProfiles, setStudentProfiles] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [resultsCount, setResultsCount] = useState(0);

  // makes API call and fetches initial data
  useEffect(() => {
    (async () => {
      try {
        await instance.get("api/students/profiles").then((response) => {
          if (response) {
            setStudentProfiles(response.data);
            setResultsCount(response.data.length);
            document
              .getElementById("navigation")
              .classList.remove("nav-disabled");
          }
        });
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  // updates result count
  useEffect(() => {
    setResultsCount(
      document.getElementsByClassName("student-profile-card").length
    );
  }, [searchInput]);

  return (
    <Fragment>
      <StudentProfilesCardsToolbar setSearchInput={setSearchInput} />
      {studentProfiles && <ResultCount resultInteger={resultsCount} />}
      <div className="card-container">
        {studentProfiles ? (
          // searches look through these fields
          studentProfiles.map((profile) => {
            let searchFields =
              profile.last_name_romaji +
              profile.first_name_romaji +
              profile.last_name_kanji +
              profile.first_name_kanji +
              profile.last_name_katakana +
              profile.first_name_katakana +
              profile.post_code +
              profile.prefecture_verbose +
              profile.city +
              profile.address_1 +
              profile.address_2 +
              profile.phone.map((number) => {
                return number.number;
              }) +
              profile.birthday +
              profile.grade_verbose +
              profile.status_verbose +
              profile.payment_method_verbose;

            let isMatch = searchFields
              .toUpperCase()
              .includes(searchInput.trim().toLocaleUpperCase());

            return (
              isMatch && (
                <div
                  className="student-profile-card card"
                  key={`student-profile-${profile.id}`}>
                  <div
                    className={`student-profile-header-container${
                      profile.status === 1
                        ? " pre-enrolled"
                        : profile.status === 2
                        ? " enrolled"
                        : profile.status === 3
                        ? " short-absence"
                        : profile.status === 4
                        ? " long-absence"
                        : "status-unknown"
                    }`}>
                    <div className="status">
                      {profile.status_verbose !== "" && profile.status_verbose}
                    </div>
                  </div>
                  <div className="student-profile-body-container">
                    <div className="name-container">
                      <div className="name-kanji-grade">
                        {profile.last_name_kanji !== "" &&
                          profile.last_name_kanji}
                        {profile.last_name_kanji !== "" &&
                          profile.first_name_kanji !== "" &&
                          " "}
                        {profile.first_name_kanji !== "" &&
                          profile.first_name_kanji}
                        {profile.first_name_kanji !== "" &&
                          profile.grade_verbose !== "" &&
                          " "}
                        {profile.grade_verbose !== "" &&
                          `(${profile.grade_verbose})`}
                      </div>
                      <div className="name-katakana">
                        {profile.last_name_katakana !== "" &&
                          profile.last_name_katakana}
                        {profile.first_name_katakana !== "" &&
                          ` ${profile.first_name_katakana}`}
                      </div>
                      <div className="name-romaji">
                        {profile.last_name_romaji !== "" &&
                          profile.last_name_romaji}
                        {profile.last_name_romaji &&
                          profile.first_name_romaji &&
                          ", "}
                        {profile.first_name_romaji !== "" &&
                          profile.first_name_romaji}
                      </div>
                    </div>
                    <div className="contact-container">
                      {profile.phone.map((phone) => {
                        return (
                          <div className="phone" key={`phone-${phone.id}`}>
                            {phone.number}
                            {phone.number_type_verbose !== ""
                              ? ` (${phone.number_type_verbose})`
                              : ""}
                          </div>
                        );
                      })}
                    </div>
                    {profile.phone.length !== 0 &&
                      (profile.post_code !== "" ||
                        profile.address_1 !== "" ||
                        profile.address_2 !== "") && <DividerThin />}
                    <div className="address-container">
                      <div className="post-code">
                        {profile.post_code !== ""
                          ? `〒${profile.post_code}`
                          : ""}
                      </div>
                      <div className="address-line-1">
                        {profile.prefecture !== ""
                          ? profile.prefecture_verbose
                          : ""}
                        {profile.city !== "" ? profile.city : ""}
                        {profile.address_1 !== "" ? profile.address_1 : ""}
                      </div>
                      <div className="address-line-2">
                        {profile.address_2 !== "" ? profile.address_2 : ""}
                      </div>
                    </div>
                    {(profile.post_code !== "" ||
                      profile.city !== "" ||
                      profile.address_1 !== "" ||
                      profile.address_2 !== "") &&
                      profile.birthday && <DividerThin />}
                    <div className="birthday-container">
                      <div className="birthday">
                        {profile.birthday !== null
                          ? `${profile.birthday} (${profile.age}才)`
                          : ""}
                      </div>
                    </div>
                    {profile.birthday !== null &&
                      profile.payment_method !== null && <DividerThin />}
                    <div className="payment-container">
                      {profile.payment_method && (
                        <div className="payment-method">
                          {profile.payment_method_verbose}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            );
          })
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </Fragment>
  );
}

export default StudentProfiles;
