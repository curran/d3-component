import { select, local } from "d3-selection";
var instanceLocal = local();

function noop (){
} // no operation

function children(){
  return this.children;
}

function destroyInstance(d, i){
  select(this).selectAll("*").each(function (){
    var instance = instanceLocal.get(this);
    instanceLocal.remove(this) && instance.destroy();
  });
  (instanceLocal.get(this).destroy(d, i) || select(this)).remove();
}

export default function (tagName){
  var create = noop,
      render = noop,
      destroy = noop,
      key;

  function setInstance(d, i){
    instanceLocal.set(this, {
      owner: component,
      destroy: function (){
        return destroy.call(this, d, i);
      }.bind(this)
    });
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
        .each(setInstance)
        .each(create)
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

  return component;
};
