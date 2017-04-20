import { RUNS_STORED, RUN_STORED } from '../actions/runs';

const initialState = {
  ids: [],
  details: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RUNS_STORED:
      return { ...state, ids: action.runs.sort().reverse() };
    case RUN_STORED:
      return { ...state, details: { ...state.details, [action.runId]: action.run } };
    default:
      return state;
  }
};
