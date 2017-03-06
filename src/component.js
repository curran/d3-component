import { select, local } from "d3-selection";

var instanceLocal = local();

function noop (){} // no operation

function children(){
  return this.children;
}

function exitInstance(){
  select(this).selectAll("*").each(function (){
    var instance = instanceLocal.get(this);
    instanceLocal.remove(this) && instance.exit();
  });
  var transition = instanceLocal.get(this).exit();
  (transition || select(this)).remove();
}

export default function (tagName){
  var enter = noop,
      update = noop,
      exit = noop,
      key;

  function enterInstance(d, i, nodes){
    instanceLocal.set(this, {
      owner: component,
      exit: function (){
        return exit.call(this, d, i, nodes);
      }.bind(this)
    });
    enter.call(this, d, i, nodes);
  }

  function belongsToMe(){
    var instance = instanceLocal.get(this);
    return instance && instance.owner === component;
  }

  function component(selection, data){
    var instances = selection
      .selectAll(children)
      .filter(belongsToMe)
      .data(Array.isArray(data) ? data : [data], key);
    instances
      .enter().append(tagName)
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

  return component;
};
