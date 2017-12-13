import { select } from 'd3-selection';

// The name of the property used to store component instances on DOM nodes.
const instanceProperty = '__instance__';

// Sets the component instance property on the given DOM node.
function setInstance(node, value) {
  node[instanceProperty] = value;
}

// Gets the component instance property from the given DOM node.
const getInstance = node => node[instanceProperty];

// Computes the data to pass into the data join from component invocation arguments.
function dataArray(data, context) {
  data = Array.isArray(data) ? data : [data];
  return context ? data.map(d => Object.assign(Object.create(context), d)) : data;
}

// Destroys a descendant component instance.
// Does not remove its DOM node, as one if its ancestors will be removed.
function destroyDescendant() {
  const instance = getInstance(this);
  if (instance) {
    const { selection, datum, destroy, index } = instance;
    destroy(selection, datum, index);
  }
}

// Destroys the component instance and its descendant component instances.
function destroyInstance() {
  const { selection, datum, destroy, index } = getInstance(this);
  selection.selectAll('*').each(destroyDescendant);
  const transition = destroy(selection, datum, index);
  (transition || selection).remove();
}

// No operation.
const noop = () => null;

// The component constructor, exposed as d3.component.
export default function (tagName, className) {
  // Values set via setters.
  let create = noop;
  let render = noop;
  let destroy = noop;
  let key = null;

  // Checks if the given DOM node is managed by this component.
  function belongsToMe(node) {
    const instance = getInstance(node);
    return instance && instance.component === component;
  }

  // Returns DOM children managed by this component.
  function mine() {
    return Array.from(this.children).filter(belongsToMe);
  }

  // Creates a new component instance and stores it on the DOM node.
  function createInstance(datum, index) {
    const selection = select(this);
    setInstance(this, { component, selection, destroy, datum, index });
    create(selection, datum, index);
  }

  // Renders the component instance, and stores its datum for later use (in destroy).
  function renderInstance(datum, index) {
    const instance = getInstance(this);
    instance.datum = datum;
    render(instance.selection, datum, index);
  }

  // The returned component instance.
  function component(container, data, context) {
    const selection = container.nodeName ? select(container) : container;
    const instances = selection
      .selectAll(mine)
      .data(dataArray(data, context), key);
    instances
      .exit()
        .each(destroyInstance);
    return instances
      .enter().append(tagName)
        .attr('class', className)
        .each(createInstance)
      .merge(instances)
        .each(renderInstance);
  }

  // Chainable setters.
  component.render = (_) => { render = _; return component; };
  component.create = (_) => { create = _; return component; };
  component.destroy = (_) => { destroy = _; return component; };
  component.key = (_) => { key = _; return component; };

  return component;
}
