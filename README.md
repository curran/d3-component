# d3-component
An idiomatic D3 component API specification.

[![](https://imgs.xkcd.com/comics/standards.png)](https://xkcd.com/927/)

This is an attempt to express a baseline API structure for interactive data visualizations.

In addition to an API specification, this project aims to provide:

 * A library that can validate that components conform to the specification.
 * A library that provides utilities that make it easier to implement the specification.

# Introduction

One of the most respected and emulated pattern for reusable D3 components is expressed in the piece [Towards Reusable Charts (by Mike Bostock, 2012)](http://bost.ocks.org/mike/chart/). In order to try to understand this pattern, I created the following bl.ocks:

 * [Original code from "Towards Reusable Charts"](http://bl.ocks.org/curran/66d926fe73211fd650ec)
 * [Reusable Scatter Plot](http://bl.ocks.org/curran/1fb2ae1dfc1471972904) An attempt to apply the pattern to a scatter plot.

Previously, I had attempted to build a library to support reusable D3 components, [Model.js](https://github.com/curran/model). This does solve the problem to some extent, however it requires that developers add Model.js as a dependency to their component. It somehow seems like one should be able to build reusable visualization components _without_ depending on any particular library.

The Towards Reusable Charts approach comprises of two fundamental patterns:

 * chainable getter-setters, and
 * constructing a function that gets called with a D3 selection.

The merits of these patterns are numerous, and are quite well explained in the original Towards Reusable Charts piece. The chainable getter-setter pattern provides a clean and flexible API for constructing and manipulating objects. Constructing a function that gets called with a D3 selection provides the "rubber stamp" nature of the D3 Enter, Update, Exit paradigm. This makes it straightforward to, for example, implement [small multiples](https://en.wikipedia.org/wiki/Small_multiple) for any visualization technique.

However, the Towards Reusable Charts pattern does not specify any particular way to deal with mutable state and handling events. For example, how should the visualization respond when the browser window is resized? To implement resizing visualization, one needs to establish some means by which to update the state of the visualization (width and height) **and** re-render the visualization.

# API Specification

**A module that defines a component must export a component constructor function.**

 * If CommonJS, the `module.exports` should be the constructor function.
 * If ES6, the constructor function must be the default export (using ES6 syntax `export default`).

**A component's constructor function must take zero arguments.**

 * Let's call the constructor function `Component`;

**A component's constructor function must work regardless of whether the `new` keyword is used.**

For example, the following two ways of invoking the constructor should have exactly the same behavior:

Without using `new`:
```javascript
var component = Component();
```

Using `new`:
```javascript
var component = new Component();
```

**A component's constructor function must return a function, the component instance.**

 * Let's call the component instance `component`.

**The component instance must be callable with a D3 selection.**

This invocation might look something like this:

```javascript
d3.select("#chart")
  .datum(data)
  .call(component);
```

# Validation

# Utilities

Related work:

 * [Towards Reusable Charts](http://bl.ocks.org/curran/66d926fe73211fd650ec)
 * [syntagmatic/parallel-coordinates getter-setter pattern](https://github.com/syntagmatic/parallel-coordinates/blob/master/d3.parcoords.js#L73)
