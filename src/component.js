import { select, local } from "d3-selection";

var componentLocal = local(),
    noop = function (){};

export default function (tagName, className){
  var create,
      render = noop,
      destroy = noop,
      selector = className ? "." + className : tagName;

  function component(selection, props){
    var update = selection.selectAll(selector)
          .data(Array.isArray(props) ? props : [props]),
        exit = update.exit(),
        enter = update.enter().append(tagName).attr("class", className);

    enter.each(function (){
      componentLocal.set(this, {
        selection: select(this)
      });
    });

    if(create){
      enter.each(function (){
        var local = componentLocal.get(this);
        local.state = {};
        local.render = noop;
        create(function setState(state){
          Object.assign(local.state, state);
          local.render();
        });
      });
      enter.merge(update).each(function (props){
        var local = componentLocal.get(this);
        if(local.render === noop){
          local.render = function (){
            render(local.selection, local.props, local.state);
          };
        }
        local.props = props;
        local.render();
      });
      exit.each(function (){
        destroy(componentLocal.get(this).state);
      });
    } else {
      enter.merge(update).each(function (props){
        render(componentLocal.get(this).selection, props);
      });
    }
    exit.remove();
  }

  component.render = function(_) { return (render = _, component); };
  component.create = function(_) { return (create = _, component); };
  component.destroy = function(_) { return (destroy = _, component); };

  return component;
};
