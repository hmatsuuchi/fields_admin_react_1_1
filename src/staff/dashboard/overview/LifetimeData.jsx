import React, { Fragment, useEffect } from "react";

/* AXIOS */
import instance from "../../../axios/axios_authenticated";
/* CSS */
import "./LifetimeData.scss";
/* COMPONENTS */
import LoadingSpinner from "../../micro/LoadingSpinner";

function LifetimeData() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const [lifetimeData, setLifetimeData] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(true);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  /* fetches revenue by month data from the API */
  const fetchAverageLifetimeRevenue = () => {
    instance
      .get("api/dashboard/dashboard/overview/lifetime_data/")
      .then((response) => {
        if (response) {
          setLifetimeData(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setIsLoading(false));
  };

  /* runs on component mount */
  useEffect(() => {
    fetchAverageLifetimeRevenue();
  }, []);

  /* ---------------------------------------- */
  /* -----------------  JSX ----------------- */
  /* ---------------------------------------- */

  return (
    <div id="lifetime-data-section" onClick={fetchAverageLifetimeRevenue}>
      <div className="lifetime-data-container card">
        {isLoading ? (
          <LoadingSpinner />
        ) : lifetimeData ? (
          <Fragment>
            {/* MEAN LIFETIME REVENUE PER STUDENT */}
            <div className="title-data-container">
              <div className="title">平均生涯売上</div>
              <div className="data">
                {`${(lifetimeData["mean_lifetime_revenue"] / 10000).toLocaleString()} 万円`}
              </div>
              <div
                className={`historical-data-container${lifetimeData["highest_mean_lifetime_revenue"] === lifetimeData["mean_lifetime_revenue"] ? " match" : ""}`}
              >
                <div className="date">
                  {`${lifetimeData["highest_mean_lifetime_revenue_date"].split("T")[0]}`}
                </div>
                <div className="data">
                  {`${(lifetimeData["highest_mean_lifetime_revenue"] / 10000).toLocaleString()} 万円`}
                </div>
              </div>
            </div>

            {/* MEDIAN LIFETIME REVENUE PER STUDENT */}
            <div className="title-data-container">
              <div className="title">生涯売上の中央値</div>
              <div className="data">
                {`${(lifetimeData["median_lifetime_revenue"] / 10000).toLocaleString()} 万円`}
              </div>
              <div
                className={`historical-data-container${lifetimeData["highest_median_lifetime_revenue"] === lifetimeData["median_lifetime_revenue"] ? " match" : ""}`}
              >
                <div className="date">
                  {`${lifetimeData["highest_median_lifetime_revenue_date"].split("T")[0]}`}
                </div>
                <div className="data">
                  {`${(lifetimeData["highest_median_lifetime_revenue"] / 10000).toLocaleString()} 万円`}
                </div>
              </div>
            </div>

            <div className="section-divider" />

            {/* MEAN LIFETIME IN DAYS */}
            <div className="title-data-container">
              <div className="title">平均在籍期間</div>
              <div className="data">
                {`${lifetimeData["mean_lifetime_in_days"].toLocaleString()} 日`}
              </div>
              <div
                className={`historical-data-container${lifetimeData["highest_mean_lifetime_in_days"] === lifetimeData["mean_lifetime_in_days"] ? " match" : ""}`}
              >
                <div className="date">
                  {`${lifetimeData["highest_mean_lifetime_in_days_date"].split("T")[0]}`}
                </div>
                <div className="data">
                  {`${lifetimeData["highest_mean_lifetime_in_days"].toLocaleString()} 日`}
                </div>
              </div>
            </div>

            {/* MEDIAN LIFETIME IN DAYS */}
            <div className="title-data-container">
              <div className="title">在籍期間の中央値</div>
              <div className="data">
                {`${lifetimeData["median_lifetime_in_days"].toLocaleString()} 日`}
              </div>
              <div
                className={`historical-data-container${lifetimeData["highest_median_lifetime_in_days"] === lifetimeData["median_lifetime_in_days"] ? " match" : ""}`}
              >
                <div className="date">
                  {`${lifetimeData["highest_median_lifetime_in_days_date"].split("T")[0]}`}
                </div>
                <div className="data">
                  {`${lifetimeData["highest_median_lifetime_in_days"].toLocaleString()} 日`}
                </div>
              </div>
            </div>
          </Fragment>
        ) : null}
      </div>
    </div>
  );
}

export default LifetimeData;
