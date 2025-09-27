import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Action/userActions";

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    $("[data-trigger]").on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var offcanvas_id = $(this).attr("data-trigger");
      $(offcanvas_id).toggleClass("show");
    });

    $(".btn-aside-minimize").on("click", function () {
      if (window.innerWidth < 768) {
        $("body").removeClass("aside-mini");
        $(".navbar-aside").removeClass("show");
      } else {
        $("body").toggleClass("aside-mini");
      }
    });
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header className="main-header navbar">
      <div className="col-search"></div>
      <div className="col-nav">
        <button
          className="btn btn-icon btn-mobile me-auto"
          data-trigger="#offcanvas_aside"
        >
          <i className="md-28 fas fa-bars"></i>
        </button>
        <ul className="nav">
          <li className="nav-item">
            <Link className={`nav-link btn-icon`} title="Dark mode" to="#">
              <i className="fas fa-moon"></i>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link btn-icon" to="#">
              <i className="fas fa-bell"></i>
            </Link>
          </li>

          <li className="dropdown nav-item">
            <Link className="dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown" to="#">
              {userInfo && (
                <>
                  <img
                    className="img-xs rounded-circle me-2"
                    src="/images/logo12.png"
                    alt="logo12"
                    style={{ width: "36px", height: "36px", objectFit: "cover" }}
                  />
             
                </>
              )}
            </Link>
            <div className="dropdown-menu dropdown-menu-end">
              <Link className="dropdown-item" to="/category">
                <i className="fas fa-id-badge me-2"></i> Mon profil
              </Link>
              <Link className="dropdown-item" to="#">
                <i className="fas fa-cog me-2"></i> Paramètres
              </Link>
              <Link
                onClick={logoutHandler}
                className="dropdown-item text-danger"
                to="#"
              >
                <i className="fas fa-sign-out-alt me-2"></i> Déconnexion
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
