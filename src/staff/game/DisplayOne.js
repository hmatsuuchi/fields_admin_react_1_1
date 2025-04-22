import React from "react";
/* AXIOS */
import instance from "../axios/axios_authenticated";
// CSS
import "./DisplayOne.scss";

function DisplayOne() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [UUIDInput, setUUIDInput] = React.useState("");

  const [points, setPoints] = React.useState(0);

  /* ------------------------------------------- */
  /* ---------------- FUNCTIONS ---------------- */
  /* ------------------------------------------- */

  const fetchStudentData = async () => {
    const params = {
      card_uuid: UUIDInput,
    };

    try {
      await instance
        .get("api/game/display/01/", { params })
        .then((response) => {
          if (response) {
            console.log(response.data);
            console.log("------------------");
            setPoints(response.data.attendance_count * 10);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  /* ------------------------------------------- */
  /* ------------------- JSX ------------------- */
  /* ------------------------------------------- */

  return (
    <div id="debug-container">
      <div>{points}</div>
      <input
        value={UUIDInput}
        onChange={(e) => setUUIDInput(e.target.value)}
      ></input>
      <button onClick={fetchStudentData}>FETCH ME SOME DATA</button>
    </div>
  );
}

export default DisplayOne;
