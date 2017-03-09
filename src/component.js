import { select, local } from "d3-selection";
var instanceLocal = local(),
    noop = function (){}; // no operation

export default function (tagName, className){
  var enter = noop,
      update = noop,
      exit = noop,
      key;

  function component(selection, data, context){
    var instances = selection
      .selectAll(children)
      .filter(belongsToMe)
      .data(dataArray(data, context), key);
    instances
      .enter().append(tagName)
        .attr("class", className)
        .each(enterInstance)
      .merge(instances)
        .each(update);
    instances
      .exit()
        .each(exitInstance);
  }

  component.update = function(_) { return (update = _, component); };
  component.enter = function(_) { return (enter = _, component); };
  component.exit = function(_) { return (exit = _, component); };
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

  function enterInstance(d, i, nodes){
    instanceLocal.set(this, {
      owner: component,
      exit: function (){
        return exit.call(this, d, i, nodes);
      }.bind(this)
    });
    enter.call(this, d, i, nodes);
  }

  function exitInstance(){
    select(this).selectAll("*").each(exitDescendant);
    (instanceLocal.get(this).exit() || select(this)).remove();
  }

  function exitDescendant(){
    var instance = instanceLocal.get(this);
    instanceLocal.remove(this) && instance.exit();
  }

  return component;
};
