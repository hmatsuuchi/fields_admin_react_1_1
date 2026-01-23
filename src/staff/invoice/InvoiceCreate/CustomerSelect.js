import React, { useEffect, useState } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./CustomerSelect.scss";

function CustomerSelect({
  setDisableToolbarButtons,
  invoiceData,
  setInvoiceData,
  searchTerm,
  setSearchTerm,
  selectedCustomerData,
  setSelectedCustomerData,
}) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [customerList, setCustomerList] = useState([]);
  const [filteredCustomerList, setFilteredCustomerList] = useState([]);

  const [displayCustomerSearchResults, setDisplayCustomerSearchResults] =
    useState(false);
  const [ignoreChangesToSearchField, setIgnoreChangesToSearchField] =
    useState(false);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* enables & disables transfer date field based on payment method of selected customer */
  useEffect(() => {
    const paymentMethod = invoiceData.payment_method;

    const transferDateInput = document.getElementById("transfer-date");
    if (paymentMethod === 2) {
      transferDateInput.classList.remove("disable-clicks");
    } else {
      transferDateInput.classList.add("disable-clicks");
    }
  }, [invoiceData.payment_method]);

  /* run on component mount */
  useEffect(() => {
    /* fetch list of student profiles for select list */
    const fetchCustomerList = async () => {
      try {
        await instance
          .get("api/invoices/invoices/profiles-list-for-select/")
          .then((response) => {
            if (response) {
              setCustomerList(response.data);
              setFilteredCustomerList(response.data);
              /* re-enable toolbar buttons after customer list is loaded */
              setDisableToolbarButtons(false);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchCustomerList();
  }, [setDisableToolbarButtons]);

  /* filters customer list based on search term */
  useEffect(
    () => {
      /* Ignore changes to search field if flag is set */
      if (ignoreChangesToSearchField) {
        return;
      }

      /* Filter customer list based on search term */
      const workingList = customerList.filter((customer) => {
        /* Create a string that includes relevant customer fields for searching */
        const customerIdentifierString =
          `${customer.last_name_kanji}${customer.first_name_kanji}${customer.last_name_kanji}${customer.last_name_romaji}${customer.first_name_romaji}${customer.last_name_romaji}${customer.last_name_katakana}${customer.first_name_katakana}${customer.last_name_katakana}`
            .toLowerCase()
            .replace(" ", "");

        /* Clean the search term by removing commas and spaces */
        const filteredSearchTerm = searchTerm
          .toLowerCase()
          .replace(",", "")
          .replace(" ", "");

        return customerIdentifierString.includes(filteredSearchTerm);
      });

      /* Update state with filtered list */
      setFilteredCustomerList(workingList);

      /* update selected customer data with first item in the filtered list */
      if (
        workingList.length > 0 &&
        workingList.length !== customerList.length
      ) {
        setSelectedCustomerData(workingList[0]);
        setInvoiceData((prev = {}) => ({
          ...prev,
          ...workingList[0],
          customer_name: `${workingList[0].last_name_kanji} ${workingList[0].first_name_kanji}`,
          prefecture_city: `${workingList[0].prefecture_verbose}${workingList[0].city}`,
          customer_address_line_1: workingList[0].address_1,
          customer_address_line_2: workingList[0].address_2,
          student: workingList[0].id,
          customer_postal_code: workingList[0].post_code,
          customer_prefecture: workingList[0].prefecture_verbose,
          customer_city: workingList[0].city,
          payment_method: workingList[0].payment_method_from_invoice,
        }));
      }
    },
    [
      searchTerm,
      customerList,
      setInvoiceData,
      ignoreChangesToSearchField,
      setSelectedCustomerData,
    ],
    setSelectedCustomerData,
  );

  /* sets search term back to selected customer to avoid partial names */
  const setSearchFieldToSelectedCustomerName = (last, first, grade) => {
    setIgnoreChangesToSearchField(true);
    setSearchTerm(`${last} ${first}${grade ? ` (${grade})` : ""}`);

    setIgnoreChangesToSearchField(false);
  };

  /* Handle clicks on customer search results */
  const handleClicksToCustomerSearchResult = (customer) => {
    setSelectedCustomerData(customer);

    setInvoiceData((prev = {}) => ({
      ...prev,
      ...customer,
      customer_name: `${customer.last_name_kanji} ${customer.first_name_kanji}`,
      prefecture_city: `${customer.prefecture_verbose}${customer.city}`,
      customer_address_line_1: customer.address_1,
      customer_address_line_2: customer.address_2,
      student: customer.id,
      customer_postal_code: customer.post_code,
      customer_prefecture: customer.prefecture_verbose,
      customer_city: customer.city,
      payment_method: customer.payment_method_from_invoice,
    }));

    setSearchFieldToSelectedCustomerName(
      customer.last_name_kanji,
      customer.first_name_kanji,
      customer.grade_verbose,
    );
  };

  /* Handle focus to customer search input */
  const handleOnFocusToCustomerSearch = (e) => {
    setDisplayCustomerSearchResults(true);
    e.target.select();
  };

  /* Handle blur to customer search input */
  const handleOnBlurToCustomerSearch = () => {
    setSearchFieldToSelectedCustomerName(
      selectedCustomerData.last_name_kanji,
      selectedCustomerData.first_name_kanji,
      selectedCustomerData.grade_verbose,
    );
    setDisplayCustomerSearchResults(false);
  };

  /* Handle key down events to customer search input */
  const handleKeyDownToCustomerSearch = () => (e) => {
    /* down arrow */
    if (e.key === "ArrowDown" && filteredCustomerList.length > 0) {
      e.preventDefault();
      /* get index of current customer */
      const currentIndex = filteredCustomerList.findIndex(
        (customer) => customer.id === selectedCustomerData.id,
      );
      /* get next customer (or disable arrow key functionality) */
      const nextIndex =
        currentIndex !== filteredCustomerList.length - 1
          ? currentIndex + 1
          : currentIndex;
      const nextCustomer = filteredCustomerList[nextIndex];

      /* scroll customer search result into view */
      const customerSearchResultElement = document.querySelector(
        `.customer-name-container:nth-child(${nextIndex + 1})`,
      );
      if (customerSearchResultElement) {
        customerSearchResultElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }

      /* update selected customer data */
      setSelectedCustomerData(nextCustomer);
      setInvoiceData((prev = {}) => ({
        ...prev,
        ...nextCustomer,
        customer_name: `${nextCustomer.last_name_kanji} ${nextCustomer.first_name_kanji}`,
        prefecture_city: `${nextCustomer.prefecture_verbose}${nextCustomer.city}`,
        customer_address_line_1: nextCustomer.address_1,
        customer_address_line_2: nextCustomer.address_2,
        customer_postal_code: nextCustomer.post_code,
        customer_prefecture: nextCustomer.prefecture_verbose,
        customer_city: nextCustomer.city,
        payment_method: nextCustomer.payment_method_from_invoice,
        student: nextCustomer.id,
      }));

      /* up arrow */
    } else if (e.key === "ArrowUp" && filteredCustomerList.length > 0) {
      e.preventDefault();
      /* get index of current customer */
      const currentIndex = filteredCustomerList.findIndex(
        (customer) => customer.id === selectedCustomerData.id,
      );
      /* get previous customer (or disable arrow key functionality) */
      const previousIndex =
        currentIndex !== 0 ? currentIndex - 1 : currentIndex;
      const previousCustomer = filteredCustomerList[previousIndex];

      /* scroll customer search result into view */
      const customerSearchResultElement = document.querySelector(
        `.customer-name-container:nth-child(${previousIndex + 1})`,
      );
      if (customerSearchResultElement) {
        customerSearchResultElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }

      /* update selected customer data */
      setSelectedCustomerData(previousCustomer);
      setInvoiceData((prev = {}) => ({
        ...prev,
        ...previousCustomer,
        customer_name: `${previousCustomer.last_name_kanji} ${previousCustomer.first_name_kanji}`,
        prefecture_city: `${previousCustomer.prefecture_verbose}${previousCustomer.city}`,
        customer_address_line_1: previousCustomer.address_1,
        customer_address_line_2: previousCustomer.address_2,
        customer_postal_code: previousCustomer.post_code,
        customer_prefecture: previousCustomer.prefecture_verbose,
        customer_city: previousCustomer.city,
        payment_method: previousCustomer.payment_method_from_invoice,
        student: previousCustomer.id,
      }));

      /* enter */
    } else if (e.key === "Enter" && filteredCustomerList.length > 0) {
      e.preventDefault();
      e.target.blur();
    }
  };

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div id="customer-search-container">
      <input
        type="text"
        id="customer-search"
        className={`${customerList.length === 0 ? "disable-clicks" : ""}`}
        placeholder="生徒検索"
        value={searchTerm}
        tabIndex="1"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onFocus={(e) => {
          handleOnFocusToCustomerSearch(e);
        }}
        onBlur={() => {
          handleOnBlurToCustomerSearch();
        }}
        onKeyDown={handleKeyDownToCustomerSearch()}
      />

      {displayCustomerSearchResults ? (
        <div id="customer-search-results">
          {filteredCustomerList.map((customer) => (
            <div
              key={customer.id}
              className={`customer-name-container${
                customer.id === selectedCustomerData.id
                  ? " selected-customer"
                  : ""
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleClicksToCustomerSearchResult(customer);
              }}
            >{`${customer.last_name_kanji} ${customer.first_name_kanji}${
              customer.grade_verbose ? ` (${customer.grade_verbose})` : ""
            }`}</div>
          ))}
        </div>
      ) : null}

      {/* <div id="linked-customer-data-container">
        <div className="customer-name-container">
          <div className="linked-customer-name-kanji">{`${
            selectedCustomerData.last_name_kanji
          } ${selectedCustomerData.first_name_kanji}${
            selectedCustomerData.grade_verbose
              ? ` (${selectedCustomerData.grade_verbose})`
              : ""
          }`}</div>
          <div className="linked-customer-name-katakana">{`${selectedCustomerData.last_name_katakana} ${selectedCustomerData.first_name_katakana}`}</div>

          <div className="linked-customer-name-romaji">
            {selectedCustomerData.last_name_romaji &&
            selectedCustomerData.first_name_romaji
              ? `${selectedCustomerData.last_name_romaji}, ${selectedCustomerData.first_name_romaji}`
              : selectedCustomerData.last_name_romaji
              ? selectedCustomerData.last_name_romaji
              : selectedCustomerData.first_name_romaji
              ? selectedCustomerData.first_name_romaji
              : ""}
          </div>
        </div>
        <div className="linked-customer-post-code">{`${selectedCustomerData.post_code}`}</div>
        <div className="linked-customer-prefecture-city">{`${selectedCustomerData.prefecture_verbose}${selectedCustomerData.city}`}</div>
        <div className="linked-customer-address-1">{`${
          selectedCustomerData.address_1 ? selectedCustomerData.address_1 : ""
        }`}</div>

        <div className="linked-customer-address-2">{`${
          selectedCustomerData.address_2 ? selectedCustomerData.address_2 : ""
        }`}</div>
      </div> */}
    </div>
  );
}

export default CustomerSelect;
