 import axios from "axios";
import { 
  REPORT_CONSULTATION_FAIL, 
  REPORT_CONSULTATION_REQUEST, 
  REPORT_CONSULTATION_SUCCESS 
} from "../constants/reportConsultation";

// Action pour récupérer le rapport de consultation
export const getConsultationReport = () => async (dispatch, getState) => {
  try {
    dispatch({ type: REPORT_CONSULTATION_REQUEST });

    // On récupère l'utilisateur connecté dans le state Redux
    const {
      userLogin: { userInfo },
    } = getState();

    // Préparer les headers avec le token
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Appel backend avec le token
    const { data } = await axios.get(
      "/api/documents/rapport/consultations",
      config
    );

    dispatch({
      type: REPORT_CONSULTATION_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REPORT_CONSULTATION_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
