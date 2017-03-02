import { select, local } from "d3-selection";
var instanceLocal = local(),
    noop = function (){};

export default function (tagName, className){
  var create = noop,
      render = noop,
      destroy = noop,
      createInstance = function (){
        var instance = instanceLocal.set(this, {
          selection: select(this),
          state: {},
          render: noop
        });
        create(instance.selection, function setState(state){
          Object.assign(instance.state, state);
          instance.render();
        });
        instance.render = function (){
          render(instance.selection, instance.props, instance.state);
        };
      },
      renderInstance = function (props){
        var instance = instanceLocal.get(this);
        instance.props = props || {};
        instance.render();
      },
      destroyInstance = function (){
        var instance = instanceLocal.get(this);
        if(instance){
          instance.selection.selectAll("*").each(destroyInstance);
          (destroy(instance.state) || instance.selection).remove();
        }
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
    instances.exit().each(destroyInstance);
  }
  component.render = function(_) { return (render = _, component); };
  component.create = function(_) { return (create = _, component); };
  component.destroy = function(_) { return (destroy = _, component); };
  component.key = function(_) { return (key = _, component); };

  return component;
};
