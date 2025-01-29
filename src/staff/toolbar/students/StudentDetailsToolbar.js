import React from "react";
// CSS
import "./StudentDetailsToolbar.scss";
// Components
import ToolbarBackButton from "../../micro/students/ToolbarBackButton";

function StudentDetailsToolbar({
  backButtonLink,
  setBackButtonLink,
  backButtonText,
  setBackButtonText,
  profileLastNameKanji,
  profileFirstNameKanji,
  profileId,
  setDisplayProfile,
}) {
  return (
    <div id="student-profile-details-toolbar">
      <ToolbarBackButton
        backButtonLink={backButtonLink}
        setBackButtonLink={setBackButtonLink}
        backButtonText={backButtonText}
        setBackButtonText={setBackButtonText}
        profileLastNameKanji={profileLastNameKanji}
        profileFirstNameKanji={profileFirstNameKanji}
        profileId={profileId}
        setDisplayProfile={setDisplayProfile}
      />
    </div>
  );
}

export default StudentDetailsToolbar;
