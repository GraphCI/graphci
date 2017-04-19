import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { getAllRuns } from '../actions/runs';
import Runlist from './RunList';

export class RunsWrapperView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  componentWillMount() {
    const { dispatchGetAllRuns } = this.props;

    dispatchGetAllRuns().then(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    return (
      this.state.loading
        ? <p>Data is loading...</p>
        : (<Route exact path="/web/runs" component={Runlist} />)
    );
  }
}

export default connect(undefined, {
  dispatchGetAllRuns: getAllRuns,
})(RunsWrapperView);
