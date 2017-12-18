var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);


var paragraphDatum,
    paragraph = d3.component("p")
      .render(function (selection, d){
        paragraphDatum = d;
        selection.text(d);
      });

var createArgs,
    renderArgs,
    destroyArgs,
    argsTester = d3.component("div")
      .create(function (selection, d){
        createArgs = arguments;
      })
      .render(function (selection, d){
        renderArgs = arguments;
      })
      .destroy(function (selection, d){
        destroyArgs = arguments;
      });


tape("A component should render a single instance.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(paragraph, "Hello Component");
  test.equal(div.html(), "<p>Hello Component</p>");
  test.end();
});

tape("A component should accept a DOM node in place of a selection.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  paragraph(div.node(), "Hello Component");
  test.equal(div.html(), "<p>Hello Component</p>");
  test.end();
});

tape("A component should render multiple instances.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter
  div.call(paragraph, [ "foo", "bar" ]);
  test.equal(div.html(), "<p>foo</p><p>bar</p>");

  // Update + Enter
  div.call(paragraph, [ "fooz", "barz", "baz" ])
  test.equal(div.html(), "<p>fooz</p><p>barz</p><p>baz</p>");

  // Update + Exit
  div.call(paragraph, [ "fooz", "baz" ])
  test.equal(div.html(), "<p>fooz</p><p>baz</p>");

  // Exit
  div.call(paragraph, []);
  test.equal(div.html(), "");

  test.end();
});

tape("A component should be passed undefined as datum when data not specified.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(paragraph);
  test.equal(div.html(), '<p></p>');
  test.equal(typeof paragraphDatum, "undefined");
  test.end();
});

tape("Livecycle arguments should be only (selection, d).", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(argsTester, ["a", "b"]);
  div.call(argsTester, ["a"]);
  test.equal(createArgs.length, 3)
  test.equal(renderArgs.length, 3)
  test.equal(destroyArgs.length, 3);
  test.end();
});

tape("A component should return its merged Enter + Update selection.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  test.equal(paragraph(div, "Text").text(), "Text"); // Enter
  test.equal(paragraph(div, "Text").text(), "Text"); // Update
  test.end();
});
