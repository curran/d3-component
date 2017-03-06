var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);


var paragraphDatum,
    paragraph = d3.component("p")
      .update(function (d){
        paragraphDatum = d;
        d3.select(this).text(d);
      });

var indexTesterEnterIndex,
    indexTesterUpdateIndex,
    indexTesterExitIndex,
    indexTester = d3.component("div")
      .enter(function (d, i){
        indexTesterEnterIndex = i;
      })
      .update(function (d, i){
        indexTesterUpdateIndex = i;
      })
      .exit(function (d, i){
        indexTesterExitIndex = i;
      });

tape("A component should render a single instance.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(paragraph, "Hello Component");
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

tape("A component should be passed the index as the second argument in callbacks.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  
  indexTesterEnterIndex = indexTesterUpdateIndex = indexTesterExitIndex = null;
  div.call(indexTester);
  test.equal(indexTesterEnterIndex, 0)
  test.equal(indexTesterUpdateIndex, 0)
  test.equal(indexTesterExitIndex, null);

  indexTesterEnterIndex = indexTesterUpdateIndex = indexTesterExitIndex = null;
  div.call(indexTester, ["a", "b"]);
  test.equal(indexTesterEnterIndex, 1)
  test.equal(indexTesterUpdateIndex, 1)
  test.equal(indexTesterExitIndex, null);

  indexTesterEnterIndex = indexTesterUpdateIndex = indexTesterExitIndex = null;
  div.call(indexTester, ["a", "b"]);
  test.equal(indexTesterEnterIndex, null)
  test.equal(indexTesterUpdateIndex, 1)
  test.equal(indexTesterExitIndex, null);

  indexTesterEnterIndex = indexTesterUpdateIndex = indexTesterExitIndex = null;
  div.call(indexTester, ["a"]);
  test.equal(indexTesterEnterIndex, null)
  test.equal(indexTesterUpdateIndex, 0)
  test.equal(indexTesterExitIndex, 1);

  indexTesterEnterIndex = indexTesterUpdateIndex = indexTesterExitIndex = null;
  div.call(indexTester, []);
  test.equal(indexTesterEnterIndex, null)
  test.equal(indexTesterUpdateIndex, null)
  test.equal(indexTesterExitIndex, 0);

  test.end();
});
