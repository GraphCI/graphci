import React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import Cytoscape from './Cytoscape';

const Logs = ({ contents, isOpen, onClose }) => (
  <ReactModal
     isOpen={isOpen}
     style={{
       overlay: {
         backgroundColor: 'darkgrey',
       },
       content: {
         color: 'lightsteelblue',
       },
     }}
     ariaHideApp={true}
     onRequestClose={onClose}
     shouldCloseOnOverlayClick={true}
  >
    <p>{contents}</p>
  </ReactModal>
);

class RunListView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  showModal(node) {
    this.setState({ isOpen: true });
  }

  close(node) {
    this.setState({ isOpen: false });
  }

  render() {
    const { nodes, edges } = this.props;
    return (
      <div>
        <Cytoscape elements={{ nodes, edges }} onTap={this.showModal.bind(this)} />
        <Logs
          contents="/api/v1/run/1492959044135"
          isOpen={this.state.isOpen}
          onClose={() => this.close('modal')}
        />
      </div>
    );
  }
}

export default connect((state, ownProps) => {
  const run = state.runs.details[ownProps.runId];
  const edges = run.edges.map((p) => ({
    data: {
      source: p[0],
      target: p[1],
    },
  }));

  const allNodes = run.edges.reduce(((t, p) => t.concat(p[0], p[1])), []);
  const nodes = allNodes.map((key) => ({
    data: {
      id: key,
    },
    classes: (run.stages[key] && run.stages[key].result) || 'unknown',
  }));

  return {
    run,
    nodes,
    edges,
  };
})(RunListView);
