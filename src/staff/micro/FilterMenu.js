import React, { Fragment, useState } from "react";
// CSS
import "./FilterMenu.scss";

function FilterMenu({
  setDisplayFilterMenu,
  monthFilters,
  setMonthFilters,
  archiveFilters,
  setArchiveFilters,
  filtersActive,
}) {
  const [displayMonthSelectList, setDisplayMonthSelectList] = useState(false);
  const [displayArchiveStatusSelectList, setDisplayArchiveStatusSelectList] =
    useState(false);

  const handleSelectAllMonthTrue = (event) => {
    setMonthFilters({
      month0: true,
      month1: true,
      month2: true,
      month3: true,
      month4: true,
      month5: true,
      month6: true,
      month7: true,
      month8: true,
      month9: true,
      month10: true,
      month11: true,
      month12: true,
    });
  };

  const handleSelectAllMonthFalse = (event) => {
    setMonthFilters({
      month0: false,
      month1: false,
      month2: false,
      month3: false,
      month4: false,
      month5: false,
      month6: false,
      month7: false,
      month8: false,
      month9: false,
      month10: false,
      month11: false,
      month12: false,
    });
  };

  const handleSelectAllArchiveStatusTrue = (event) => {
    setArchiveFilters({
      unarchived: true,
      archived: true,
    });
  };

  const handleSelectAllArchiveStatusFalse = (event) => {
    setArchiveFilters({
      unarchived: false,
      archived: false,
    });
  };

  const handleToggleMonthSelectList = (event) => {
    setDisplayMonthSelectList(!displayMonthSelectList);
  };

  const handleToggleArchiveStatusSelectList = (event) => {
    setDisplayArchiveStatusSelectList(!displayArchiveStatusSelectList);
  };

  const handleClearAllFilters = () => {
    handleSelectAllMonthTrue();
    handleSelectAllArchiveStatusTrue();
  };

  return (
    <Fragment>
      <div className="filter-menu-container">
        <div className="filter-main-title">フィルター</div>
        {filtersActive && (
          <button
            className="clear-all-filters-button"
            onClick={handleClearAllFilters}>
            クリア
          </button>
        )}
        {/* birth month filter */}
        <button
          onClick={handleToggleMonthSelectList}
          className="filter-title-container">
          <div
            className={`filter-title-arrow${
              displayMonthSelectList ? " rotate-90-deg" : ""
            }`}></div>
          <div className="section-title">誕生月</div>
        </button>
        <div
          className={`filter-menu-group${
            !displayMonthSelectList ? " height-zero-overflow-hidden" : ""
          }`}>
          <div className="select-all-none-container">
            <button onClick={handleSelectAllMonthTrue}>全部</button>
            <button onClick={handleSelectAllMonthFalse}>解除</button>
          </div>
          {/* No birthday data */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...prevMonthFilters,
                month0: !prevMonthFilters.month0,
              }));
            }}>
            <input
              type="checkbox"
              name="month-0"
              checked={monthFilters.month0}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month0;
              }}
            />
            <label htmlFor="month-0">データ無</label>
          </button>
          {/* January Birthday */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...monthFilters,
                month1: !prevMonthFilters.month1,
              }));
            }}>
            <input
              type="checkbox"
              name="month-1"
              checked={monthFilters.month1}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month1;
              }}
            />
            <label htmlFor="month-1">1月</label>
          </button>
          {/* February Birthday */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...monthFilters,
                month2: !prevMonthFilters.month2,
              }));
            }}>
            <input
              type="checkbox"
              name="month-2"
              checked={monthFilters.month2}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month2;
              }}
            />
            <label htmlFor="month-2">2月</label>
          </button>
          {/* March Birthday */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...monthFilters,
                month3: !prevMonthFilters.month3,
              }));
            }}>
            <input
              type="checkbox"
              name="month-3"
              checked={monthFilters.month3}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month3;
              }}
            />
            <label htmlFor="month-3">3月</label>
          </button>
          {/* April Birthday */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...monthFilters,
                month4: !prevMonthFilters.month4,
              }));
            }}>
            <input
              type="checkbox"
              name="month-4"
              checked={monthFilters.month4}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month4;
              }}
            />
            <label htmlFor="month-4">4月</label>
          </button>
          {/* May Birthday */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...monthFilters,
                month5: !prevMonthFilters.month5,
              }));
            }}>
            <input
              type="checkbox"
              name="month-5"
              checked={monthFilters.month5}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month5;
              }}
            />
            <label htmlFor="month-5">5月</label>
          </button>
          {/* June Birthday */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...monthFilters,
                month6: !prevMonthFilters.month6,
              }));
            }}>
            <input
              type="checkbox"
              name="month-6"
              checked={monthFilters.month6}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month6;
              }}
            />
            <label htmlFor="month-6">6月</label>
          </button>
          {/* July Birthday */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...monthFilters,
                month7: !prevMonthFilters.month7,
              }));
            }}>
            <input
              type="checkbox"
              name="month-7"
              checked={monthFilters.month7}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month7;
              }}
            />
            <label htmlFor="month-7">7月</label>
          </button>
          {/* August Birthday */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...monthFilters,
                month8: !prevMonthFilters.month8,
              }));
            }}>
            <input
              type="checkbox"
              name="month-8"
              checked={monthFilters.month8}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month8;
              }}
            />
            <label htmlFor="month-8">8月</label>
          </button>
          {/* September Birthday */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...monthFilters,
                month9: !prevMonthFilters.month9,
              }));
            }}>
            <input
              type="checkbox"
              name="month-9"
              checked={monthFilters.month9}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month9;
              }}
            />
            <label htmlFor="month-9">9月</label>
          </button>
          {/* October Birthday */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...monthFilters,
                month10: !prevMonthFilters.month10,
              }));
            }}>
            <input
              type="checkbox"
              name="month-10"
              checked={monthFilters.month10}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month10;
              }}
            />
            <label htmlFor="month-10">10月</label>
          </button>
          {/* November Birthday */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...monthFilters,
                month11: !prevMonthFilters.month11,
              }));
            }}>
            <input
              type="checkbox"
              name="month-11"
              checked={monthFilters.month11}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month11;
              }}
            />
            <label htmlFor="month-11">11月</label>
          </button>
          {/* December Birthday */}
          <button
            onClick={(event) => {
              setMonthFilters((prevMonthFilters) => ({
                ...monthFilters,
                month12: !prevMonthFilters.month12,
              }));
            }}>
            <input
              type="checkbox"
              name="month-12"
              checked={monthFilters.month12}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = monthFilters.month12;
              }}
            />
            <label htmlFor="month-12">12月</label>
          </button>
        </div>
        {/* archive status filter */}
        <button
          onClick={handleToggleArchiveStatusSelectList}
          className="filter-title-container">
          <div
            className={`filter-title-arrow${
              displayArchiveStatusSelectList ? " rotate-90-deg" : ""
            }`}></div>
          <div className="section-title">アーカイブ</div>
        </button>
        <div
          className={`filter-menu-group${
            !displayArchiveStatusSelectList
              ? " height-zero-overflow-hidden"
              : ""
          }`}>
          <div className="select-all-none-container">
            <button onClick={handleSelectAllArchiveStatusTrue}>全部</button>
            <button onClick={handleSelectAllArchiveStatusFalse}>解除</button>
          </div>
          {/* Unarchived */}
          <button
            onClick={(event) => {
              setArchiveFilters((prevArchiveFilters) => ({
                ...archiveFilters,
                unarchived: !prevArchiveFilters.unarchived,
              }));
            }}>
            <input
              type="checkbox"
              name="unarchived"
              checked={archiveFilters.unarchived}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = archiveFilters.unarchived;
              }}
            />
            <label htmlFor="unarchived">アーカイブ対象外</label>
          </button>
          {/* Archived */}
          <button
            onClick={(event) => {
              setArchiveFilters((prevArchiveFilters) => ({
                ...archiveFilters,
                archived: !prevArchiveFilters.archived,
              }));
            }}>
            <input
              type="checkbox"
              name="archived"
              checked={archiveFilters.archived}
              // not necessary; used to prevent console errors
              onChange={(event) => {
                event.target.checked = archiveFilters.archived;
              }}
            />
            <label htmlFor="archived">アーカイブ対象</label>
          </button>
        </div>
      </div>
      <div
        className="close-filter-menu-background-button"
        onClick={() => {
          setDisplayFilterMenu(false);
        }}></div>
    </Fragment>
  );
}

export default FilterMenu;
