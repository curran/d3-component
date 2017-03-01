var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(require("../"), require("d3-selection"));

/*************************************
 ************ Components *************
 *************************************/

// Basic component.
var paragraph = d3.component("p")
  .render(function (selection, d){ selection.text(d); });

/*************************************
 ************** Tests ****************
 *************************************/
tape("A component should render a single instance.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(paragraph, "foo");
  test.equal(div.html(), "<p>foo</p>");
  test.end();
});


tape("A component should render multiple instances.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

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
