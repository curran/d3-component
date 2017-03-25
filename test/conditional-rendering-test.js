var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component),
    post = require("./nesting-test").post;


var apple = d3.component("span", "apple"),
    orange = d3.component("span", "orange"),

    // One of the limitations of this library
    // is that you can't have apples and oranges mixed as peers
    // with a data-driven ordering, so you need to introduce
    // an intermediate "switcher" component, like this fruit component here.
    fruit = d3.component("div")
      .render(function (selection, d){
        selection
          .call(apple, d === "apple" || []) // If type matches, pass true as datum, else pass [].
          .call(orange, d === "orange" || [])
      });


tape("Conditional rendering.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter
  div.call(fruit, [ "apple", "orange", "apple", "apple", "orange" ]);
  test.equal(div.html(), [
    '<div><span class="apple"></span></div>',
    '<div><span class="orange"></span></div>',
    '<div><span class="apple"></span></div>',
    '<div><span class="apple"></span></div>',
    '<div><span class="orange"></span></div>'
  ].join(""));

  // Update + Exit
  div.call(fruit, [ "orange", "apple", "apple" ]);
  test.equal(div.html(), [
    '<div><span class="orange"></span></div>',
    '<div><span class="apple"></span></div>',
    '<div><span class="apple"></span></div>'
  ].join(""));

  // Exit
  div.call(fruit, []);
  test.equal(div.html(), "");

  test.end();
});
