var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);

var createArgs = [],
    renderArgs = [],
    destroyArgs = [],
    argsTester = d3.component("div")
      .create(function () {
        createArgs.push(arguments);
      })
      .render(function () {
        renderArgs.push(arguments);
      })
      .destroy(function (selection, datum, index) {
        destroyArgs.push(arguments);
      });

tape("Multiple instances should have correct indices.", function(test) {
  createArgs = [];
  renderArgs = [];
  destroyArgs = [];

  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(argsTester, ["one", "two", "three"]);

  test.equal(createArgs.length, 3);
  test.equal(createArgs[0][2], 0);
  test.equal(createArgs[1][2], 1);
  test.equal(createArgs[2][2], 2);

  test.equal(renderArgs.length, 3);
  test.equal(renderArgs[0][2], 0);
  test.equal(renderArgs[1][2], 1);
  test.equal(renderArgs[2][2], 2);

  div.call(argsTester, []);
  test.equal(destroyArgs.length, 3);
  test.equal(destroyArgs[0][2], 0);
  test.equal(destroyArgs[1][2], 1);
  test.equal(destroyArgs[2][2], 2);

  test.end();
});

tape("Single instances should have index 0.", function(test) {
  createArgs = [];
  renderArgs = [];
  destroyArgs = [];
  
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(argsTester, "one");

  test.equal(createArgs.length, 1);
  test.equal(createArgs[0][2], 0);

  test.equal(renderArgs.length, 1);
  test.equal(renderArgs[0][2], 0);

  div.call(argsTester, []);
  test.equal(destroyArgs.length, 1);

  test.end();
});
