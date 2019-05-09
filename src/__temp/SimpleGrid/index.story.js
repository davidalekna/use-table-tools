import React from 'react';
import { storiesOf } from '@storybook/react';
import ShowDocs from '../../utils/ShowDocs';
import axios from 'axios';
import DataBrowser, { getObjectPropertyByString } from '../../index';
import { View, TableHead, Grid, GridItem, Image } from '../globals';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
});

export class Demo extends React.Component {
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
        onSelectAll={this.props.onSelectAll}
        onCheckboxToggle={this.props.onCheckboxToggle}
        columns={[{ label: 'name', sortField: 'name', isLocked: true }]}
      >
        {({
          visibleColumns,
          selectAllCheckboxState,
          onSelection,
          checkboxState,
          checkboxToggle,
        }) => (
          <View>
            <TableHead>
              <label>
                <input
                  type="checkbox"
                  checked={selectAllCheckboxState}
                  onChange={() =>
                    onSelection({
                      items: this.state.items.map(item => item.id),
                    })
                  }
                />
                <span>click me</span>
              </label>
            </TableHead>
            <Grid>
              {this.state.items.map((row, key) => (
                <GridItem
                  key={key}
                  style={{ cursor: 'pointer' }}
                  checked={checkboxState(row.id)}
                  onClick={() => checkboxToggle({ rowId: row.id })}
                >
                  {row.album && <Image src={row.album.url} alt="" />}
                  {visibleColumns.map(({ sortField }) => (
                    <div key={sortField}>
                      {getObjectPropertyByString(row, sortField)}
                    </div>
                  ))}
                </GridItem>
              ))}
            </Grid>
          </View>
        )}
      </DataBrowser>
    );
  }
}

storiesOf('simple grid', module)
  .add('Docs', () => <ShowDocs md={require('../../../docs/sample.md')} />)
  .add('Demo', () => <Demo />);
