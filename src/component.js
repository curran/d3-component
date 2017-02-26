import { local } from "d3-selection";
export default function (Component){
  var className = Component.className,
      tagName = Component.tagName,
      componentLocal = local();

  return function (context, data){
    var components = context
      .selectAll(className ? "." + className : tagName)
      .data(Array.isArray(data) ? data : [data]);
    components
      .exit()
        .each(function (){
          var instance = componentLocal.get(this);
          if(instance.destroy){ instance.destroy(); }
        })
        .remove();
    components
      .enter().append(tagName)
        .attr("class", className)
        .each(function (){
          componentLocal.set(this, Component());
        })
      .merge(components)
        .each(function (data){
          d3.select(this).call(componentLocal.get(this), data);
        });
  };
};
