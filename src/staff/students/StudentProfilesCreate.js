import React, { Fragment, useEffect, useState } from "react";
// Axios
import instance from "../axios/axios_authenticated";
// Components
import StudentProfileCreateToolbar from "../toolbar/StudentProfileCreateToolbar";
import CreateProfileSectionHeader from "../micro/CreateProfileSectionHeader";
// CSS
import "./StudentProfilesCreate.scss";
import "./StudentProfilesCards";

function StudentProfilesCreate() {
  // choice values
  const [prefectureChoices, setPrefectureChoices] = useState([]);
  const [phoneChoices, setPhoneChoices] = useState([]);
  const [gradeChoices, setGradeChoices] = useState([]);
  const [statusChoices, setStatusChoices] = useState([]);
  const [paymentChoices, setPaymentChoices] = useState([]);
  // phone number array
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  // status and payment method
  const [profileStatus, setProfileStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

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
            setPaymentMethod(response.data.payment_choices[0].id);
          }
        });
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  // creates an array of phone numbers for the many-to-many relationship
  function createPhoneNumberArray() {
    const phoneNumberContainer = document.getElementById(
      "phone-number-container"
    );
    const phoneNumberData =
      phoneNumberContainer.getElementsByClassName("phone-number-data");
    let phoneNumberArray = [];
    Array.from(phoneNumberData).forEach((element) => {
      const number = element.getElementsByClassName("phone-number")[0].value;
      const number_type = element.getElementsByClassName("phone-type")[0].value;
      if (number !== "") {
        phoneNumberArray.push({ number: number, number_type: number_type });
      }
    });
    setPhoneNumbers(phoneNumberArray);
  }

  // clicks to the plus button to add a new phone number field up to 9 fields
  function addPhoneNumberField() {
    const container = document.getElementById("phone-number-container");
    const phoneDataDivs = container.getElementsByClassName("phone-number-data");

    const addPhoneNumberButton = document.getElementById(
      "add-phone-number-button"
    );
    const removePhoneNumberButton = document.getElementById(
      "remove-phone-number-button"
    );

    // Limit the creation of "phone-number-data" elements to 9
    if (phoneDataDivs.length >= 8) {
      addPhoneNumberButton.classList.add("disable-button");
    }

    if (removePhoneNumberButton.classList.contains("disable-button")) {
      removePhoneNumberButton.classList.remove("disable-button");
    }

    const lastPhoneDataDiv = phoneDataDivs[phoneDataDivs.length - 1];

    const newPhoneDataDiv = lastPhoneDataDiv.cloneNode(true);

    const lastIdNumber = parseInt(lastPhoneDataDiv.id.split("-").pop());
    const newIdNumber = lastIdNumber + 1;
    const newId = `phone-number-data-${String(newIdNumber).padStart(2, "0")}`;

    newPhoneDataDiv.id = newId;

    container.insertBefore(newPhoneDataDiv, container.lastChild);
  }

  // clicks to the minus button to remove a phone number field down to 1 field
  function removePhoneNumberField() {
    const container = document.getElementById("phone-number-container");
    const phoneDataDivs = container.getElementsByClassName("phone-number-data");

    const addPhoneNumberButton = document.getElementById(
      "add-phone-number-button"
    );
    const removePhoneNumberButton = document.getElementById(
      "remove-phone-number-button"
    );

    // Limit the creation of "phone-number-data" elements to 9
    if (phoneDataDivs.length <= 2) {
      removePhoneNumberButton.classList.add("disable-button");
    }
    if (addPhoneNumberButton.classList.contains("disable-button")) {
      addPhoneNumberButton.classList.remove("disable-button");
    }

    phoneDataDivs[phoneDataDivs.length - 1].remove();
  }

  // handles clicks to the status buttons
  function handleProfileStatusClick(event) {
    let idString = event.target.id;
    let idInteger = parseInt(idString.split("-").pop());
    setProfileStatus(idInteger);
  }

  // handles clicks to the payment method buttons
  function handlePaymentMethodClick(event) {
    let idString = event.target.id;
    let idInteger = parseInt(idString.split("-").pop());
    setPaymentMethod(idInteger);
  }

  // handles the submit button
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = document.getElementById("profile-create-form");
    const formData = new FormData(form);

    createPhoneNumberArray();

    const data = {
      last_name_romaji: formData.get("last_name_romaji"),
      first_name_romaji: formData.get("first_name_romaji"),
      last_name_kanji: formData.get("last_name_kanji"),
      first_name_kanji: formData.get("first_name_kanji"),
      last_name_katakana: formData.get("last_name_katakana"),
      first_name_katakana: formData.get("first_name_katakana"),
      post_code: formData.get("post_code"),
      prefecture: formData.get("prefecture"),
      city: formData.get("city"),
      address_1: formData.get("address_1"),
      address_2: formData.get("address_2"),
      phone: phoneNumbers,
      birthday: formData.get("birthday"),
      grade: formData.get("grade"),
      status: profileStatus,
      payment_method: paymentMethod,
      archived: formData.get("archived"),
    };

    try {
      await instance
        .post("api/students/profiles/create", data)
        .then((response) => {
          if (response) {
            console.log(response);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Fragment>
      <StudentProfileCreateToolbar />
      <div className="card-section-full-width">
        <div className="card-container-full-width">
          <div className="card-full-width">
            <div className="student-profile-header-container pre-enrolled">
              <div></div>
              <div className="status">入学希望</div>
            </div>
            <div className="student-profile-body-container create-new-profile-body-container">
              <div className="form-container">
                <form id="profile-create-form" onSubmit={handleSubmit}>
                  {/* Name Section */}
                  <CreateProfileSectionHeader displayText="名前" />
                  <label htmlFor="last_name_romaji">姓（ローマ字）</label>
                  <input
                    type="text"
                    id="last-name-romaji"
                    className="input-width-10"
                    name="last_name_romaji"></input>
                  <label htmlFor="first_name_romaji">名（ローマ字）</label>
                  <input
                    type="text"
                    id="first-name-romaji"
                    className="input-width-10"
                    name="first_name_romaji"></input>
                  <label htmlFor="last_name_kanji">姓（漢字）</label>
                  <input
                    type="text"
                    id="last-name-kanji"
                    className="input-width-10"
                    name="last_name_kanji"></input>
                  <label htmlFor="first_name_kanji">名（漢字）</label>
                  <input
                    type="text"
                    id="first-name-kanji"
                    className="input-width-10"
                    name="first_name_kanji"></input>
                  <label htmlFor="last_name_katakana">姓（カタカナ）</label>
                  <input
                    type="text"
                    id="last-name-katakana"
                    className="input-width-10"
                    name="last_name_katakana"></input>
                  <label htmlFor="first_name_katakana">名（カタカナ）</label>
                  <input
                    type="text"
                    id="first-name-katakana"
                    className="input-width-10"
                    name="first_name_katakana"></input>
                  {/* Address Section */}
                  <CreateProfileSectionHeader displayText="住所" />
                  <label htmlFor="post_code">郵便番号</label>
                  <input
                    type="text"
                    id="post-code"
                    className="input-width-7"
                    name="post_code"></input>
                  <label htmlFor="prefecture">府県</label>
                  <select
                    type="text"
                    id="prefecture"
                    className="input-width-7"
                    name="prefecture">
                    <option value="">----------</option>
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
                    className="input-width-10"
                    name="city"></input>
                  <label htmlFor="address_1">住所1</label>
                  <input
                    type="text"
                    id="address-1"
                    className="input-width-20"
                    name="address_1"></input>
                  <label htmlFor="address_2">住所2</label>
                  <input
                    type="text"
                    id="address-2"
                    className="input-width-20"
                    name="address_2"></input>
                  {/* Contact Section */}
                  <CreateProfileSectionHeader displayText="連絡先" />
                  <div id="phone-number-container">
                    <div
                      id="phone-number-data-01"
                      className="phone-number-data">
                      <label htmlFor="number">電話</label>
                      <input
                        className="phone-number input-width-12"
                        type="text"
                        id="phone"
                        name="number"></input>
                      <label htmlFor="number_type">代表1</label>
                      <select
                        className="phone-type input-width-7"
                        type="text"
                        id="phone-type"
                        name="number_type">
                        <option value="">----------</option>
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
                    <div className="add-remove-phone-number-container">
                      <button
                        onClick={addPhoneNumberField}
                        type="button"
                        id="add-phone-number-button"
                        className="add-phone-number-button">
                        <div className="vertical-line"></div>
                        <div className="horizontal-line"></div>
                      </button>
                      <button
                        onClick={removePhoneNumberField}
                        type="button"
                        id="remove-phone-number-button"
                        className="remove-phone-number-button disable-button">
                        <div className="horizontal-line"></div>
                      </button>
                    </div>
                  </div>
                  {/* Age/Birthday Section */}
                  <CreateProfileSectionHeader displayText="年齡" />
                  <label htmlFor="birthday">生年月日</label>
                  <input
                    type="date"
                    id="birthday"
                    className="input-width-10"
                    name="birthday"></input>
                  <label htmlFor="grade">学年</label>
                  <select
                    type="text"
                    id="grade"
                    className="input-width-7"
                    name="grade">
                    <option value="">----------</option>
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
                  <CreateProfileSectionHeader displayText="現状" />
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
                  <input type="checkbox" id="archived" name="archived"></input>
                  {/* Bottom Buttons Section */}
                  <div className="bottom-buttons-container">
                    <button type="button" className="button cancel">
                      キャンセル
                    </button>
                    <div className="sub-container">
                      <button type="submit" className="button submit-and-new">
                        作成してもう一つ追加
                      </button>
                      <button type="submit" className="button submit">
                        作成
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default StudentProfilesCreate;
