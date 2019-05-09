import React from 'react';
import { storiesOf } from '@storybook/react';
import ShowDocs from '../../__utils__/ShowDocs';
import axios from 'axios';
import DataBrowser, { getObjectPropertyByString } from '../../index';
import { action } from '@storybook/addon-actions';
import fieldReducer from './fieldReducer';
import GlobalStyle from '../globals/reset.css';
import useRows from '../hooks/useRows';
import {
  View,
  TableHead,
  HeadRowItem,
  TableBody,
  TableRow,
  TableRowItem,
} from '../globals';

function Demo({ onSelectAll, onCheckboxToggle }) {
  const { rows, loading } = useRows();
  return (
    <>
      <GlobalStyle />
      <DataBrowser
        totalItems={rows.length}
        onSelectAll={onSelectAll}
        onCheckboxToggle={() => {
          console.log('toggle');
          onCheckboxToggle();
        }}
        columns={[
          { label: 'name', sortField: 'name', isLocked: true },
          { label: 'user name', sortField: 'username' },
          { label: 'email', sortField: 'email' },
          { label: 'street', sortField: 'address.street' },
        ]}
      >
        {({
          columnFlex,
          visibleColumns,
          selectAllCheckboxState,
          onSelection,
          checkboxToggle,
          checkboxState,
        }) => {
          return (
            <View>
              <TableHead>
                <HeadRowItem
                  style={{
                    flex: '0 0 auto',
                    position: 'relative',
                    width: 30,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectAllCheckboxState}
                    onChange={() =>
                      onSelection({
                        items: rows.map(item => item.id),
                      })
                    }
                  />
                </HeadRowItem>
                {visibleColumns.map((cell, index) => (
                  <HeadRowItem
                    key={index}
                    selected={cell}
                    flex={columnFlex[index]}
                  >
                    {cell.label}
                  </HeadRowItem>
                ))}
              </TableHead>
              <TableBody>
                {rows.map((row, key) => (
                  <TableRow key={key} selectable>
                    <TableRowItem
                      style={{
                        flex: '0 0 auto',
                        position: 'relative',
                        width: 30,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checkboxState(row.id)}
                        onChange={() => checkboxToggle({ rowId: row.id })}
                      />
                    </TableRowItem>
                    {visibleColumns.map(
                      ({ label, sortField, isLocked }, index) => (
                        <TableRowItem
                          key={sortField}
                          flex={columnFlex[index]}
                          cursor="pointer"
                          onClick={() =>
                            alert(`🦄 clicked on a row (id) ${row.id}`)
                          }
                        >
                          {isLocked && `🔒 `}
                          {fieldReducer(
                            getObjectPropertyByString(row, sortField),
                            sortField,
                          )}
                        </TableRowItem>
                      ),
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </View>
          );
        }}
      </DataBrowser>
    </>
  );
}

storiesOf('table checkbox', module)
  .add('Docs', () => <ShowDocs md={require('../../../docs/sample.md')} />)
  .add('Demo', () => (
    <Demo
      onSelectAll={action('onSelectAll')}
      onCheckboxToggle={action('onCheckboxToggle')}
    />
  ));
