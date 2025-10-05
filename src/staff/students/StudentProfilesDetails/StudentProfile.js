import React from "react";
// CSS
import "../StudentProfilesCards.scss";
import "./StudentProfile.scss";
// React Router DOM
import { Link } from "react-router-dom";

function StudentProfile({
  profile,
  setBackButtonText,
  setBackButtonLink,
  setDisplayBackButton,
}) {
  const handleClicksToEditProfileButton = () => {
    function formatNameForButton(profile) {
      if (profile.last_name_kanji !== "" && profile.first_name_kanji !== "") {
        return `${profile.last_name_kanji} ${profile.first_name_kanji}`;
      } else if (
        profile.first_name_kanji === "" &&
        profile.last_name_kanji === ""
      ) {
        return "戻る";
      } else {
        return `${profile.last_name_kanji}${profile.first_name_kanji}`;
      }
    }

    setBackButtonText(formatNameForButton(profile));
    setBackButtonLink(`/staff/students/profiles/details/${profile.id}`);
    setDisplayBackButton(true);
  };

  return (
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
            }`}
          >
            <div className="section-title">生徒情報</div>
            <div
              className={`header-right-container${
                profile.archived === true ? " archived-profile" : ""
              }`}
            >
              <div className="status">
                {profile.status_verbose !== "" && profile.status_verbose}
              </div>
              <div className="archived-button"></div>
            </div>
          </div>
          <div className="student-profile-body-container">
            <div className="name-container">
              <div className="name-kanji-grade">
                {profile.last_name_kanji !== "" && profile.last_name_kanji}
                {profile.last_name_kanji !== "" &&
                  profile.first_name_kanji !== "" &&
                  " "}
                {profile.first_name_kanji !== "" && profile.first_name_kanji}
                {profile.first_name_kanji !== "" &&
                  profile.grade_verbose !== "" &&
                  " "}
                {profile.grade_verbose !== "" && `(${profile.grade_verbose})`}
              </div>
              <div className="name-katakana">
                {profile.last_name_katakana !== "" &&
                  profile.last_name_katakana}
                {profile.first_name_katakana !== "" &&
                  ` ${profile.first_name_katakana}`}
              </div>
              <div className="name-romaji">
                {profile.last_name_romaji !== "" && profile.last_name_romaji}
                {profile.last_name_romaji && profile.first_name_romaji && ", "}
                {profile.first_name_romaji !== "" && profile.first_name_romaji}
              </div>
            </div>
            <div className="student-info-container">
              {profile.phone.length !== 0 ? (
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
              ) : null}
              {`${profile.post_code}${profile.prefecture_verbose}${profile.city}${profile.address_1}${profile.address_2}` !==
              "" ? (
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
              ) : null}
              {profile.birthday !== null ? (
                <div className="birthday-container">
                  <div className="birthday">
                    {profile.birthday !== null
                      ? `${profile.birthday} (${profile.age}才)`
                      : ""}
                  </div>
                </div>
              ) : null}
              <div className="payment-container">
                {profile.payment_method && (
                  <div className="payment-method">
                    {profile.payment_method_verbose}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="student-profile-footer-container">
            <Link
              className="profile-edit-button"
              to={`/staff/students/profiles/update/${profile.id}`}
              onClick={() => handleClicksToEditProfileButton()}
            ></Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentProfile;
