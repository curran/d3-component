import { select, local } from "d3-selection";

var myLocal = local(),
    noop = function (){};

export default function (tagName, className){
  var create = noop,
      render = noop,
      destroy = noop,
      selector = className ? "." + className : tagName;

  function component(selection, props){
    var components = selection
      .selectAll(selector)
      .data(Array.isArray(props) ? props : [props]);

    components
      .enter()
      .append(tagName)
        .attr("class", className)
        .each(function (){
          var my = myLocal.set(this, {
            selection: select(this),
            state: {},
            render: noop
          });
          create(function setState(state){
            Object.assign(my.state, state);
            my.render();
          });
          my.render = function (){
            render(my.selection, my.props, my.state);
          };
        })
      .merge(components)
        .each(function (props){
          var my = myLocal.get(this);
          my.props = props;
          my.render();
        });
    components
      .exit()
        .each(function (){
          destroy(myLocal.get(this).state);
        })
        .remove();
  }

  component.render = function(_) { return (render = _, component); };
  component.create = function(_) { return (create = _, component); };
  component.destroy = function(_) { return (destroy = _, component); };

  return component;
};
