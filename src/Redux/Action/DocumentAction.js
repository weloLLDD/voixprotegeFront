import axios from "axios";
import { logout } from "./userActions";
import {
  DOCUMENTS_CREATE_FAIL,
  DOCUMENTS_CREATE_REQUEST,
  DOCUMENTS_CREATE_SUCCESS,
  DOCUMENTS_DELETE_FAIL,
  DOCUMENTS_DELETE_REQUEST,
  DOCUMENTS_DELETE_SUCCESS,
  DOCUMENTS_LIST_FAIL,
  DOCUMENTS_LIST_REQUEST,
  DOCUMENTS_LIST_SUCCESS,
} from "../constants/DocumentConstant";
import { DOCUMENT_CONSULT_FAIL, DOCUMENT_CONSULT_REQUEST, DOCUMENT_CONSULT_SUCCESS } from "../constants/documentConsultation";

 

// 🔹 Liste des documents avec pagination, filtres et recherche
export const listDocument = (
  page = 1,
  pageSize = 6,
  type = "Tous",
  year = "",
  searchTerm = "" // <- correspond au backend
) => async (dispatch, getState) => {
  try {
    dispatch({ type: DOCUMENTS_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // 🔹 Requête GET avec query params correctement nommés
    const { data } = await axios.get(
      `/api/documents?page=${page}&pageSize=${pageSize}&type=${type}&year=${year}&searchTerm=${searchTerm}`,
      config
    );

    dispatch({
      type: DOCUMENTS_LIST_SUCCESS,
      payload: data, // { documents, page, pages, totalDocuments }
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }

    dispatch({
      type: DOCUMENTS_LIST_FAIL,
      payload: message,
    });
  }
};




export const deleteDocument = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DOCUMENTS_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/documents/${id}`, config);

    dispatch({ type: DOCUMENTS_DELETE_SUCCESS });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: DOCUMENTS_DELETE_FAIL,
      payload: message,
    });
  }
};

 
// create
export const createDocument = (title, description, type, file) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: DOCUMENTS_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    // ⚡ FormData pour fichier PDF
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("file", file); // ⚡ doit correspondre à upload.single("file")

    const { data } = await axios.post(`/api/documents/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({
      type: DOCUMENTS_CREATE_SUCCESS,
      payload: data, // renvoie { message, document }
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }

    dispatch({
      type: DOCUMENTS_CREATE_FAIL,
      payload: message,
    });
  }
};


export const consultDocument = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DOCUMENT_CONSULT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/documents/${id}`, config);

    dispatch({
      type: DOCUMENT_CONSULT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DOCUMENT_CONSULT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};








