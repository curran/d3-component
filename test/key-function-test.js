var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);


var created,
    destroyed,
    apple = d3.component("span", "apple")
      .create(function (){ created++; })
      .destroy(function(){ destroyed++; }),
    orange = d3.component("span", "orange")
      .create(function (){ created++; })
      .destroy(function(){ destroyed++; }),
    renderFruit = function (d){
      d3.select(this)
        .call(apple, d.type === "apple" ? true : [])
        .call(orange, d.type === "orange" ? true : []);
    },
    fruitNotKeyed = d3.component("div", "fruit")
      .render(renderFruit),
    fruitKeyed = d3.component("div", "fruit")
      .render(renderFruit)
      .key(function (d){ return d.id; });

tape("Use index as key if key function not specified.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter.
  created = destroyed = 0;
  div.call(fruitNotKeyed, [
    { id: "a", type: "apple"},
    { id: "b", type: "orange"}
  ]);
  test.equal(created, 2);
  test.equal(destroyed, 0);

  // Update with swap (unnecessary creation and destruction).
  created = destroyed = 0;
  div.call(fruitNotKeyed, [
    { id: "b", type: "orange"},
    { id: "a", type: "apple"}
  ]);
  test.equal(created, 2);
  test.equal(destroyed, 2);

  // Exit (tests recursive destruction).
  created = destroyed = 0;
  div.call(fruitNotKeyed, []);
  test.equal(created, 0);
  test.equal(destroyed, 2);

  test.end();
});

tape("Use key function if specified.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter.
  created = destroyed = 0;
  div.call(fruitKeyed, [
    { id: "a", type: "apple"},
    { id: "b", type: "orange"}
  ]);
  test.equal(created, 2);
  test.equal(destroyed, 0);

  // Update with swap (no unnecessary creation and destruction).
  created = destroyed = 0;
  div.call(fruitKeyed, [
    { id: "b", type: "orange"},
    { id: "a", type: "apple"}
  ]);
  test.equal(created, 0);
  test.equal(destroyed, 0);

  // Exit (tests recursive destruction).
  created = destroyed = 0;
  div.call(fruitKeyed, []);
  test.equal(created, 0);
  test.equal(destroyed, 2);

  test.end();
});
