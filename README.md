# d3-component

A D3 component system.

<table>
  <tr>
    <td>
      <a href="http://bl.ocks.org/curran/fc8f6989901628e2e79d6374849453ed">
        <div>Posts with D3 Component</div>
        <img width="230" height="120" src="http://bl.ocks.org/curran/raw/fc8f6989901628e2e79d6374849453ed/thumbnail.png">
      </a>
    </td>
    <td>
      <a href="http://bl.ocks.org/curran/685fa8300650c4324d571c6b0ecc55de">
        <div>Spinner with D3 Component</div>
        <img width="230" height="120" src="http://bl.ocks.org/curran/raw/685fa8300650c4324d571c6b0ecc55de/thumbnail.png">
      </a>
    </td>
  </tr>
</table>

## Installing

If you use NPM, `npm install d3-component`. Otherwise, download the [latest release](https://github.com/curran/d3-component/releases/latest). You can also load directly from [unpkg.com](https://unpkg.com) as a [standalone library](https://unpkg.com/d3-component@0.1). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3` global is exported:

```html
<script src="https://unpkg.com/d3-selection@1.0"></script>
<script src="https://unpkg.com/d3-component@0.3"></script>
<script>

var apple = d3.component("div", "apple");

</script>
```
## API Reference

<a href="#component" name="component">#</a> <b>component</b>(<i>tagName</i>[, <i>className</i>])

Creates a new component generator that manages and renders into DOM elements of the specified *tagName*. Optionally, you may specify a *className*, which will determine the value of the `class` attribute on the DOM elements managed.

<a href="#component_render" name="component_render" >#</a> <i>component</i>.<b>render</b>([<i>function</i>])

Sets the render function of this component generator to the specified *function*. This function will be invoked for each instance of the component, passing the following arguments:

 * *selection* a D3 selection that contains a single DOM element
 * *props* the object that determines what will be rendered
 * *state* the current local state of the component

**Note:** The value of the *state* argument will be an empty object unless *setState* was invoked inside the `[create](#component_create)` lifecycle hook.

For example, here we define a component that creates an `<h1>` and sets its text.

```js
var heading = d3.component("h1")
  .render(function (selection, props){
    selection.text(props.text);
  });
```

<a href="#component_invoke" name="component_invoke" >#</a> <i>component</i>(<i>selection</i>[,<i>data</i>])

Renders the component to the given *selection*, a D3 selection. If *data* is specified as an array, one component instance will be rendered for each element of the *data* array and the *[render function](component_render)* will receive a single element of the *data* array as its *datum* argument. If *data* is specified and is not an array, exactly one component instance will be rendered and the *[render function](component_render)* will receive the *data* value as its *datum* argument. It *data* is not specified, exactly one component instance will be rendered and the *[render function](component_render)* will receive `undefined` as its *datum* argument. If *data* is specified as an empty array `[]`, then all previously rendered component instances will be removed from the DOM.

For example, here's what it looks like to render an instance of our `heading` component defined above.

```js
d3.select("#some-container-div")
  .call(heading, { text: "Hello Component" });
```

The following DOM structure will be rendered.

```html
<div id="some-container-div">
  <h1>Hello Component</h1>
</div>
```

<a href="#component_create" name="component_create" >#</a> <i>component</i>.<b>create</b>([<i>function</i>])

Sets the lifecycle hook for component instance creation. This allows you to construct DOM structures when the component instance is instantiated, and allows you to use local state. The specified *function* will be invoked whenever a new component instance is created, and will be passed the following arguments:

 * *selection* a D3 selection that contains a single DOM element.
 * *setState* A function that can be used to set the local state of the component instance. The *setState* function accepts a single argument *state*, an object, and assigns all properties present on the *state* object to the previous state object. Any properties on the previous state object that are not present in the new state object will not be removed. After the initial render, whenever *setState* is invoked, the component re-renders itself, passing the new state into the render function.

For example, here's a component that leverages <b>create</b> to construct a deeply nested DOM structure when the component instance gets created.

```js
var card = d3.component("div", "card")
  .create(function (selection){
    selection
      .append("div").attr("class", "card-block")
      .append("div").attr("class", "card-text");
  })
  .render(function (selection, props){
    selection.select(".card-text").text(props.text);
  });
```

Here's how we would render an instance of the `card` component.

```js
d3.select("#some-container-div")
  .call(card, { text: "I'm in a card." });
```

The following DOM structure will be rendered.

```html
<div id="some-container-div">
  <div class="card">
    <div class="card-block">
      <div class="card-text">
        I'm in a card.
      </div>
    </div>
  </div>
</div>
```

<a href="#component_destroy" name="component_destroy" >#</a> <i>component</i>.<b>destroy</b>([<i>function</i>])

Sets the lifecycle hook for component instance destruction. Only use this if your component uses local state. The specified *function* will be invoked whenever a new component instance is destroyed, and will be passed a single argument *state*, the local state of the component instance.

## Composing Components

Components can use other components in their render functions. Some useful patterns for component composition are:

 * [Nesting](#nesting)
 * [Containment](#containment)
 * [Conditional Rendering](#conditional_rendering)

### Nesting

Here's an example of a `post` component that composes two other components, `heading` and `paragraph`.

```js
var heading = d3.component("h1")
      .render(function (selection, props){
        selection.text(props.text);
      }),
    paragraph = d3.component("p")
      .render(function (selection, props){
        selection.text(props.text);
      }),
    post = d3.component("div", "post")
      .render(function (selection, props){
        selection
          .call(heading, { text: props.title })
          .call(paragraph, { text: props.content });
      });
```

Here's how we would render an instance of the `post` component.

```js
d3.select("#some-container-div");
  .call(post, {
    title: "Title",
    content: "Content here."
  });
```

The following DOM structure will be rendered.

```html
<div id="some-container-div">
  <div class="post">
    <h1>Title</h1>
    <p>Content here.</p>
  </div>
</div>
```

Here's an example of rendering multiple component instances.

```js
d3.select("#some-container-div")
  .call(post, [
    { title: "A Title", content: "a content" },
    { title: "B Title", content: "b content" },
  ]);
```

The following HTML structure will be rendered.

```html
<div id="some-container-div">
  <div class="post">
    <h1>A Title</h1>
    <p>a content</p>
  </div>
  <div class="post">
    <h1>B Title</h1>
    <p>b content</p>
  </div>
</div>
```

### Containment

Sometimes children components are not known in advance. This is often the case for components that serve as "boxes" that can contain arbitrary content, such as cards or dialogs.

Here's an example of a `card` component that can render arbitrary chilren.

```js
var card = d3.component("div", "card")
  .create(function (selection){
    selection
      .append("div").attr("class", "card-block")
      .append("div").attr("class", "card-text");
  })
  .render(function (selection, props){
    selection.select(".card-text")
        .call(props.childComponent, props.childProps);
  });
```

Here's how we can use this `card` component to render a card that contains instances of the `post` component.

```js
d3.select("#some-container-div")
  .call(card, {
    childComponent: post,
    childProps: [
      { title: "A Title", content: "a content" },
      { title: "B Title", content: "b content" },
    ]
  });
```

The following DOM structure will be rendered.

```html
<div id="some-container-div">
  <div class="card">
    <div class="card-block">
      <div class="card-text">
        <div class="post"><h1>A Title</h1><p>a content</p></div>
        <div class="post"><h1>B Title</h1><p>b content</p></div>
      </div>
    </div>
  </div>
</div>
```

### Conditional Rendering

Sometimes components should render sub-components only under certain conditions. To achieve this, the `props` passed into the sub-component can either be `[]` to render zero component instances, or any other value to render one or many component instances. Even if a sub-component is not rendered, it still needs to be invoked with its `props` as `[]`, in the case that it was rendered previously and its instances need to be removed from the DOM.

Here's an example of a `fruit` component that conditionally renders either `apple` or `orange` components, depending on the value of `props.type`.

```js
var apple = d3.component("span", "apple")
    orange = d3.component("span", "orange")
    fruit = d3.component("div", "fruit")
      .render(function (selection, props){
        selection
          .call(apple, props.type === "apple"? {} : [])
          .call(orange, props.type === "orange"? {} : [])
      });
```

Here's how we can use this `fruit` component.

```js
d3.select("#some-container-div")
  .call(fruit, [
    { type: "apple" },
    { type: "orange" },
    { type: "apple" },
    { type: "apple" },
    { type: "orange" }
  ]);
```

The following DOM structure will be rendered.

```html
<div id="some-container-div">
  <div class="fruit"><span class="apple"></span></div>
  <div class="fruit"><span class="orange"></span></div>
  <div class="fruit"><span class="apple"></span></div>
  <div class="fruit"><span class="apple"></span></div>
  <div class="fruit"><span class="orange"></span></div>
</div>
```

## Parallels with React Components

 * `props`
 (similar to `props` in React components)
 * `state`
 * `setState`
 * Lifecycle Hooks
   * *create*
