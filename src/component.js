import { select, local } from "d3-selection";
var myLocal = local(),
    noop = function (){};

export default function (tagName, className){
  var create = noop,
      render = noop,
      destroy = noop,
      myCreate = function (){
        var my = myLocal.set(this, {
          selection: select(this),
          state: {},
          render: noop
        });
        create(my.selection, function setState(state){
          Object.assign(my.state, state);
          my.render();
        });
        my.render = function (){
          render(my.selection, my.props, my.state);
        };
      },
      myRender = function (props){
        var my = myLocal.get(this);
        my.props = props;
        my.render();
      },
      myDestroy = function (props){
        destroy(myLocal.get(this).state);
      },
      selector = className ? "." + className : tagName;

  function component(selection, props){
    var components = selection.selectAll(selector)
      .data(Array.isArray(props) ? props : [props]);
    components
      .enter().append(tagName)
        .attr("class", className)
        .each(myCreate)
      .merge(components)
        .each(myRender);
    components
      .exit()
        .each(myDestroy)
        .remove();
  }

  component.render = function(_) { render = _; return component; };
  component.create = function(_) { create = _; return component; };
  component.destroy = function(_) { destroy = _; return component; };

  return component;
};
