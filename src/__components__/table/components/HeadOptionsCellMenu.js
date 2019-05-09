import React from 'react';
import { withDataBrowser } from '../../../index';
import { CellWithMenu } from '../styles';
import { FlexRow, FlexCol } from '../../globals';
import { FlexButton } from '../styles';

const SwitchViewButtons = ({
  columnFlex,
  replaceColumnFlex,
  availableColumnFlex,
}) => (
  <FlexRow>
    {availableColumnFlex.map((colFlex, index) => (
      <FlexButton
        key={index}
        style={{ marginLeft: 5 }}
        active={columnFlex.toString() === colFlex.toString()}
        onClick={() =>
          replaceColumnFlex({
            columnFlex: colFlex,
          })
        }
      >
        {colFlex.length}
      </FlexButton>
    ))}
  </FlexRow>
);

const HeadOptionsCellMenu = ({
  onClick,
  dataBrowser: {
    columnFlex,
    replaceColumnFlex,
    switchViewType,
    viewType,
    availableColumnFlex,
  },
}) => (
  <CellWithMenu top={34} right={1}>
    <div style={{ borderBottom: '1px solid #ddd' }}>
      {availableColumnFlex && (
        <FlexCol>
          <span>Shown Columns</span>
          <FlexRow style={{ justifyContent: 'center' }}>
            <SwitchViewButtons
              {...{
                columnFlex,
                replaceColumnFlex,
                availableColumnFlex,
              }}
            />
          </FlexRow>
        </FlexCol>
      )}
      <span>Switch View</span>
      <ul onClick={onClick}>
        <li onClick={() => switchViewType({ viewType: 'LIST_VIEW' })}>
          {viewType === 'LIST_VIEW' && '★ '}
          show list
        </li>
        <li onClick={() => switchViewType({ viewType: 'GRID_VIEW' })}>
          {viewType === 'GRID_VIEW' && '★ '}
          show grid
        </li>
      </ul>
    </div>
  </CellWithMenu>
);

export default withDataBrowser(HeadOptionsCellMenu);
