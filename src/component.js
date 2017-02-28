import { select, local } from "d3-selection";

var noop = function (){},
    stateLocal = local();

function setState(newState){
  var oldState = stateLocal.get(this);
  stateLocal.set(this, Object.assign({}, oldState, newState));
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
        create(setState.bind(this));
      });
      exit.each(function (){
        destroy(stateLocal.get(this));
      });
    }

    exit.remove();

    all.each(function (props){
      var state = create ? stateLocal.get(this) : undefined;
      select(this).call(render, props, state);
    });
  }

  component.render = function(_) { return (render = _, component); };
  component.create = function(_) { return (create = _, component); };
  component.destroy = function(_) { return (destroy = _, component); };

  return component;
};
