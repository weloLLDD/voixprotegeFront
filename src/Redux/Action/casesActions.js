import axios from "axios";
import { CASES_REQUEST, CASES_SUCCESS, CASES_FAIL, CASE_LIST_MY_REQUEST, CASE_LIST_MY_SUCCESS, CASE_LIST_MY_FAIL, CASE_LIST_REQUEST, CASE_LIST_SUCCESS, CASE_LIST_FAIL, CASE_CREATE_REQUEST, CASE_CREATE_SUCCESS, CASE_CREATE_FAIL, CASE_EVOLUTION_REQUEST, CASE_EVOLUTION_SUCCESS, CASE_EVOLUTION_FAIL, CASES_LIST_REQUEST, CASES_LIST_SUCCESS, CASES_LIST_FAIL, CASE_LIST_ALL_REQUEST, CASE_LIST_ALL_SUCCESS, CASE_LIST_ALL_FAIL } from "../constants/casesConstants";

export const listCases = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CASES_REQUEST });

    // Selon ton store, le user est dans userLogin.userInfo 
      const { userInfo } = getState().userLogin; // <-- ici

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("https://voixprotegebdd.onrender.com/api/case", config);

    dispatch({
      type: CASES_SUCCESS,
      payload: data, // data devrait être un tableau de cases
    });
  } catch (error) {
    dispatch({
      type: CASES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Action pour lister les cas assignés à l’agent connecté
export const listMyCases = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CASE_LIST_MY_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Récupérer uniquement les cas assignés à cet agent
    const { data } = await axios.get(`https://voixprotegebdd.onrender.com/api/case/mescas`, config);

    dispatch({
      type: CASE_LIST_MY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CASE_LIST_MY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

 // ===== Créer un dossier
export const createCase = (formData) => async (dispatch) => {
  try {
    dispatch({ type: CASE_CREATE_REQUEST });

    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post("https://voixprotegebdd.onrender.com/api/case", formData, config);

    dispatch({ type: CASE_CREATE_SUCCESS, payload: data.case });
  } catch (error) {
    dispatch({
      type: CASE_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};



// get evolution
export const getCaseEvolution = (caseId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CASE_EVOLUTION_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get(`https://voixprotegebdd.onrender.com/api/case/${caseId}`, config);

    dispatch({ type: CASE_EVOLUTION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CASE_EVOLUTION_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

 
// Ajouter une évolution
 export const addCaseEvolution = (caseId, evolutionData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CASE_EVOLUTION_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `https://voixprotegebdd.onrender.com/api/case/${caseId}/evolution`,
      evolutionData,
      config
    );

    dispatch({ type: CASE_EVOLUTION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CASE_EVOLUTION_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


 // List all cases (admin)
export const listAllCases = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CASE_LIST_ALL_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.get("https://voixprotegebdd.onrender.com/api/case/all", config);

    dispatch({ type: CASE_LIST_ALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CASE_LIST_ALL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
 