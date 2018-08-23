<h1 align="center">
  DataBrowser 🗄 
</h1>
<p align="center" style="font-size: 1.2rem;">Primitive to build simple, flexible, enhanced data views like table or grid React components</p>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![downloads][downloads-badge]][npmcharts] [![version][version-badge]][package]
[![MIT License][license-badge]][license]

[![PRs Welcome][prs-badge]][prs] 
[![Code of Conduct][coc-badge]][coc]
[![size][size-badge]][unpkg-dist] [![gzip size][gzip-badge]][unpkg-dist]

## The problem

Its quite time consuming to build your own table functionality when you actually dont want to use a built in styled table component. 

## This solution

DataBrowser component will provide common functionalities like checkbox, sorting, filtering, visible / offset columns and much more for your individual table components... 

> NOTE: The original use case of this component is to build flexbox table list, however the API
> is powerful and flexible enough to build things like grids as well.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save react-data-browser
```

> This package also depends on `react`, `hoist-non-react-statics` and `prop-types`. Please make sure you have those installed as well.

## Usage

> NOTE: This example is using styled-components to make it easier to visualize the usage.

> [Try it out in the browser](https://codesandbox.io/s/6z67jvklw3)

```jsx
import React from 'react'
import {render} from 'react-dom'
import DataBrowser from 'react-data-browser'

const columns = []

const items = []

render(
  <DataBrowser columns={columns}>
    {({
      columnFlex,
      visibleColumns,
      selectAllCheckboxState,
      checkboxState,
      onSelection,
      checkboxToggle,
      viewType,
      defaultSortMethod,
    }) => (
      <Table>
        <FixedTableHead>
          <HeadCell
            style={{ width: fixedColWidth }}
            flex="0 0 auto"
            render={() => (
              <Checkbox
                checked={selectAllCheckboxState}
                dataCy="check-all-checkbox"
                onChange={() =>
                  onSelection({
                    items: rows.map(({ node }) => node.id),
                  })
                }
              />
            )}
          />
          {visibleColumns.map((cell, index) => (
            <HeadCell
              key={index}
              selected={cell}
              flex={columnFlex[index]}
              render={props => <div {...props}>{cell.label}</div>}
            />
          ))}
          <RowOptionsCell
            head
            width={fixedColWidth}
            render={({ isOpen, ...props }) => (
              <IconButton {...props} color={isOpen ? 'red' : '#555'} size="18px">
                {viewType === 'LIST_VIEW' ? 'view_list' : 'view_module'}
              </IconButton>
            )}
          />
        </FixedTableHead>
        {viewType === 'GRID_VIEW' ? (
          <div>Grid View</div>
        ) : (
          <TableBody>
            {sort(defaultSortMethod, rows).map(({ cursor, node: row }, key) => (
              <Row key={cursor} selectable>
                <RowItem style={{ width: fixedColWidth }} flex="0 0 auto">
                  <Checkbox
                    id={row.id}
                    checked={checkboxState(row.id)}
                    dataCy={`row-checkbox-${key}`}
                    onChange={() => checkboxToggle({ rowId: row.id })}
                  />
                </RowItem>
                {visibleColumns.map(({ label, sortField, isLocked }, index) => (
                  <RowItem
                    key={sortField}
                    flex={columnFlex[index]}
                    cursor="pointer"
                    checked={checkboxState(row.id)}
                    onClick={() => alert(`🦄 clicked on a row ${row.id}`)}
                  >
                    {isLocked && `🔒 `}
                    {index === 0 && `🌄 `}
                    {fieldReducer(
                      getObjectPropertyByString(row, sortField),
                      sortField,
                    )}
                  </RowItem>
                ))}
                <RowOptionsCell
                  width={fixedColWidth}
                  checked={checkboxState(row.id)}
                  render={({ isOpen, ...props }) => (
                    <IconButton
                      {...props}
                      color={isOpen ? 'red' : '#999'}
                      size="18px"
                    >
                      more_horiz
                    </IconButton>
                  )}
                />
              </Row>
            ))}
            <TableFooter>
              <FetchMore
                fetchMore={fetchMore}
                pageInfo={pageInfo}
                loading={loading && networkStatus === 3}
                typeName={typeName}
              />
            </TableFooter>
          </TableBody>
        )}
      </Table>
    )}
  </DataBrowser>,
  document.getElementById('root'),
)
```

`<DataBrowser />` and `withDataBrowser()` are the only components exposed by this package. It doesn't render anything itself, it just calls the render function and renders that
["Use a render prop!"][use-a-render-prop]!
`<DataBrowser>{props => <div>/* your JSX here! */</div>}</DataBrowser>`.


## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/paypal/downshift.svg?style=flat-square
[build]: https://travis-ci.org/paypal/downshift
[coverage-badge]: https://img.shields.io/codecov/c/github/paypal/downshift.svg?style=flat-square
[coverage]: https://codecov.io/github/paypal/downshift
[version-badge]: https://img.shields.io/npm/v/downshift.svg?style=flat-square
[package]: https://www.npmjs.com/package/downshift
[downloads-badge]: https://img.shields.io/npm/dm/downshift.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/downshift
[license-badge]: https://img.shields.io/npm/l/downshift.svg?style=flat-square
[license]: https://github.com/paypal/downshift/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[chat]: https://gitter.im/paypal/downshift
[chat-badge]: https://img.shields.io/gitter/room/paypal/downshift.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/paypal/downshift/blob/master/CODE_OF_CONDUCT.md
[react-badge]: https://img.shields.io/badge/%E2%9A%9B%EF%B8%8F-(p)react-00d8ff.svg?style=flat-square
[react]: https://facebook.github.io/react/
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?label=size&style=flat-square
[unpkg-dist]: https://unpkg.com/downshift/dist/
[module-formats-badge]: https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20es-green.svg?style=flat-square
[spectrum-badge]: https://withspectrum.github.io/badge/badge.svg
[spectrum]: https://spectrum.chat/downshift
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[ryan]: https://github.com/ryanflorence
[compound-components-lecture]: https://courses.reacttraining.com/courses/advanced-react/lectures/3060560
[react-autocomplete]: https://www.npmjs.com/package/react-autocomplete
[jquery-complete]: https://jqueryui.com/autocomplete/
[examples]: https://codesandbox.io/search?refinementList%5Btags%5D%5B0%5D=downshift%3Aexample&page=1
[yt-playlist]: https://www.youtube.com/playlist?list=PLV5CVI1eNcJh5CTgArGVwANebCrAh2OUE
[jared]: https://github.com/jaredly
[controlled-components-lecture]: https://courses.reacttraining.com/courses/advanced-react/lectures/3172720
[react-training]: https://reacttraining.com/
[advanced-react]: https://courses.reacttraining.com/courses/enrolled/200086
[use-a-render-prop]: https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce
[semver]: http://semver.org/
