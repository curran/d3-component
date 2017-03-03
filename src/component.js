import { select, selectAll } from "d3-selection";
var noop = function (){}, // no operation
    instanceLocal = function (node, value){
      return value ? (node.__instance__ = value) : node.__instance__;
    };

export default function (tagName, className){
  var create = noop,
      render = noop,
      destroy = noop,
      createInstance = function (){
        var instance = instanceLocal(this, {
          selection: select(this),
          state: {},
          render: noop,
          destroy: destroy
        });
        create(instance.selection, function setState(state){
          state = (typeof state === "function") ? state(instance.state) : state;
          Object.assign(instance.state, state);
          instance.render();
        });
        instance.render = function (props){
          instance.props = props || {};
          render(instance.selection, instance.props, instance.state);
        };
      },
      renderInstance = function (props){
        instanceLocal(this).render(props);
      },
      destroyInstance = function (){
        var instance = instanceLocal(this);
        selectAll(this.children).each(destroyInstance);
        if(instance){ instance.destroy(instance.state); }
      },
      selector = className ? "." + className : tagName,
      key;

  function component(selection, props){
    var instances = selection.selectAll(selector)
      .data(Array.isArray(props) ? props : [props], key);
    instances
      .enter().append(tagName)
        .attr("class", className)
        .each(createInstance)
      .merge(instances)
        .each(renderInstance);
    instances
      .exit()
        .each(destroyInstance)
        .remove();
  }
  component.render = function(_) { return (render = _, component); };
  component.create = function(_) { return (create = _, component); };
  component.destroy = function(_) { return (destroy = _, component); };
  component.key = function(_) { return (key = _, component); };

  return component;
};
