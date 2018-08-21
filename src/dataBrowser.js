import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { getObjectPropertyByString } from './utils';

const DataBrowserContext = React.createContext({
  columnFlex: [],
  selected: [],
  columns: [],
  visibleColumns: [],
  data: [],
  viewType: '',
  selectAllCheckboxState: false,
  currentSort: {},
  checked: [],
  switchViewType: () => {},
  switchColumns: () => {},
  checkboxState: () => {},
  offsetColumns: () => {},
  checkboxToggle: () => {},
  onSelection: () => {},
  changeSortDirection: () => {},
  defaultSortMethod: () => {},
  sortData: () => {},
});

export class DataBrowser extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    debug: PropTypes.bool,
    columnFlex: PropTypes.array,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        sortField: PropTypes.string.isRequired,
        isLocked: PropTypes.bool,
      }),
    ).isRequired,
    currentSort: PropTypes.shape({
      sortDirection: PropTypes.string,
      sortField: PropTypes.string,
    }),
    data: PropTypes.array.isRequired,
    stateReducer: PropTypes.func,
    viewType: PropTypes.string,
    viewsAvailable: PropTypes.array,
  };
  static stateChangeTypes = {
    deselectAll: '__deselect_all__',
    selectAll: '__select_all__',
    checkboxToggle: '__checbox_toggle__',
    switchColumns: '__switch_columns__',
    switchView: '__switch_view__',
    sortData: '__sort_data__',
  };
  static defaultProps = {
    stateReducer: (state, changes) => changes,
    viewType: 'LIST_VIEW',
    viewsAvailable: ['LIST_VIEW', 'GRID_VIEW'],
    columnFlex: ['0 0 25%', '1 1 35%', '0 0 20%', '0 0 20%'],
    data: [],
    debug: false,
    currentSort: {
      sortDirection: 'asc',
      sortField: '',
    },
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.data.length < nextProps.data.length) {
      return {
        ...prevState,
        data: nextProps.data,
      };
    } else {
      return prevState;
    }
  }
  static Consumer = DataBrowserContext.Consumer;
  getState(state = this.state) {
    return state;
  }
  internalSetState = (changes, callback) => {
    this.setState(currentState => {
      return [changes]
        .map(c => (typeof c === 'function' ? c(currentState) : c))
        .map(c => this.props.stateReducer(currentState, c) || {})
        .map(
          ({ type: ignoredType, ...remainingChanges }) =>
            (this.props.debug && console.info(ignoredType)) || remainingChanges,
        )
        .map(c => (Object.keys(c).length ? c : null))[0];
    }, callback);
  };
  switchColumns = ({
    type = DataBrowser.stateChangeTypes.switchColumns,
    column: selected,
    sortField: active,
  }) => {
    const { visibleColumns: columns } = this.getState();
    const index = columns.findIndex(x => x.sortField === active);
    const visibleColumns = columns.filter(col => col.sortField !== active);
    visibleColumns.splice(index, 0, selected);
    this.internalSetState({ type, visibleColumns });
  };
  offsetColumns = () => {
    const visible = this.getState().visibleColumns.map(
      column => column.sortField,
    );
    return this.getState()
      .columns.filter(c => !c.isLocked)
      .map(column => {
        if (visible.indexOf(column.sortField) > -1) {
          return { ...column, offset: true };
        } else {
          return column;
        }
      });
  };
  onSelection = ({ type, items }) => {
    switch (this.getState().selectAllCheckboxState) {
      case true:
        return this.onDeselectAll({ type });
      case false:
        return this.onSelectAll({ type, items });
      default:
        return this.onDeselectAll({ type });
    }
  };
  onDeselectAll = ({
    type = DataBrowser.stateChangeTypes.deselectAll,
  } = {}) => {
    this.internalSetState({ type, selectAllCheckboxState: false, checked: [] });
  };
  onSelectAll = ({
    type = DataBrowser.stateChangeTypes.selectAll,
    items,
  } = {}) => {
    this.internalSetState({
      type,
      selectAllCheckboxState: true,
      checked: items,
    });
  };
  checkboxToggle = ({
    type = DataBrowser.stateChangeTypes.checkboxToggle,
    rowId,
  } = {}) => {
    if (this.getState().checked.indexOf(rowId) === -1) {
      this.internalSetState(state => ({
        type,
        selectAllCheckboxState: false,
        checked: [...state.checked, rowId],
      }));
    } else {
      this.internalSetState(state => ({
        type,
        selectAllCheckboxState: false,
        checked: state.checked.filter(id => id !== rowId),
      }));
    }
  };
  checkboxState = value => this.getState().checked.indexOf(value) !== -1;
  switchViewType = ({
    type = DataBrowser.stateChangeTypes.switchView,
    viewType,
  }) => {
    if (this.state.viewsAvailable.indexOf(viewType) > -1) {
      this.internalSetState({ type, viewType });
    } else {
      console.warn(`${viewType} not in available views`);
    }
  };
  changeSortDirection = ({ sortDirection = 'asc' }) => {
    this.internalSetState({ currentSort: { sortDirection } });
  };
  defaultSortMethod = (sortField, sortDirection) => (a, b) => {
    let nameA = getObjectPropertyByString(a, sortField);
    let nameB = getObjectPropertyByString(b, sortField);
    // force null and undefined to the bottom
    nameA = nameA === null || nameA === undefined ? '' : nameA;
    nameB = nameB === null || nameB === undefined ? '' : nameB;
    // force any string values to lowercase
    nameA = typeof nameA === 'string' ? nameA.toLowerCase() : nameA;
    nameB = typeof nameB === 'string' ? nameB.toLowerCase() : nameB;
    // Return either 1 or -1 to indicate a sort priority
    if (sortDirection.toLowerCase() === 'asc') {
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    }
    if (sortDirection.toLowerCase() === 'dsc') {
      if (nameA > nameB) {
        return -1;
      } else if (nameA < nameB) {
        return 1;
      } else {
        return 0;
      }
    }
    return 0;
  };
  sortData = ({
    type = DataBrowser.stateChangeTypes.sortData,
    sortField = 'id',
    sortDirection = 'asc',
  }) => {
    this.internalSetState(state => ({
      type,
      currentSort: { sortField, sortDirection },
      data: state.data
        .slice()
        .sort(this.state.defaultSortMethod(sortField, sortDirection)),
    }));
  };
  activeSort = (fieldName = '', sortDir = '') => {
    const currentSort = this.getState().currentSort;
    const isActive = currentSort.sortField === fieldName;
    const isCurrentSortDir = currentSort.sortDirection === sortDir;
    return isActive && isCurrentSortDir;
  };
  initialState = {
    columnFlex: this.props.columnFlex,
    selected: [],
    columns: this.props.columns,
    visibleColumns: this.props.columns.slice(0, this.props.columnFlex.length),
    data: this.props.data,
    viewType: this.props.viewType,
    viewsAvailable: this.props.viewsAvailable,
    selectAllCheckboxState: false,
    currentSort: this.props.currentSort,
    checked: [],
    //
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
  };
  state = this.initialState;
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
