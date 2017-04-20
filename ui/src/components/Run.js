import React from 'react';
import { connect } from 'react-redux';
import Cytoscape from './Cytoscape';

const RunListView = ({ nodes, edges }) => (
  <Cytoscape elements={{ nodes, edges }} />
);

export default connect((state, ownProps) => {
  const run = state.runs.details[ownProps.runId];
  const edges = run.edges.map((p) => ({ data: { source: p[0], target: p[1] } }));

  const allNodes = run.edges.reduce(((t, p) => t.concat(p[0], p[1])), []);
  const nodes = allNodes.map((key) => ({ data: { id: key } }));

  return {
    run,
    nodes,
    edges,
  };
})(RunListView);
