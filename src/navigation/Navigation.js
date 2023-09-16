import React from "react";
// Axios
import instance from "../axios/axios";
// React Router DOM
import { NavLink } from "react-router-dom";
// CSS
import "./Navigation.scss";

function Navigation({ setIsAuth }) {
  // toggles navigation open/closed
  // adds/removes closeNavOnScroll event listener when nav is open/closed
  function toggleNavigation() {
    const navigation = document.getElementById("navigation");
    if (navigation.classList.contains("nav-active")) {
      navigation.classList.add("nav-inactive");
      navigation.classList.remove("nav-active");
      window.removeEventListener("scroll", closeNavOnScroll);
    } else if (navigation.classList.contains("nav-inactive")) {
      navigation.classList.add("nav-active");
      navigation.classList.remove("nav-inactive");
      window.addEventListener("scroll", closeNavOnScroll);
    } else {
      navigation.classList.add("nav-active");
      window.addEventListener("scroll", closeNavOnScroll);
    }
  }

  // when nav is open, closes nav on scroll
  function closeNavOnScroll() {
    const navigation = document.getElementById("navigation");
    navigation.classList.add("nav-inactive");
    navigation.classList.remove("nav-active");
    window.removeEventListener("scroll", closeNavOnScroll);
  }

  // disables clicks to nav
  function closeDisableNav() {
    document.getElementById("navigation").classList.add("nav-disabled");

    const navigation = document.getElementById("navigation");
    if (navigation.classList.contains("nav-active")) {
      navigation.classList.add("nav-inactive");
      navigation.classList.remove("nav-active");
      window.removeEventListener("scroll", closeNavOnScroll);
    }
  }

  const logout = () =>
    (async () => {
      try {
        await instance
          .post("api/logout/", {
            refresh_token: localStorage.getItem("refresh_token"),
          })
          .then(() => {
            localStorage.clear();
            setIsAuth(false);
          })
          .catch((e) => {});
      } catch (e) {
        console.log("logout not working", e);
      }
    })();

  return (
    <nav id="navigation" className="nav-disabled">
      <div id="link-list-container">
        <NavLink
          id="link-item-03"
          to="/login"
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : ""
          }
          onClick={logout}>
          ログアウト
        </NavLink>
        <NavLink
          id="link-item-02"
          to="/students/profiles/cards"
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : ""
          }
          onClick={closeDisableNav}>
          生徒カード
        </NavLink>
        <NavLink
          id="link-item-01"
          to="/students/profiles/list"
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : ""
          }
          onClick={closeDisableNav}>
          生徒リスト
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
  );
}

export default Navigation;
