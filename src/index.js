import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { timeDifference } from 'src/helpers/utils';

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
  onSwitchViewType: () => {},
  switchColumns: () => {},
  checkboxState: () => {},
  offsetColumns: () => {},
  checkboxToggle: () => {},
  onSelection: () => {},
  changeSortDirection: () => {},
});

export class DataBrowser extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    columnFlex: PropTypes.array,
    columns: PropTypes.array,
    currentSort: PropTypes.shape({
      sortDirection: PropTypes.string,
      sortField: PropTypes.string,
    }),
    data: PropTypes.array,
    onStateChange: PropTypes.func,
    stateReducer: PropTypes.func,
    viewType: PropTypes.string,
  };
  static stateChangeTypes = {
    deselectAll: '__deselect_all__',
    selectAll: '__select_all__',
    checkboxToggle: '__checbox_toggle__',
    switchColumns: '__switch_columns__',
  };
  static defaultProps = {
    stateReducer: (state, changes) => changes,
    onStateChange: () => {},
    viewType: 'LIST_VIEW',
    columnFlex: ['0 0 25%', '1 1 35%', '0 0 20%', '0 0 20%'],
    data: [],
    currentSort: {
      sortDirection: 'asc',
      sortField: '',
    },
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      data: nextProps.data,
    };
  }
  static Consumer = DataBrowserContext.Consumer;
  getState(state = this.state) {
    return state;
  }
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
    // get visible sortFields into array
    const visible = this.getState().visibleColumns.map(
      column => column.sortField,
    );
    return this.getState().columns.map(column => {
      if (visible.indexOf(column.sortField) > -1) {
        return { ...column, offset: true };
      } else {
        return column;
      }
    });
  };
  onSelection = ({ items, type }) => {
    switch (this.getState().selectAllCheckboxState) {
      case true:
        return this.onDeselectAll({ type });
      case false:
        return this.onSelectAll({ items, type });
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
  onSort = () => {};
  onSwitchViewType = viewType => {
    this.internalSetState(state => ({
      viewType: state.viewType !== viewType ? 'GRID_VIEW' : 'LIST_VIEW',
    }));
  };
  changeSortDirection = sortDirection => {
    this.internalSetState({
      currentSort: {
        sortDirection,
      },
    });
  };
  // sortData = (sortField = 'id', sortDirection = 'asc') => {
  //   this.internalSetState(state => ({
  //     currentSort: { sortField, sortDirection },
  //     data: [...this.getState().data].sort((a, b) => {
  //       const nameA = String(a[sortField]);
  //       const nameB = String(b[sortField]);
  //       if (this.getState().currentSort.sortDirection === 'asc') {
  //         if (nameA < nameB) {
  //           return -1;
  //         }
  //         if (nameA > nameB) {
  //           return 1;
  //         }
  //         return 0;
  //       } else if (this.getState().currentSort.sortDirection === 'dsc') {
  //         if (nameA > nameB) {
  //           return -1;
  //         }
  //         if (nameA < nameB) {
  //           return 1;
  //         }
  //         return 0;
  //       } else {
  //         return 0;
  //       }
  //     }),
  //   }));
  // };
  initialState = {
    columnFlex: this.props.columnFlex,
    selected: [],
    columns: this.props.columns,
    visibleColumns: this.props.columns.slice(0, this.props.columnFlex.length),
    data: this.props.data,
    viewType: this.props.viewType,
    selectAllCheckboxState: false,
    currentSort: this.props.currentSort,
    checked: [],
    //
    onSwitchViewType: this.onSwitchViewType,
    switchColumns: this.switchColumns,
    checkboxState: this.checkboxState,
    offsetColumns: this.offsetColumns,
    checkboxToggle: this.checkboxToggle,
    onSelection: this.onSelection,
    changeSortDirection: this.changeSortDirection,
  };
  state = this.initialState;
  internalSetState = (changes, callback) => {
    this.setState(currentState => {
      return [changes]
        .map(c => (typeof c === 'function' ? c(currentState) : c))
        .map(c => this.props.stateReducer(currentState, c) || {})
        .map(
          ({ type: ignoredType, ...remainingChanges }) =>
            console.log(ignoredType) || remainingChanges,
        )
        .map(c => (Object.keys(c).length ? c : null))[0];
    }, callback);
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

export const rowFieldTransformer = (input = '🍔') => {
  // If input type is date
  if (Date.parse(input)) {
    return timeDifference(new Date().getTime(), new Date(input).getTime());
  }
  // If anything else just return it
  return input;
};

export * from './styles';
export * from './components/HeadCell';
export * from './components/RowOptionsCell';
