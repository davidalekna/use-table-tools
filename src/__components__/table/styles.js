import styled from 'styled-components';
import { FlexRow, FlexCol } from '../globals';

export const TableHead = styled(FlexRow)`
  flex: 0 0 auto;
  height: 46px;
  color: black;
  border-bottom: 1px solid #ccc;
  padding: 0 5px;
  font-size: 12px;
  user-select: none;
`;

export const HeadRowItem = styled(FlexRow)`
  flex: ${({ flex }) => flex};
  text-transform: uppercase;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;
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

export const Table = styled(FlexCol)`
  position: relative;
  overflow: none;
  height: 100%;
  width: 100%;
`;

export const FixedTableHead = styled(FlexRow)`
  flex: 0 0 auto;
  background: white;
  color: ${({ theme }) => theme.colours.neutral['800']};
  border-bottom: 2px solid ${({ theme }) => theme.colours.neutral['200']};
  /* padding: 0 5px; */
  font-size: 12px;
`;

export const Row = styled(FlexRow)`
  flex: 0 0 auto;
  background: white;
  border-bottom: 1px solid #f9f9f9;
  &:hover {
    background: ${({ selectable }) => selectable && '#f9f9f9'};
  }
`;

export const RowItem = styled.div`
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
  background: ${({ checked, theme }) =>
    checked ? 'rgba(66,134,244,0.1)' : null};
  cursor: ${({ cursor }) => (cursor ? cursor : 'default')};
`;

export const HeadCellMenuPopup = styled.ul`
  max-height: 230px;
  overflow-x: auto;
`;

export const TableFooter = styled.div`
  display: flex;
  justify-content: center;
  flex: 0 0 auto;
  background: white;
  padding: 10px;
  margin-bottom: 10px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

export const Placeholder = styled(FlexRow)`
  flex: 0 0 auto;
  width: ${({ w }) => (w ? `${w}px` : '20px')};
  height: 20px;
  background: #f2f2f2;
  border-radius: 4px;
  ${({ loading }) =>
    loading &&
    css`
      @keyframes move {
        0% {
          background-position: -268px 0;
        }
        100% {
          background-position: 268px 0;
        }
      }
      animation-duration: 1.2s;
      animation-fill-mode: forwards;
      animation-iteration-count: infinite;
      animation-name: move;
      animation-timing-function: linear;
      background: linear-gradient(0.35turn, #f2f2f2 8%, #ddd 18%, #f2f2f2 33%);
      background-size: 400px 20px;
      position: relative;
    `};
`;

export const FlexButton = styled.button`
  display: flex;
  flex: none;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-weight: 600;
  white-space: nowrap;
  word-break: keep-all;
  cursor: pointer;
  padding: 5px 10px;
  background-color: ${props =>
    props.active
      ? props.theme.colours.primary['900']
      : props.theme.colours.neutral['200']};
  color: ${({ theme, active }) =>
    active ? theme.colours.neutral['100'] : theme.colours.neutral['900']};
`;

export const CellWithMenu = styled.div`
  position: absolute;
  min-height: 120px;
  z-index: 10;
  outline: none;
  border: 1px dashed red;
  background: white;
  width: ${({ width }) => (width ? `${width}px` : '170px')};
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  top: ${({ top }) => (top ? `${top}px` : null)};
  right: ${({ right }) => (right ? `${right}px` : null)};
  left: ${({ left }) => (left ? `${left}px` : null)};
  ul {
    margin: 0;
    padding: 5px 0 5px 0;
  }
  ul > li {
    text-transform: capitalize;
    list-style: none;
    display: flex;
    align-items: center;
    height: 28px;
    padding: 18px 35px;
    font-size: 14px;
    color: #222;
    font-weight: 400;
    cursor: pointer;
    white-space: nowrap;
  }
  ul > li:hover {
    background: ${({ theme }) => theme.colours.primary['500']};
    color: white;
    transition: all 0.2s ease;
  }
  span {
    display: block;
    color: ${({ theme }) => theme.colours.neutral['900']};
    font-weight: 500;
    text-transform: uppercase;
    font-size: 11px;
    padding: 18px 35px 10px 35px;
  }
`;
