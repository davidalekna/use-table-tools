import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Grid } from '../globals';

class GridBoard extends React.Component {
  render() {
    return <Grid>{this.props.children}</Grid>;
  }
}

export default DragDropContext(HTML5Backend)(GridBoard);
