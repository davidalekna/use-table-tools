import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as hoistNonReactStatics from 'hoist-non-react-statics';
import { getObjectPropertyByString, arrayHasArrays } from './utils';
import { State, Props, CheckboxAllState } from './types';

export const DataBrowserContext = React.createContext<State>({
  columnFlex: [],
  availableColumnFlex: null,
  visibleColumns: [],
  viewType: '',
  selectAllCheckboxState: 'none',
  currentSort: {},
  checkedItems: [],
  // fns
  getColumns: () => {},
  getViews: () => {},
  switchViewType: () => {},
  switchColumns: () => {},
  checkboxState: () => {},
  offsetColumns: () => {},
  checkboxToggle: () => {},
  onSelection: () => {},
  changeSortDirection: () => {},
  defaultSortMethod: () => {},
  sortData: () => {},
  activeSort: () => {},
  replaceColumnFlex: () => {},
  toggleSort: () => {},
});

export class DataBrowser extends React.Component<Props, State> {
  static propTypes = {
    children: PropTypes.func.isRequired,
    columnFlex: PropTypes.array,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        sortField: PropTypes.string.isRequired,
        isLocked: PropTypes.bool,
      }),
    ).isRequired,
    initialSort: PropTypes.shape({
      dir: PropTypes.string,
      sortField: PropTypes.string,
    }),
    stateReducer: PropTypes.func,
    viewType: PropTypes.string,
    viewsAvailable: PropTypes.array,
    totalItems: PropTypes.number,
  };
  static defaultProps = {
    stateReducer: (state: State, changes: unknown) => changes,
    onStateChange: () => {},
    onSwitchColumns: () => {},
    onSwitchViewType: () => {},
    onChangeSortDirection: () => {},
    onSortData: () => {},
    onReplaceColumnFlex: () => {},
    onDeselectAll: () => {},
    onSelectAll: () => {},
    onCheckboxToggle: () => {},
    onToggleSort: () => {},
    onToggleSortDirection: () => {},
    initialSort: { dir: '', sortField: '' },
    viewsAvailable: ['LIST_VIEW', 'GRID_VIEW'],
    initialColumnFlex: ['0 0 25%', '1 1 35%', '0 0 20%', '0 0 20%'],
    initialChecked: [],
    totalItems: 0,
  };
  static stateChangeTypes = {
    deselectAll: '__deselect_all__',
    selectAll: '__select_all__',
    checkboxToggle: '__checbox_toggle__',
    switchColumns: '__switch_columns__',
    switchView: '__switch_view__',
    sortData: '__sort_data__',
    toggleSort: '__toggle_sort__',
    onItemClick: '__on_item_select__',
    replaceColumnFlex: '__replace_column_flex__',
    changeSortDirection: '__change_sort_directon__',
  };
  static Consumer = DataBrowserContext.Consumer;
  private _columnFlexInitializer = () => {
    return arrayHasArrays(this.props.initialColumnFlex)
      ? this.props.initialColumnFlex[0]
      : this.props.initialColumnFlex;
  };
  /**
   * switchColumns replaces visible column with selected one from the offset
   */
  switchColumns = ({
    type = DataBrowser.stateChangeTypes.switchColumns,
    from,
    to,
  }: { type?: string; to?: string; from?: string } = {}) => {
    const { visibleColumns: columns, offsetColumns } = this.getState();
    if (columns && offsetColumns) {
      const index = columns.findIndex(x => x.sortField === from);
      const visibleColumns = columns.filter(col => col.sortField !== from);
      const replacement = offsetColumns().find(
        ({ sortField }) => sortField === to,
      );
      visibleColumns.splice(index, 0, replacement);
      this.internalSetState({ type, visibleColumns }, () =>
        this.props.onSwitchColumns(this.getState().visibleColumns),
      );
    }
  };
  /**
   * replaceColumnFlex
   */
  replaceColumnFlex = ({
    type = DataBrowser.stateChangeTypes.replaceColumnFlex,
    columnFlex = '',
  }: { type?: string; columnFlex?: string } = {}) => {
    this.internalSetState(
      state => {
        const visibleSortFields = state.visibleColumns
          .map(({ sortField }) => sortField)
          .reverse();
        return {
          type,
          columnFlex,
          visibleColumns: this.props.columns
            .sort((a, b) => {
              return (
                visibleSortFields.indexOf(b.sortField) -
                visibleSortFields.indexOf(a.sortField)
              );
            })
            .slice(0, columnFlex.length),
        };
      },
      () =>
        this.props.onReplaceColumnFlex({
          columnFlex: this.getState().columnFlex,
          visibleColumns: this.getState().visibleColumns,
        }),
    );
  };
  /**
   * offsetColumns returns columns that are note visible on the table
   */
  offsetColumns = () => {
    const { visibleColumns } = this.getState();
    if (visibleColumns) {
      const visible = visibleColumns.map(c => c.sortField);
      return this.props.columns
        .filter(c => !c.isLocked)
        .map(col => {
          if (visible.includes(col.sortField)) {
            return Object.assign(col, { visible: true });
          } else {
            return Object.assign(col, { visible: false });
          }
        });
    } else {
      return [];
    }
  };
  /**
   * onSelection checks if all checboxes selected and manages selectAllCheckboxState state
   */
  onSelection = ({ type, items }: { type?: string; items?: string[] } = {}) => {
    switch (this.getState().selectAllCheckboxState) {
      case 'all':
        return this.deselectAll({ type });
      case 'some':
        return this.deselectAll({ type });
      case 'none':
        return this.selectAll({ type, items });
      default:
        return this.deselectAll({ type });
    }
  };
  /**
   * deselectAll resets checkbox checkedItems[] state to be empty
   */
  deselectAll = ({ type = DataBrowser.stateChangeTypes.deselectAll } = {}) => {
    this.internalSetState(
      { type, selectAllCheckboxState: 'none', checkedItems: [] },
      () => this.props.onDeselectAll(this.getState().checkedItems),
    );
  };
  /**
   * selectAll checkbox to pull all ids into checkedItems[] state
   */
  selectAll = ({
    type = DataBrowser.stateChangeTypes.selectAll,
    items,
  }: { type?: string; items?: string[] } = {}) => {
    this.internalSetState(
      {
        type,
        selectAllCheckboxState: 'all',
        checkedItems: items,
      },
      () => this.props.onSelectAll(this.getState().checkedItems),
    );
  };
  /**
   * checkboxToggle toggles or untoggles row
   */
  checkboxToggle = ({
    type = DataBrowser.stateChangeTypes.checkboxToggle,
    rowId = '',
  }: { type?: string; rowId?: string } = {}) => {
    const checkedItems = this.getState().checkedItems;
    if (checkedItems) {
      if (!checkedItems.includes(rowId)) {
        // checkedItems state does not include id
        this.internalSetState(
          state => ({
            type,
            checkedItems: [...state.checkedItems, rowId],
          }),
          () => {
            this.setState(state => {
              if (state.checkedItems) {
                return {
                  selectAllCheckboxState:
                    this.props.totalItems === state.checkedItems.length
                      ? 'all'
                      : 'some',
                };
              } else {
                //  ???
                return {
                  selectAllCheckboxState: 'none',
                };
              }
            });
            this.props.onCheckboxToggle(checkedItems);
          },
        );
      } else {
        // checkedItems state includes id
        this.internalSetState(
          state => ({
            type,
            selectAllCheckboxState: 'some',
            checkedItems: state.checkedItems.filter(id => id !== rowId),
          }),
          () => this.props.onCheckboxToggle(checkedItems),
        );
      }
    }
  };
  /**
   * checkboxState helps to determin current checkbox check state
   */
  checkboxState = value => {
    const checkedItems = this.getState().checkedItems;
    if (!checkedItems) return false;
    return checkedItems.includes(value);
  };
  /**
   * switchViewType triggers view switch (grid or list or others). To be improved...
   */
  switchViewType = ({
    type = DataBrowser.stateChangeTypes.switchView,
    viewType = '',
  }: { type?: string; viewType?: string } = {}) => {
    if (this.props.viewsAvailable.includes(viewType)) {
      this.internalSetState({ type, viewType }, () =>
        this.props.onSwitchViewType(this.getState().viewType),
      );
    } else {
      console.warn(`${viewType} not in available views`);
    }
  };
  /**
   * defaultSortMethod is for sort function which is usually taken from ramda or lodash
   */
  defaultSortMethod = (a: object, b: object) => {
    const { sortField, dir } = this.getState().currentSort;
    if (sortField && dir) {
      let nameA = getObjectPropertyByString(a, sortField);
      let nameB = getObjectPropertyByString(b, sortField);
      // force null and undefined to the bottom
      nameA = nameA === null || nameA === undefined ? '' : nameA;
      nameB = nameB === null || nameB === undefined ? '' : nameB;
      // force any string values to lowercase
      nameA = typeof nameA === 'string' ? nameA.toLowerCase() : nameA;
      nameB = typeof nameB === 'string' ? nameB.toLowerCase() : nameB;
      // Return either 1 or -1 to indicate a sort priority
      if (dir.toLowerCase() === 'asc') {
        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else {
          return 0;
        }
      }
      if (dir.toLowerCase() === 'dsc') {
        if (nameA > nameB) {
          return -1;
        } else if (nameA < nameB) {
          return 1;
        } else {
          return 0;
        }
      }
      return 0;
    }
    return undefined;
  };
  /**
   * changeSortDirection changes direction to provided dir prop
   */
  changeSortDirection = ({
    type = DataBrowser.stateChangeTypes.changeSortDirection,
    dir = 'asc',
  } = {}) => {
    this.internalSetState(
      state => ({
        type,
        currentSort: { sortField: state.currentSort.sortField, dir },
      }),
      () => this.props.onChangeSortDirection(this.getState().currentSort),
    );
  };
  /**
   * toggleSortDirection toggles current sort direction
   */
  toggleSortDirection = () => {
    this.internalSetState(
      ({ currentSort }) => ({
        currentSort: {
          dir: currentSort.dir === 'asc' ? 'dsc' : 'asc',
          sortField: currentSort.sortField,
        },
      }),
      () => this.props.onToggleSortDirection(this.getState().currentSort),
    );
  };
  /**
   * toggleSort toggles data on provided sortField
   */
  toggleSort = ({
    type = DataBrowser.stateChangeTypes.toggleSort,
    sortField,
  }: { type?: string; sortField?: string } = {}) => {
    this.internalSetState(
      state => ({
        type,
        currentSort: {
          dir: state.currentSort.dir === 'asc' ? 'dsc' : 'asc',
          sortField,
        },
      }),
      () => this.props.onToggleSort(this.getState().currentSort),
    );
  };
  /**
   * sortData sorts data on specific sortField and direction provided
   */
  sortData = ({
    type = DataBrowser.stateChangeTypes.sortData,
    sortField,
    dir,
  }: { type?: string; sortField?: string; dir?: string } = {}) => {
    this.internalSetState(
      {
        type,
        currentSort: { sortField, dir },
      },
      () => this.props.onSortData(this.getState().currentSort),
    );
  };
  /**
   * activeSort is used on every sort element to determine if the current sort is that field
   */
  activeSort = (fieldName = '', sortDir = ''): boolean => {
    const currentSort = this.getState().currentSort;
    const isActive = currentSort.sortField === fieldName;
    const isCurrentSortDir = currentSort.dir === sortDir;
    return isActive && isCurrentSortDir;
  };
  initialState = {
    columnFlex: this._columnFlexInitializer(),
    availableColumnFlex: arrayHasArrays(this.props.initialColumnFlex)
      ? this.props.initialColumnFlex
      : null,
    visibleColumns: this.props.columns.slice(
      0,
      this._columnFlexInitializer().length,
    ),
    viewType: 'LIST_VIEW',
    selectAllCheckboxState: 'none',
    currentSort: this.props.initialSort,
    checkedItems: this.props.initialChecked,
    // fns
    getColumns: () => this.props.columns,
    getViews: () => this.props.viewsAvailable,
    switchViewType: this.switchViewType,
    switchColumns: this.switchColumns,
    checkboxState: this.checkboxState,
    offsetColumns: this.offsetColumns,
    checkboxToggle: this.checkboxToggle,
    onSelection: this.onSelection,
    changeSortDirection: this.changeSortDirection,
    defaultSortMethod: this.defaultSortMethod,
    sortData: this.sortData,
    activeSort: this.activeSort,
    replaceColumnFlex: this.replaceColumnFlex,
    toggleSort: this.toggleSort,
  };
  state = this.initialState;
  isControlledProp(key: string) {
    return this.props[key] !== undefined;
  }
  getState(stateToMerge = this.state): State {
    return Object.keys(stateToMerge).reduce((state, key) => {
      state[key] = this.isControlledProp(key)
        ? this.props[key]
        : stateToMerge[key];
      return state;
    }, {});
  }
  internalSetState = (changes, callback = () => {}) => {
    let allChanges;
    this.setState(
      (currentState: any) => {
        const combinedState = this.getState(currentState);
        return [changes]
          .map(c => (typeof c === 'function' ? c(currentState) : c))
          .map(c => {
            allChanges = this.props.stateReducer(combinedState, c) || {};
            return allChanges;
          })
          .map(({ type: ignoredType, ...onlyChanges }) => onlyChanges)
          .map(c => {
            return Object.keys(combinedState).reduce((newChanges, stateKey) => {
              if (!this.isControlledProp(stateKey)) {
                newChanges[stateKey] = c.hasOwnProperty(stateKey)
                  ? c[stateKey]
                  : combinedState[stateKey];
              }
              return newChanges;
            }, {});
          })
          .map(c => (Object.keys(c || {}).length ? c : null))[0];
      },
      () => {
        this.props.onStateChange(allChanges, this.state);
        callback();
      },
    );
  };
  render() {
    const { children } = this.props;
    const ui = typeof children === 'function' ? children(this.state) : children;
    return (
      <DataBrowserContext.Provider value={this.state}>
        {ui}
      </DataBrowserContext.Provider>
    );
  }
}

export function withDataBrowser(Component) {
  const Wrapper = React.forwardRef((props, ref) => {
    return (
      <DataBrowser.Consumer>
        {browserUtils => (
          <Component {...props} dataBrowser={browserUtils} ref={ref} />
        )}
      </DataBrowser.Consumer>
    );
  });
  Wrapper.displayName = `withDataBrowser(${Component.displayName ||
    Component.name})`;
  hoistNonReactStatics(Wrapper, Component);
  return Wrapper;
}

export function useDataBrowser() {
  const browserUtils = React.useContext(DataBrowserContext);
  return browserUtils;
}
