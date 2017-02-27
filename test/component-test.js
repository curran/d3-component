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
  return function (context, d){ context.text(d); };
}
Paragraph.tagName = "p";
var paragraph = d3.component(Paragraph);

function Heading(){
  return function (context, d){ context.text(d); };
}
Heading.tagName = "h";
var heading = d3.component(Heading);

function Post(){
  return function (context, d){
    context
      .call(heading, d.title)
      .call(paragraph, d.content);
  };
}
Post.tagName = "div";
var post = d3.component(Post);

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

  div.call(paragraph, [
    "foo",
    "bar"
  ]);

  test.equal(div.html(), [
    "<p>foo</p>",
    "<p>bar</p>"
  ].join(""));

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
  div.call(post, [
    { title: "A", content: "a" },
    { title: "B", content: "b" },
    { title: "C", content: "c" },
  ]);
  test.equal(div.html(), [
    "<div><h>A</h><p>a</p></div>",
    "<div><h>B</h><p>b</p></div>",
    "<div><h>C</h><p>c</p></div>"
  ].join(""));
  test.end();
});
