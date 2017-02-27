# d3-component

A D3 component system.

## Installing

If you use NPM, `npm install d3-component`. Otherwise, download the [latest release](https://github.com/curran/d3-component/releases/latest).

## API Reference

For usage examples, please have a look at the [tests](test/component-test.js);

<a href="#component" name="component">#</a> <b>component</b>(<i>tagName</i>[, <i>className</i>])

Creates a new component generator that manages and renders into DOM elements of the specified *tagName*. Optionally, for more specificity, you may specify a *className*, which will determine the value of the `class` attribute on the DOM elements managed.

<a href="#component_render" name="component_render" >#</a> <i>component</i>.<b>render</b>([<i>function</i>])

Sets the render function of this component generator to the specified *function*. This function will be invoked for each instance of the component, passing the *selection* (a D3 selection that contains a single DOM element) and *datum* (the object that determines what will be rendered, similar to `props` in React components). If a *function* is not specified, returns the  render function of this component generator, which defaults to a no-op.

<a href="#component_invoke" name="component_invoke" >#</a> <i>component</i>(<i>selection</i>[,<i>data</i>])

Renders the component to the given *selection*, a D3 selection.

If *data* is specified as an array, one component instance will be rendered for each element of the *data* array and the *[render function](component_render)* will receive a single element of the *data* array as its *datum* argument.

If *data* is specified and is not an array, exactly one component instance will be rendered and the *[render function](component_render)* will receive the *data* value as its *datum* argument.

It *data* is not specified, exactly one component instance will be rendered and the *[render function](component_render)* will receive `undefined` as its *datum* argument.

If *data* is specified as an empty array `[]`, then all previously rendered component instances will be removed from the DOM.
