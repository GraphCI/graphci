import React, { Component } from 'react';
import cytoscape from 'cytoscape';

const cyStyle = {
  height: '100%',
  width: '100%',
  position: 'absolute',
  left: '0',
  top: '64',
};

class Cytoscape extends Component {
  constructor(props) {
    super(props);

    this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
  }

  renderCytoscapeElement() {
    this.cy = cytoscape(
      {
        container: document.getElementById('cy'),

        boxSelectionEnabled: false,
        autounselectify: true,

        style: cytoscape.stylesheet()
          .selector('node')
            .css({
              height: 80,
              width: 80,
              'background-fit': 'cover',
              'border-color': '#000',
              'border-width': 3,
              'border-opacity': 0.5,
              content: 'data(id)',
              'text-valign': 'center',
            })
          .selector('.passed')
            .css({
              'background-color': 'green',
            })
          .selector('.failed')
            .css({
              'background-color': 'red',
            })
          .selector('edge')
            .css({
              width: 6,
              'target-arrow-shape': 'triangle',
              'line-color': '#ffaaaa',
              'target-arrow-color': '#ffaaaa',
              'curve-style': 'bezier',
            }),
        elements: this.props.elements,
        layout: {
          name: 'breadthfirst',
          directed: true,
          padding: 10,
        },
      });

    if (this.props.onTap) {
      this.cy.on('tap', 'node', (evt) => {
        const node = evt.target.id();
        setTimeout(() => this.props.onTap(node), 0);
      });
    }

    this.cy.minZoom(this.cy.zoom() - 0.5);
    this.cy.maxZoom(this.cy.zoom() + 1);
  }

  componentDidMount() {
    this.renderCytoscapeElement();
  }

  render() {
    return (
      <div className="node_selected">
        <div style={cyStyle} id="cy"/>
      </div>
    );
  }
}

export default Cytoscape;
