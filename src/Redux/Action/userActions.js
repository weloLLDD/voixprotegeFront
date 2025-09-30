 import axios from "axios";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_CREATE_REQUEST,
  USER_CREATE_SUCCESS,
  USER_CREATE_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
} from "../constants/userConstants";

// =======================
// LOGIN (email ou numéro)
// =======================
export const login = (emailOrPhone, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      "https://voixbdd.onrender.com/api/users/login",
      { emailOrPhone, password },
      config
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem("token", data.token);
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// =======================
// LOGOUT
// =======================
export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("token");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_LIST_RESET });
};

// =======================
// LIST USERS (ADMIN ONLY)
// =======================
export const listUser = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo || userInfo.role !== "admin") {
      throw new Error("Non autorisé : rôle admin requis");
    }

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get("https://voixbdd.onrender.com/api/users", config);
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// =======================
// UPDATE PROFILE (SELF OR ADMIN)
// =======================
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo) throw new Error("Utilisateur non connecté");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put("https://voixbdd.onrender.com/api/users/profile", user, config);

    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem("token", data.token);
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// =======================
// CREATE USER (ADMIN)
// =======================
export const createUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo || userInfo.role !== "admin") {
      throw new Error("Non autorisé : rôle admin requis");
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // user.emailOrPhone est utilisé côté backend
    const { data } = await axios.post("https://voixbdd.onrender.com/api/users/create", user, config);

    dispatch({ type: USER_CREATE_SUCCESS, payload: data });

    // Recharger automatiquement la liste des utilisateurs après création
    dispatch({ type: USER_LIST_REQUEST });
    try {
      const { data: users } = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: USER_LIST_SUCCESS, payload: users });
    } catch (error) {
      dispatch({
        type: USER_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  } catch (error) {
    dispatch({
      type: USER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

 export const register = (name, emailOrPhone, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      "https://voixbdd.onrender.com/api/users/register",
      { name, emailOrPhone, password },
      config
    );

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });

    // Stocker automatiquement le citoyen connecté après inscription
    localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem("token", data.token);
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};