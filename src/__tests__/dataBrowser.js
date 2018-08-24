import 'react-testing-library/cleanup-after-each';
import React from 'react';
import { render } from 'react-testing-library';
import { getObjectPropertyByString } from '../utils';
import DataBrowser from '../';
import mockColumns from '../__mocks__/columns';
import mockData from '../__mocks__/data';

test('should return visibleColumns in shape of columnFlex', () => {
  const { columnFlex, visibleColumns } = setup({
    columnFlex: ['0 0 25%', '1 1 55%', '0 0 20%'],
  });
  expect(visibleColumns.length).toEqual(columnFlex.length);
});

test('switchViewType should switch to selected available view', () => {
  const handleStateChange = jest.fn();
  const { switchViewType } = setup({
    onStateChange: handleStateChange,
    viewsAvailable: ['LIST_VIEW', 'GRID_VIEW'],
  });
  const viewType = { viewType: 'GRID_VIEW' };
  switchViewType(viewType);
  const changes = {
    type: '__switch_view__',
    ...viewType,
  };
  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ viewType: changes.viewType }),
  );
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
    expect.objectContaining({ visibleColumns: changes.visibleColumns }),
  );
});

test('checkboxState should check if checbox on or off', () => {
  const { checkboxState } = setup({
    checked: [1, 2, 3, 4],
  });
  const result_1 = checkboxState(2);
  expect(result_1).toBeTruthy();
  const result_2 = checkboxState(7);
  expect(result_2).toBeFalsy();
  const result_3 = checkboxState(4);
  expect(result_3).toBeTruthy();
  const result_4 = checkboxState(15);
  expect(result_4).toBeFalsy();
  const result_5 = checkboxState(1);
  expect(result_5).toBeTruthy();
  const result_6 = checkboxState(true);
  expect(result_6).toBeFalsy();
});

test('offsetColumns should get all columns except isLocked property with offset prop', () => {
  const { offsetColumns } = setup();
  const columns = offsetColumns();
  console.log(columns);
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
