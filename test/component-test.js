var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(
      require("../"),
      require("d3-selection")
    );

/*************************************
 ************ Components *************
 *************************************/
function Paragraph(){
  return function (selection, d){ selection.text(d); };
}
Paragraph.tagName = "p";
var paragraph = d3.component(Paragraph);


function Heading(){
  return function (selection, d){ selection.text(d); };
}
Heading.tagName = "h";
var heading = d3.component(Heading);


function Post(){
  return function (selection, d){
    selection
      .call(heading, d.title)
      .call(paragraph, d.content);
  };
}
Post.tagName = "div";
var post = d3.component(Post);


function Apple(){ return function (){}; }
Apple.tagName = "span";
Apple.className = "apple";
var apple = d3.component(Apple);


function Orange(){ return function (){}; }
Orange.tagName = "span";
Orange.className = "orange";
var orange = d3.component(Orange);


function Fruit(){
  return function (selection, d){
    selection
      .call(apple, d === "apple" || [])
      .call(orange, d === "orange" || []);
  };
}
Fruit.tagName = "div";
var fruit = d3.component(Fruit);

/*************************************
 ************ Utilities **************
 *************************************/
function createDiv(){
  return d3.select(jsdom.jsdom().body).append("div");
}


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
      "<h>Title</h>",
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
    "<div><h>A</h><p>a</p></div>",
    "<div><h>B</h><p>b</p></div>"
  ].join(""));

  // Enter + Update
  div.call(post, [
    { title: "D", content: "d" },
    { title: "E", content: "e" },
    { title: "F", content: "f" },
  ]);
  test.equal(div.html(), [
    "<div><h>D</h><p>d</p></div>",
    "<div><h>E</h><p>e</p></div>",
    "<div><h>F</h><p>f</p></div>"
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
    '<div><span class="apple"></span></div>',
    '<div><span class="orange"></span></div>',
    '<div><span class="apple"></span></div>',
    '<div><span class="apple"></span></div>',
    '<div><span class="orange"></span></div>'
  ].join(""));

  // Update + Exit
  div.call(fruit, ["orange", "apple", "apple"]);
  test.equal(div.html(), [
    '<div><span class="orange"></span></div>',
    '<div><span class="apple"></span></div>',
    '<div><span class="apple"></span></div>'
  ].join(""));

  test.end();
});
