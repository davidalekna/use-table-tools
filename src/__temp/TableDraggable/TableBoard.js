import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { TableBody } from '../globals';

class TableBoard extends React.Component {
  render() {
    return <TableBody>{this.props.children}</TableBody>;
  }
}

export default DragDropContext(HTML5Backend)(TableBoard);
