import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux"; 
import { logout } from "../Redux/Action/userActions";

const Sidebar = () => {

   const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [submenuOpen, setSubmenuOpen] = useState(false);

    const logoutHandler = () => {
      dispatch(logout());
    };

  return (
    <div>
      <aside className="navbar-aside" id="offcanvas_aside">
        {/* Logo + Nom du projet */}
        <div
          className="aside-top"
          style={{
            backgroundColor: "#3b82f6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 0",
          }}
        >
          <Link
            to="/"
            className="brand-wrap"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "70%",
              margin: "0 auto",
              padding: "20px 0",
            }}
          >
            <img
              src="/images/VOIIIIII.png"
              style={{
                height: "120px",
                maxWidth: "100%",
                objectFit: "contain",
                transition: "transform 0.3s ease",
              }}
              alt="VOIXPEUPLE Logo"
            />
          </Link>
        </div>

        {/* Menu */}
        <nav>
          <ul className="menu-aside">
            {/* Tableau de bord */}
            <li className="menu-item">
              <NavLink className="menu-link" to="/" end>
                <i className="icon fas fa-tachometer-alt"></i>
                <span className="text">Tableau de bord</span>
              </NavLink>
            </li>

            {/* Mes documents */}
            <li className="menu-item">
              <NavLink className="menu-link" to="/orders">
                <i className="icon fas fa-file-alt"></i>
                <span className="text">Mes Documents</span>
              </NavLink>
            </li>

            {/* Violation / Signalement */}
            <li className="menu-item">
              <NavLink className="menu-link" to="/caseScreen">
                <i className="icon fas fa-exclamation-triangle"></i>
                <span className="text">Violation / Signalement</span>
              </NavLink>
            </li>

            {/* Evolution Dossier */}
            <li className="menu-item">
              <NavLink className="menu-link" to="/evolution">
                <i className="icon fas fa-chart-line"></i>
                <span className="text">Evolution Dossier</span>
              </NavLink>
            </li>

            {/* Dashboard Citoyen */}
            <li className="menu-item">
              <NavLink className="menu-link" to="/DashCitoyen">
                <i className="icon fas fa-users"></i>
                <span className="text">Dashboard Citoyen</span>
              </NavLink>
            </li>

            {/* Profil */}
            {userInfo && (
              <li className="menu-item">
                <NavLink className="menu-link" to="/category">
                  <i className="icon fas fa-user-circle"></i>
                  <span className="text">Profil</span>
                </NavLink>
              </li>
            )}

            {/* Admin Only */}
            {userInfo && userInfo.isAdmin && (
              <>
                {/* Utilisateurs */}
                <li className="menu-item">
                  <NavLink className="menu-link" to="/users">
                    <i className="icon fas fa-users-cog"></i>
                    <span className="text">Utilisateurs</span>
                  </NavLink>
                </li>

                {/* Rapports & Archives */}
                <li className="menu-item has-submenu">
                  <a
                    href="#!"
                    className="menu-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setSubmenuOpen(!submenuOpen);
                    }}
                  >
                    <i className="icon fas fa-archive"></i>
                    <span className="text">Rapports & Archives</span>
                    <i
                      className={`fas fa-chevron-down float-end ms-auto ${
                        submenuOpen ? "rotate" : ""
                      }`}
                    ></i>
                  </a>
                  <ul
                    className={`submenu ${submenuOpen ? "open" : ""}`}
                    id="submenu-gestion"
                  >
                    <li>
                      <NavLink className="submenu-link" to="/Invoice">
                        <i className="fas fa-file-invoice"></i> Rapport par dossier
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="submenu-link" to="/Invoices">
                        <i className="fas fa-calendar-alt"></i> Rapport mensuel
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="submenu-link" to="/InsertArchive">
                        <i className="fas fa-plus-circle"></i> Insérer une archive
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="submenu-link" to="/ArchivesAll">
                        <i className="fas fa-archive"></i> Toutes les archives
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="submenu-link" to="/DashboardALL">
                        <i className="fas fa-chart-pie"></i> Dashboard global
                      </NavLink>
                    </li>
                  </ul>
                </li>

                {/* Tous les dossiers */}
                <li className="menu-item">
                  <NavLink className="menu-link" to="/tous-les-dossiers">
                    <i className="icon fas fa-clipboard-list"></i>
                    <span className="text">Tous les dossiers</span>
                  </NavLink>
                </li>

                {/* Statistiques */}
                <li className="menu-item">
                  <NavLink className="menu-link" to="/stats">
                    <i className="icon fas fa-chart-bar"></i>
                    <span className="text">Statistiques</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* Alertes */}
            <li className="menu-item">
              <NavLink className="menu-link" to="/alertes">
                <i className="icon fas fa-bell"></i>
                <span className="text">Alertes</span>
              </NavLink>
            </li>

            {/* Déconnexion */}
            <li className="menu-item">
              <NavLink className="menu-link" to="#"  onClick={logoutHandler} >
                <i className="icon fas fa-sign-out-alt"></i>
                <span className="text">Déconnexion</span>
              </NavLink>
            </li>

          
          </ul>
        </nav>
      </aside>

      <style>{`
        .menu-link {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          color: #cbd5e1;
          text-decoration: none;
          font-weight: 500;
          border-radius: 8px;
          margin: 4px 10px;
          transition: all 0.3s ease;
        }

        .menu-link:hover {
          background-color: #3b82f6;
          color: #fff;
          transform: translateX(4px);
        }

        .menu-link.active {
          background-color: #3b82f6;
          color: white;
          font-weight: 600;
        }

        .menu-link.active i {
          color: white;
        }

        .submenu {
          list-style: none;
          padding-left: 0;
          display: none;
        }

        .submenu.open {
          display: block;
        }

        .submenu-link {
          display: block;
          padding: 8px 25px;
          color: #cbd5e1;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .submenu-link:hover {
          background-color: #3b82f6;
          color: white;
        }

        .submenu-link.active {
          background-color: #3b82f6;
          color: white;
          font-weight: 600;
        }

        .icon {
          margin-right: 10px;
        }

        .rotate {
          transform: rotate(180deg);
          transition: transform 0.3s ease;
        }

        .brand-wrap img:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
