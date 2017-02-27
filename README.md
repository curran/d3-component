# d3-component

A D3 component system.

## Installing

If you use NPM, `npm install d3-component`. Otherwise, download the [latest release](https://github.com/curran/d3-component/releases/latest).

## API Reference

<a href="#component" name="component">#</a> <b>component</b>(<i>tagName</i>[, <i>className</i>])

Creates a new component generator that manages DOM elements of the specified *tagName*. Optionally, for more specificity, you may specify a *className*, which will determine the value of the `class` attribute on the DOM elements managed.

<a href="#component_render" name="component_render" >#</a> <i>component</i>.<b>render</b>([<i>function</i>])

Sets the render function of this component generator to the specified *function*. This function will be invoked for each instance of the component, passing the *selection* (a D3 selection that contains a single DOM element) and *datum* (the object that determines what will be rendered, similar to `props` in React components). If a *function* is not specified, returns the  render function of this component generator, which defaults to a no-op.
