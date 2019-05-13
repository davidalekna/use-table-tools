type Column = {
  sortField?: string;
  isLocked?: boolean;
};

export type Props = {
  stateReducer: Function;
  onStateChange: Function;
  onSwitchColumns: Function;
  onSwitchViewType: Function;
  onChangeSortDirection: Function;
  onSortData: Function;
  onReplaceColumnFlex: Function;
  onToggleSortDirection: Function;
  onDeselectAll: Function;
  onSelectAll: Function;
  onCheckboxToggle: Function;
  onToggleSort: Function;
  initialSort: { dir: string; sortField: string };
  viewsAvailable: string[];
  initialColumnFlex: string[];
  initialChecked: string[];
  totalItems: number;
  columns: Column[];
  initialViewType: string;
};

export type CheckboxAllState = 'all' | 'none' | 'some' | string;

export type State = {
  columnFlex?: string[] | string[][] | any;
  availableColumnFlex?: null | string[];
  visibleColumns?: Column[];
  viewType?: string;
  selectAllCheckboxState?: CheckboxAllState;
  currentSort?: any;
  checkedItems?: string[];
  getColumns?: () => Column[] | void;
  getViews?: Function;
  switchViewType?: Function;
  switchColumns?: Function;
  checkboxState?: Function;
  offsetColumns?: Function;
  checkboxToggle?: Function;
  onSelection?: Function;
  changeSortDirection?: Function;
  defaultSortMethod?: Function;
  sortData?: Function;
  activeSort?: Function;
  replaceColumnFlex?: Function;
  toggleSort?: Function;
};
