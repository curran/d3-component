import { select, local } from "d3-selection";
var instanceLocal = local(),
    noop = function (){}; // no operation

export default function (tagName, className){
  var create = noop,
      render = noop,
      destroy = noop,
      key;

  function component(selection, data, context){
    var instances = selection
      .selectAll(children)
      .filter(belongsToMe)
      .data(dataArray(data, context), key);
    instances
      .enter().append(tagName)
        .attr("class", className)
        .each(createInstance)
      .merge(instances)
        .each(render);
    instances
      .exit()
        .each(destroyInstance);
  }

  component.render = function(_) { return (render = _, component); };
  component.create = function(_) { return (create = _, component); };
  component.destroy = function(_) { return (destroy = _, component); };
  component.key = function(_) { return (key = _, component); };

  function children(){
    return this.children;
  }

  function belongsToMe(){
    var instance = instanceLocal.get(this);
    return instance && instance.owner === component;
  }

  function dataArray(data, context){
    data = Array.isArray(data) ? data : [data];
    return context ? data.map(function (d){
      return Object.assign({}, d, context);
    }) : data;
  }

  function createInstance(d, i, nodes){
    instanceLocal.set(this, {
      owner: component,
      destroy: function (){
        return destroy.call(this, d, i, nodes);
      }.bind(this)
    });
    create.call(this, d, i, nodes);
  }

  function destroyInstance(){
    select(this).selectAll("*").each(destroyDescendant);
    (instanceLocal.get(this).destroy() || select(this)).remove();
  }

  function destroyDescendant(){
    var instance = instanceLocal.get(this);
    instanceLocal.remove(this) && instance.destroy();
  }

  return component;
};
