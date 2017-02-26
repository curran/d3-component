var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(
      require("../"),
      require("d3-selection")
    );

// An example component.
function Paragraph(){
  return function (context, d){ context.text(d); };
}
Paragraph.tagName = "p";

tape("component()", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  var paragraph = d3.component(Paragraph);
  div.call(paragraph, ["foo", "bar"]);
  test.equal(div.html(), "<p>foo</p><p>bar</p>");
  test.end();
});
