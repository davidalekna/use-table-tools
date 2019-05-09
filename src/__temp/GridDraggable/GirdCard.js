import React from 'react';
import { GridItem } from '../globals';
import { findDOMNode } from 'react-dom';
import { compose } from 'recompose';
import {
  DragSource,
  DropTarget,
  DropTargetMonitor,
  DropTargetConnector,
  DragSourceConnector,
  DragSourceMonitor,
} from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props, monitor = DropTargetMonitor, component) {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

class GirdCard extends React.Component {
  render() {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      children,
    } = this.props;
    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(
          <div
            style={{
              opacity: isDragging ? 0 : 1,
              cursor: 'move',
            }}
          >
            <GridItem>{children}</GridItem>
          </div>,
        ),
      )
    );
  }
}

export default compose(
  DragSource(
    'card',
    cardSource,
    (connect = DragSourceConnector, monitor = DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  ),
  DropTarget('card', cardTarget, (connect = DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget(),
  })),
)(GirdCard);
