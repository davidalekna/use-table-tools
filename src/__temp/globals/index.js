import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { FlexCol } from './globals';

// Globals folder mostly contains styles

const RootView = styled(FlexCol)`
  position: relative;
  overflow: none;
  width: 100vw;
  height: 100%;
`;

export const View = ({ children }) => (
  <ThemeProvider theme={{}}>
    <RootView>{children}</RootView>
  </ThemeProvider>
);

const RootGrid = styled.section`
  display: grid;
  align-content: flex-start;
  overflow-x: auto;
  grid-gap: 15px;
  padding: 15px;
  height: 100%;
  grid-template-columns: repeat(auto-fill, minmax(260px, auto));
`;

export const Grid = ({ children }) => <RootGrid>{children}</RootGrid>;

export * from './globals';
export * from './table';
export * from './grid';
