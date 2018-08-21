import React from 'react';
import ReactDom from 'react-dom';
import DataBrowser from '../index';

test('mounts', () => {
  const div = document.createElement('div');
  ReactDom.render(
    <DataBrowser data={[]} columns={[]}>
      {() => <div>asd</div>}
    </DataBrowser>,
    div,
  );
  console.log(div.innerHTML);
});
