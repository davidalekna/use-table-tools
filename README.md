<h1 align="center">
  DataBrowser 🗄 (beta)
</h1>
<p align="center" style="font-size: 1.2rem;">Primitive to build simple, flexible, enhanced data views like table or grid React components</p>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
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

> [Try it out in the browser](https://codesandbox.io/s/zrqpl819rx)

```jsx
import React from 'react'
import {render} from 'react-dom'
import DataBrowser from 'react-data-browser'

const columns = []

render(
  <DataBrowser columns={columns}>
    {({
      columnFlex,
      visibleColumns,
      selectAllCheckboxState,
      checkboxState,
      onSelection,
      checkboxToggle,
      viewType
    }) => (
      <div />
    )}
  </DataBrowser>,
  document.getElementById('root'),
)
```

`<DataBrowser />` and `withDataBrowser()` are the only components exposed by this package. It doesn't render anything itself, it just calls the render function and renders that
["Use a render prop!"][use-a-render-prop]!
`<DataBrowser>{props => <div>/* your JSX here! */</div>}</DataBrowser>`.

## Basic Props

This is the list of props that you should probably know about. There are some
[advanced props](#advanced-props) below as well.

### children

> `function({})` | _required_

This is called with an object. Read more about the properties of this object in
the section "[Children Function](#children-function)".

### columns

> `Array<>` | _required_

Provide columns array that you wish to be visible in your component.

### columnFlex

> `Array<>` | optional

Takes in an array of flexbox flex parameters for your columns, for example '1 1 40%'

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
)

function stateReducer(state, changes) {
  switch (changes.type) {
    default:
      return changes
  }
}
```

## Advanced Props

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
  state = { rows: [] }
  onStateChange = (action, { defaultSortMethod }) => {
    if (action.type === "__sort_data__") {
      this.setState(state => ({
        rows: sort(defaultSortMethod, state.rows)
      }));
    }
  }
  render() {
    <DataBrowser onStateChange={this.onStateChange}>{/* your callback */}</DataBrowser>
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
console.log(Object.keys(DataBrowser.stateChangeTypes))
```

## Children Function

This is where you render whatever you want to based on the state of `react-data-browser`.
You use it like so:

```javascript
const ui = (
  <DataBrowser>
    {props => (
      <div>{/* more jsx here */}</div>
    )}
  </DataBrowser>
)
```

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://travis-ci.org/davidalekna/react-data-browser.svg?style=flat-square
[build]: https://travis-ci.org/davidalekna/react-data-browser
[coverage-badge]: https://codecov.io/gh/davidalekna/react-data-browser/branch/master/graph/badge.svg?style=flat-square
[coverage]: https://codecov.io/gh/davidalekna/react-data-browser
[version-badge]: https://img.shields.io/npm/v/downshift.svg?style=flat-square
[package]: https://www.npmjs.com/package/downshift
[downloads-badge]: https://img.shields.io/npm/dm/downshift.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/downshift
[license-badge]: https://img.shields.io/npm/l/downshift.svg?style=flat-square
[license]: https://github.com/davidalekna/react-data-browser/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[chat]: https://gitter.im/paypal/downshift
[chat-badge]: https://img.shields.io/gitter/room/paypal/downshift.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/davidalekna/react-data-browser/blob/master/CODE_OF_CONDUCT.md
[react-badge]: https://img.shields.io/badge/%E2%9A%9B%EF%B8%8F-(p)react-00d8ff.svg?style=flat-square
[react]: https://facebook.github.io/react/
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/downshift/dist/downshift.umd.min.js?label=size&style=flat-square
[unpkg-dist]: https://unpkg.com/react-data-browser/dist/
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
