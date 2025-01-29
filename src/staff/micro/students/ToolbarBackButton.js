import React from "react";
// CSS
import "./ToolbarBackButton.scss";
import { Link } from "react-router-dom";

function ToolbarBackButton({
  backButtonLink,
  setBackButtonLink,
  backButtonText,
  setBackButtonText,
  profileLastNameKanji,
  profileFirstNameKanji,
  profileId,
  setDisplayProfile,
}) {
  const handleClicksToBackButton = () => {
    /* hide profile details */
    setDisplayProfile(false);

    /* set back button text and link */
    setBackButtonText(
      `生徒情報 (${profileLastNameKanji} ${profileFirstNameKanji})`
    );
    setBackButtonLink(`/staff/students/profiles/details/${profileId}`);
  };

  return (
    <Link
      to={backButtonLink}
      className="toolbar-back-button"
      onClick={handleClicksToBackButton}
    >
      {backButtonText}
    </Link>
  );
}

export default ToolbarBackButton;
