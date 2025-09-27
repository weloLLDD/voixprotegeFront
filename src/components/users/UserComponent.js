import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listUser } from "../../Redux/Action/userActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const UserComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (userInfo.role === "admin") {
      // admin peut voir tous les users
      dispatch(listUser());
    }
  }, [dispatch, userInfo, navigate]);

  // Pour les utilisateurs normaux (citoyen/agent)
  const displayUsers =
    userInfo?.role === "admin"
      ? users
      : userInfo
      ? [userInfo] // afficher seulement l'utilisateur connecté
      : [];

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Users</h2>
        {userInfo?.role === "admin" && (
          <div>
            <Link to="/create-user" className="btn btn-primary">
              <i className="material-icons md-plus"></i> Create new
            </Link>
          </div>
        )}
      </div>

      <div className="card mb-4">
        <header className="card-header">
          <div className="row gx-3">
            <div className="col-lg-4 col-md-6 me-auto">
              <input type="text" placeholder="Search..." className="form-control" />
            </div>
            <div className="col-lg-2 col-6 col-md-3">
              <select className="form-select">
                <option>Show 20</option>
                <option>Show 30</option>
                <option>Show 40</option>
                <option>Show all</option>
              </select>
            </div>
            <div className="col-lg-2 col-6 col-md-3">
              <select className="form-select">
                <option>Status: all</option>
                <option>Active only</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </header>

        <div className="card-body">
          {loading ? (
            <Loading />
          ) : error ? (
            <Message variant="alert-danger">{error}</Message>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
              {displayUsers.map((user) => (
                <div className="col" key={user._id}>
                  <div className="card card-user shadow-sm">
                    <div className="card-header">
                      <img className="img-md img-avatar" src="images/favicon.png" alt="User pic" />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title mt-5">{user.name}</h5>
                      <div className="card-text text-muted">
                        <p className="m-0">{user.role}</p>
                        <p>
                          <a href={`mailto:${user.email}`}>{user.email}</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserComponent;
