import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactModal from 'react-modal';
import uniq from 'lodash/uniq';
import axios from 'axios';
import moment from 'moment';
import reactAnsiStyle from 'react-ansi-style';
import Cytoscape from './Cytoscape';
import { nodeLogUrl } from '../endpoints';

require('react-ansi-style/inject-css');

const style = {
  overlay: {
    backgroundColor: 'darkgrey',
  },
  content: {
    color: 'black',
  },
};

const modalContent = {
  maxWidth: 800,
  margin: '0 auto',
  padding: 20,
};

const textStyle = {
  padding: 0,
  margin: 0,
  fontFamily: 'monospace',
};

const header = {
  textAlign: 'center',
  fontWeight: 700,
  fontSize: '2em',
};

const duration = {
  textAlign: 'center',
  fontWeight: 300,
  fontSize: '1em',
  fontColor: 'darkgrey',
  fontStyle: 'italic',
};

const logs = {
  paddingTop: 20,
  paddingBottom: 20,
};

class NodeLogViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { content: { logs: ['loading'] } };

    axios(nodeLogUrl(props.runId, props.node))
      .then((response) => response.data)
      .then((info) => {
        this.setState({ content: {
          ...info,
          logs: info.logs.trim().split(/[\r\n]+/),
        } });
      })
      .catch((e) => this.setState({ content: [e.message] }));
  }

  render() {
    const { isOpen, onClose } = this.props;

    const { name, started, finished } = this.state.content;

    return (
      <ReactModal
        isOpen={isOpen}
        style={style}
        ariaHideApp={true}
        onRequestClose={onClose}
      >
        <div style={modalContent}>
          <div style={header}>{name}</div>
          <div style={duration}>{moment(finished).from(started, true)}</div>
          <div style={logs}>
          {
            this.state.content.logs.map((line, i) => (
              <p key={i} style={textStyle}>
              {reactAnsiStyle(React, line)}
              </p>
            ))
          }
          </div>
        </div>
      </ReactModal>
    );
  }
}

class RunListView extends React.Component {
  constructor(props) {
    super(props);

    const { nodez } = this.props;

    this.state = nodez.reduce((state, node) => ({ ...state, [node]: false }), {});
  }

  showModal(node) {
    this.setState({ [node]: true });
  }

  close(node) {
    this.setState({ [node]: false });
  }

  render() {
    const { nodes, edges, nodez } = this.props;

    return (
      <div>
        <Link to={'/web/runs'} style={{ display: 'block' }}>Back to run list</Link>
        <Cytoscape elements={{ nodes, edges }} onTap={this.showModal.bind(this)} />
        {
          nodez.map((node) => (
            <NodeLogViewer
              runId={this.props.runId}
              key={node}
              node={node}
              isOpen={this.state[node]}
              onClose={() => this.close(node)}
            />
          ))
        }
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
    runId: ownProps.runId,
    run,
    nodes,
    edges,
    nodez: uniq(allNodes),
  };
})(RunListView);
