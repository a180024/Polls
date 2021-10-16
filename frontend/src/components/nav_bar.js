import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const NavBar = () => {
  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Link className="navbar-link" to="/">
          Home
        </Link>
        <Link className="navbar-link" to="/polls">
          View Polls
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
