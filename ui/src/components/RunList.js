import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const runStyle = {
  padding: 10,
};

const RunOverview = ({ run }) => (
  <Link to={`/web/run/${run}`} style={{ display: 'block' }}>
    <div style={runStyle}>
      <span>{moment(run).fromNow()}</span>
      <span> RunId: {run}</span>
      <span> Date: {moment(run).format('dddd DD of MMMM, YYYY  @ HH:mm (Z)')}</span>
    </div>
  </Link>
);

const list = {
  maxWidth: 800,
  margin: '0 auto',
};

const RunListView = ({ runs }) => (
  <div style={list}>
    {runs.map((run) => (<RunOverview key={run} run={Number(run)} />))}
  </div>
);

export default connect((state) => ({
  runs: state.runs.ids,
}))(RunListView);
