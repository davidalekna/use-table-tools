import { ColumnProps } from './tableTools';

export const getObjectValueByString = (obj: object, path: string): any => {
  return path.split('.').reduce((acc: any, part) => acc && acc[part], obj);
};

export const getOffsetColumns = (
  visibleColumns: ColumnProps[],
  columns: ColumnProps[],
  includeVisible: boolean = false
) => {
  if (visibleColumns.length) {
    const visible = visibleColumns.map(({ sortKey }) => sortKey);
    return columns
      .filter(({ isLocked }) => !isLocked)
      .map((column) => {
        if (visible.includes(column.sortKey)) {
          return Object.assign(column, { visible: true });
        } else {
          return Object.assign(column, { visible: false });
        }
      })
      .filter(({ visible }) => (includeVisible ? true : !visible));
  } else {
    return [];
  }
};

export const callAllEventHandlers = (...fns: Function[]) => {
  return (...args: any[]) =>
    fns.some((fn) => {
      if (fn) {
        fn(...args);
      }
    });
};
