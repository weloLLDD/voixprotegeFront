import { DOCUMENT_CONSULT_FAIL, DOCUMENT_CONSULT_REQUEST, DOCUMENT_CONSULT_SUCCESS } from "../constants/documentConsultation";

 

export const documentConsultReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCUMENT_CONSULT_REQUEST:
      return { loading: true };
    case DOCUMENT_CONSULT_SUCCESS:
      return { loading: false, success: true, document: action.payload };
    case DOCUMENT_CONSULT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
