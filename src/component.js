import { select, local } from "d3-selection";

var componentLocal = local(),
    noop = function (){};

export default function (tagName, className){
  var create,
      render = noop,
      destroy = noop,
      selector = className ? "." + className : tagName;

  function component(selection, props){
    var components = selection
      .selectAll(selector)
      .data(Array.isArray(props) ? props : [props]);

    components
      .enter()
      .append(tagName)
        .attr("class", className)
        .each(function (){
          var local = componentLocal.set(this, {
            selection: select(this),
            state: {},
            render: noop
          });
          if(create){
            create(function setState(state){
              Object.assign(local.state, state);
              local.render();
            });
          }
        })
      .merge(components)
        .each(function (props){
          var local = componentLocal.get(this);
          if(local.render === noop){
            local.render = function (){
              render(local.selection, local.props, local.state);
            };
          }
          local.props = props;
          local.render();
        });
    components
      .exit()
        .each(function (){
          destroy(componentLocal.get(this).state);
        })
        .remove();
  }

  component.render = function(_) { return (render = _, component); };
  component.create = function(_) { return (create = _, component); };
  component.destroy = function(_) { return (destroy = _, component); };

  return component;
};
