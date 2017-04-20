import React from 'react';
import { connect } from 'react-redux';
import { getRun } from '../actions/runs';
import Run from './Run';

export class RunWrapperView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  componentWillMount() {
    const { dispatchGetRun, runId } = this.props;

    dispatchGetRun(runId).then(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { runId } = this.props;
    return (
      this.state.loading
        ? <p>Data is loading...</p>
        : <Run runId={runId} />
    );
  }
}

export default connect((state, ownProps) => ({
  runId: ownProps.match.params.runId,
}), {
  dispatchGetRun: getRun,
})(RunWrapperView);
