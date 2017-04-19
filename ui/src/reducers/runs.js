import { RUNS_STORED } from '../actions/runs';

export default (state = [], action) => {
  switch (action.type) {
    case RUNS_STORED:
      return action.runs.sort().reverse();
    default:
      return state;
  }
};
