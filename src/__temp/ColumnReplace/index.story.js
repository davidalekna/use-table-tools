import React from 'react';
import { storiesOf } from '@storybook/react';
import ShowDocs from '../../utils/ShowDocs';
import axios from 'axios';
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
        {({ columnFlex, visibleColumns }) => (
          <View>
            <TableHead>
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
              {this.state.items.map((row, key) => (
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

storiesOf('column replace', module)
  .add('Docs', () => <ShowDocs md={require('../../../docs/sample.md')} />)
  .add('Demo', () => <Demo />);
