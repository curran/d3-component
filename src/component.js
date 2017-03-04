import { select, local } from "d3-selection";
var noop = function (){}, // no operation
    instanceLocal = local();

function Instance(node, component){

    this.selection = select(node);
    this.state = {};
    this.owner = component;

    component.create()(this.selection, function setState(state){
      state = (typeof state === "function") ? state(this.state) : state;
      this.state = Object.assign({}, this.state, state);
      this.render && this.render();
    }.bind(this));

    this.render = function (props){
      this.props = props ? props : this.props;
      this.owner.render()(this.selection, this.props, this.state);
    };
}
Instance.prototype = {
  destroy: function (){
    return this.owner.destroy()(this.selection, this.state);
  }
};

export default function (tagName, className){
  var create = noop,
      render = noop,
      destroy = noop,
      key,
      createInstance = function (){
        instanceLocal.set(this, new Instance(this, component));
      },
      renderInstance = function (props){
        instanceLocal.get(this).render(props || {});
      },
      destroyInstance = function (){
        var instance = instanceLocal.get(this);
        instance.selection
          .selectAll("*")
            .each(function (){
              var instance = instanceLocal.get(this);
              instanceLocal.remove(this) && instance.destroy();
            })
            .remove();
        (instance.destroy() || instance.selection).remove();
      },
      children = function (){ return this.children; },
      belongsToMe = function (){
        var instance = instanceLocal.get(this);
        return instance && instance.owner === component;
      };

  function component(selection, props){
    var instances = selection.selectAll(children).filter(belongsToMe)
      .data(Array.isArray(props) ? props : [props], key);
    instances
      .enter().append(tagName).attr("class", className)
        .each(createInstance)
      .merge(instances)
        .each(renderInstance);
    instances
      .exit()
        .each(destroyInstance);
  }

  component.render = function(_) {
    return arguments.length ? (render = _, component) : render;
  };

  component.create = function(_) {
    return arguments.length ? (create = _, component) : create;
  };

  component.destroy = function(_) {
    return arguments.length ? (destroy = _, component) : destroy;
  };

  component.key = function(_) {
    return arguments.length ? (key = _, component) : key;
  };

  return component;
};
