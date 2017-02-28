import { select } from "d3-selection";

var noop = function (){};

export default function (tagName, className){
  var render = noop,
      create = noop,
      destroy = noop,
      selector = className ? "." + className : tagName;

  function component(selection, props){
    var data = Array.isArray(props) ? props : [props],
        update = selection.selectAll(selector).data(data),
        exit = update.exit(),
        enter = update.enter().append(tagName)
        all = enter.merge(update);

    if(className){
      enter.attr("class", className);
    }

    exit.remove();

    all.each(function (d){
      select(this).call(render, d);
    });
  }

  component.render = function(_) { return (render = _, component); };
  component.create = function(_) { return (create = _, component); };
  component.destroy = function(_) { return (destroy = _, component); };

  return component;
};
