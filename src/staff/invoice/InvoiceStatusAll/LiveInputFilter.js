import React, { useEffect, useRef } from "react";
/* CSS */
import "./LiveInputFilter.scss";

function LiveInputFilter({
  liveFilterTextInput,
  setLiveFilterTextInput,
  invoicesAll,
  setInvoicesAll,
  liveFilterTextInputIsOpen,
  setLiveFilterTextInputIsOpen,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  // tracks if the update came from the live filter
  const isLiveFilterUpdate = useRef(false);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // handle input change
  useEffect(() => {
    // skip if this update was triggered by the filter itself
    if (isLiveFilterUpdate.current) {
      isLiveFilterUpdate.current = false;
      return;
    }

    // mark that the next update is from the filter
    isLiveFilterUpdate.current = true;

    setInvoicesAll((prevInvoices) =>
      prevInvoices.map((invoice) => {
        const invoiceSearchString = (
          invoice.student.first_name_romaji +
          invoice.student.last_name_romaji +
          invoice.student.first_name_romaji
        ).toLowerCase();

        const inputSearchString = liveFilterTextInput
          .toLowerCase()
          .replaceAll(" ", "")
          .replaceAll(",", "");

        // check if any field contains the live filter text input
        const matchesFilter = invoiceSearchString.includes(inputSearchString);
        return {
          ...invoice,
          // add a property to indicate if it matches the filter
          matchesLiveFilter: matchesFilter,
        };
      }),
    );
  }, [liveFilterTextInput, invoicesAll, setInvoicesAll]);

  // handle clicks to open/close button
  const handleClicksToOpenCloseButton = () => {
    // run only when opening
    if (!liveFilterTextInputIsOpen) {
      // focus the input after animation
      setTimeout(() => {
        const inputElement = document.getElementById("live-input-filter-input");
        if (inputElement) {
          inputElement.focus();
        }
      }, 300); // match with CSS animation duration
    } else {
      // clear the input when closing
      setLiveFilterTextInput("");
    }

    setLiveFilterTextInputIsOpen(!liveFilterTextInputIsOpen);
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div
      id="live-input-filter"
      className={liveFilterTextInputIsOpen ? "open" : ""}
    >
      <div className="input-container">
        <input
          id="live-input-filter-input"
          value={liveFilterTextInput}
          onChange={(e) => {
            setLiveFilterTextInput(e.target.value);
          }}
        />
      </div>

      <div className="open-close-tab" onClick={handleClicksToOpenCloseButton}>
        <div className="arrow"></div>
      </div>
    </div>
  );
}

export default LiveInputFilter;
