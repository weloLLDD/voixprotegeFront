import {
  REPORT_REQUEST,
  REPORT_SUCCESS,
  REPORT_FAIL,
} from "../constants/reportConstants";

const initialState = { loading: false, data: [] };

export const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case "REPORT_REQUEST":
      return { ...state, loading: true };
    case "REPORT_SUCCESS":
      return { loading: false, data: action.payload };
    case "REPORT_FAIL":
      return { loading: false, error: action.payload, data: [] };
    default:
      return state;
  }
};
