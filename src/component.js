import { select } from 'd3-selection';

const setInstance = (node, value) => { node.__instance__ = value; }; // no operation
const getInstance = node => node.__instance__;
const noop = () => {};

export default function (tagName, className) {
  let create = noop;
  let render = noop;
  let destroy = noop;
  let key;

  function component(selection, data, context) {
    const instances = (selection.nodeName ? select(selection) : selection)
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
        .each(render);
  }

  function mine() {
    return Array.from(this.children).filter(belongsToMe);
  }

  function belongsToMe(node) {
    const instance = getInstance(node);
    return instance && instance.owner === component;
  }

  function dataArray(data, context) {
    data = Array.isArray(data) ? data : [data];
    return context ? data.map(d => Object.assign(Object.create(context), d)) : data;
  }

  function createInstance(d, i, nodes) {
    setInstance(this, {
      owner: component,
      destroy: () => destroy.call(this, d, i, nodes)
    });
    create.call(this, d, i, nodes);
  }

  function destroyInstance() {
    select(this).selectAll('*').each(destroyDescendant);
    (getInstance(this).destroy() || select(this)).remove();
  }

  function destroyDescendant() {
    const instance = getInstance(this);
    if (instance) { instance.destroy(); }
  }

  component.render = (_) => {
    render = _;
    return component;
  };
  component.create = (_) => {
    create = _;
    return component;
  };
  component.destroy = (_) => {
    destroy = _;
    return component;
  };
  component.key = (_) => {
    key = _;
    return component;
  };

  return component;
}
