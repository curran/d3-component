var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(require("../"), require("d3-selection"));

/*************************************
 ************ Components *************
 *************************************/

// Conditional rendering
var apple = d3.component("span", "apple")
    orange = d3.component("span", "orange")
    fruit = d3.component("div", "fruit")
      .render(function (selection, props){
        selection
          .call(apple, props.type === "apple"? {} : [])
          .call(orange, props.type === "orange"? {} : [])
      });

/*************************************
 ************** Tests ****************
 *************************************/

tape("Conditional rendering.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter
  div.call(fruit, [
    { type: "apple" },
    { type: "orange" },
    { type: "apple" },
    { type: "apple" },
    { type: "orange" }
  ]);
  test.equal(div.html(), [
    '<div class="fruit"><span class="apple"></span></div>',
    '<div class="fruit"><span class="orange"></span></div>',
    '<div class="fruit"><span class="apple"></span></div>',
    '<div class="fruit"><span class="apple"></span></div>',
    '<div class="fruit"><span class="orange"></span></div>'
  ].join(""));

  // Update + Exit
  div.call(fruit, [
    { type: "orange" },
    { type: "apple" },
    { type: "apple" }
  ]);
  test.equal(div.html(), [
    '<div class="fruit"><span class="orange"></span></div>',
    '<div class="fruit"><span class="apple"></span></div>',
    '<div class="fruit"><span class="apple"></span></div>'
  ].join(""));

  test.end();
});
