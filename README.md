<h1 align="center">
  DataBrowser 🗄 
</h1>
<p align="center" style="font-size: 1.2rem;">Primitive to build simple, flexible, enhanced flexbox tables or grid React components</p>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
[![size][size-badge]][unpkg-lib] [![gzip size][gzip-badge]][unpkg-lib]
[![Storybook](https://github.com/storybooks/press/blob/master/badges/storybook.svg)](https://davidalekna.github.io/react-data-browser)

## The problem

It's time consuming to build your own table functionality when you want something unique or have more specific use case than table components that already exist.

## This solution

DataBrowser component will provide common functionalities like checkbox, client side sorting, filtering, visible / offset columns and much more for your individual table components...

> NOTE: The original use case of this component is to build flexbox tables, however the API
> is powerful and flexible enough to build things like grids as well.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [Basic Props](#basic-props)
  - [children](#children)
  - [initialSort](#initialsort)
  - [columns](#columns)
  - [viewsAvailable](#viewsavailable)
  - [totalItems](#totalitems)
  - [initialChecked](#initialchecked)
  - [initialColumnFlex](#initialcolumnflex)
  - [stateReducer](#statereducer)
- [Advanced Props](#advanced-props)
  - [visibleColumns](#visiblecolumns)
  - [viewType](#viewtype)
  - [selectAllCheckboxState](#selectallcheckboxstate)
  - [currentSort](#currentsort)
  - [checkedItems](#checkedItems)
  - [viewsAvailable](#viewsavailable-1)
  - [switchViewType](#switchviewtype)
  - [switchColumns](#switchcolumns)
  - [checkboxState](#checkboxstate)
  - [offsetColumns](#offsetcolumns)
  - [checkboxToggle](#checkboxtoggle)
  - [onSelection](#onselection)
  - [toggleSort](#togglesort)
  - [changeSortDirection](#changesortdirection)
  - [defaultSortMethod](#defaultsortmethod)
  - [sortData](#sortdata)
  - [onStateChange](#onstatechange)
- [stateChangeTypes](#statechangetypes)
- [Children Function](#children-function)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save react-data-browser
```

> This package also depends on `react` and `prop-types`. Please make sure you have those installed as well.

## Usage

> NOTE: DataBrowser component will not provide any styles, only the functionality. Styles used in the examples are only for better visualization for what could be achieved using this component.

> [Try it out in the browser](https://codesandbox.io/s/github/davidalekna/data-browser-examples)

```jsx
import React from 'react';
import { render } from 'react-dom';
import DataBrowser from 'react-data-browser';

render(
  <DataBrowser columns={[]}>{() => <div />}</DataBrowser>,
  document.getElementById('root'),
);
```

This package exposes `<DataBrowser />`, `withDataBrowser()` components and `getObjectPropertyByString()` function.

`<DataBrowser />` doesn't render anything itself, it just calls the render function and renders that ["Use a render prop!"][use-a-render-prop]!
`<DataBrowser>{props => <div>/* your JSX here! */</div>}</DataBrowser>`.

`getObjectPropertyByString()` is a function that helps to access nested properties on an object by string.
Usage: `getObjectPropertyByString(object, 'object.property.that.you.want.to.access')`

## Basic Props

This is the list of props that you should know about. There are some
[advanced props](#advanced-props) below as well.

### children

> `function({})` | _required_

This is called with an object. Read more about the properties of this object in
the section "[Children Function](#children-function)".

### initialSort

> `Object<{ dir: string, sortField: string }>` optional

sets an initial sort order.

### columns

> `Array<{ label: string, sortField: string, isLocked: boolean }>` | _required_

Accepts an array of objects with any values you need + 3 values that are used by the component.
label key will hold the label for the field, sortField will have to match data key name that you want
to display from remote source. isLocked key will add isLocked props to the visibleColumns.

### viewsAvailable

> `Array<string>` | optional | defaults to ['LIST_VIEW', 'GRID_VIEW']

you can provide available views to your component and you will be able to toggle them later.

### totalItems

> number | optional

totalItems is required if you have a sorting functionality on your table. It will help for the selectAllCheckbox to determin weather all items are selected or not.

### initialChecked

> `Array<string>` | optional

Takes in an array of ids if you need to set initial checkedItems items.

### initialColumnFlex

> `Array<>` | optional | defaults to ['0 0 25%', '1 1 35%', '0 0 20%', '0 0 20%']

columnFlex has a default layout, if you'd like to overwrite it you can provide initialColumnFlex with an
array of flex values you required or an array of arrays with flex values.

### stateReducer

> `function(state: object, changes: object)` | optional

**🚨 This is a really handy power feature 🚨**

This function will be called each time `react-data-browser` sets its internal state
(or calls your `onStateChange` handler for control props). It allows you to
modify the state change that will take place which can give you fine grain
control over how the component interacts with user updates without having to
use [Control Props](#control-props). It gives you the current state and the
state that will be set, and you return the state that you want to set.

- `state`: The full current state of react-data-browser.
- `changes`: These are the properties that are about to change. This also has a
  `type` property which you can learn more about in the
  [`stateChangeTypes`](#statechangetypes) section.

```jsx
const ui = (
  <DataBrowser stateReducer={stateReducer}>{/* your callback */}</DataBrowser>
);

function stateReducer(state, changes) {
  switch (changes.type) {
    default:
      return changes;
  }
}
```

## Advanced Props

### visibleColumns

> `Array<string>` | defaults to generated visibleColumns

### viewType

> `string` | defaults to 'LIST_VIEW'

### selectAllCheckboxState

> `boolean` | defaults to false

### currentSort

> `object` | defaults to currentSort: { dir: '', sortField: '' }

### checkedItems

> `Array<>` | control prop

state that holds selected item ids

### viewsAvailable

> `Array<>` | defaults to internal implementation

### switchViewType

> `function(props: object)` | defaults to internal implementation

accepts view type string from viewsAvailable controlled prop

### switchColumns

> `function(props: object)` | defaults to internal implementation

will accept an object with params from and to. Providing sortFields columns will be replaced from - to.

### checkboxState

> `function(props: string)` | defaults to internal implementation

will check weather item is checkedItems or not. Returns boolean

### offsetColumns

> `function()` | defaults to internal implementation

will return offset columns with additional prop 'visible' if that column is already displayed.

### checkboxToggle

> `function(props: string)` | defaults to internal implementation

will accept item id and toggle the checkbox for that item

### onSelection

> `function(props: object)` | defaults to internal implementation

function for 'select all checkbox'.

### toggleSort

> `function(props: object)` | defaults to internal implementation

takes in sortField and toggles asc | dsc on it

### changeSortDirection

> `function(props: object)` | defaults to internal implementation

changes sort direction, will accept an object with {dir: string}

### defaultSortMethod

> `function()` | defaults to internal implementation

default sort method for client side sort implementation

### sortData

> `function()` | defaults to internal implementation

will accept sortField and dir

### onStateChange

> `function(changes: object, stateAndHelpers: object)` | optional, no useful
> default

This function is called anytime the internal state changes. This can be useful
if you're using react-data-browser as a "controlled" component, where you manage some or
all of the state and then pass it as props, rather than letting react-data-browser control
all its state itself. The parameters both take the shape of internal state but differ slightly.

- `changes`: These are the properties that actually have changed since the last
  state change. This also has a `type` property which you can learn more about
  in the [`stateChangeTypes`](#statechangetypes) section.
- `stateAndHelpers`: This is the exact same thing your `children` function is
  called with (see [Children Function](#children-function))

> Tip: This function will be called any time _any_ state is changed. The best
> way to determine whether any particular state was changed, you can use
> `changes.hasOwnProperty('propName')`.

```jsx
class App extends React.Component {
  state = { rows: [] };
  onStateChange = (action, { defaultSortMethod }) => {
    if (action.type === '__sort_data__') {
      this.setState(state => ({
        rows: sort(defaultSortMethod, state.rows),
      }));
    }
  };
  render() {
    <DataBrowser onStateChange={this.onStateChange}>
      {/* your callback */}
    </DataBrowser>;
  }
}
```

## stateChangeTypes

There are a few props that expose changes to state
([`onStateChange`](#onstatechange) and [`stateReducer`](#statereducer)).
For you to make the most of these APIs, it's important for you to understand
why state is being changed. To accomplish this, there's a `type` property on the
`changes` object you get. This `type` corresponds to a
`DataBrowser.stateChangeTypes` property. If you want to see what change types
are available, run this in your app:

```javascript
console.log(Object.keys(DataBrowser.stateChangeTypes));
```

## Children Function

This is where you render whatever you want to based on the state of `react-data-browser`.
You use it like so:

```javascript
const ui = (
  <DataBrowser>{props => <div>{/* more jsx here */}</div>}</DataBrowser>
);
```

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://travis-ci.org/davidalekna/react-data-browser.svg?style=flat-square
[build]: https://travis-ci.org/davidalekna/react-data-browser
[coverage-badge]: https://codecov.io/gh/davidalekna/react-data-browser/branch/master/graph/badge.svg?style=flat-square
[coverage]: https://codecov.io/gh/davidalekna/react-data-browser
[license-badge]: https://img.shields.io/npm/l/downshift.svg?style=flat-square
[license]: https://github.com/davidalekna/react-data-browser/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/davidalekna/react-data-browser/blob/master/CODE_OF_CONDUCT.md
[react-badge]: https://img.shields.io/badge/%E2%9A%9B%EF%B8%8F-(p)react-00d8ff.svg?style=flat-square
[react]: https://facebook.github.io/react/
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?label=size&style=flat-square
[unpkg-lib]: https://unpkg.com/react-data-browser/lib/
[use-a-render-prop]: https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce
