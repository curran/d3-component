import { select, local } from "d3-selection";

var componentLocal = local();

export default function (tagName, className){
  var create,
      render = function (){},
      destroy = function (){},
      selector = className ? "." + className : tagName;

  function component(selection, props){
    var update = selection.selectAll(selector)
          .data(Array.isArray(props) ? props : [props]),
        exit = update.exit(),
        enter = update.enter().append(tagName).attr("class", className);

    if(create){
      enter.each(function (){
        var local = componentLocal.set(this, {
          state: {},
          render: function (){}
        });
        create(function setState(state){
          Object.assign(local.state, state);
          local.render();
        });
      });
      enter.merge(update).each(function (props){
        var local = componentLocal.get(this),
            selection = select(this);
        (local.render = function (){
          selection.call(render, props, local.state);
        })();
      });
      exit.each(function (){
        destroy(componentLocal.get(this).state);
      });
    } else {
      enter.merge(update).each(function (props){
        select(this).call(render, props);
      });
    }
    exit.remove();
  }
  component.render = function(_) { return (render = _, component); };
  component.create = function(_) { return (create = _, component); };
  component.destroy = function(_) { return (destroy = _, component); };

  return component;
};
