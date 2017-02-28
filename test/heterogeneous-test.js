var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(require("../"), require("d3-selection"));

/*************************************
 ************ Components *************
 *************************************/

// Heterogeneous component trees.
var apple = d3.component("span", "apple")
      .render(function (selection, d){ selection.text(d); }),
    orange = d3.component("span", "orange")
      .render(function (selection, d){ selection.text(d); }),
    fruit = d3.component("div", "fruit")
      .render(function (selection, d){
        selection
          .call(apple, d === "apple" || [])
          .call(orange, d === "orange" || []);
      }),
    fruitBasket = d3.component("div", "fruit-basket")
      .render(function (selection, d){
        selection
          .call(apple, d.apples || [])
          .call(orange, d.oranges || []);
      });

/*************************************
 ************** Tests ****************
 *************************************/

tape("Conditional components with classes.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter
  div.call(fruit, ["apple", "orange", "apple", "apple", "orange"]);
  test.equal(div.html(), [
    '<div class="fruit"><span class="apple">true</span></div>',
    '<div class="fruit"><span class="orange">true</span></div>',
    '<div class="fruit"><span class="apple">true</span></div>',
    '<div class="fruit"><span class="apple">true</span></div>',
    '<div class="fruit"><span class="orange">true</span></div>'
  ].join(""));

  // Update + Exit
  div.call(fruit, ["orange", "apple", "apple"]);
  test.equal(div.html(), [
    '<div class="fruit"><span class="orange">true</span></div>',
    '<div class="fruit"><span class="apple">true</span></div>',
    '<div class="fruit"><span class="apple">true</span></div>'
  ].join(""));

  test.end();
});

tape("Multiple nested component types.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter
  div.call(fruitBasket, {
    apples: ["Red Delicious", "Honeycrisp"],
    oranges: ["Navel", "Mandarin", "Pomelo"]
  });
  test.equal(div.html(), [
    '<div class="fruit-basket">',
      '<span class="apple">Red Delicious</span>',
      '<span class="apple">Honeycrisp</span>',
      '<span class="orange">Navel</span>',
      '<span class="orange">Mandarin</span>',
      '<span class="orange">Pomelo</span>',
    "</div>"
  ].join(""));

  // Update + Enter + Exit
  div.call(fruitBasket, [
    {
      apples: ["Red Delicious", "Honeycrisp", "Granny Nice"],
      oranges: ["Navel", "Pomelo"]
    },
    {
      oranges: ["Mandarin"]
    }
  ]);
  test.equal(div.html(), [
    '<div class="fruit-basket">',
      '<span class="apple">Red Delicious</span>',
      '<span class="apple">Honeycrisp</span>',
      '<span class="orange">Navel</span>',
      '<span class="orange">Pomelo</span>',
      '<span class="apple">Granny Nice</span>',
    "</div>",
    '<div class="fruit-basket">',
      '<span class="orange">Mandarin</span>',
    "</div>"
  ].join(""));

  test.end();
});
