var tape = require("tape"),
    component = require("../");

tape("component()", function(test) {
  test.equal(component(function(){}), 42);
  test.end();
});
