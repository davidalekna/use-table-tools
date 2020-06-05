import { renderHook } from '@testing-library/react-hooks';

import { useTableTools } from '../tableTools';

test('visibleColumns should have a number of items as per current layout ', () => {
  const { result } = renderHook(() =>
    useTableTools({
      layout: ['0 0 25%', '1 1 55%', '0 0 20%'],
      columns: [
        { title: 'id', sortKey: 'id', locked: false },
        { title: 'email', sortKey: 'email', locked: false },
        { title: 'title', sortKey: 'title', locked: false },
        { title: 'location', sortKey: 'location', locked: false },
      ],
      totalItems: 0,
    }),
  );

  expect(result.current.visibleColumns.length).toEqual(3);
  expect(result.current.visibleColumns).toMatchInlineSnapshot(`
    Array [
      Object {
        "locked": false,
        "sortKey": "id",
        "title": "id",
      },
      Object {
        "locked": false,
        "sortKey": "email",
        "title": "email",
      },
      Object {
        "locked": false,
        "sortKey": "title",
        "title": "title",
      },
    ]
  `);
});
