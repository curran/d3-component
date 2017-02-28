import { select } from "d3-selection";

var noop = function (){};

export default function (tagName, className){
  var render = noop,
      create = noop,
      destroy = noop,
      selector = className ? "." + className : tagName;

  function component(selection, data){
    var components = selection
      .selectAll(selector)
      .data(Array.isArray(data) ? data : [data]);

    components
      .exit().remove();

    components
      .enter().append(tagName)
        .attr("class", className)
      .merge(components)
        .each(function (d){ select(this).call(render, d); });
  }

  component.render = function(_) { return (render = _, component); };
  component.create = function(_) { return (create = _, component); };
  component.destroy = function(_) { return (destroy = _, component); };

  return component;
};
