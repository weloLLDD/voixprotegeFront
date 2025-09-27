import { CASES_REQUEST, CASES_SUCCESS, CASES_FAIL, CASE_LIST_MY_REQUEST, CASE_LIST_MY_SUCCESS, CASE_LIST_MY_FAIL, CASE_LIST_REQUEST, CASE_LIST_SUCCESS, CASE_LIST_FAIL, CASE_CREATE_REQUEST, CASE_CREATE_SUCCESS, CASE_CREATE_FAIL, CASE_RESET, CASE_EVOLUTION_REQUEST, CASE_EVOLUTION_SUCCESS, CASE_EVOLUTION_FAIL, CASE_EVOLUTION_RESET, CASES_LIST_REQUEST, CASES_LIST_SUCCESS, CASES_LIST_FAIL, CASE_LIST_ALL_REQUEST, CASE_LIST_ALL_SUCCESS, CASE_LIST_ALL_FAIL } from "../constants/casesConstants";

const initialState = {
  list: [],      // Liste des signalements
    myCases: [],
  loading: false,
  error: null,
};

export const casesReducer = (state = initialState, action) => {
  switch (action.type) {
    case CASES_REQUEST:
      return { ...state, loading: true, error: null };
    case CASES_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case CASES_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};



 
export const caseCreateReducer = (state = initialState, action) => {
  switch (action.type) {
    case CASE_CREATE_REQUEST:
      return { ...state, loading: true };
    case CASE_CREATE_SUCCESS:
      return { ...state, loading: false, success: true, myCases: [action.payload, ...state.myCases] };
    case CASE_CREATE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CASE_RESET:
      return initialState;
    default:
      return state;
  }
};

  
export const caseEvolutionReducer = (state = { case: { evolution: [] } }, action) => {
  switch (action.type) {
    case CASE_EVOLUTION_REQUEST:
      return { ...state, loading: true };
    case CASE_EVOLUTION_SUCCESS:
      return { loading: false, success: true, case: action.payload };
    case CASE_EVOLUTION_FAIL:
      return { loading: false, error: action.payload, case: { evolution: [] } };
    case CASE_EVOLUTION_RESET:
      return { case: { evolution: [] } };
    default:
      return state;
  }
}

// Reducer pour la liste des cas
export const caseListReducer = (state = { cases: [] }, action) => {
  switch (action.type) {
    case CASES_LIST_REQUEST:
      return { loading: true, cases: [] };
    case CASES_LIST_SUCCESS:
      return { loading: false, cases: action.payload };
    case CASES_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Récupérer les cas assignés à l’agent connecté
export const caseListMyReducer = (state = { cases: [] }, action) => {
  switch (action.type) {
    case CASE_LIST_MY_REQUEST:
      return { loading: true, cases: [] };
    case CASE_LIST_MY_SUCCESS:
      return { loading: false, cases: action.payload };
    case CASE_LIST_MY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Liste globale des cas (admin)
export const caseListAllReducer = (state = { cases: [] }, action) => {
  switch (action.type) {
    case CASE_LIST_ALL_REQUEST:
      return { loading: true, cases: [] };
    case CASE_LIST_ALL_SUCCESS:
      return { loading: false, cases: action.payload };
    case CASE_LIST_ALL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};