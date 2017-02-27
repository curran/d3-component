var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(
      require("../"),
      require("d3-selection")
    );

/*************************************
 ************ Components *************
 *************************************/

var heading = d3.component("h1")
  .render(function (selection, d){ selection.text(d); });

var paragraph = d3.component("p")
  .render(function (selection, d){ selection.text(d); });

var post = d3.component("div")
  .render(function (selection, d){
    selection
      .call(heading, d.title)
      .call(paragraph, d.content);
  });

var apple = d3.component("span", "apple")
  .render(function (selection, d){ selection.text(d); });

var orange = d3.component("span", "orange")
  .render(function (selection, d){ selection.text(d); });

var fruit = d3.component("div", "fruit")
  .render(function (selection, d){
    selection
      .call(apple, d === "apple" || [])
      .call(orange, d === "orange" || []);
  });

var fruitBasket = d3.component("div", "fruit-basket")
  .render(function (selection, d){
    selection
      .call(apple, d.apples || [])
      .call(orange, d.oranges || []);
  });


/*************************************
 ************** Tests ****************
 *************************************/
tape("A component should render a single instance.", function(test) {
  var div = createDiv();
  div.call(paragraph, "foo");
  test.equal(div.html(), "<p>foo</p>");
  test.end();
});


tape("A component should render multiple instances.", function(test) {
  var div = createDiv();

  // Enter
  div.call(paragraph, [ "foo", "bar" ]);
  test.equal(div.html(), "<p>foo</p><p>bar</p>");

  // Update + Enter
  div.call(paragraph, [ "fooz", "barz", "baz" ]);
  test.equal(div.html(), "<p>fooz</p><p>barz</p><p>baz</p>");

  // Exit
  div.call(paragraph, []);
  test.equal(div.html(), "");

  test.end();
});


tape("Nested components.", function(test) {
  var div = createDiv();

  div.call(post, {
    title: "Title",
    content: "Content here."
  });

  test.equal(div.html(), [
    "<div>",
      "<h1>Title</h1>",
      "<p>Content here.</p>",
    "</div>"
  ].join(""));

  test.end();
});


tape("Nested components multiple instances.", function(test) {
  var div = createDiv();

  // Enter
  div.call(post, [
    { title: "A", content: "a" },
    { title: "B", content: "b" },
  ]);
  test.equal(div.html(), [
    "<div><h1>A</h1><p>a</p></div>",
    "<div><h1>B</h1><p>b</p></div>"
  ].join(""));

  // Enter + Update
  div.call(post, [
    { title: "D", content: "d" },
    { title: "E", content: "e" },
    { title: "F", content: "f" },
  ]);
  test.equal(div.html(), [
    "<div><h1>D</h1><p>d</p></div>",
    "<div><h1>E</h1><p>e</p></div>",
    "<div><h1>F</h1><p>f</p></div>"
  ].join(""));

  // Exit
  div.call(post, []);
  test.equal(div.html(), "");

  test.end();
});

tape("Conditional components with classes.", function(test) {
  var div = createDiv();

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
  var div = createDiv();

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


/*************************************
 ************ Utilities **************
 *************************************/
function createDiv(){
  return d3.select(jsdom.jsdom().body).append("div");
}
