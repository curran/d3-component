import { select, selectAll } from "d3-selection";

function setInstance(node, value){
  return node.__instance__ = value;
}

function getInstance(node, value){
  return node.__instance__;
}

function noop(){};

export default function (tagName, className){
  var create = noop,
      render = noop,
      destroy = noop,
      createInstance = function (){
        var instance = setInstance(this, {
          selection: select(this),
          state: {},
          render: noop
        });
        create(instance.selection, function setState(state){
          Object.assign(instance.state, state);
          instance.render();
        });
        instance.render = function (){
          render(instance.selection, instance.props, instance.state);
        };
        instance.destroy = function (){
          destroy(instance.state);
        }
      },
      renderInstance = function (props){
        var instance = getInstance(this);
        instance.props = props || {};
        instance.render();
      },
      destroyInstance = function (){
        selectAll(this.children).each(destroyInstance);
        var instance = getInstance(this);
        if(instance){
          instance.destroy();
        } else {
          console.log("Fdsafds");
        }
      },
      selector = className ? "." + className : tagName,
      key;

  function component(selection, props){
    var instances = selection.selectAll(selector)
      .data(Array.isArray(props) ? props : [props], key);
    instances
      .enter().append(tagName)
        .attr("class", className)
        .each(createInstance)
      .merge(instances)
        .each(renderInstance);
    instances
      .exit()
        .each(destroyInstance)
        .remove();
  }
  component.render = function(_) { return (render = _, component); };
  component.create = function(_) { return (create = _, component); };
  component.destroy = function(_) { return (destroy = _, component); };
  component.key = function(_) { return (key = _, component); };

  return component;
};
