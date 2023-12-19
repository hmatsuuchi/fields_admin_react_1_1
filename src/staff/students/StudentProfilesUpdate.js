import React, { Fragment, useEffect, useState } from "react";
// Axios
import instance from "../axios/axios_authenticated";
// Components
import StudentProfileUpdateToolbar from "../toolbar/StudentProfileUpdateToolbar";
import ProfileSectionHeader from "../micro/ProfileSectionHeader";
import DisplayDescriptors from "../micro/DisplayDescriptors";
import LoadingSpinner from "../micro/LoadingSpinner";
// CSS
import "./StudentProfilesCreateUpdate.scss";
import "./StudentProfilesCards";
// React Router
import { Link, useParams, useNavigate } from "react-router-dom";

function StudentProfilesUpdate() {
  // get profile id from URL params
  const { profileId } = useParams();

  // choice values
  const [prefectureChoices, setPrefectureChoices] = useState([]);
  const [phoneChoices, setPhoneChoices] = useState([]);
  const [gradeChoices, setGradeChoices] = useState([]);
  const [statusChoices, setStatusChoices] = useState([]);
  const [paymentChoices, setPaymentChoices] = useState([]);
  // form input values
  const [lastNameRomaji, setLastNameRomaji] = useState("");
  const [firstNameRomaji, setFirstNameRomaji] = useState("");
  const [lastNameKanji, setLastNameKanji] = useState("");
  const [firstNameKanji, setFirstNameKanji] = useState("");
  const [lastNameKatakana, setLastNameKatakana] = useState("");
  const [firstNameKatakana, setFirstNameKatakana] = useState("");
  const [postCode, setPostCode] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [phoneNumberArray, setPhoneNumberArray] = useState([{}]);
  const [birthday, setBirthday] = useState("");
  const [grade, setGrade] = useState("");
  const [profileStatus, setProfileStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [archived, setArchived] = useState(false);
  // profile status name
  const [profileStatusName, setProfileStatusName] = useState("");
  // content has been submitted bool
  const [submitted, setSubmitted] = useState(false);
  // display content bool
  const [displayContent, setDisplayContent] = useState(false);

  // React Router DOM Navigate
  const navigate = useNavigate();

  // makes API call and fetches choice values for the form
  useEffect(() => {
    (async () => {
      try {
        await instance.get("api/students/profiles/choices").then((response) => {
          if (response) {
            setPrefectureChoices(response.data.prefecture_choices);
            setPhoneChoices(response.data.phone_choices);
            setGradeChoices(response.data.grade_choices);
            setStatusChoices(response.data.status_choices);
            setPaymentChoices(response.data.payment_choices);

            setProfileStatus(response.data.status_choices[0].id);
            setProfileStatusName(response.data.status_choices[0].name);
            setPaymentMethod(response.data.payment_choices[0].id);
          }
        });
      } catch (e) {
        console.log(e);
      }

      try {
        await instance
          .get("api/students/profiles/details", {
            params: { profile_id: profileId },
          })
          .then((response) => {
            if (response) {
              const responseData = response.data;
              setLastNameRomaji(responseData.last_name_romaji);
              setFirstNameRomaji(responseData.first_name_romaji);
              setLastNameKanji(responseData.last_name_kanji);
              setFirstNameKanji(responseData.first_name_kanji);
              setLastNameKatakana(responseData.last_name_katakana);
              setFirstNameKatakana(responseData.first_name_katakana);
              setPostCode(responseData.post_code);
              setPrefecture(responseData.prefecture);
              setCity(responseData.city);
              setAddress1(responseData.address_1);
              setAddress2(responseData.address_2);
              setPhoneNumberArray(
                responseData.phone.length === 0 ? [{}] : responseData.phone
              );
              setBirthday(responseData.birthday);
              setGrade(responseData.grade);
              setProfileStatus(responseData.status);
              setPaymentMethod(responseData.payment_method);
              setArchived(responseData.archived);
              // displays content
              setDisplayContent(true);
            }
          });
      } catch (e) {
        console.log(e);
      }
    })();
  }, [profileId]);

  // updates the phone number array with phone number values
  function updatePhoneNumber(e, index) {
    const newPhoneNumberArray = [...phoneNumberArray];
    newPhoneNumberArray[index].number = e.target.value;
    setPhoneNumberArray(newPhoneNumberArray);
  }

  // updates the phone number array with phone type values
  function updatePhoneType(e, index) {
    const newPhoneNumberArray = [...phoneNumberArray];
    newPhoneNumberArray[index].number_type = e.target.value;
    setPhoneNumberArray(newPhoneNumberArray);
  }

  // clicks to the plus button to add a new phone number field up to 9 fields
  function addPhoneNumberField() {
    setPhoneNumberArray(phoneNumberArray.concat({}));
  }

  // clicks to the minus button to remove a phone number field down to 1 field
  function removePhoneNumberField() {
    setPhoneNumberArray(phoneNumberArray.slice(0, -1));
  }

  // removes blank phone number dictionary elements from the phone number array
  function removeBlankPhoneNumberFieldsFromArray() {
    let newPhoneNumberArray = [...phoneNumberArray];
    return newPhoneNumberArray.filter(
      (phone) =>
        (phone.number !== undefined && phone.number !== "") ||
        (phone.id !== undefined && phone.id !== "")
    );
  }

  // handles clicks to the status buttons
  function handleProfileStatusClick(event) {
    let idString = event.target.id;
    let idInteger = parseInt(idString.split("-").pop());
    setProfileStatus(idInteger);
    setProfileStatusName(
      statusChoices.find((element) => element.id === idInteger).name
    );
  }

  // handles clicks to the payment method buttons
  function handlePaymentMethodClick(event) {
    let idString = event.target.id;
    let idInteger = parseInt(idString.split("-").pop());
    setPaymentMethod(idInteger);
  }

  // handles clicks to the archived button
  function handleArchivedClick() {
    setArchived(!archived);
  }

  // handles the submit button
  const handleSubmit = async (event) => {
    setSubmitted(true);

    event.preventDefault();

    const data = {
      id: profileId,
      last_name_romaji: lastNameRomaji,
      first_name_romaji: firstNameRomaji,
      last_name_kanji: lastNameKanji,
      first_name_kanji: firstNameKanji,
      last_name_katakana: lastNameKatakana,
      first_name_katakana: firstNameKatakana,
      post_code: postCode,
      prefecture: prefecture,
      city: city,
      address_1: address1,
      address_2: address2,
      phone: removeBlankPhoneNumberFieldsFromArray(),
      birthday: birthday,
      grade: grade,
      status: profileStatus,
      payment_method: paymentMethod,
      archived: archived,
    };

    try {
      await instance
        .put("api/students/profiles/details", data)
        .then((response) => {
          if (response) {
            if (response.status === 201) {
              navigate(`/staff/students/profiles/details/${profileId}`);
            } else {
              setSubmitted(false);
              window.alert("An error occurred.");
            }
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Fragment>
      <StudentProfileUpdateToolbar
        backButtonLink={`/staff/students/profiles/details/${profileId}`}
        backButtonText={
          lastNameKanji && firstNameKanji
            ? `${lastNameKanji} ${firstNameKanji} (明細)`
            : lastNameKanji || firstNameKanji
            ? `${lastNameKanji}${firstNameKanji} (明細)`
            : "明細へ戻る"
        }
        displayContent={displayContent}
      />

      <DisplayDescriptors
        displayTextArray={
          displayContent
            ? [
                `${
                  lastNameKanji && firstNameKanji
                    ? `「${lastNameKanji} ${firstNameKanji}」`
                    : lastNameKanji || firstNameKanji
                    ? `「${lastNameKanji}${firstNameKanji}」`
                    : "プロフィール"
                }を編集しています`,
              ]
            : []
        }
      />
      {displayContent ? (
        <div
          className={`card-section-full-width${
            submitted ? " content-submitted" : ""
          }`}>
          <div className="card-container-full-width">
            <div className="card-full-width">
              <div
                className={`student-profile-header-container${
                  profileStatus === 1
                    ? " pre-enrolled"
                    : profileStatus === 2
                    ? " enrolled"
                    : profileStatus === 3
                    ? " short-absence"
                    : profileStatus === 4
                    ? " long-absence"
                    : ""
                }`}>
                {archived ? <div className="archived"></div> : <div></div>}
                <div className="status">{profileStatusName}</div>
              </div>
              <div className="student-profile-body-container create-new-profile-body-container">
                <div className="form-container">
                  <form id="profile-create-form" onSubmit={handleSubmit}>
                    {/* Name Section */}
                    <ProfileSectionHeader displayText="名前" />
                    <label htmlFor="last_name_romaji">姓（ローマ字）</label>
                    <input
                      type="text"
                      id="last-name-romaji"
                      className="input-width-s"
                      name="last_name_romaji"
                      value={lastNameRomaji}
                      onChange={(e) =>
                        setLastNameRomaji(e.target.value)
                      }></input>
                    <label htmlFor="first_name_romaji">名（ローマ字）</label>
                    <input
                      type="text"
                      id="first-name-romaji"
                      className="input-width-s"
                      name="first_name_romaji"
                      value={firstNameRomaji}
                      onChange={(e) =>
                        setFirstNameRomaji(e.target.value)
                      }></input>
                    <label htmlFor="last_name_kanji">姓（漢字）</label>
                    <input
                      type="text"
                      id="last-name-kanji"
                      className="input-width-s"
                      name="last_name_kanji"
                      value={lastNameKanji}
                      onChange={(e) =>
                        setLastNameKanji(e.target.value)
                      }></input>
                    <label htmlFor="first_name_kanji">名（漢字）</label>
                    <input
                      type="text"
                      id="first-name-kanji"
                      className="input-width-s"
                      name="first_name_kanji"
                      value={firstNameKanji}
                      onChange={(e) =>
                        setFirstNameKanji(e.target.value)
                      }></input>
                    <label htmlFor="last_name_katakana">姓（カタカナ）</label>
                    <input
                      type="text"
                      id="last-name-katakana"
                      className="input-width-s"
                      name="last_name_katakana"
                      value={lastNameKatakana}
                      onChange={(e) =>
                        setLastNameKatakana(e.target.value)
                      }></input>
                    <label htmlFor="first_name_katakana">名（カタカナ）</label>
                    <input
                      type="text"
                      id="first-name-katakana"
                      className="input-width-s"
                      name="first_name_katakana"
                      value={firstNameKatakana}
                      onChange={(e) =>
                        setFirstNameKatakana(e.target.value)
                      }></input>
                    {/* Address Section */}
                    <ProfileSectionHeader displayText="住所" />
                    <label htmlFor="post_code">郵便番号</label>
                    <input
                      type="text"
                      id="post-code"
                      className="input-width-7"
                      name="post_code"
                      value={postCode}
                      onChange={(e) => postCode(e.target.value)}></input>
                    <label htmlFor="prefecture">府県</label>
                    <select
                      type="text"
                      id="prefecture"
                      className="input-width-7"
                      name="prefecture"
                      value={prefecture}
                      onChange={(e) => setPrefecture(e.target.value)}>
                      <option value="">-------</option>
                      {prefectureChoices.map((prefecture) => {
                        return (
                          <option
                            value={prefecture.id}
                            key={`prefecture-choice-${prefecture.id}`}>
                            {prefecture.name}
                          </option>
                        );
                      })}
                    </select>
                    <label htmlFor="city">都市</label>
                    <input
                      type="text"
                      id="city"
                      className="input-width-s"
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}></input>
                    <label htmlFor="address_1">住所1</label>
                    <input
                      type="text"
                      id="address-1"
                      className="input-width-20"
                      name="address_1"
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}></input>
                    <label htmlFor="address_2">住所2</label>
                    <input
                      type="text"
                      id="address-2"
                      className="input-width-20"
                      name="address_2"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}></input>
                    {/* Contact Section */}
                    <ProfileSectionHeader displayText="連絡先" />
                    <div id="phone-number-container">
                      {/* Contact Section - Inputs */}
                      {phoneNumberArray.map((phone, index) => {
                        return (
                          <div
                            key={`phone-number-data-${index}`}
                            id={`phone-number-data-${index}`}
                            className="phone-number-data">
                            <label htmlFor="number" className="number-label">
                              電話
                            </label>
                            <input
                              className="phone-number input-width-12"
                              type="text"
                              id="phone"
                              name="number"
                              value={phone.number}
                              onChange={(e) =>
                                updatePhoneNumber(e, index)
                              }></input>
                            <label
                              htmlFor="number_type"
                              className="number-type-label">
                              代表
                            </label>
                            <select
                              className="phone-type input-width-7"
                              type="text"
                              id="phone-type"
                              name="number_type"
                              value={phone.number_type && phone.number_type}
                              onChange={(e) => updatePhoneType(e, index)}>
                              <option value="">-------</option>
                              {phoneChoices.map((phone) => {
                                return (
                                  <option
                                    value={phone.id}
                                    key={`phone-choice-${phone.id}`}>
                                    {phone.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        );
                      })}
                      {/* Contact Section - Buttons */}
                      <div className="add-remove-phone-number-container">
                        <button
                          onClick={addPhoneNumberField}
                          type="button"
                          id="add-phone-number-button"
                          className={`add-phone-number-button${
                            phoneNumberArray.length > 8 ? " disable-button" : ""
                          }`}>
                          <div className="vertical-line"></div>
                          <div className="horizontal-line"></div>
                        </button>
                        <button
                          onClick={removePhoneNumberField}
                          type="button"
                          id="remove-phone-number-button"
                          className={`remove-phone-number-button${
                            phoneNumberArray.length < 2 ? " disable-button" : ""
                          }`}>
                          <div className="horizontal-line"></div>
                        </button>
                      </div>
                    </div>
                    {/* Age/Birthday Section */}
                    <ProfileSectionHeader displayText="年齡" />
                    <label htmlFor="birthday">生年月日</label>
                    <input
                      type="date"
                      id="birthday"
                      className="input-width-s"
                      name="birthday"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}></input>
                    <label htmlFor="grade">学年</label>
                    <select
                      type="text"
                      id="grade"
                      className="input-width-7"
                      name="grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}>
                      <option value="">-------</option>
                      {gradeChoices.map((grade) => {
                        return (
                          <option
                            value={grade.id}
                            key={`grad-choice-${grade.id}`}>
                            {grade.name}
                          </option>
                        );
                      })}
                    </select>
                    {/* Status Section - Status */}
                    <ProfileSectionHeader displayText="現状" />
                    <label>入学状況</label>
                    <div id="status" className="horizontal-select-menu">
                      {statusChoices.map((status) => {
                        return (
                          <button
                            id={`status-choice-${status.id}`}
                            type="button"
                            className={`horizontal-select-menu-option${
                              profileStatus === status.id
                                ? " selected-button"
                                : ""
                            }`}
                            key={status.id}
                            onClick={handleProfileStatusClick}>
                            {status.name}
                          </button>
                        );
                      })}
                    </div>
                    {/* Status Section - Payment Method */}
                    <label>支払方法</label>
                    <div id="payment-method" className="horizontal-select-menu">
                      {paymentChoices.map((payment) => {
                        return (
                          <button
                            id={`payment-method-choice-${payment.id}`}
                            type="button"
                            className={`horizontal-select-menu-option${
                              paymentMethod === payment.id
                                ? " selected-button"
                                : ""
                            }`}
                            key={payment.id}
                            onClick={handlePaymentMethodClick}>
                            {payment.name}
                          </button>
                        );
                      })}
                    </div>
                    <label htmlFor="archived">アーカイブ</label>
                    <button
                      type="button"
                      id="archived-button-container"
                      className={archived ? "archived-button-active" : ""}
                      name="archived"
                      onClick={handleArchivedClick}>
                      <div className="archived-button-icon"></div>
                      <div className="archived-dot"></div>
                    </button>
                    {/* Bottom Buttons Section */}
                    <div className="bottom-buttons-container">
                      <Link
                        to={`/staff/students/profiles/delete/${profileId}`}
                        className="button delete">
                        削除
                      </Link>
                      <div className="button-group-container">
                        <Link
                          to={`/staff/students/profiles/details/${profileId}`}
                          className="button cancel">
                          キャンセル
                        </Link>
                        <button type="submit" className="button submit">
                          編集
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </Fragment>
  );
}

export default StudentProfilesUpdate;
