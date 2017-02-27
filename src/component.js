import { select, local } from "d3-selection";
export default function (component){
  var className = component.className,
      tagName = component.tagName,
      render = component.render || function(){};

  return function (selection, props){
    var components = selection
      .selectAll(className ? "." + className : tagName)
      .data(Array.isArray(props) ? props : [props]);
    components.exit().remove();
    components
      .enter().append(tagName).attr("class", className)
      .merge(components)
        .each(function (props){
          select(this).call(render, props);
        });
  };
};
