import { select, local } from "d3-selection";
var componentLocal = local(),
    noop = function (){};

export default function (tagName, className){
  var create = noop,
      render = noop,
      destroy = noop,
      localCreate = function (){
        var local = componentLocal.set(this, {
          selection: select(this),
          state: {},
          render: noop
        });
        create(local.selection, function setState(state){
          Object.assign(local.state, state);
          local.render();
        });
        local.render = function (){
          render(local.selection, local.props, local.state);
        };
      },
      localRender = function (props){
        var local = componentLocal.get(this);
        local.props = props;
        local.render();
      },
      localDestroy = function (props){
        destroy(componentLocal.get(this).state);
      },
      selector = className ? "." + className : tagName;

  function component(selection, props){
    var components = selection.selectAll(selector)
      .data(Array.isArray(props) ? props : [props]);
    components
      .enter().append(tagName)
        .attr("class", className)
        .each(localCreate)
      .merge(components)
        .each(localRender);
    components
      .exit()
        .each(localDestroy)
        .remove();
  }

  component.render = function(_) { return (render = _, component); };
  component.create = function(_) { return (create = _, component); };
  component.destroy = function(_) { return (destroy = _, component); };

  return component;
};
