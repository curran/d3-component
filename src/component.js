import local from "d3-local";
export default function (Component){
  var className = Component.className,
      tagName = Component.tagName,
      componentLocal = local();

  return function (context, props){
    var components = context
      .selectAll(className ? "." + className : tagName)
      .data(Array.isArray(props) ? props : [props]);
    components
      .exit()
        .each(function (){
          var componentInstance = componentLocal.get(this);
          if(componentInstance.destroy){ componentInstance.destroy(); }
        })
        .remove();
    components
      .enter()
      .append(Component.tagName)
        .attr("class", 
        .each(function (){
          componentLocal.set(this, Component());
        })
      .merge(components)
        .each(function (props){
          d3.select(this).call(componentLocal.get(this), props);
        });
  };
};
