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
        instance.props = props;
        instance.render();
      },
      destroyInstance = function (props){
        destroy(instanceLocal.get(this).state);
      },
      selector = className ? "." + className : tagName;

  function component(selection, props){
    var instances = selection.selectAll(selector)
      .data(Array.isArray(props) ? props : [props]);
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

  return component;
};
