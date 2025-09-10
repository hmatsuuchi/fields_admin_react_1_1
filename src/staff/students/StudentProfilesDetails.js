import React, { useEffect, useState, Fragment } from "react";
// Axios
import instance from "../../axios/axios_authenticated";
// Components
import DisplayDescriptors from "../micro/students/DisplayDescriptors";
import EnrolledClasses from "./StudentProfilesDetails/EnrolledClasses";
import LoadingSpinner from "../micro/LoadingSpinner";
import StudentDetailsToolbar from "../toolbar/students/StudentDetailsToolbar";
import StudentProfile from "./StudentProfilesDetails/StudentProfile";
import Attendance from "./StudentProfilesDetails/Attendance";
import Journal from "./StudentProfilesDetails/Journal";
import JournalArchive from "./StudentProfilesDetails/JournalArchive";
// CSS
import "./StudentProfilesCards.scss";
import "./StudentProfilesDetails.scss";
// React Router DOM
import { useParams } from "react-router-dom";

function StudentProfilesDetails({
  csrfToken,
  backButtonText,
  setBackButtonText,
  backButtonLink,
  setBackButtonLink,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const { profileId } = useParams();

  const [profile, setProfile] = useState("");
  const [displayProfile, setDisplayProfile] = useState(false);

  const [journalEntries, setJournalEntries] = useState(null);
  const [showJournalArchive, setShowJournalArchive] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  useEffect(() => {
    // DEVELOPMENT
    console.log(journalEntries);
    console.log("-".repeat(30));
    console.log(selectedEntry);
    console.log("=".repeat(60));
  }, [journalEntries, selectedEntry]);

  // makes API call and fetches profile details
  useEffect(() => {
    (async () => {
      try {
        await instance
          .get("api/students/profiles/details/", {
            params: { profile_id: profileId },
          })
          .then((response) => {
            if (response) {
              setProfile(response.data);
              // displays profile
              setDisplayProfile(true);
            }
          });
      } catch (e) {
        console.log(e);
      }
    })();
  }, [profileId]);

  // sets back button text and link on component mount
  useEffect(() => {
    // sets back button text and link
    setBackButtonText("生徒情報");
    setBackButtonLink("/staff/students/profiles/cards/");
  }, [setBackButtonText, setBackButtonLink]);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      {/* Toolbar */}
      <StudentDetailsToolbar
        backButtonLink={backButtonLink}
        setBackButtonLink={setBackButtonLink}
        backButtonText={backButtonText}
        setBackButtonText={setBackButtonText}
        profileLastNameKanji={profile.last_name_kanji}
        profileFirstNameKanji={profile.first_name_kanji}
        profileId={profileId}
        setDisplayProfile={setDisplayProfile}
      />

      {/* Text Descriptors */}
      <DisplayDescriptors
        displayTextArray={
          displayProfile
            ? [
                `${
                  profile
                    ? profile.last_name_kanji && profile.first_name_kanji
                      ? `「${profile.last_name_kanji} ${profile.first_name_kanji}」の明細`
                      : profile.last_name_kanji || profile.first_name_kanji
                      ? `「${profile.last_name_kanji}${profile.first_name_kanji}」の明細`
                      : "明細"
                    : "明細"
                }を表示しています`,
              ]
            : []
        }
      />
      <div className="card-section-full-width">
        {/* Profile */}
        {displayProfile ? (
          <StudentProfile profile={profile} />
        ) : (
          <LoadingSpinner />
        )}

        {/* Enrolled Classes */}
        {displayProfile ? (
          <EnrolledClasses
            profileId={profileId}
            profileStatus={profile.status}
            setDisplayProfile={setDisplayProfile}
            profileLastNameKanji={profile.last_name_kanji}
            profileFirstNameKanji={profile.first_name_kanji}
            setBackButtonText={setBackButtonText}
            setBackButtonLink={setBackButtonLink}
          />
        ) : null}

        {/* Attendance */}
        {displayProfile ? (
          <Attendance
            csrfToken={csrfToken}
            profileId={profileId}
            profileStatus={profile.status}
            profileLastNameKanji={profile.last_name_kanji}
            profileFirstNameKanji={profile.first_name_kanji}
            setBackButtonText={setBackButtonText}
            setBackButtonLink={setBackButtonLink}
          />
        ) : null}

        {/* Journal */}
        {displayProfile ? (
          <Journal
            profileId={profileId}
            profileStatus={profile.status}
            profileLastNameKanji={profile.last_name_kanji}
            profileFirstNameKanji={profile.first_name_kanji}
            setBackButtonText={setBackButtonText}
            setBackButtonLink={setBackButtonLink}
            setShowJournalArchive={setShowJournalArchive}
            journalEntries={journalEntries}
            setJournalEntries={setJournalEntries}
            setSelectedEntry={setSelectedEntry}
          />
        ) : null}
      </div>

      {/* Journal Edit/Delete Modal */}
      {showJournalArchive ? (
        <JournalArchive
          csrfToken={csrfToken}
          setShowJournalArchive={setShowJournalArchive}
          journalEntries={journalEntries}
          setJournalEntries={setJournalEntries}
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
        />
      ) : null}
    </Fragment>
  );
}

export default StudentProfilesDetails;
