import React from "react";
import { AuthComponent } from "../../components/authComponent/AuthComponent";
import "./NavbarComponent.css";
export const NavbarComponent = () => {


  return (
    <nav className="navbar myNavbar navbar-dark">

      <h3>Progetto REACT MICROSOFT TEAMS</h3>
      <div className="navbar-nav ">

          <AuthComponent />

      </div>
    </nav>
  );
}
