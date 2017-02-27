import { select, local } from "d3-selection";
export default function (Component){
  var className = Component.className,
      tagName = Component.tagName,
      componentLocal = local();

  return function (selection, props){
    var components = selection
      .selectAll(className ? "." + className : tagName)
      .props(Array.isArray(props) ? props : [props]);
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
        .each(function (props){
          select(this).call(componentLocal.get(this), props);
        });
  };
};
