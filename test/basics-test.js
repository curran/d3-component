var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(require("../"), require("d3-selection"));

/*************************************
 ************ Components *************
 *************************************/

// Basic component.
var paragraph = d3.component("p")
  .render(function (selection, props){
    selection.text(props.text);
  });

var paragraphOptionalText = d3.component("p", "optional-text")
  .render(function (selection, props){
    selection.text(props.text || "");
  });

/*************************************
 ************** Tests ****************
 *************************************/
tape("A component should render a single instance.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(paragraph, { text: "Hello Component" });
  test.equal(div.html(), "<p>Hello Component</p>");
  test.end();
});


tape("A component should render multiple instances.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter
  div.call(paragraph, [
    { text: "foo" },
    { text: "bar" }
  ]);
  test.equal(div.html(), "<p>foo</p><p>bar</p>");

  // Update + Enter
  div.call(paragraph, [
    { text: "fooz" },
    { text: "barz" },
    { text: "baz" }
  ])
  test.equal(div.html(), "<p>fooz</p><p>barz</p><p>baz</p>");

  // Exit
  div.call(paragraph, []);
  test.equal(div.html(), "");

  test.end();
});


tape("A component should be passed props as {} when not specified.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(paragraphOptionalText, { text: "Hello Component" });
  test.equal(div.html(), '<p class="optional-text">Hello Component</p>');
  div.call(paragraphOptionalText);
  test.equal(div.html(), '<p class="optional-text"></p>');
  test.end();
});


//tape("A component should be passed props as {} when not specified.", function(test) {
//  var div = d3.select(jsdom.jsdom().body).append("div");
//  div
//      .call(paragraphOptionalText, { text: "Hello Component" })
//      .call(paragraphOptionalText, { text: "Hello Component" })
//  test.equal(div.html(), "<p>Hello Component</p>");
//  div.call(paragraphOptionalText);
//  test.equal(div.html(), "<p></p>");
//  test.end();
//});
