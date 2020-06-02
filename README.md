<h1 align="center">
  use-table-tools 
</h1>
<p align="center" style="font-size: 1.2rem;">React Hooks for building kickass react table components</p>

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]
[![gzip size][gzip-badge]][unpkg-lib]

## Introduction

use-table-tools is a React Hooks library for building kickass react table components.

It features:

- flexbox table with adjustable column configuration
- checkboxes with multi select
- client side sorting
- shifting columns into or off view
- number of visible columns per screen resolution

## Quick Start

```jsx
import { useTableTools } from 'use-table-tools';

function Table() {
  const { ...utils } = useTableTools({
    layout: [''],
    columns: [],
    totalItems: 0,
  });

  return <div>hello from table component</div>;
}
```

## Usage

<!-- > [Try it out in the browser](https://codesandbox.io/s/github/davidalekna/data-browser-examples) -->

Inside your React project directory, run the following:

```
yarn add use-table-tools
```

or with npm

```
npm install use-table-tools
```

## API

### Parameters

> initialState

> reducer

### Return Values

- `switchColumns: (from: string, to: string) => void`: provide colums keys from `sortKey` to `sortKey` and they will get replaced
- `switchCurrentLayout: (currentLayout: string[]) => void`: will switch current layout to the given one and will update visible and offset columns
- `offsetColumns: (obj?: { includeVisible: boolean }) => ColumnProps[]`: shows offset columns with the ability to include visible ones as well
- `onSelection: (items: string[]) => void`: actions on master checkbox selection
- `deselectAll: () => void`: clears the state of selected item ids
- `selectAll: (checkedItems: string[]) => void`: selects all items
- `checkboxToggle: (evt: ChangeEvent<HTMLInputElement>) => void`: toggles checkbox by id
- `checkboxShiftToggle: (evt: ChangeEvent<HTMLInputElement>) => void`: toggles checkbox by id and selects/deselects a range when shift key is on
- `checkboxState: (id: string) => boolean`: returns a boolean state for the checkbox by id
- `clientSortMethod: (a: object, b: object) => number`: method to be used in a sort function, like ramda sort
- `changeSortDirection: (direction: SortProps['direction']) => void`: change current sort direction by specifying next direction
- `toggleSortDirection: () => void`: toggle current sort field direction
- `toggleSortByKey: (fieldKey: string) => void`: toggle sort direction on a field key
- `sortData: (sortProps: SortProps) => void`: sorts data on provided sortField and direction props
- `activeSort: (sortProps: SortProps) => boolean`: checks the state of the current active sort by key and direction
- `activeSortKey: (key: string) => boolean`: checks the state of the current active sort by key
- `getCheckboxProps: ({...}) => CheckboxProps`: spread checkbox props on the checkbox input

### Options

## Global Configuration

React Context API

```jsx
<TableTools>{(utils) => <div />}</TableTools>
```

```jsx
const utils = useTableToolsContext();
```

## LICENSE

MIT

[build-badge]: https://travis-ci.org/davidalekna/use-table-tools.svg?style=flat-square
[build]: https://travis-ci.org/davidalekna/use-table-tools
[coverage-badge]: https://codecov.io/gh/davidalekna/use-table-tools/branch/master/graph/badge.svg?style=flat-square
[coverage]: https://codecov.io/gh/davidalekna/use-table-tools
[license-badge]: https://img.shields.io/npm/l/downshift.svg?style=flat-square
[license]: https://github.com/davidalekna/use-table-tools/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/davidalekna/use-table-tools/blob/master/CODE_OF_CONDUCT.md
[react-badge]: https://img.shields.io/badge/%E2%9A%9B%EF%B8%8F-(p)react-00d8ff.svg?style=flat-square
[react]: https://facebook.github.io/react/
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?label=size&style=flat-square
[unpkg-lib]: https://unpkg.com/use-table-tools/lib/
[use-a-render-prop]: https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce
