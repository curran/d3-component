import { select } from "d3-selection";

export default function (tagName, className){
  var render = function(){};

  function component(selection, data){
    var components = selection
      .selectAll(className ? "." + className : tagName)
      .data(Array.isArray(data) ? data : [data]);
    components
      .exit().remove();
    components
      .enter().append(tagName)
        .attr("class", className)
      .merge(components)
        .each(function (d){ select(this).call(render, d); });
  }

  component.render = function(_) {
    return arguments.length ? (render = _, component) : render;
  };

  return component;
};
