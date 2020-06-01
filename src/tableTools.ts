import { useReducer, useLayoutEffect, useCallback, ChangeEvent } from 'react';
import { useWindowSize } from './use-window-size';
import {
  getObjectValueByString,
  getOffsetColumns,
  callAllEventHandlers,
} from './utils';

// https://kentcdodds.com/blog/the-state-reducer-pattern-with-react-hooks

// TODO: get all table variations from azure devops table
// TODO: create pagination helpers
// TODO: comment all code really well

export type ColumnProps = {
  /** nice name for a sortKey that should show up on the table head */
  title: string;
  /** key to select value from your data item, can also be nested, split by dot */
  sortKey: string;
  /** identifies if the column should be locked and always visible */
  locked?: boolean;
  [key: string]: any;
};

export type SelectAllCheckboxStates = 'all' | 'none' | 'some';

export type SortProps = { direction: 'asc' | 'desc'; fieldKey: string };

export type TableToolsProps = {
  /** total items per page, required for the checkboxes to work */
  totalItems: number;
  /** column properties */
  columns: ColumnProps[];
  // currentLayout?: string[] | string[][] | any;
  clientSortBy?: SortProps;
  /** initialize checked items */
  checkedItems?: string[];
  /** layout of the table */
  layout?: { [key: number]: string[] } | string[];
};

export interface TableToolsState {
  /** current layout of the columns flex property */
  currentLayout: string[];
  /** currently visible columns */
  visibleColumns: ColumnProps[];
  /** total visible items, required for the checkboxes to work */
  totalItems: number;
  /** column properties */
  columns: ColumnProps[];
  /** checked items ids store */
  checkedItems: string[];
  /** master checkbox state */
  selectAllCheckboxState: SelectAllCheckboxStates;
  /** current table sort */
  currentSort: SortProps;
  /** last checked item  */
  lastChecked: { id: string; value: string } | null;
}

export interface TableToolsReturnProps extends TableToolsState {
  /** provide colums keys from `sortKey` to `sortKey` and they will get replaced */
  switchColumns: (from: string, to: string) => void;
  /** will switch current layout to the given one and will update visible and offset columns */
  switchCurrentLayout: (currentLayout: string[]) => void;
  /** shows offset columns with the ability to include visible ones as well */
  offsetColumns: (obj?: { includeVisible: boolean }) => ColumnProps[];
  /** actions on master checkbox selection */
  onSelection: (items: string[]) => void;
  /** clears the state of selected item ids */
  deselectAll: () => void;
  /** selects all items */
  selectAll: (checkedItems: string[]) => void;
  /** toggles checkbox by id */
  checkboxToggle: (evt: ChangeEvent<HTMLInputElement>) => void;
  /** toggles checkbox by id and selects/deselects a range when shift key is on */
  checkboxShiftToggle: (evt: ChangeEvent<HTMLInputElement>) => void;
  /** returns a boolean state for the checkbox by id */
  checkboxState: (id: string) => boolean;
  /** method to be used in a sort function, like ramda sort */
  clientSortMethod: (a: object, b: object) => number;
  /** change current sort direction by specifying  next direction */
  changeSortDirection: (direction: SortProps['direction']) => void;
  /** toggle current sort field direction */
  toggleSortDirection: () => void;
  /** toggle sort direction on a field key */
  toggleSortByKey: (fieldKey: string) => void;
  /** sorts data on provided sortField and direction props */
  sortData: (sortProps: SortProps) => void;
  /** checks the state of the current active sort by key and direction */
  activeSort: (sortProps: SortProps) => boolean;
  /** checks the state of the current active sort by key */
  activeSortKey: (key: string) => boolean;
  /** spread checkbox props on the checkbox input */
  getCheckboxProps: any;
}

