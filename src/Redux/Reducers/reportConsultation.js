import { REPORT_CONSULTATION_FAIL, REPORT_CONSULTATION_REQUEST, REPORT_CONSULTATION_SUCCESS } from "../constants/reportConsultation";




export const consultationReportReducer = (state = { report: [] }, action) => {
  switch (action.type) {
    case REPORT_CONSULTATION_REQUEST:
      return { loading: true };
    case REPORT_CONSULTATION_SUCCESS:
      return { loading: false, report: action.payload };
    case REPORT_CONSULTATION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

