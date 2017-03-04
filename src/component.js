import { select, local } from "d3-selection";
var noop = function (){}, // no operation
    instanceLocal = local();

export default function (tagName, className){
  var create = noop,
      render = noop,
      destroy = noop,
      key,
      createInstance = function (){
        var instance = instanceLocal.set(this, {
          selection: select(this),
          state: {},
          render: noop,
          owner: component
        });
        create(instance.selection, function setState(state){
          state = (typeof state === "function") ? state(instance.state) : state;
          Object.assign(instance.state, state);
          instance.render();
        });
        instance.render = function (){
          render(instance.selection, instance.props, instance.state);
        };
        instance.destroy = function (){
          destroy(instance.selection, instance.state);
        };
      },
      renderInstance = function (props){
        var instance = instanceLocal.get(this);
        instance.props = props || {};
        instance.render();
      },
      destroyInstance = function (){
        var instance = instanceLocal.get(this);
        instance.selection
          .selectAll("*")
            .each(function (){
              var instance = instanceLocal.get(this);
              instanceLocal.remove(this) && instance.destroy();
            })
            .remove();
        instance.destroy();
        instance.selection.remove();
      },
      children = function (){ return this.children; },
      belongsToMe = function (){
        var instance = instanceLocal.get(this);
        return instance && instance.owner === component;
      };

  function component(selection, props){
    var instances = selection.selectAll(children).filter(belongsToMe)
      .data(Array.isArray(props) ? props : [props], key);
    instances
      .enter().append(tagName).attr("class", className)
        .each(createInstance)
      .merge(instances)
        .each(renderInstance);
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
