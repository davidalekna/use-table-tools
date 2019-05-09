import React from 'react';
import { storiesOf } from '@storybook/react';
import ShowDocs from '../../utils/ShowDocs';
import axios from 'axios';
import sort from 'ramda/src/sort';
import DataBrowser, { getObjectPropertyByString } from '../../index';
import fieldReducer from './fieldReducer';
import {
  View,
  TableHead,
  HeadRowItem,
  TableBody,
  TableRow,
  TableRowItem,
} from '../globals';

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
  renderArrow = (active, dir) => {
    if (active) {
      if (dir === 'asc') {
        return '👆';
      } else {
        return `👇`;
      }
    }
  };
  render() {
    return (
      <DataBrowser
        totalItems={this.state.items.length}
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
          sortData,
          currentSort,
          defaultSortMethod,
          activeSort,
          toggleSort,
        }) => (
          <View>
            <TableHead>
              {visibleColumns.map(({ label, sortField }, index) => (
                <HeadRowItem
                  style={{ cursor: 'pointer' }}
                  key={index}
                  flex={columnFlex[index]}
                  onClick={() => toggleSort({ sortField })}
                >
                  {this.renderArrow(
                    currentSort.sortField === sortField,
                    currentSort.dir,
                  )}
                  {label}
                </HeadRowItem>
              ))}
            </TableHead>
            <TableBody>
              {sort(defaultSortMethod, this.state.items).map((row, key) => (
                <TableRow key={key} selectable>
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
        )}
      </DataBrowser>
    );
  }
}

storiesOf('sortable', module)
  .add('Docs', () => <ShowDocs md={require('../../../docs/sample.md')} />)
  .add('Demo', () => <Demo />);
