import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const RunOverview = ({ run }) => (
  <Link to={`/web/runs/${run}`}>
    <span> RunId: {run}</span>
    <span> Date: {moment(run).format('dddd DD of MMMM, YYYY  @ HH:MM (Z)')}</span>
    <span> Started: {moment(run).fromNow()}</span>
  </Link>
);

const RunListView = ({ runs }) => (
  <div>
    {runs.map((run) => (<RunOverview key={run} run={Number(run)} />))}
  </div>
);

export default connect((state) => ({
  runs: state.runs,
}))(RunListView);
