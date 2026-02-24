import React from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
// CSS
import "./InvoiceListAllToolbar.scss";
// COMPONENTS
import ToolbarBackButton from "../../micro/ToolbarBackButton";

function InvoiceListAllToolbar({
  disableToolbarButtons,
  setDisableToolbarButtons,
  backButtonText,
  backButtonLink,
  displayBackButton,
  setDisplayBackButton,
  filterParameters,
  setFilterParameters,
  setFilterParametersApplied,
  invoiceCount,
  setInvoicesAll,
  setContentLoading,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  // fetches invoices using the query parameters
  const fetchInvoicesAll = async (searchType) => {
    // verified parameters to be sent with request to backend
    let verifiedParameters = {};

    // date search button is pressed and both year and month values are present
    if (
      searchType === "dateSearch" &&
      filterParameters.year !== "" &&
      filterParameters.month !== ""
    ) {
      setFilterParameters({
        ...filterParameters,
        display_student_only_id: null,
        text_filter: "",
      });

      // sets filter parameters for text descriptor
      setFilterParametersApplied({
        display_student_only_id: null,
        year: filterParameters.year,
        month: filterParameters.month,
        text_filter: null,
      });

      verifiedParameters = {
        year: filterParameters.year,
        month: filterParameters.month,
      };
    }
    // date search button is pressed and year or month values are missing
    else if (searchType === "dateSearch") {
      // current year and month
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      setFilterParameters({
        display_student_only_id: null,
        year: currentYear,
        month: currentMonth,
        text_filter: "",
      });

      // sets filter parameters for text descriptor
      setFilterParametersApplied({
        display_student_only_id: null,
        year: currentYear,
        month: currentMonth,
        text_filter: null,
      });

      verifiedParameters = {
        year: currentYear,
        month: currentMonth,
      };
    }

    // text search button is pressed and text filter value is present
    if (searchType === "textSearch" && filterParameters.text_filter !== "") {
      // sets parameters to be sent with request to backend
      verifiedParameters = {
        text_filter: filterParameters.text_filter,
      };

      // sets filter parameters
      setFilterParameters({
        ...filterParameters,
        display_student_only_id: null,
        year: "",
        month: "",
      });

      // sets filter parameters for text descriptor
      setFilterParametersApplied({
        display_student_only_id: null,
        year: null,
        month: null,
        text_filter: filterParameters.text_filter,
      });
    }
    // text search button is pressed and text filter value is missing
    else if (searchType === "textSearch") {
      // current year and month
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      setFilterParameters({
        display_student_only_id: null,
        year: currentYear,
        month: currentMonth,
        text_filter: "",
      });

      // sets filter parameters for text descriptor
      setFilterParametersApplied({
        display_student_only_id: null,
        year: currentYear,
        month: currentMonth,
        text_filter: null,
      });

      verifiedParameters = {
        year: currentYear,
        month: currentMonth,
      };
    }

    try {
      await instance
        .get("api/invoices/invoices/list/all/", {
          params: verifiedParameters,
        })
        .then((response) => {
          if (response) {
            setInvoicesAll(response.data.invoices);
            setDisableToolbarButtons(false);
            setContentLoading(false);
          }
        });
    } catch (e) {
      setContentLoading(false);
      console.log(e);
    }
  };

  const handleClicksToDateFilterButton = () => {
    // reset invoice array to empty array
    setInvoicesAll([]);

    // set content loading state
    setContentLoading(true);

    // disable toolbar buttons while fetching data
    setDisableToolbarButtons(true);

    // fetch data using the query parameters
    fetchInvoicesAll("dateSearch");
  };

  const handleClicksToTextFilterButton = () => {
    // reset invoice array to empty array
    setInvoicesAll([]);

    // set content loading state
    setContentLoading(true);

    // disable toolbar buttons while fetching data
    setDisableToolbarButtons(true);

    // fetch data using the query parameters
    fetchInvoicesAll("textSearch");
  };

  // Handle Key Up On Text Search Filter Input
  const handleKeyUpOnTextSearchFilterInput = (e) => {
    if (e.key === "Enter") {
      // runs text search
      handleClicksToTextFilterButton(e);
    }
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */
  return (
    <div
      id="invoice-list-all-toolbar"
      className={disableToolbarButtons ? "disable-toolbar-buttons" : ""}
    >
      <ToolbarBackButton
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
        displayBackButton={displayBackButton}
        setDisplayBackButton={setDisplayBackButton}
      />

      <div className="toolbar-right-side-container">
        {/* text search filter */}
        <input
          type="text"
          className="text-filter-input"
          value={filterParameters.text_filter}
          onChange={(e) => {
            setFilterParameters({
              ...filterParameters,
              text_filter: e.target.value,
            });
          }}
          onKeyUp={handleKeyUpOnTextSearchFilterInput}
          tabIndex={1}
        />
        <button
          className="filter-results-button"
          onClick={handleClicksToTextFilterButton}
          tabIndex={2}
        ></button>

        <div className="vertical-divider-thin" />

        {/* year and month filter */}
        <select
          className="year-select"
          value={filterParameters.year}
          onChange={(e) => {
            setFilterParameters({
              ...filterParameters,
              year: e.target.value,
            });
          }}
          tabIndex={3}
        >
          <option value={""}>-------</option>
          <option value={2026}>2026年</option>
          <option value={2025}>2025年</option>
        </select>
        <select
          className="month-select"
          value={filterParameters.month}
          onChange={(e) => {
            setFilterParameters({
              ...filterParameters,
              month: e.target.value,
            });
          }}
          tabIndex={4}
        >
          <option value={""}>-------</option>
          <option value={1}>1月</option>
          <option value={2}>2月</option>
          <option value={3}>3月</option>
          <option value={4}>4月</option>
          <option value={5}>5月</option>
          <option value={6}>6月</option>
          <option value={7}>7月</option>
          <option value={8}>8月</option>
          <option value={9}>9月</option>
          <option value={10}>10月</option>
          <option value={11}>11月</option>
          <option value={12}>12月</option>
        </select>
        <button
          className="filter-results-button"
          onClick={handleClicksToDateFilterButton}
          tabIndex={5}
        ></button>

        {/* filtered results */}
        <div className="number-of-results">{`${invoiceCount}件`}</div>
      </div>
    </div>
  );
}

export default InvoiceListAllToolbar;
