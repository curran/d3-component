var tape = require("tape"),
    d3 = require("../");

tape("component()", function(test) {
  test.equal(d3.component(function(){}), 42);
  test.end();
});
