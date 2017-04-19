import { get } from 'axios';
import isEmpty from 'lodash/isEmpty';
import { runsUrl } from '../endpoints';

export const RUNS_STORED = 'GRAPHCI/RUNS_STORED';
const runsStored = (runs) => ({
  type: RUNS_STORED,
  runs,
});

const handleResponse = (response) => (isEmpty(response.data) ? [] : response.data);

export const getAllRuns = () => (dispatch) => (
  get(runsUrl())
    .then(handleResponse)
    .then((runs) => {
      dispatch(runsStored(runs));
    })
);
