import React, { useEffect, useState, Fragment } from "react";
// Axios
import instance from "../axios/axios_authenticated";
// Components
import DisplayDescriptors from "../micro/students/DisplayDescriptors";
import EnrolledClasses from "./StudentProfilesDetails/EnrolledClasses";
import LoadingSpinner from "../micro/LoadingSpinner";
import StudentDetailsToolbar from "../toolbar/students/StudentDetailsToolbar";
import StudentProfile from "./StudentProfilesDetails/StudentProfile";
import Attendance from "./StudentProfilesDetails/Attendance";
// CSS
import "./StudentProfilesCards.scss";
import "./StudentProfilesDetails.scss";
// React Router DOM
import { useParams } from "react-router-dom";

function StudentProfilesDetails({ backButtonText, backButtonLink }) {
  const { profileId } = useParams();

  const [profile, setProfile] = useState("");
  const [displayProfile, setDisplayProfile] = useState(false);

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

  return (
    <Fragment>
      {/* Toolbar */}
      <StudentDetailsToolbar
        backButtonLink={backButtonLink}
        backButtonText={backButtonText}
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
          />
        ) : null}

        {/* Attendance */}
        {displayProfile ? (
          <Attendance profileId={profileId} profileStatus={profile.status} />
        ) : null}
      </div>
    </Fragment>
  );
}

export default StudentProfilesDetails;
