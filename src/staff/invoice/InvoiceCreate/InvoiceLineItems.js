import React, { Fragment, useEffect } from "react";
/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./InvoiceLineItems.scss";

function InvoiceLineItems({ invoiceData, setInvoiceData }) {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [serviceTypeList, setServiceTypeList] = React.useState([]);
  const [taxesList, setTaxesList] = React.useState([]);
  const [taxesDefault, setTaxesDefault] = React.useState("");

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* run on component mount */
  useEffect(() => {
    /* fetch list of service types for select list */
    const fetchServiceTypeList = async () => {
      try {
        await instance
          .get("api/invoices/invoices/service-types-list-for-select/")
          .then((response) => {
            if (response) {
              setServiceTypeList(response.data);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drives code */
    fetchServiceTypeList();

    /* fetch list of tax types for select list */
    const fetchTaxesTypeList = async () => {
      try {
        await instance
          .get("api/invoices/invoices/taxes-list-for-select/")
          .then((response) => {
            if (response) {
              setTaxesList(response.data.taxes);
              setTaxesDefault(response.data.default_tax);
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    /* drives code */
    fetchTaxesTypeList();
  }, []);

  /* calculates default tax rate based on default tax type */
  function calculateDefaultTaxRate(taxesList, taxesDefault) {
    const defaultTaxObject = taxesList.find(
      (taxItem) => taxItem.id === taxesDefault
    );
    if (defaultTaxObject) {
      return defaultTaxObject.rate;
    } else {
      return "";
    }
  }

  /* sets default values for line item and creates first line item */
  useEffect(() => {
    if (
      serviceTypeList.length !== 0 &&
      taxesList.length !== 0 &&
      taxesDefault !== ""
    ) {
      setInvoiceData((prev) => ({
        ...prev,
        line_items: [
          {
            description: "",
            quantity: "",
            rate: "",
            tax_type: taxesDefault,
            tax_rate: calculateDefaultTaxRate(taxesList, taxesDefault),
            service_type: "",
          },
        ],
      }));
    }
  }, [setInvoiceData, serviceTypeList, taxesList, taxesDefault]);

  /* creates new line items */
  const handleClicksToCreateNewLineItemButton = () => {
    if (invoiceData.line_items.length < 10) {
      setInvoiceData({
        ...invoiceData,
        line_items: [
          ...invoiceData.line_items,
          {
            description: "",
            quantity: "",
            rate: "",
            tax_rate: calculateDefaultTaxRate(taxesList, taxesDefault),
            tax_type: taxesDefault,
            service_type: "",
          },
        ],
      });
    }
  };

  /* deletes line items */
  const handleClicksToDeleteLineItemButton = (elementIndex) => {
    if (invoiceData.line_items.length !== 1) {
      setInvoiceData({
        ...invoiceData,
        line_items: invoiceData.line_items.filter(
          (item, index) => index !== elementIndex
        ),
      });
    }
  };
  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <Fragment>
      <div className="section-header">科目</div>
      <div id="invoice-line-items-section">
        {invoiceData.line_items.map((item, index) => {
          return (
            <div key={`invoice-item-${index}`} className="line-item-container">
              <div
                className="delete-line-item-button"
                onClick={() => {
                  handleClicksToDeleteLineItemButton(index);
                }}
              ></div>
              {/* Service Select Dropdown */}
              <select
                className="line-item-service-type"
                value={item.service_type}
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    line_items: invoiceData.line_items.map(
                      (lineItem, lineIndex) =>
                        lineIndex === index
                          ? { ...lineItem, service_type: e.target.value }
                          : lineItem
                    ),
                  })
                }
              >
                <option value="">-------</option>
                {serviceTypeList.map((serviceTypeItem) => (
                  <option
                    key={`service-type-item-${serviceTypeItem.id}`}
                    value={serviceTypeItem.id}
                  >
                    {serviceTypeItem.name}
                  </option>
                ))}
              </select>
              {/* Description Input */}
              <input
                placeholder="内容"
                className="line-item-description"
                value={item.description}
                onChange={(e) => {
                  setInvoiceData({
                    ...invoiceData,
                    line_items: invoiceData.line_items.map(
                      (lineItem, lineIndex) =>
                        lineIndex === index
                          ? { ...lineItem, description: e.target.value }
                          : lineItem
                    ),
                  });
                }}
              ></input>
              {/* Quantity Input */}
              <input
                value={item.quantity}
                placeholder="数量"
                className="line-item-quantity"
                onChange={(e) => {
                  setInvoiceData({
                    ...invoiceData,
                    line_items: invoiceData.line_items.map(
                      (lineItem, lineIndex) =>
                        lineIndex === index
                          ? { ...lineItem, quantity: e.target.value }
                          : lineItem
                    ),
                  });
                }}
              ></input>
              {/* Service Rate Input */}
              <input
                value={item.rate}
                placeholder="値段"
                className="line-item-rate"
                onChange={(e) => {
                  setInvoiceData({
                    ...invoiceData,
                    line_items: invoiceData.line_items.map(
                      (lineItem, lineIndex) =>
                        lineIndex === index
                          ? { ...lineItem, rate: e.target.value }
                          : lineItem
                    ),
                  });
                }}
              ></input>
              {/* Tax Rate Dropdown */}
              <select
                value={item.tax_type}
                className="line-item-tax"
                onChange={(e) => {
                  setInvoiceData({
                    ...invoiceData,
                    line_items: invoiceData.line_items.map(
                      (lineItem, lineIndex) =>
                        lineIndex === index
                          ? { ...lineItem, tax_type: e.target.value }
                          : lineItem
                    ),
                  });
                }}
              >
                <option value="">-------</option>
                {taxesList.map((taxItem) => (
                  <option key={`tax-item-${taxItem.id}`} value={taxItem.id}>
                    {`${taxItem.name} (${taxItem.rate}%)`}
                  </option>
                ))}
              </select>
              {/* Tax Rate Manual Input */}
              <input
                value={item.tax_rate}
                placeholder="税率"
                className="line-item-tax-rate"
                onChange={(e) => {
                  setInvoiceData({
                    ...invoiceData,
                    line_items: invoiceData.line_items.map(
                      (lineItem, lineIndex) =>
                        lineIndex === index
                          ? { ...lineItem, tax_rate: e.target.value }
                          : lineItem
                    ),
                  });
                }}
              ></input>
              {/* Total Display */}
              <div className="line-item-total">
                {`¥${(item.quantity * item.rate).toLocaleString("ja-JP")}`}
              </div>
            </div>
          );
        })}
      </div>
      <div
        id="add-invoice-line-item-container"
        onClick={handleClicksToCreateNewLineItemButton}
      ></div>
    </Fragment>
  );
}

export default InvoiceLineItems;
