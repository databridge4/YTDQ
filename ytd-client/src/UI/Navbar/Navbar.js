import React, { Fragment, useState } from "react";
import { Link, Outlet } from "react-router-dom"; // Assuming you're using react-router-dom for routing
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <nav className="navbar">
        <div className="navbar__logo" onClick={handleClick}>
          YTD
        </div>
        <div className={`navbar__links ${open ? "open" : ""}`}>
          <Link to="/transcript" className="navbar__link" onClick={closeMenu}>
            Quotes
          </Link>
          <Link
            to="/videoDownloader"
            className="navbar__link"
            onClick={closeMenu}
          >
            Downloader
          </Link>
        </div>
      </nav>
      <div onClick={closeMenu}>
        <Outlet />
      </div>
    </Fragment>
  );
};

export default Navbar;
