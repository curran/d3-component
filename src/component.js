import { select, local } from "d3-selection";

var noop = function (){},
    stateLocal = local(),
    renderLocal = local();

function setState(newState){
  var oldState = stateLocal.get(this);
  stateLocal.set(this, Object.assign({}, oldState, newState));
  renderLocal.get(this)();
}

export default function (tagName, className){
  var render = noop,
      create,
      destroy,
      selector = className ? "." + className : tagName;

  function component(selection, props){
    var data = Array.isArray(props) ? props : [props],
        update = selection.selectAll(selector).data(data),
        exit = update.exit(),
        enter = update.enter().append(tagName),
        all = enter.merge(update);

    if(className){
      enter.attr("class", className);
    }

    if(create){
      enter.each(function (){
        renderLocal.set(this, noop);
        create(setState.bind(this));
      });
      if(destroy){
        exit.each(function (){
          renderLocal.set(this, noop);
          destroy(stateLocal.get(this));
        });
      }
      all.each(function (props){
        var rerender = function (){
          select(this).call(render, props, stateLocal.get(this));
        }.bind(this);
        renderLocal.set(this, rerender);
        rerender();
      });
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
