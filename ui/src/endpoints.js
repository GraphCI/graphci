const apiBase = 'https://qagia23cyk.execute-api.ap-southeast-2.amazonaws.com/Prod/';

export const runsUrl = () => `${apiBase}/api/v1/runs`;
export const runUrl = (runId) => `${apiBase}/api/v1/run/${runId}`;
export const nodeLogUrl = (runId, node) => `${apiBase}/api/v1/run/${runId}/${node}`;