export const actionTypes = {
  updateState: 'updateState',
  switchColumns: 'switchColumns',
  switchCurrentLayout: 'switchCurrentLayout',
  deselectAll: 'deselectAll',
  selectAll: 'selectAll',
  checkboxToggle: 'checkboxToggle',
  checkboxShiftToggle: 'checkboxShiftToggle',
  changeSortDirection: 'changeSortDirection',
  toggleSortDirection: 'toggleSortDirection',
  toggleSortByKey: 'toggleSortByKey',
  sortData: 'sortData',
};

export type Action = { type: string; payload?: any };
export type ReducerProps<S, A> = (prevState: S, action: A) => S;
export const tableToolsReducer: ReducerProps<TableToolsState, Action> = (
  state,
  action
) => {
  switch (action.type) {
    case actionTypes.updateState: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case actionTypes.switchColumns: {
      const { to, from } = action.payload;
      const { visibleColumns: columns } = state;
      const index = columns.findIndex((x) => x.sortKey === from);
      const visibleColumns = columns.filter((col) => col.sortKey !== from);
      const replacement = getOffsetColumns(
        state.visibleColumns,
        state.columns
      ).find(({ sortKey }) => sortKey === to);
      if (replacement) {
        visibleColumns.splice(index, 0, replacement);
      }
      return {
        ...state,
        visibleColumns,
      };
    }
    case actionTypes.switchCurrentLayout: {
      const { currentLayout } = action.payload;

      const visibleSortFields = state.visibleColumns
        .map(({ sortField }) => sortField)
        .reverse();

      return {
        ...state,
        currentLayout,
        visibleColumns: state.columns
          .sort((a, b) => {
            return (
              visibleSortFields.indexOf(b.sortKey) -
              visibleSortFields.indexOf(a.sortKey)
            );
          })
          .slice(0, currentLayout.length),
      };
    }
    case actionTypes.deselectAll: {
      return {
        ...state,
        selectAllCheckboxState: 'none',
        checkedItems: [],
      };
    }
    case actionTypes.selectAll: {
      const { items } = action.payload;
      return {
        ...state,
        checkedItems: items,
        selectAllCheckboxState:
          state.totalItems === items.length ? 'all' : 'some',
      };
    }
    case actionTypes.checkboxToggle: {
      const { id, value: rowId } = action.payload;
      const { checkedItems } = state;

      if (!checkedItems.includes(rowId)) {
        // checkedItems state does not include id
        const allCheckedItems = [...state.checkedItems, rowId];
        // checkedItems state includes id
        return {
          ...state,
          lastChecked: { id, value: rowId },
          checkedItems: allCheckedItems,
          selectAllCheckboxState:
            state.totalItems === allCheckedItems.length ? 'all' : 'some',
        };
      } else {
        // checkedItems state includes id
        const allCheckedItems = checkedItems.filter((id) => id !== rowId);
        return {
          ...state,
          lastChecked: { id, value: rowId },
          checkedItems: allCheckedItems,
          selectAllCheckboxState: allCheckedItems.length ? 'some' : 'none',
        };
      }
    }
    case actionTypes.checkboxShiftToggle: {
      const { checkedItems, lastChecked } = state;
      const { id, value, refs } = action.payload;

      if (lastChecked) {
        // TODO: get range from selection
        const rows: any[] = Array.from(refs);
        const lastCheckedId = parseInt(lastChecked.id);
        const currentCheckedId = parseInt(id);
        let slicedInputs: string[];
        let checked: string[] = [];

        if (lastCheckedId < currentCheckedId) {
          slicedInputs = rows.slice(lastCheckedId, currentCheckedId + 1);
        } else {
          slicedInputs = rows.slice(currentCheckedId, lastCheckedId + 1);
        }

        const rangeIds = slicedInputs.map((ref: any) => ref.value);

        // TODO: add or remove items from selected range

        if (
          checkedItems.includes(lastChecked.value) &&
          !checkedItems.includes(value)
        ) {
          checked = checkedItems.concat(rangeIds);
        } else if (
          !checkedItems.includes(lastChecked.value) &&
          !checkedItems.includes(value)
        ) {
          checked = checkedItems.concat(rangeIds);
        } else {
          checked = checkedItems.filter((id) =>
            rangeIds.includes(id) ? false : true
          );
        }

        return {
          ...state,
          lastChecked: { id, value },
          checkedItems: checked,
          selectAllCheckboxState: checked.length
            ? state.totalItems === checked.length
              ? 'all'
              : 'some'
            : 'none',
        };
      } else {
        return {
          ...state,
          lastChecked: { id, value },
        };
      }
    }
    case actionTypes.changeSortDirection: {
      return {
        ...state,
        currentSort: {
          fieldKey: state.currentSort.fieldKey,
          direction: action.payload.direction,
        },
      };
    }
    case actionTypes.toggleSortDirection: {
      const { currentSort } = state;
      return {
        ...state,
        currentSort: {
          direction: currentSort.direction === 'asc' ? 'dsc' : 'asc',
          fieldKey: currentSort.fieldKey,
        },
      };
    }
    case actionTypes.toggleSortByKey: {
      const { currentSort } = state;
      const { fieldKey } = action.payload;
      return {
        ...state,
        currentSort: {
          fieldKey,
          direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
        },
      };
    }
    case actionTypes.sortData: {
      const { fieldKey, direction } = action.payload;
      return {
        ...state,
        currentSort: { fieldKey, direction },
      };
    }
    default: {
      throw new Error(`Unhandled type: ${action.type}`);
    }
  }
};

