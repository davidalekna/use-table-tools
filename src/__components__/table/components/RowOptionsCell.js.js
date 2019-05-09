import React from 'react';
import Downshift from 'downshift';
import { RowItem } from '../styles';
import HeadOptionsCellMenu from './HeadOptionsCellMenu';

export const RowOptionsCell = ({
  id,
  width,
  render = () => {},
  head,
  checked,
  rowMenu = () => {},
  row,
}) => {
  const getMenu = props =>
    head ? <HeadOptionsCellMenu {...props} /> : rowMenu({ row, ...props });
  return (
    <Downshift>
      {({ isOpen, toggleMenu }) => (
        <div style={{ flex: '0 0 auto', position: 'relative' }}>
          <RowItem style={{ width }} flex="0 0 auto" checked={checked}>
            {render({
              id: `row-options-cell-${id}`,
              isOpen,
              onClick: toggleMenu,
              'data-toggle': 'dropdown',
              'aria-haspopup': 'true',
              'aria-expanded': isOpen,
            })}
            {isOpen && getMenu({ onClick: toggleMenu })}
          </RowItem>
        </div>
      )}
    </Downshift>
  );
};
