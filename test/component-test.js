var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(
      require("../"),
      require("d3-selection")
    );

// An example component.
function Paragraph(){
  return function (context, d){
    context.text(d);
  };
}
Paragraph.tagName = "p";

tape("A component should render multiple instances.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  var paragraph = d3.component(Paragraph);
  div.call(paragraph, ["foo", "bar"]);
  test.equal(div.html(), "<p>foo</p><p>bar</p>");
  test.end();
});

tape("A component should render a single instance.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  var paragraph = d3.component(Paragraph);
  div.call(paragraph, "foo");
  test.equal(div.html(), "<p>foo</p>");
  test.end();
});


function Heading(){
  return function (context, d){
    context.text(d);
  };
}
Heading.tagName = "h";

function Post(){
  var heading = d3.component(Heading);
  var paragraph = d3.component(Paragraph);
  return function (context, d){
    context
      .call(heading, d.title)
      .call(paragraph, d.content);
  };
}
Post.tagName = "div";

tape("Nested components.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  var post = d3.component(Post);
  div.call(post, { title: "Title", content: "Content here." });
  test.equal(div.html(), "<div><h>Title</h><p>Content here.</p></div>");
  test.end();
});