export const useTableTools = (
  {
    layout = ['0 0 25%', '1 1 35%', '0 0 20%', '0 0 20%'],
    totalItems = 0,
    clientSortBy = { direction: 'asc', fieldKey: '' },
    columns = [],
    checkedItems = [],
  }: TableToolsProps,
  reducer = tableToolsReducer
): TableToolsReturnProps => {
  const checkboxRefs = new Set();
  const { width } = useWindowSize(Array.isArray(layout) ? 'no' : 'yes');
  const [state, send] = useReducer(reducer, {
    currentLayout: [],
    visibleColumns: [],
    columns,
    totalItems,
    currentSort: clientSortBy,
    checkedItems,
    selectAllCheckboxState: 'none',
    lastChecked: null,
  });

  useLayoutEffect(() => {
    if (Array.isArray(layout)) {
      return send({
        type: actionTypes.updateState,
        payload: {
          currentLayout: layout,
          visibleColumns: columns.slice(0, layout.length),
        },
      });
    }

    Object.keys(layout).map((breakpoint: any) => {
      if (breakpoint < width) {
        switchCurrentLayout(layout[breakpoint]);
      }
      return undefined;
    });
  }, [width]);

  // COLUMN HELPERS

  const switchColumns = (from: string, to: string) => {
    send({ type: actionTypes.switchColumns, payload: { to, from } });
  };

  const switchCurrentLayout = (nextLayout: string[]) => {
    send({
      type: actionTypes.switchCurrentLayout,
      payload: { currentLayout: nextLayout },
    });
  };

  const offsetColumns = useCallback(
    ({ includeVisible } = {}) => {
      return getOffsetColumns(
        state.visibleColumns,
        state.columns,
        includeVisible
      );
    },
    [state.visibleColumns, state.columns]
  );

  // CHECKBOX HELPERS

  const onSelection = (items: string[]) => {
    switch (state.selectAllCheckboxState) {
      case 'all':
        return deselectAll();
      case 'some':
        return deselectAll();
      case 'none':
        return selectAll(items);
      default:
        return deselectAll();
    }
  };

  const deselectAll = () => {
    send({ type: actionTypes.deselectAll });
  };

  const selectAll = (items: string[]) => {
    send({
      type: actionTypes.selectAll,
      payload: { items: items.map((item) => String(item)) },
    });
  };

  const checkboxToggle = (evt: any) => {
    send({
      type: actionTypes.checkboxToggle,
      payload: { id: String(evt.target.id), value: String(evt.target.value) },
    });
  };

  const checkboxShiftToggle = (evt: any) => {
    if (evt.shiftKey && state.lastChecked) {
      send({
        type: actionTypes.checkboxShiftToggle,
        payload: {
          id: String(evt.target.id),
          value: String(evt.target.value),
          refs: checkboxRefs,
        },
      });
      return;
    }
    send({
      type: actionTypes.checkboxToggle,
      payload: { id: String(evt.target.id), value: String(evt.target.value) },
    });
  };

  const checkboxState = (itemId: string) => {
    if (!state.checkedItems || state.checkedItems.length < 1) {
      return false;
    }
    return state.checkedItems.includes(String(itemId));
  };

  // SORTING HELPERS

  const clientSortMethod = (a: object, b: object): number => {
    const { fieldKey, direction } = state.currentSort;
    if (fieldKey && direction) {
      let valueA = getObjectValueByString(a, fieldKey);
      let valueB = getObjectValueByString(b, fieldKey);
      // force null and undefined to the bottom
      valueA = valueA === null || valueA === undefined ? '' : valueA;
      valueB = valueB === null || valueB === undefined ? '' : valueB;
      // force any string values to lowercase
      valueA = typeof valueA === 'string' ? valueA.toLowerCase() : valueA;
      valueB = typeof valueB === 'string' ? valueB.toLowerCase() : valueB;
      // Return either 1 or -1 to indicate a sort priority
      if (direction.toLowerCase() === 'asc') {
        if (valueA < valueB) {
          return -1;
        } else if (valueA > valueB) {
          return 1;
        } else {
          return 0;
        }
      }
      if (direction.toLowerCase() === 'desc') {
        if (valueA > valueB) {
          return -1;
        } else if (valueA < valueB) {
          return 1;
        } else {
          return 0;
        }
      }
      return 0;
    }
    return 0;
  };

  const changeSortDirection = (direction: SortProps['direction']) => {
    send({ type: actionTypes.changeSortDirection, payload: { direction } });
  };

  const toggleSortDirection = () => {
    send({
      type: actionTypes.toggleSortDirection,
    });
  };

  const toggleSortByKey = (fieldKey: string) => {
    send({
      type: actionTypes.toggleSortByKey,
      payload: { fieldKey },
    });
  };

  const sortData = ({ direction, fieldKey }: SortProps) => {
    send({ type: actionTypes.sortData, payload: { direction, fieldKey } });
  };

  const activeSort = ({ direction, fieldKey }: SortProps) => {
    const { currentSort } = state;
    const isActive = currentSort.fieldKey === fieldKey;
    const isCurrentSortDir = currentSort.direction === direction;
    return isActive && isCurrentSortDir;
  };

  const activeSortKey = (fieldKey: string) => {
    const { currentSort } = state;
    return currentSort.fieldKey === fieldKey;
  };

  // PAGINATION HELPERS

  // PROP GETTERS

  const getCheckboxProps = ({ master = false, ...rest }: any = {}) => {
    /** if master checkbox, do not need a ref as it's not in the items range */
    if (master) {
      return {
        ...rest,
      };
    }

    /**
     * add refs to the checkboxes so later we could grab range of items
     * from when the `shift` key is on.
     */
    return {
      ref: (ref: any) => ref && checkboxRefs.add(ref),
      ...rest,
    };
  };

  return Object.assign(state, {
    switchColumns,
    switchCurrentLayout,
    onSelection,
    deselectAll,
    selectAll,
    offsetColumns,
    checkboxToggle,
    checkboxShiftToggle,
    checkboxState,
    clientSortMethod,
    changeSortDirection,
    toggleSortDirection,
    toggleSortByKey,
    sortData,
    activeSort,
    activeSortKey,
    getCheckboxProps,
  });
};
