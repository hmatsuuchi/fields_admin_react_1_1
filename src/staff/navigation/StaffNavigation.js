import { React, Fragment } from "react";
// React Router DOM
import { NavLink } from "react-router-dom";
// CSS
import "./StaffNavigation.scss";

function StaffNavigation() {
  // toggles navigation open/closed
  // adds/removes closeNavOnScroll event listener when nav is open/closed
  function toggleNavigation() {
    const navigation = document.getElementById("navigation");
    const closeNavigation = document.getElementById("close-navigation");

    if (navigation.classList.contains("nav-active")) {
      navigation.classList.add("nav-inactive");
      navigation.classList.remove("nav-active");
      closeNavigation.classList.remove("nav-active");
      window.removeEventListener("scroll", closeNavOnScroll);
    } else if (navigation.classList.contains("nav-inactive")) {
      navigation.classList.add("nav-active");
      navigation.classList.remove("nav-inactive");
      closeNavigation.classList.add("nav-active");
      window.addEventListener("scroll", closeNavOnScroll);
    } else {
      navigation.classList.add("nav-active");
      closeNavigation.classList.add("nav-active");
      window.addEventListener("scroll", closeNavOnScroll);
    }
  }

  // when nav is open, closes nav on scroll
  function closeNavOnScroll() {
    const navigation = document.getElementById("navigation");
    const closeNavigation = document.getElementById("close-navigation");

    navigation.classList.add("nav-inactive");
    navigation.classList.remove("nav-active");
    closeNavigation.classList.remove("nav-active");
    window.removeEventListener("scroll", closeNavOnScroll);
  }

  function clicksToNavHousekeeping() {
    closeNavOnScroll();
  }

  return (
    <Fragment>
      <nav id="navigation" className="staff-navigation">
        <div id="link-list-container">
          <NavLink
            id="link-item-01"
            to="/staff/dashboard/"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
            onClick={clicksToNavHousekeeping}>
            ダッシュボード
          </NavLink>
          <NavLink
            id="link-item-02"
            to="/staff/students/profiles/cards/"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
            onClick={clicksToNavHousekeeping}>
            生徒情報
          </NavLink>
          <NavLink
            id="link-item-03"
            to="/staff/schedule/events/calendar/"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
            onClick={clicksToNavHousekeeping}>
            カレンダー
          </NavLink>
          <NavLink
            id="link-item-04"
            to="/logout/"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }>
            ログアウト
          </NavLink>
        </div>
        <button id="hamburger-button" onClick={toggleNavigation}>
          <div id="hamburger-container">
            <div id="hamburger-line-1" className="hamburger-line"></div>
            <div id="hamburger-line-2" className="hamburger-line"></div>
            <div id="hamburger-line-3" className="hamburger-line"></div>
          </div>
        </button>
      </nav>
      <div id="close-navigation" onClick={toggleNavigation} />
    </Fragment>
  );
}

export default StaffNavigation;
