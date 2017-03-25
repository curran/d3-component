import { select } from 'd3-selection';

const instanceProperty = '__instance__';

function setInstance(node, value) {
  node[instanceProperty] = value;
}

function getInstance(node) {
  return node[instanceProperty];
}

function dataArray(data, context) {
  data = Array.isArray(data) ? data : [data];
  return context ? data.map(d => Object.assign(Object.create(context), d)) : data;
}

function destroyInstance() {
  select(this).selectAll('*').each(destroyDescendant);
  const instance = getInstance(this);
  const transition = instance.destroy(instance.selection, instance.datum);
  (transition || instance.selection).remove();
}

function destroyDescendant() {
  const instance = getInstance(this);
  if (instance) {
    instance.destroy(instance.selection, instance.datum);
  }
}

function noop() {} // no operation

export default function (tagName, className) {
  let create = noop;
  let render = noop;
  let destroy = noop;
  let key;

  function mine() {
    return Array.from(this.children).filter(belongsToMe);
  }

  function belongsToMe(node) {
    const instance = getInstance(node);
    return instance && instance.component === component;
  }

  function createInstance(datum) {
    const selection = select(this);
    setInstance(this, { component, selection, destroy, datum });
    create(selection, datum);
  }

  function renderInstance(datum) {
    const instance = getInstance(this);
    instance.datum = datum; // Required later for destroy hook.
    render(instance.selection, datum);
  }

  function component(container, data, context) {
    const selection = container.nodeName ? select(container) : container;
    const instances = selection.selectAll(mine)
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

  component.render = (_) => { render = _; return component; };
  component.create = (_) => { create = _; return component; };
  component.destroy = (_) => { destroy = _; return component; };
  component.key = (_) => { key = _; return component; };

  return component;
}
