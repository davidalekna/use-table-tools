import 'react-testing-library/cleanup-after-each';
import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import DataBrowser from '../';

test('mounts', () => {
  const { selectItem } = setup({
    data: [],
    columns: [],
  });

  // const div = document.createElement('div');
  // ReactDom.render(
  //   <DataBrowser data={[]} columns={[]}>
  //     {() => <div>asd</div>}
  //   </DataBrowser>,
  //   div,
  // );

  // console.log(div.innerHTML);
});

function setup({ render: renderFn = () => <div />, ...props } = {}) {
  let renderArg;
  const childrenSpy = jest.fn(controllerArg => {
    renderArg = controllerArg;
    return renderFn(controllerArg);
  });
  const utils = render(<DataBrowser {...props}>{childrenSpy}</DataBrowser>);
  return { childrenSpy, ...utils, ...renderArg };
}
