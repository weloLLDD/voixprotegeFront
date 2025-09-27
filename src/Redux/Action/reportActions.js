import axios from "axios";
import {
  REPORT_REQUEST,
  REPORT_SUCCESS,
  REPORT_FAIL,
} from "../constants/reportConstants";

export const downloadMonthlyReport = (month) => async (dispatch, getState) => {
  try {
    dispatch({ type: REPORT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      responseType: "blob", // important
    };

    const { data } = await axios.get(`/api/orders/report/${month}`, config);

    // Créer un blob et déclencher le téléchargement
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `rapport_ventes_${month}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    dispatch({ type: REPORT_SUCCESS });
  } catch (error) {
    dispatch({
      type: REPORT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
