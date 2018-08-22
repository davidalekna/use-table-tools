import 'react-testing-library/cleanup-after-each';
import React from 'react';
import { render } from 'react-testing-library';
import { getObjectPropertyByString } from '../utils';
import DataBrowser from '../';
import mockColumns from '../__mocks__/columns';
import mockData from '../__mocks__/data';

// selected,
// data,
// viewType,
// switchViewType,
// viewsAvailable,
// selectAllCheckboxState,
// currentSort,
// checked,
// switchColumns,
// checkboxState,
// offsetColumns,
// checkboxToggle,
// onSelection,
// changeSortDirection,
// defaultSortMethod,
// sortData,
// activeSort,

test('should return visibleColumns in shape of columnFlex', () => {
  const { columnFlex, visibleColumns } = setup({
    columnFlex: ['0 0 25%', '1 1 55%', '0 0 20%'],
  });
  expect(visibleColumns.length).toEqual(columnFlex.length);
});

test('should replace existing column with selected offset column', () => {
  const handleStateChange = jest.fn();
  const props = setup();
});

function setup({
  render: renderFn = () => <div />,
  data = mockData,
  columns = mockColumns,
  ...props
} = {}) {
  let renderArg;
  const childrenSpy = jest.fn(controllerArg => {
    renderArg = controllerArg;
    return renderFn(controllerArg);
  });
  const utils = render(
    <DataBrowser data={data} columns={columns} {...props}>
      {childrenSpy}
    </DataBrowser>,
  );
  return { childrenSpy, ...utils, ...renderArg };
}
