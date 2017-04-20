import { get } from 'axios';
import isEmpty from 'lodash/isEmpty';
import { runsUrl, runUrl } from '../endpoints';

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

export const RUN_STORED = 'GRAPHCI/RUN_STORED';
const runStored = (runId, run) => ({
  type: RUN_STORED,
  runId,
  run,
});

export const getRun = (runId) => (dispatch) => (
  get(runUrl(runId))
    .then(handleResponse)
    .then((run) => {
      dispatch(runStored(runId, run));
    })
);
