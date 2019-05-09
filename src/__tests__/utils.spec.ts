import { getObjectPropertyByString, arrayHasArrays } from '../utils';

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

test('should detect if array is multidimensional', () => {
  const test1: any = ['hello world', 1, undefined, null, true, false, []];
  const test2: any = [[], [], []];
  const test3 = ['this', 'one', 'will', 'have', 'no', 'arrays'];

  const result1 = arrayHasArrays(test1);
  expect(result1).toEqual(true);
  const result2 = arrayHasArrays(test2);
  expect(result2).toEqual(true);
  const result3 = arrayHasArrays(test3);
  expect(result3).toEqual(false);
});
