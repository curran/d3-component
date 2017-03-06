# d3-component

A component module for [D3.js](d3js.org). Provides the following features:

 * Encapsulation of the [General Update Pattern](https://github.com/d3/d3-selection#selection_merge).
 * Support for recursive components.
 * Reliable `exit` hook.

<table>
  <tr>
    <td>
      <a href="http://bl.ocks.org/curran/fc8f6989901628e2e79d6374849453ed">
        <div>Posts</div>
        <img width="230" height="120" src="http://bl.ocks.org/curran/raw/fc8f6989901628e2e79d6374849453ed/thumbnail.png">
      </a>
    </td>
    <td>
      <a href="http://bl.ocks.org/curran/685fa8300650c4324d571c6b0ecc55de">
        <div>Spinner</div>
        <img width="230" height="120" src="http://bl.ocks.org/curran/raw/685fa8300650c4324d571c6b0ecc55de/thumbnail.png">
      </a>
    </td>
    <td>
      <a href="http://bl.ocks.org/curran/593ffae30c42789a9af36f08c983867e">
        <div>Stopwatch</div>
        <img width="230" height="120" src="http://bl.ocks.org/curran/raw/593ffae30c42789a9af36f08c983867e/thumbnail.png">
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <a href="http://bl.ocks.org/curran/acde35df0c7939ff97740b4f9800258e">
        <div>Counter</div>
        <img width="230" height="120" src="http://bl.ocks.org/curran/raw/acde35df0c7939ff97740b4f9800258e/thumbnail.png">
      </a>
    </td>
    <td>
      <a href="http://bl.ocks.org/curran/d8639546697c7ae3ab46c2544683d53a">
        <div>Todos</div>
        <img width="230" height="120" src="http://bl.ocks.org/curran/raw/d8639546697c7ae3ab46c2544683d53a/thumbnail.png">
      </a>
    </td>
  </tr>
</table>

Primary use case: you are using D3 already, and don't want to adopt an additional framework in order to

 * **build user interfaces around your visualizations** and/or
 * **encapsulate your visualizations as components**.

This component system is similar in concept and functionality to stateless functional [React components](https://facebook.github.io/react/docs/react-component.html). Using this component system, you can easily encapsulate data-driven user interface components as conceptual "boxes-within-boxes", cleanly isolating concerns for various levels of your DOM tree. No special treatment is given to events or event delegation, because the intended use is within a unidirectional data flow architecture like [Redux](http://redux.js.org/).

## Installing

If you use NPM, `npm install d3-component`. Otherwise, download the [latest release](https://github.com/curran/d3-component/releases/latest). You can also load directly from [unpkg.com](https://unpkg.com) as a [standalone library](https://unpkg.com/d3-component@1). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3` global is exported:

```html
<script src="https://unpkg.com/d3@4"></script>
<script src="https://unpkg.com/d3-component@1"></script>
<script>

var myComponent = d3.component("div")
  .enter(function (d, i, nodes){ // Invoked for entering component instances.
    d3.select(this)
        .attr("class", i % 2 ? "even" : "odd")
        .style("font-size", "0px")
      .transition()
        .style("font-size", "30px");
  })
  .update(function (d, i, nodes){ // Invoked for entering AND updating instances.
    d3.select(this).text(d);
  })
  .exit(function (d, i, nodes){ // Invoked for exiting component instances.
    return d3.select(this) // You can return a transition here to delay node removal.
      .transition()
        .style("font-size", "0px");
  });
  
  d3.select("body")
    .call(myComponent, "Hello d3-component!");

</script>
```

[Run the above example](https://bl.ocks.org/curran/c3d9783e641636479fa8e07a480e7233).

## API Reference

<a href="#component" name="component">#</a> <b>component</b>(<i>tagName</i>)

Creates a new component generator that manages and renders into DOM elements of the specified *tagName*.

<a href="#component_update" name="component_update" >#</a> <i>component</i>.<b>update</b>(<i>function</i>)

Sets the update *function* of this component generator. This *function* will be invoked for each component instance during rendering, being passed the current datum (*d*), the current index (*i*), and the current group (*nodes*), with *this* as the current DOM element (same signature as [*selection*.each](https://github.com/d3/d3-selection#selection_each)).

<a href="#component_invoke" name="component_invoke" >#</a> <i>component</i>(<i>selection</i>[,<i>data</i>])

Renders the component to the given *selection*, a D3 selection containing a single DOM element.

 * If *data* is specified as an array, one component instance will be rendered for each element of the *data* array and the *[update function](component_update)* will receive a single element of the *data* array as its *d* argument.
   * **Useful case:** If *data* is specified as an empty array `[]`, previously rendered component instances will be removed.
 * If *data* is specified and is not an array, exactly one component instance will be rendered and the *[update function](component_update)* will receive the *data* value as its *d* argument.
 * It *data* is not specified, exactly one component instance will be rendered and the *[update function](component_update)* will receive an empty object as its *d* argument.

In summary, the following cases are explicitly supported:

 * `selection.call(myComponent, dataObject)` → One instance, update function *d* argument will be `dataObject`.
 * `selection.call(myComponent, dataArray)` → `dataArray.length` instances, update function *d* argument will be `dataArray[i]`
 * `selection.call(myComponent)` → One instance, update function *d* argument will be `{}`.

<a href="#component_enter" name="component_enter" >#</a> <i>component</i>.<b>enter</b>(<i>function</i>)

Sets the enter *function* of this component generator, which will be invoked whenever a new component instance is created, being passed the current datum (*d*), the current index (*i*), and the current group (*nodes*), with *this* as the current DOM element (same signature as [*selection*.each](https://github.com/d3/d3-selection#selection_each)).

<a href="#component_exit" name="component_exit" >#</a> <i>component</i>.<b>exit</b>(<i>function</i>)

Sets the exit *function* of this component generator, which will be invoked whenever a component instance is destroyed, being passed the current datum (*d*), the current index (*i*), and the current group (*nodes*), with *this* as the current DOM element (same signature as [*selection*.each](https://github.com/d3/d3-selection#selection_each)).

When a component instance exits, the exit *function* of all its children is also invoked (recursively), so you can be sure that this *function* will be invoked before the compoent instance is removed from the DOM.

The exit *function* may optionally return a transition, which will defer DOM element removal until after the transition is finished.

<a href="#component_key" name="component_key" >#</a> <i>component</i>.<b>key</b>(<i>function</i>)

Sets the key *function* used in the internal [data join](https://github.com/d3/d3-selection#selection_data) when managing DOM elements for component instances. Specifying a key *function* is optional (the array index is used as the key by default), but will make re-rendering more efficient in cases where *data* arrays get reordered or spliced over time.
