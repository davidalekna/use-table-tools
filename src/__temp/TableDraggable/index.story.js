import React from 'react';
import { storiesOf } from '@storybook/react';
import ShowDocs from '../../utils/ShowDocs';
import axios from 'axios';
import DataBrowser, { getObjectPropertyByString } from '../../index';
import fieldReducer from './fieldReducer';
import { View, TableHead, HeadRowItem, TableRowItem } from '../globals';
import TableBoard from './TableBoard';
import TableRow from './TableRow';
import update from 'immutability-helper';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
});

class Demo extends React.Component {
  state = { items: [], loading: true };
  async componentDidMount() {
    const [users, albums] = await Promise.all([
      api('users'),
      api('photos?albumId=1'),
    ]);
    const items = users.data.map(user => ({
      ...user,
      album: albums.data.find(album => album.id === user.id),
    }));
    this.setState({ items, loading: false });
  }
  moveRow = (dragIndex, hoverIndex) => {
    const { items } = this.state;
    const dragCard = items[dragIndex];
    this.setState(
      update(this.state, {
        items: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        },
      }),
    );
  };
  render() {
    return (
      <DataBrowser
        totalItems={this.state.items.length}
        onSelectAll={this.props.onSelectAll}
        onCheckboxToggle={this.props.onCheckboxToggle}
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
        }) => (
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
                      items: this.state.items.map(item => item.id),
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
            <TableBoard>
              {this.state.items.map((row, key) => (
                <TableRow key={key} index={key} moveRow={this.moveRow}>
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
            </TableBoard>
          </View>
        )}
      </DataBrowser>
    );
  }
}

storiesOf('table draggable', module)
  .add('Docs', () => <ShowDocs md={require('../../../docs/sample.md')} />)
  .add('Demo', () => <Demo />);
