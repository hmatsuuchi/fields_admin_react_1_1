import React, { Fragment, useState, useEffect } from "react";
// Axios
import instance from "../../axios/axios_authenticated";
// Components
import DataLoadError from "../micro/DataLoadError";
import DisplayDescriptors from "../micro/students/DisplayDescriptors";
import LoadingSpinner from "../micro/LoadingSpinner";
import StudentProfilesToolbar from "../toolbar/students/StudentProfilesToolbar";
// CSS
import "./StudentProfilesCards.scss";
// React Router DOM
import { Link } from "react-router-dom";

function StudentProfiles({
  monthFilters,
  setMonthFilters,
  archiveFilters,
  setArchiveFilters,
  sorts,
  setSorts,
  backButtonText,
  setBackButtonText,
  backButtonLink,
  setBackButtonLink,
  displayBackButton,
  setDisplayBackButton,
}) {
  // source of truth for student profiles
  const [studentProfilesTruth, setstudentProfilesTruth] = useState([]);
  // student profiles filtered by search input
  const [studentProfilesFiltered, setStudentProfilesFiltered] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [resultCount, setResultCount] = useState(0);
  // student profiles filtered and then sorted
  const [studentProfilesFilteredSorted, setStudentProfilesFilteredSorted] =
    useState([]);
  // boolean used to hide content until API call is complete
  const [displayContent, setDisplayContent] = useState(false);
  // boolean used to disable toolbar buttons until API call is complete
  const [disableToolbarButtons, setDisableToolbarButtons] = useState(true);
  // months to display
  const [monthsToDisplay, setMonthsToDisplay] = useState([]);
  // display text
  const [displayTextArray, setDisplayTextArray] = useState([]);
  // boolean used to indicate if filters are active
  const [filtersActive, setFiltersActive] = useState(false);
  // boolean used to display error message and retry button if API call fails
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

  // fetches profile data from API
  const fetchProfiles = async () => {
    // disables toolbar buttons
    setDisableToolbarButtons(true);
    // hides content
    setDisplayContent(false);
    // hides error message
    setDisplayErrorMessage(false);
    try {
      await instance.get("api/students/profiles/").then((response) => {
        if (response) {
          setstudentProfilesTruth(response.data);
          // hides error message
          setDisplayErrorMessage(false);
          // enables toolbar buttons
          setDisableToolbarButtons(false);
          // displays content
          setDisplayContent(true);
        }
      });
    } catch (e) {
      console.log(e);
      // displays error message
      setDisplayErrorMessage(true);
    }
  };

  // makes API call and fetches initial data on component mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  // filter by text search input, month filter and archived status filter
  useEffect(() => {
    const studentProfilesSearchFiltered = studentProfilesTruth.filter(
      (profile) => {
        const searchFields =
          profile.last_name_romaji +
          profile.first_name_romaji +
          profile.last_name_romaji /* allows searches to be run with first and last name in swapped order */ +
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

        const profileBirthdayMonth = profile.birthday
          ? new Date(profile.birthday).getMonth() + 1
          : 0;

        return (
          (searchFields
            .toLowerCase()
            .includes(searchInput.trim().toLowerCase()) ||
            searchFields
              .toLowerCase()
              .includes(
                searchInput
                  .trim()
                  .toLowerCase()
                  .replace(" ", "")
                  .replace(",", "")
              )) &&
          monthsToDisplay.includes(profileBirthdayMonth) &&
          (profile.archived === archiveFilters.archived ||
            profile.archived === !archiveFilters.unarchived) &&
          (archiveFilters.archived === true ||
            archiveFilters.unarchived === true)
        );
      }
    );

    setStudentProfilesFiltered(studentProfilesSearchFiltered);
    setResultCount(studentProfilesSearchFiltered.length);
  }, [studentProfilesTruth, searchInput, monthsToDisplay, archiveFilters]);

  // sort student profiles
  useEffect(() => {
    if (sorts.id === 1) {
      // sorts by descending ID
      setStudentProfilesFilteredSorted(
        [...studentProfilesFiltered].sort((b, a) => a.id - b.id)
      );
    } else if (sorts.id === 2) {
      // sorts by ascending ID
      setStudentProfilesFilteredSorted(
        [...studentProfilesFiltered].sort((a, b) => a.id - b.id)
      );
    } else if (sorts.birth_month_day === 1) {
      // sorts by ascending birth month and day
      setStudentProfilesFilteredSorted(
        [...studentProfilesFiltered].sort((b, a) => {
          const aBirthday = new Date(a.birthday);
          const bBirthday = new Date(b.birthday);

          const monthDifference = aBirthday.getMonth() - bBirthday.getMonth();
          if (monthDifference !== 0) {
            return monthDifference;
          }

          return aBirthday.getDate() - bBirthday.getDate();
        })
      );
    } else if (sorts.birth_month_day === 2) {
      // sorts by ascending birth month and day
      setStudentProfilesFilteredSorted(
        [...studentProfilesFiltered].sort((a, b) => {
          const aBirthday = new Date(a.birthday);
          const bBirthday = new Date(b.birthday);

          const monthDifference = aBirthday.getMonth() - bBirthday.getMonth();
          if (monthDifference !== 0) {
            return monthDifference;
          }

          return aBirthday.getDate() - bBirthday.getDate();
        })
      );
    }
  }, [studentProfilesFiltered, sorts]);

  // creates array of months to display
  useEffect(() => {
    let monthsList = [];

    if (monthFilters.month0) monthsList.push(0);
    if (monthFilters.month1) monthsList.push(1);
    if (monthFilters.month2) monthsList.push(2);
    if (monthFilters.month3) monthsList.push(3);
    if (monthFilters.month4) monthsList.push(4);
    if (monthFilters.month5) monthsList.push(5);
    if (monthFilters.month6) monthsList.push(6);
    if (monthFilters.month7) monthsList.push(7);
    if (monthFilters.month8) monthsList.push(8);
    if (monthFilters.month9) monthsList.push(9);
    if (monthFilters.month10) monthsList.push(10);
    if (monthFilters.month11) monthsList.push(11);
    if (monthFilters.month12) monthsList.push(12);

    setMonthsToDisplay(monthsList);
  }, [monthFilters]);

  // updates filter button active status on changes to birth month and archive status filters
  useEffect(() => {
    archiveFilters.unarchived === false ||
    archiveFilters.archived === false ||
    monthsToDisplay.length < 13
      ? setFiltersActive(true)
      : setFiltersActive(false);
  }, [monthsToDisplay, archiveFilters]);

  // generates display text
  useEffect(() => {
    let displayArray = [];

    // result count
    displayArray.push(`${resultCount}件を表示しています`);
    // birth month and archived status filter
    // creates blank string
    let filterTextList = "";
    // adds birth month filter text
    monthsToDisplay.length < 13 && filterTextList.length > 0
      ? (filterTextList += "、誕生日")
      : monthsToDisplay.length < 13 && (filterTextList = "誕生日");
    // adds archived status filter text
    (archiveFilters.unarchived === false ||
      archiveFilters.archived === false) &&
    filterTextList.length > 0
      ? (filterTextList += "、アーカイブ")
      : (archiveFilters.unarchived === false ||
          archiveFilters.archived === false) &&
        (filterTextList = "アーカイブ");
    // adds filter text to display array
    (monthsToDisplay.length < 13 ||
      archiveFilters.unarchived === false ||
      archiveFilters.archived === false) &&
      displayArray.push(
        `「${filterTextList}」のフィルターが有効になっています`
      );
    // search input
    searchInput !== "" && displayArray.push(`「${searchInput}」で検索しました`);

    sorts.id === 1 && displayArray.push(`「ID」で降順に並べ替えました`);
    sorts.id === 2 && displayArray.push(`「ID」で昇順に並べ替えました`);
    sorts.birth_month_day === 1 &&
      displayArray.push(`「誕生日」で降順に並べ替えました`);
    sorts.birth_month_day === 2 &&
      displayArray.push(`「誕生日」で昇順に並べ替えました`);

    setDisplayTextArray(displayArray);
  }, [resultCount, monthsToDisplay, archiveFilters, searchInput, sorts]);

  // handles click to student profile card
  const handleClickToStudentCard = () => {
    setBackButtonText("生徒情報");
    setBackButtonLink("/staff/students/profiles/cards/");
    setDisplayBackButton(true);
  };

  return (
    <Fragment>
      {/* Toolbar */}
      <StudentProfilesToolbar
        setSearchInput={setSearchInput}
        resultCount={resultCount}
        disableToolbarButtons={disableToolbarButtons}
        monthFilters={monthFilters}
        setMonthFilters={setMonthFilters}
        archiveFilters={archiveFilters}
        setArchiveFilters={setArchiveFilters}
        filtersActive={filtersActive}
        sorts={sorts}
        setSorts={setSorts}
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />

      {/* Error Loading Data */}
      {displayErrorMessage && (
        <DataLoadError
          errorMessage={"エラーが発生されました"}
          retryFunction={fetchProfiles}
        />
      )}

      {/* Display Descriptors */}
      {displayContent && (
        <DisplayDescriptors displayTextArray={displayTextArray} />
      )}

      {/* Student Profiles */}
      {displayContent && (
        <div className="card-section">
          <div className="card-container">
            {studentProfilesFilteredSorted.map((profile) => {
              return (
                <Link
                  to={`/staff/students/profiles/details/${profile.id}`}
                  className="student-profile-card card"
                  key={`student-profile-${profile.id}`}
                  onClick={() => handleClickToStudentCard()}
                >
                  {" "}
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
                    {profile.archived === true ? (
                      <div className="archived"></div>
                    ) : (
                      <div></div>
                    )}
                    <div className="status">
                      {profile.status_verbose !== "" && profile.status_verbose}
                    </div>
                    <div className="more-info-container"></div>
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
                    {/* Student Info Container */}
                    <div className="student-info-container">
                      {/* Contact Container */}
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
                      {/* Address Container */}
                      {profile.post_code !== "" ||
                      profile.prefecture_verbose !== "" ||
                      profile.city !== "" ||
                      profile.address_1 !== "" ||
                      profile.address_2 !== "" ? (
                        <div className="address-container">
                          <div className="post-code">
                            {profile.post_code !== ""
                              ? `〒${profile.post_code}`
                              : ""}
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
                      {/* Birthday Container */}
                      {profile.birthday !== null ? (
                        <div className="birthday-container">
                          <div className="birthday">
                            {profile.birthday !== null
                              ? `${profile.birthday} (${profile.age}才)`
                              : ""}
                          </div>
                        </div>
                      ) : null}
                      {/* Payment Container */}
                      {profile.payment_method_from_invoice !== null ? (
                        <div className="payment-container">
                          {profile.payment_method_from_invoice && (
                            <div className="payment-method">
                              {profile.payment_method_verbose}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {!displayContent && !displayErrorMessage && <LoadingSpinner />}
    </Fragment>
  );
}

export default StudentProfiles;
