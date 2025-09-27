import {
  DOCUMENTS_CREATE_FAIL,
  DOCUMENTS_CREATE_REQUEST,
  DOCUMENTS_CREATE_RESET,
  DOCUMENTS_CREATE_SUCCESS,
  DOCUMENTS_DELETE_FAIL,
  DOCUMENTS_DELETE_REQUEST,
  DOCUMENTS_DELETE_SUCCESS,
  DOCUMENTS_EDIT_FAIL,
  DOCUMENTS_EDIT_REQUEST,
  DOCUMENTS_EDIT_SUCCESS,
  DOCUMENTS_LIST_FAIL,
  DOCUMENTS_LIST_REQUEST,
  DOCUMENTS_LIST_SUCCESS,
  DOCUMENTS_UPDATE_FAIL,
  DOCUMENTS_UPDATE_REQUEST,
  DOCUMENTS_UPDATE_RESET,
  DOCUMENTS_UPDATE_SUCCESS,
} from "../constants/DocumentConstant";

 
// LIST DOCUMENTS avec pagination
export const documentListReducer = (state = { documents: [], page: 1, pages: 1, totalDocuments: 0 }, action) => {
  switch (action.type) {
    case DOCUMENTS_LIST_REQUEST:
      return { ...state, loading: true };
    case DOCUMENTS_LIST_SUCCESS:
      return {
        loading: false,
        documents: action.payload.documents, // documents de la page actuelle
        page: action.payload.page,           // page actuelle
        pages: action.payload.pages,         // nombre total de pages
        totalDocuments: action.payload.totalDocuments, // nombre total de documents
      };
    case DOCUMENTS_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


// DELETE DOCUMENT
export const documentDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCUMENTS_DELETE_REQUEST:
      return { loading: true };
    case DOCUMENTS_DELETE_SUCCESS:
      return { loading: false, success: true };
    case DOCUMENTS_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case "DOCUMENTS_DELETE_RESET": // ✅ reset optionnel pour vider le success
      return {};
    default:
      return state;
  }
};

// CREATE DOCUMENT
export const documentCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCUMENTS_CREATE_REQUEST:
      return { ...state, loading: true };
    case DOCUMENTS_CREATE_SUCCESS:
      return { loading: false, success: true, document: action.payload };
    case DOCUMENTS_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case DOCUMENTS_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

// EDIT DOCUMENT
export const documentEditReducer = (state = { document: {} }, action) => {
  switch (action.type) {
    case DOCUMENTS_EDIT_REQUEST:
      return { ...state, loading: true };
    case DOCUMENTS_EDIT_SUCCESS:
      return { loading: false, document: action.payload };
    case DOCUMENTS_EDIT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// UPDATE DOCUMENT
export const documentUpdateReducer = (state = { document: {} }, action) => {
  switch (action.type) {
    case DOCUMENTS_UPDATE_REQUEST:
      return { ...state, loading: true };
    case DOCUMENTS_UPDATE_SUCCESS:
      return { loading: false, success: true, document: action.payload };
    case DOCUMENTS_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case DOCUMENTS_UPDATE_RESET:
      return { document: {} };
    default:
      return state;
  }
};
