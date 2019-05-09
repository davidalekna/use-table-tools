import React from 'react';
import Downshift from 'downshift';
import { HeadRowItem } from '../styles';
import HeadCellMenu from './HeadCellMenu';

export const HeadCell = ({ style, render, selected, flex }) => (
  <Downshift>
    {({ isOpen, toggleMenu }) => (
      <div style={{ flex, ...style }}>
        <HeadRowItem>
          {render({
            id: `head-cell-${selected && selected.sortField}`,
            onClick: toggleMenu,
            'data-toggle': 'dropdown',
            'aria-haspopup': 'true',
            'aria-expanded': isOpen,
            style: {
              cursor: 'pointer',
              color: isOpen && 'black',
            },
          })}
          {isOpen && (
            <HeadCellMenu selected={selected} toggleMenu={toggleMenu} />
          )}
        </HeadRowItem>
      </div>
    )}
  </Downshift>
);
