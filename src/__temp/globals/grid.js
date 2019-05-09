import styled from 'styled-components';

export const GridItem = styled.div`
  position: relative;
  height: 260px;
  background: ${({ checked }) => (checked ? 'rgba(66,134,244,0.5)' : '#eee')};
  padding: 10px;
  color: black;
  user-select: none;
`;

export const Image = styled.img`
  width: 100%;
  height: auto;
  max-height: 150px;
`;
