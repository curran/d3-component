var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);


var entered,
    exited,
    apple = d3.component("span", "apple")
      .enter(function (){ entered++; })
      .exit(function(){ exited++; }),
    orange = d3.component("span", "orange")
      .enter(function (){ entered++; })
      .exit(function(){ exited++; }),
    updateFruit = function (d){
      d3.select(this)
        .call(apple, d.type === "apple" ? true : [])
        .call(orange, d.type === "orange" ? true : []);
    },
    fruitNotKeyed = d3.component("div", "fruit")
      .update(updateFruit),
    fruitKeyed = d3.component("div", "fruit")
      .update(updateFruit)
      .key(function (d){ return d.id; });

tape("Use index as key if key function not specified.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter.
  entered = exited = 0;
  div.call(fruitNotKeyed, [
    { id: "a", type: "apple"},
    { id: "b", type: "orange"}
  ]);
  test.equal(entered, 2);
  test.equal(exited, 0);

  // Update with swap (unnecessary creation and destruction).
  entered = exited = 0;
  div.call(fruitNotKeyed, [
    { id: "b", type: "orange"},
    { id: "a", type: "apple"}
  ]);
  test.equal(entered, 2);
  test.equal(exited, 2);

  // Exit (tests recursive destruction).
  entered = exited = 0;
  div.call(fruitNotKeyed, []);
  test.equal(entered, 0);
  test.equal(exited, 2);

  test.end();
});

tape("Use key function if specified.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter.
  entered = exited = 0;
  div.call(fruitKeyed, [
    { id: "a", type: "apple"},
    { id: "b", type: "orange"}
  ]);
  test.equal(entered, 2);
  test.equal(exited, 0);

  // Update with swap (no unnecessary creation and destruction).
  entered = exited = 0;
  div.call(fruitKeyed, [
    { id: "b", type: "orange"},
    { id: "a", type: "apple"}
  ]);
  test.equal(entered, 0);
  test.equal(exited, 0);

  // Exit (tests recursive destruction).
  entered = exited = 0;
  div.call(fruitKeyed, []);
  test.equal(entered, 0);
  test.equal(exited, 2);

  test.end();
});
