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

test('switchColumns should switch column accordingly', () => {
  const handleStateChange = jest.fn();
  const { switchColumns } = setup({ onStateChange: handleStateChange });
  switchColumns({ from: 'name', to: 'body' });
  const changes = {
    type: '__switch_columns__',
    visibleColumns: [
      { label: 'item id', sortField: 'id', isLocked: true },
      { label: 'post id', sortField: 'postId' },
      { label: 'body', sortField: 'body' },
      { label: 'email', sortField: 'email' },
    ],
  };
  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({}),
  );
});

function setup({
  render: renderFn = () => <div />,
  columns = mockColumns,
  ...props
} = {}) {
  let renderArg;
  const childrenSpy = jest.fn(controllerArg => {
    renderArg = controllerArg;
    return renderFn(controllerArg);
  });
  const utils = render(
    <DataBrowser columns={columns} {...props}>
      {childrenSpy}
    </DataBrowser>,
  );
  return { childrenSpy, ...utils, ...renderArg };
}
