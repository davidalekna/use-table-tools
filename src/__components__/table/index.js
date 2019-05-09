import React from 'react';
import styled from 'styled-components';

export * from './styles';

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

export const ItemOptionsMenu = ({ onClick }) => (
  <CellWithMenu top={34} right={1}>
    <div style={{ borderBottom: '1px solid #ddd' }}>
      <ul onClick={onClick}>
        <li>Edit</li>
        <li>Email User</li>
        <li>Activity Log</li>
        <li>Clinics</li>
        <li>Delete</li>
      </ul>
    </div>
  </CellWithMenu>
);

export const Label = styled.div`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 5px;
  margin-right: 10px;
  border-radius: 2px;
  color: white;
  background: ${({ color }) => (color ? color : '#ccc')};
`;
