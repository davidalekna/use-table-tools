import React from 'react';
import { storiesOf } from '@storybook/react';
import ShowDocs from '../../__utils__/ShowDocs';
import axios from 'axios';
import DataBrowser, { getObjectPropertyByString } from '../../index';
import { View, TableHead, Image } from '../globals';
import GridBoard from './GridBoard';
import GirdCard from './GirdCard';
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
  moveCard = (dragIndex, hoverIndex) => {
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
            <GridBoard>
              {this.state.items.map((row, key) => (
                <GirdCard key={key} index={key} moveCard={this.moveCard}>
                  <input
                    type="checkbox"
                    checked={checkboxState(row.id)}
                    onChange={() => checkboxToggle({ rowId: row.id })}
                  />
                  {row.album && <Image src={row.album.url} alt="" />}
                  {visibleColumns.map(({ sortField }) => (
                    <div key={sortField}>
                      {getObjectPropertyByString(row, sortField)}
                    </div>
                  ))}
                </GirdCard>
              ))}
            </GridBoard>
          </View>
        )}
      </DataBrowser>
    );
  }
}

storiesOf('grid draggable', module)
  .add('Docs', () => <ShowDocs md={require('../../../docs/sample.md')} />)
  .add('Demo', () => <Demo />);
