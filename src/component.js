import { select, local } from "d3-selection";
var stateLocal = local(),
    renderLocal = local(),
    noop = function (){};

export default function (tagName, className){
  var render = noop, create, destroy,
      selector = className ? "." + className : tagName;

  function component(selection, props){
    var update = selection.selectAll(selector)
          .data(Array.isArray(props) ? props : [props]),
        exit = update.exit(),
        enter = update.enter().append(tagName).attr("class", className),
        all = enter.merge(update);

    if(create){
      enter.each(function (){
        renderLocal.set(this, noop);
        create(function (state){
          stateLocal.set(this, Object.assign({}, stateLocal.get(this), state));
          renderLocal.get(this)();
        }.bind(this));
      });
      all.each(function (props){
        renderLocal.set(this, function (){
          select(this).call(render, props, stateLocal.get(this));
        }.bind(this));
        renderLocal.get(this)();
      });
      if(destroy){
        exit.each(function (){
          renderLocal.set(this, noop);
          destroy(stateLocal.get(this));
        });
      }
    } else {
      all.each(function (props){
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
