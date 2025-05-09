import React, { Fragment } from "react";
import { Link } from "react-router-dom";

// CSS
import "./Dashboard.scss";

function Dashboard() {
  return (
    <Fragment>
      <h1>Display Dashboard</h1>
      <Link to="/display/game/display/01">Display 01</Link>
    </Fragment>
  );
}

export default Dashboard;
