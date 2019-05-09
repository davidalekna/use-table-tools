import React from 'react';
import { RowOptionsCell } from './RowOptionsCell';
import { HeadCell } from './HeadCell';
import { withDataBrowser } from '../../../index';
import {
  Table,
  TableBody,
  FixedTableHead,
  Row,
  RowItem,
  Placeholder,
} from '../styles';

const rows = num =>
  Array(num)
    .fill({})
    .map((k, i) => ({ i }));

export const Loading = withDataBrowser(
  ({ dataBrowser: { visibleColumns, columnFlex }, numberOfRows = 10 }) => {
    const fixedColWidth = 40;
    return (
      <Table>
        <FixedTableHead>
          <HeadCell
            style={{ width: fixedColWidth }}
            flex="0 0 auto"
            render={() => <Placeholder />}
          />
          {visibleColumns.map((cell, index) => (
            <HeadCell
              key={index}
              flex={columnFlex[index]}
              render={() => (
                <Placeholder w={Math.floor(Math.random() * 100) + 50} loading />
              )}
            />
          ))}
          <RowOptionsCell
            head
            width={fixedColWidth}
            render={() => <Placeholder />}
          />
        </FixedTableHead>
        <TableBody>
          {rows(numberOfRows).map((n, key) => (
            <Row key={key}>
              <RowItem style={{ width: fixedColWidth }} flex="0 0 auto">
                <Placeholder />
              </RowItem>
              {visibleColumns.map(({ label, sortField, isLocked }, index) => (
                <RowItem key={sortField} flex={columnFlex[index]}>
                  <Placeholder
                    w={Math.floor(Math.random() * 100) + 50}
                    loading={index === 0}
                  />
                </RowItem>
              ))}
              <RowOptionsCell
                head
                width={fixedColWidth}
                render={() => <Placeholder />}
              />
            </Row>
          ))}
        </TableBody>
      </Table>
    );
  },
);
