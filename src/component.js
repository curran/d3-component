import { select, selectAll, local } from "d3-selection";
var noop = function (){}, // no operation
    instanceLocal = local();

export default function (tagName, className){
  var create = noop,
      render = noop,
      destroy = noop,
      createInstance = function (){
        var instance = instanceLocal.set(this, {
          selection: select(this),
          state: {},
          render: noop,
          destroy: destroy,
          component: component
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
        instanceLocal.get(this).render(props);
      },
      destroyInstance = function (){
        var instance = instanceLocal.get(this);
        instanceLocal.remove(this);
        selectAll(this.children).each(destroyInstance);
        if(instance){ instance.destroy(instance.state); }
      },
      key;

  function component(selection, props){
    var instances = selection.selectAll(tagName)
      .filter(function (){
        return instanceLocal.get(this).component === component;
      })
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
