import React, { useEffect, useState, Fragment } from "react";
// React Router DOM
import { useParams } from "react-router-dom";
// Axios
import instance from "../axios/axios_authenticated";
// CSS
import "./StudentProfilesCards.scss";
import "./StudentProfilesDetails.scss";
// Components
import DividerThin from "../micro/DividerThin";
import StudentDetailsToolbar from "../toolbar/StudentDetailsToolbar";
import LoadingSpinner from "../micro/LoadingSpinner";

function StudentProfilesDetails() {
  const { profileId } = useParams();

  const [profile, setProfile] = useState(null);

  // makes API call and fetches profile details
  useEffect(() => {
    (async () => {
      try {
        await instance
          .post("api/students/profiles/details", { profile_id: profileId })
          .then((response) => {
            if (response) {
              setProfile(response.data);
            }
          });
      } catch (e) {
        console.log(e);
      }
    })();
  }, [profileId]);

  return (
    <Fragment>
      <StudentDetailsToolbar />
      <div className="card-section-full-width">
        <div className="card-container-full-width">
          {profile && (
            <div className="card-full-width">
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
                {profile.archived === true ? (
                  <div className="archived"></div>
                ) : (
                  <div></div>
                )}
                <div className="status">
                  {profile.status_verbose !== "" && profile.status_verbose}
                </div>
              </div>
              <div className="student-profile-body-container">
                <div className="name-container">
                  <div className="name-kanji-grade">
                    {profile.last_name_kanji !== "" && profile.last_name_kanji}
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
                    {profile.post_code !== "" ? `〒${profile.post_code}` : ""}
                  </div>
                  <div className="address-line-1">
                    {profile.prefecture_verbose !== ""
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
          )}
        </div>
      </div>
      {!profile && <LoadingSpinner />}
    </Fragment>
  );
}

export default StudentProfilesDetails;