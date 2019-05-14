import 'react-testing-library/cleanup-after-each';
import * as React from 'react';
import { render } from 'react-testing-library';
import DataBrowser from '../';
import mockColumns from '../__mocks__/columns';

test('should return visibleColumns in shape of columnFlex', () => {
  const { columnFlex, visibleColumns } = renderDataBrowser({
    props: { initialColumnFlex: ['0 0 25%', '1 1 55%', '0 0 20%'] },
  });
  expect(visibleColumns.length).toEqual(columnFlex.length);
});

test('switchViewType should switch to selected available view', () => {
  const handleStateChange = jest.fn();
  const { switchViewType } = renderDataBrowser({
    props: {
      onStateChange: handleStateChange,
      viewsAvailable: ['LIST', 'GRID', 'LOADING'],
    },
  });
  // Includes view type
  const viewType = { viewType: 'GRID' };
  switchViewType(viewType);
  const changes = {
    type: DataBrowser.stateChangeTypes.switchView,
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
  const { switchColumns } = renderDataBrowser({
    props: { onStateChange: handleStateChange },
  });
  switchColumns({ from: 'name', to: 'body' });
  const changes = {
    type: DataBrowser.stateChangeTypes.switchColumns,
    visibleColumns: [
      { label: 'item id', sortField: 'id', isLocked: true },
      { label: 'post id', sortField: 'postId', visible: true },
      { label: 'body', sortField: 'body', visible: false },
      { label: 'email', sortField: 'email', visible: true },
    ],
  };
  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ visibleColumns: changes.visibleColumns }),
  );
});

test('replaceColumnFlex should replace columns with chosen set of cols', () => {
  const handleStateChange = jest.fn();
  const initialColumnFlex = [
    ['0 0 25%', '1 1 75%'],
    ['0 0 25%', '1 1 55%', '0 0 20%'],
    ['0 0 20%', '1 1 40%', '0 0 20%', '0 0 20%'],
  ];
  const {
    columnFlex,
    availableColumnFlex,
    replaceColumnFlex,
  } = renderDataBrowser({
    props: {
      initialColumnFlex: initialColumnFlex,
      onStateChange: handleStateChange,
    },
  });

  const selectedColFlex = availableColumnFlex[1];
  replaceColumnFlex({ columnFlex: selectedColFlex });

  const changes = {
    columnFlex: selectedColFlex,
    type: DataBrowser.stateChangeTypes.replaceColumnFlex,
    visibleColumns: [
      { label: 'item id', sortField: 'id', isLocked: true },
      { label: 'post id', sortField: 'postId', visible: true },
      { label: 'name', sortField: 'name', visible: true },
    ],
  };

  expect(columnFlex.toString()).toEqual(initialColumnFlex[0].toString());
  expect(availableColumnFlex.toString()).toEqual(initialColumnFlex.toString());
  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({
      visibleColumns: changes.visibleColumns,
    }),
  );
});

test('checkboxState should check if checbox on or off', () => {
  const { checkboxState } = renderDataBrowser({
    props: { checkedItems: [1, 2, 3, 4] },
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

test('checkboxState returns false if checkedItems not available', () => {
  const { checkboxState } = renderDataBrowser({
    props: { checkedItems: undefined },
  });
  const result = checkboxState(2);
  expect(result).toBeFalsy();
});

test('offsetColumns should get all columns except with isLocked prop', () => {
  const { offsetColumns } = renderDataBrowser();
  const columns = offsetColumns();
  const result = columns
    .map(item => (item.isLocked && 'exist') || false)
    .includes('exist');
  expect(result).toEqual(false);
});

test('offsetColumns objects should contain prop visible', () => {
  const { offsetColumns } = renderDataBrowser();
  const columns = offsetColumns();
  const result = columns
    .map(item => Object.keys(item).includes('visible'))
    .includes(false);
  expect(result).toEqual(false);
});

test('offsetColumns state doesnt have visibleColumns', () => {
  // NOTE: not sure if it should return an empty array 🤔
  const { offsetColumns } = renderDataBrowser({
    props: {
      visibleColumns: null,
    },
  });
  const columns = offsetColumns();
  expect(columns).toEqual([]);
});

test('checkboxToggle select when unchecked', () => {
  const handleStateChange = jest.fn();
  const { checkboxToggle } = renderDataBrowser({
    props: {
      initialChecked: [0, 1, 2, 3, 4],
      totalItems: 6,
      onStateChange: handleStateChange,
    },
  });
  checkboxToggle({ rowId: 5 });
  const changes = {
    type: DataBrowser.stateChangeTypes.checkboxToggle,
    checkedItems: [0, 1, 2, 3, 4, 5],
  };
  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ checkedItems: [0, 1, 2, 3, 4, 5] }),
  );
});

test('checkboxToggle select when checkedItems', () => {
  const handleStateChange = jest.fn();
  const { checkboxToggle } = renderDataBrowser({
    props: {
      initialChecked: [0, 1, 2, 3, 4, 5],
      totalItems: 6,
      onStateChange: handleStateChange,
    },
  });
  checkboxToggle({ rowId: 5 });
  const changes = {
    type: DataBrowser.stateChangeTypes.checkboxToggle,
    selectAllCheckboxState: 'some',
    checkedItems: [0, 1, 2, 3, 4],
  };
  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ checkedItems: changes.checkedItems }),
  );
});

test('onSelection selectAllCheckboxState toggle', () => {
  const items = [0, 1, 2, 3, 4, 5];
  const handleStateChange = jest.fn();
  const { onSelection } = renderDataBrowser({
    props: {
      totalItems: items.length,
      onStateChange: handleStateChange,
    },
  });

  // All selected
  onSelection({ items });
  const changes = {
    type: DataBrowser.stateChangeTypes.selectAll,
    selectAllCheckboxState: 'all',
    checkedItems: items,
  };
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ checkedItems: changes.checkedItems }),
  );

  // None selected
  onSelection();
  const changes2 = {
    type: DataBrowser.stateChangeTypes.deselectAll,
    selectAllCheckboxState: 'none',
    checkedItems: [],
  };
  expect(handleStateChange).toHaveBeenCalledTimes(2);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes2,
    expect.objectContaining({ checkedItems: changes2.checkedItems }),
  );

  // Some selected
  // onSelection({ items: [1, 2, 3] });
  // const changes3 = {
  //   type: DataBrowser.stateChangeTypes.deselectAll,
  //   selectAllCheckboxState: 'some',
  //   checkedItems: [1, 2, 3],
  // };
  // expect(handleStateChange).toHaveBeenLastCalledWith(
  //   changes3,
  //   expect.objectContaining({ checkedItems: changes3.checkedItems }),
  // );
});

test('changeSortDirection', () => {
  const handleStateChange = jest.fn();
  const { changeSortDirection } = renderDataBrowser({
    props: {
      initialSort: { dir: 'asc', sortField: '_id' },
      onStateChange: handleStateChange,
    },
  });
  changeSortDirection({ dir: 'dsc' });
  const changes = {
    type: DataBrowser.stateChangeTypes.changeSortDirection,
    currentSort: {
      dir: 'dsc',
      sortField: '_id',
    },
  };
  expect(handleStateChange).toHaveBeenCalledTimes(1);
  expect(handleStateChange).toHaveBeenLastCalledWith(
    changes,
    expect.objectContaining({ currentSort: changes.currentSort }),
  );
});

test('defaultSortMethod', () => {});
test('sortData', () => {});
test('activeSort', () => {});

function renderDataBrowser({
  render: renderFn = args => <div />,
  columns = mockColumns,
  props,
}: any = {}): any {
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
