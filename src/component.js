import { select } from "d3-selection";
export default function (component){
  var className = component.className,
      tagName = component.tagName,
      render = component.render || function(){};

  return function (selection, data){
    var components = selection
      .selectAll(className ? "." + className : tagName)
      .data(Array.isArray(data) ? data : [data]);
    components.exit().remove();
    components
      .enter().append(tagName).attr("class", className)
      .merge(components)
        .each(function (data){
          select(this).call(render, data);
        });
  };
};
