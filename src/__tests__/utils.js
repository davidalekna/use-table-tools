import { getObjectPropertyByString } from '../utils';

test('should get object property value by string', () => {
  const items = {
    totalItems: 1,
    edges: {
      node: {
        id: '123',
        name: 'My name is Kobra3000',
      },
      cursor: '123',
    },
  };
  const result = getObjectPropertyByString(items, 'edges.node.name');
  expect(result).toEqual(items.edges.node.name);
});
