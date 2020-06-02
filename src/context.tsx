import React, { createContext, ReactElement, useContext } from 'react';
import {
  TableToolsReturnProps,
  TableToolsProps,
  useTableTools,
  ReducerProps,
  TableToolsState,
  Action,
} from './tableTools';

const TableToolsContext = createContext<TableToolsReturnProps>({
  currentLayout: [],
  visibleColumns: [],
  totalItems: 0,
  columns: [],
  checkedItems: [],
  selectAllCheckboxState: 'none',
  currentSort: { direction: 'asc', fieldKey: '' },
  lastChecked: null,
  switchColumns: () => {},
  switchCurrentLayout: () => {},
  offsetColumns: () => [],
  onSelection: () => {},
  deselectAll: () => {},
  selectAll: () => {},
  checkboxToggle: () => {},
  checkboxShiftToggle: () => {},
  checkboxState: () => false,
  clientSortMethod: () => 0,
  changeSortDirection: () => {},
  toggleSortDirection: () => {},
  toggleSortByKey: () => {},
  sortData: () => {},
  activeSort: () => false,
  activeSortKey: () => false,
  getCheckboxProps: () => {},
});

type RenderProps = (_: TableToolsReturnProps) => ReactElement;
interface TableProps extends TableToolsProps {
  children: RenderProps | ReactElement;
  stateReducer?: ReducerProps<TableToolsState, Action>;
}
export const TableTools = ({ children, stateReducer, ...rest }: TableProps) => {
  const utils = useTableTools(rest, stateReducer);
  const ui = typeof children === 'function' ? children(utils) : children;
  return (
    <TableToolsContext.Provider value={utils}>{ui}</TableToolsContext.Provider>
  );
};

export const useTableToolsContext = () => {
  const utils = useContext(TableToolsContext);
  return utils;
};
