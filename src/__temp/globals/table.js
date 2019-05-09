import styled from 'styled-components';
import { FlexRow, FlexCol } from './globals';

export const TableHead = styled(FlexRow)`
  flex: 0 0 auto;
  height: 46px;
  color: black;
  border-bottom: 1px solid #ccc;
  padding: 0 5px;
  font-size: 12px;
`;

export const HeadRowItem = styled(FlexRow)`
  flex: ${({ flex }) => flex};
  text-transform: uppercase;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

export const TableBody = styled(FlexCol)`
  flex: 1 1 auto;
  overflow-x: auto;
  padding: 0 5px;
`;

export const TableRow = styled(FlexRow)`
  flex: 0 0 auto;
  border-bottom: 1px solid #eee;
  &:hover {
    background: ${({ selectable }) => selectable && '#4286f4'};
    color: ${({ selectable }) => selectable && 'white'};
  }
`;

export const TableRowItem = styled.div`
  display: flex;
  flex: ${({ flex }) => flex};
  height: 46px;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10px;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  background: ${({ checked }) => (checked ? 'rgba(66,134,244,0.1)' : null)};
  cursor: ${({ cursor }) => (cursor ? cursor : 'default')};
`;
