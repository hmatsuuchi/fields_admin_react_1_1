import React, { useState } from "react";
import { useEffect } from "react";
// Axios
import instance from "../../axios/axios";
// CSS
import "./StudentProfilesCards.scss";

function StudentProfiles() {
  const [studentProfiles, setStudentProfiles] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        await instance.get("api/students/profiles").then((response) => {
          if (response) {
            setStudentProfiles(response.data);
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

  return (
    <div className="list-container">
      {studentProfiles.map((element) => (
        <div className="student-profile" key={`student-profile-${element.id}`}>
          <div>
            {element.last_name_romaji}, {element.first_name_romaji}
          </div>
          <div>{element.payment_method_verbose}</div>
          <div>{element.post_code}</div>
          <div>{element.address_1}</div>
          <div>{element.address_2}</div>
          {element.phone.map((phone) => (
            <div key={`phone-${phone.id}`}>
              {phone.number} {phone.number_type_verbose}
            </div>
          ))}
          <div>{element.birthday}</div>
          <div>{element.grade_verbose}</div>
          <div>{element.status_verbose}</div>
          <div>{element.prefecture_verbose}</div>
          <div>{element.city}</div>
          <div>{element.archived ? "Archived" : "Unarchived"}</div>
        </div>
      ))}
    </div>
  );
}

export default StudentProfiles;
